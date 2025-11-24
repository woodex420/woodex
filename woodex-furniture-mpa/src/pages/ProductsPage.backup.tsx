import { useState, useEffect } from 'react';
import { Search, X, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import SEO from '../components/SEO';
import StructuredData, { getBreadcrumbSchema } from '../components/StructuredData';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  thumbnail_image: string | null;
  features: string[] | null;
  is_active: boolean;
  is_featured: boolean;
}

const ProductsPage = () => {
  const { addToCart } = useCart();
  const breadcrumbData = getBreadcrumbSchema([
    { name: 'Home', url: window.location.origin },
    { name: 'Products', url: `${window.location.origin}/products` },
  ]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = async (product: Product) => {
    if (!product.price) return;
    
    setAddingToCart(product.id);
    try {
      await addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.thumbnail_image || '',
        quantity: 1,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Office Furniture Products - Executive Desks, Chairs & More | Woodex"
        description="Browse our complete range of office furniture including executive desks, ergonomic chairs, workstations, meeting tables, and storage solutions. Premium quality, Pakistan-wide delivery."
        keywords="office furniture, executive desk, ergonomic chair, office workstation, meeting table, office storage, reception furniture, Pakistan office furniture"
        ogImage="/images/products-og.jpg"
      />

      <StructuredData data={breadcrumbData} />

      <div className="min-h-screen bg-white py-12 sm:py-16 lg:py-20">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Our Products
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover premium office furniture designed for comfort, productivity, and style
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 sm:mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    {product.thumbnail_image ? (
                      <img
                        src={product.thumbnail_image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                        onClick={() => setLightboxImage(product.thumbnail_image)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    {product.is_featured && (
                      <div className="absolute top-4 right-4 bg-primary text-black px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {product.features && product.features.length > 0 && (
                      <ul className="space-y-1 mb-4">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {product.features.length > 3 && (
                          <li className="text-sm text-gray-400">+{product.features.length - 3} more</li>
                        )}
                      </ul>
                    )}

                    {product.price && (
                      <div className="text-2xl font-bold text-primary mb-4">
                        Rs. {product.price.toLocaleString()}
                      </div>
                    )}

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.price || addingToCart === product.id}
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart === product.id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No products found matching your search.' : 'No products available at the moment.'}
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 lg:mt-24 bg-gray-50 rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We offer custom design services to create furniture perfectly tailored to your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/customization" className="btn-primary text-lg px-8 py-4">
                Custom Design
              </a>
              <a href="/contact" className="btn-secondary text-lg px-8 py-4">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={lightboxImage}
            alt="Product"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
