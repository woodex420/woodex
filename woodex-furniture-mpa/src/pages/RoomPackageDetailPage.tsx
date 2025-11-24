import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { Package, ShoppingCart, Check, ArrowLeft, Percent } from 'lucide-react';

interface RoomPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  discount_percentage: number;
  featured_image?: string;
  gallery_images?: string[];
  included_products: any;
  customization_options?: any;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
}

export default function RoomPackageDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [pkg, setPkg] = useState<RoomPackage | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (slug) fetchPackageDetails();
  }, [slug]);

  const fetchPackageDetails = async () => {
    try {
      const { data: pkgData, error: pkgError } = await supabase
        .from('room_packages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (pkgError) throw pkgError;
      setPkg(pkgData);

      // Fetch associated products
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, price, images')
        .eq('is_active', true)
        .limit(10);

      setProducts(productsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackageToCart = () => {
    if (!pkg) return;
    
    // Add package as a special cart item
    const packageItem = {
      product_id: pkg.id,
      product_name: pkg.name,
      product_price: pkg.base_price * (1 - pkg.discount_percentage / 100),
      product_image: pkg.featured_image || '',
      quantity: 1,
    };
    
    addToCart(packageItem as any);
    alert('Package added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-r-transparent"></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Package Not Found</h2>
          <Link to="/room-packages" className="text-brand-blue hover:underline">
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  const discountedPrice = pkg.base_price * (1 - pkg.discount_percentage / 100);
  const savings = pkg.base_price - discountedPrice;

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Breadcrumb */}
      <div className="bg-muted-bg border-b border-separator py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-text-secondary hover:text-brand-blue">Home</Link>
            <span className="text-text-secondary">/</span>
            <Link to="/room-packages" className="text-text-secondary hover:text-brand-blue">Room Packages</Link>
            <span className="text-text-secondary">/</span>
            <span className="text-text-primary">{pkg.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Link to="/room-packages" className="inline-flex items-center gap-2 text-brand-blue hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Packages
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div>
            <div className="bg-white rounded-lg border border-separator overflow-hidden mb-4">
              <img
                src={pkg.featured_image || 'https://placehold.co/600x400/e5e5e5/666666?text=Room+Package'}
                alt={pkg.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {pkg.gallery_images && pkg.gallery_images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {pkg.gallery_images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${pkg.name} ${idx + 1}`}
                    className="w-full h-20 object-cover rounded border border-separator cursor-pointer hover:border-brand-blue transition"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-4">{pkg.name}</h1>
            <p className="text-text-secondary text-lg mb-6">{pkg.description}</p>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                {pkg.discount_percentage > 0 && (
                  <span className="text-2xl text-text-secondary line-through">
                    PKR {pkg.base_price.toLocaleString()}
                  </span>
                )}
                <span className="text-5xl font-bold text-brand-blue">
                  PKR {discountedPrice.toLocaleString()}
                </span>
              </div>
              {pkg.discount_percentage > 0 && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                    <Percent className="h-3 w-3" />
                    Save {pkg.discount_percentage}%
                  </span>
                  <span className="text-green-800 font-semibold">
                    You save PKR {savings.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddPackageToCart}
              className="w-full bg-brand-blue text-white py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg font-semibold mb-6"
            >
              <ShoppingCart className="h-5 w-5" />
              Add Package to Cart
            </button>

            {/* Included Products */}
            <div className="border-t border-separator pt-6">
              <h3 className="text-2xl font-bold mb-4">Package Includes</h3>
              <div className="space-y-3">
                {Object.entries(pkg.included_products || {}).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-text-secondary"> x {value as any}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-separator pt-6 mt-6">
              <h3 className="text-2xl font-bold mb-4">Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-blue" />
                  <span>Complete setup, professionally curated</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-blue" />
                  <span>Bulk discount already applied</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-blue" />
                  <span>Free delivery and installation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-blue" />
                  <span>2-year warranty on all items</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {products.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Individual Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {products.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white rounded-lg border border-separator hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <img
                    src={product.images?.[0] || 'https://placehold.co/200x200/e5e5e5/666666?text=Product'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-brand-blue font-bold">
                      PKR {product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
