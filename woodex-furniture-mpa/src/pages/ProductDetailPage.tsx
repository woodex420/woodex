import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { ChevronLeft, ShoppingCart, Heart, Share2, Truck, Shield, Package, Star, ChevronRight, ChevronLeft as ChevronLeftIcon, Minus, Plus, FileText, MessageCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: string;
  is_featured: boolean;
  stock_status: string;
  sku: string;
  specifications: any;
  dimensions: any;
  weight: number;
  materials: string[];
  colors: string[];
  warranty_months: number;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) throw productError;

      setProduct(productData);
      if (productData.materials?.length > 0) setSelectedMaterial(productData.materials[0]);
      if (productData.colors?.length > 0) setSelectedColor(productData.colors[0]);

      // Fetch category
      if (productData.category_id) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('id', productData.category_id)
          .single();
        
        setCategory(categoryData);

        // Fetch related products from same category
        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', productData.category_id)
          .neq('id', id)
          .eq('is_active', true)
          .limit(4);
        
        setRelatedProducts(relatedData || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBulkDiscount = (qty: number) => {
    if (qty >= 51) return 0.15;
    if (qty >= 21) return 0.10;
    if (qty >= 6) return 0.05;
    return 0;
  };

  const calculatePrice = () => {
    if (!product) return 0;
    const discount = calculateBulkDiscount(quantity);
    return product.price * quantity * (1 - discount);
  };

  const calculateUnitPrice = () => {
    if (!product) return 0;
    const discount = calculateBulkDiscount(quantity);
    return product.price * (1 - discount);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      product_image: product.images?.[0] || '',
      quantity: quantity,
    } as any);

    // Show success message or redirect to cart
    navigate('/cart');
  };

  const handleRequestQuote = () => {
    if (!product) return;
    navigate(`/quotations/request?source=product&productId=${product.id}&productName=${encodeURIComponent(product.name)}&price=${product.price}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <Link to="/products" className="text-blue-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = calculateBulkDiscount(quantity);
  const totalPrice = calculatePrice();
  const unitPrice = calculateUnitPrice();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            {category && (
              <>
                <span className="hover:text-blue-600">{category.name}</span>
                <ChevronRight className="h-4 w-4 mx-2" />
              </>
            )}
            <span className="text-gray-800 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage] || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Product Name & SKU */}
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <p className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</p>
              </div>

              {/* Rating Placeholder */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">(45 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-800">
                    PKR {unitPrice.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <span className="text-lg text-gray-500 line-through">
                      PKR {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                    {(discount * 100).toFixed(0)}% Bulk Discount Applied
                  </span>
                )}
              </div>

              {/* Bulk Discount Tiers */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Bulk Discount Tiers</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>6-20 units:</span>
                    <span className="font-semibold text-green-600">5% OFF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>21-50 units:</span>
                    <span className="font-semibold text-green-600">10% OFF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>51+ units:</span>
                    <span className="font-semibold text-green-600">15% OFF</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Material Selection */}
              {product.materials && product.materials.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Material
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material) => (
                      <button
                        key={material}
                        onClick={() => setSelectedMaterial(material)}
                        className={`px-4 py-2 border rounded-lg ${
                          selectedMaterial === material
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg ${
                          selectedColor === color
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-gray-100"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center border-x border-gray-300 py-3 focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 hover:bg-gray-100"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {quantity >= 6 && quantity < 21 && <span className="text-green-600 font-semibold">Next tier at 21 units (10% OFF)</span>}
                    {quantity >= 21 && quantity < 51 && <span className="text-green-600 font-semibold">Next tier at 51 units (15% OFF)</span>}
                    {quantity >= 51 && <span className="text-green-600 font-semibold">Maximum discount reached!</span>}
                  </div>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Price:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    PKR {totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  For {quantity} unit{quantity > 1 ? 's' : ''} @ PKR {unitPrice.toLocaleString()} each
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleRequestQuote}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
                >
                  <FileText className="h-5 w-5" />
                  Request Quote
                </button>
              </div>

              {/* Additional Actions */}
              <div className="flex gap-4 pb-6 border-b">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                  <Heart className="h-5 w-5" />
                  <span>Add to Wishlist</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                  <MessageCircle className="h-5 w-5" />
                  <span>Ask Question</span>
                </button>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Free Delivery</p>
                    <p className="text-sm text-gray-600">On orders over PKR 50,000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">{product.warranty_months || 12} Months Warranty</p>
                    <p className="text-sm text-gray-600">Manufacturer warranty included</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Easy Returns</p>
                    <p className="text-sm text-gray-600">14-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Tab */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Specifications</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dimensions */}
            {product.dimensions && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Dimensions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Length:</span>
                    <span className="font-medium">{product.dimensions.length || 'N/A'} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Width:</span>
                    <span className="font-medium">{product.dimensions.width || 'N/A'} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">{product.dimensions.height || 'N/A'} cm</span>
                  </div>
                </div>
              </div>
            )}

            {/* Other Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{product.weight || 'N/A'} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Status:</span>
                  <span className={`font-medium ${product.stock_status === 'in_stock' ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={relatedProduct.images?.[0] || '/placeholder-image.jpg'}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{relatedProduct.name}</h3>
                    <p className="text-xl font-bold text-blue-600">
                      PKR {relatedProduct.price.toLocaleString()}
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
