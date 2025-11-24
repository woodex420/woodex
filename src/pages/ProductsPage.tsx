import { useEffect, useState } from 'react';
import { supabase, type Profile, type Product } from '../lib/supabase';
import { Plus, Package, Edit, Eye, Trash2 } from 'lucide-react';
import ProductFormModal from '../components/products/ProductFormModal';

interface ProductsPageProps {
  profile: Profile | null;
}

const ProductsPage = ({ profile }: ProductsPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setViewProduct(product);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      fetchProducts();
    } catch (error: any) {
      alert(error.message || 'Failed to delete product');
    }
  };

  const canEdit = profile?.role === 'admin' || profile?.role === 'editor';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Products</h1>
          <p className="text-text-secondary">Manage your furniture catalog - {products.length} products</p>
        </div>
        {canEdit && (
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-text-primary text-white px-6 py-3 rounded-md hover:bg-text-primary-alt transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-text-primary border-r-transparent"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-separator hover:shadow-lg transition-shadow overflow-hidden">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center"><Package className="h-12 w-12 text-text-secondary" /></div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-text-primary mb-1">{product.name}</h3>
                <p className="text-sm text-text-secondary mb-2">{product.sku}</p>
                <p className="text-2xl font-bold text-text-primary mb-3">PKR {product.price.toFixed(0)}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                    {product.stock_status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewProduct(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-separator rounded-md hover:bg-muted transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4" /> View
                  </button>
                  {canEdit && (
                    <>
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-text-primary text-white rounded-md hover:bg-text-primary-alt transition-colors text-sm"
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product)}
                        className="px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-separator">
          <Package className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary mb-4">No products found</p>
          {canEdit && (
            <button 
              onClick={handleAddProduct}
              className="bg-text-primary text-white px-6 py-2 rounded-md hover:bg-text-primary-alt"
            >
              Add First Product
            </button>
          )}
        </div>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
        product={selectedProduct}
      />

      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewProduct(null)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-text-primary mb-2">{viewProduct.name}</h2>
                  <p className="text-text-secondary">SKU: {viewProduct.sku}</p>
                </div>
                <button onClick={() => setViewProduct(null)} className="text-text-secondary hover:text-text-primary">
                  <Package className="h-6 w-6" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {viewProduct.images?.[0] ? (
                    <img src={viewProduct.images[0]} alt={viewProduct.name} className="w-full rounded-lg border border-separator" />
                  ) : (
                    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center"><Package className="h-16 w-16 text-text-secondary" /></div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Price</p>
                    <p className="text-3xl font-bold text-text-primary">PKR {viewProduct.price.toFixed(0)}</p>
                  </div>
                  {viewProduct.description && (
                    <div>
                      <p className="text-sm text-text-secondary mb-1">Description</p>
                      <p className="text-text-primary">{viewProduct.description}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${viewProduct.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {viewProduct.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {viewProduct.is_featured && <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800">Featured</span>}
                    {viewProduct.is_customizable && <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">Customizable</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
