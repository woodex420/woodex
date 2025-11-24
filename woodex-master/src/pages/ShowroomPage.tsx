import { useState, useEffect } from 'react';
import { supabase, type Product } from '../lib/supabase';
import { Store, Package, Eye } from 'lucide-react';

const ShowroomPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('is_active', true).order('is_featured', { ascending: false }).limit(20);
      if (error) throw error;
      setProducts(data || []);
      if (data && data.length > 0) setSelectedProduct(data[0]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-4xl font-bold text-text-primary mb-2">Virtual Showroom</h1><p className="text-text-secondary">Explore our furniture collection in 360°</p></div>

      {loading ? (
        <div className="text-center py-12"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-text-primary border-r-transparent"></div></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border border-separator overflow-hidden">
            {selectedProduct ? (
              <div>
                {selectedProduct.panorama_image || selectedProduct.images?.[0] ? (
                  <div className="relative w-full h-96 bg-muted flex items-center justify-center">
                    <img src={selectedProduct.panorama_image || selectedProduct.images?.[0] || ''} alt={selectedProduct.name} className="max-w-full max-h-full object-contain" />
                    <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-lg text-sm">
                      <p className="font-semibold">360° View Available</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-muted flex items-center justify-center"><Package className="h-16 w-16 text-text-secondary" /></div>
                )}
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-text-primary mb-2">{selectedProduct.name}</h2>
                  <p className="text-text-secondary mb-4">{selectedProduct.description || 'Premium furniture piece'}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-4xl font-bold text-text-primary">PKR {selectedProduct.price.toFixed(0)}</p>
                    <button className="bg-text-primary text-white px-6 py-3 rounded-md hover:bg-text-primary-alt transition-colors">Add to Quote</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center"><p className="text-text-secondary">Select a product to view</p></div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-separator p-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-bold text-text-primary mb-4">Product Gallery</h3>
            <div className="space-y-2">
              {products.map((product) => (
                <button key={product.id} onClick={() => setSelectedProduct(product)} className={`w-full p-3 rounded-lg border transition-colors text-left ${selectedProduct?.id === product.id ? 'border-text-primary bg-muted' : 'border-separator hover:bg-muted'}`}>
                  <div className="flex items-center gap-3">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center"><Package className="h-6 w-6 text-text-secondary" /></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary truncate">{product.name}</p>
                      <p className="text-sm text-text-secondary">PKR {product.price.toFixed(0)}</p>
                    </div>
                    <Eye className="h-4 w-4 text-text-secondary flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-separator"><Store className="h-12 w-12 text-text-secondary mx-auto mb-4" /><p className="text-text-secondary">No products available in showroom</p></div>
      )}
    </div>
  );
};

export default ShowroomPage;
