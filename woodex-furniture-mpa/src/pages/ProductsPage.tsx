import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { Search, Filter, Grid3x3, List, SlidersHorizontal, FileText } from 'lucide-react';
import QuantitySelector from '../components/QuantitySelector';
import BulkDiscountDisplay from '../components/BulkDiscountDisplay';

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  category_id: string;
  is_featured: boolean;
  stock_status: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPageEnhanced() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Quantity state for each product
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, sortBy]);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')
        .limit(20);
      setCategories(categoriesData || []);

      // Build query
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      // Sorting
      if (sortBy === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else if (sortBy === 'name') {
        query = query.order('name', { ascending: true });
      } else {
        query = query.order('is_featured', { ascending: false });
      }

      const { data: productsData } = await query;
      setProducts(productsData || []);
      
      // Initialize quantities to 1 for each product
      const initialQuantities: Record<string, number> = {};
      productsData?.forEach(p => {
        initialQuantities[p.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesSearch && matchesPrice;
  });

  // Calculate discount based on quantity
  const calculateDiscount = (quantity: number): number => {
    if (quantity >= 51) return 0.15;
    if (quantity >= 21) return 0.10;
    if (quantity >= 6) return 0.05;
    return 0;
  };

  // Calculate total price with discount
  const calculateTotal = (price: number, quantity: number): number => {
    const discount = calculateDiscount(quantity);
    return price * quantity * (1 - discount);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      product_image: product.images?.[0] || '',
      quantity: quantity,
    } as any);
  };

  const handleRequestQuote = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    navigate(`/quotations/request?source=product&productId=${product.id}&productName=${encodeURIComponent(product.name)}&price=${product.price}&quantity=${quantity}`);
  };

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Hero */}
      <section className="bg-gradient-to-r from-brand-blue to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Discover {products.length} premium office furniture products crafted for modern workspaces
          </p>
        </div>
      </section>

      {/* Search & Filters Bar */}
      <section className="bg-white border-b border-separator sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-brand-blue text-white' : 'bg-muted-bg text-text-secondary'}`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-brand-blue text-white' : 'bg-muted-bg text-text-secondary'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-separator rounded-lg hover:bg-muted-bg"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="grid md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-separator">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-separator rounded-lg"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-separator rounded-lg"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold mb-2">Min Price</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-separator rounded-lg"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Max Price</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-separator rounded-lg"
                  placeholder="1000000"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-text-secondary">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-r-transparent"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="h-16 w-16 text-text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-text-secondary">Try adjusting your filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredProducts.map((product) => {
                const quantity = quantities[product.id] || 1;
                const discount = calculateDiscount(quantity);
                const totalPrice = calculateTotal(product.price, quantity);

                return viewMode === 'grid' ? (
                  <div key={product.id} className="bg-white rounded-lg border border-separator hover:shadow-xl transition-shadow overflow-hidden group">
                    {/* Clickable Image */}
                    <Link to={`/products/${product.id}`}>
                      <div className="relative overflow-hidden bg-muted-bg">
                        <img
                          src={product.images?.[0] || 'https://placehold.co/400x300/e5e5e5/666666?text=Product'}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                        {product.is_featured && (
                          <span className="absolute top-2 right-2 bg-brand-orange text-white text-xs px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      {/* Clickable Title */}
                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-brand-blue cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Price Section */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-2xl font-bold text-brand-blue">
                            PKR {product.price.toLocaleString()}
                          </p>
                          {discount > 0 && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                              -{(discount * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">
                          Unit price
                        </p>
                      </div>

                      {/* Bulk Discount Display */}
                      <div className="mb-4">
                        <BulkDiscountDisplay currentQuantity={quantity} />
                      </div>

                      {/* Quantity Selector */}
                      <div className="mb-3">
                        <label className="block text-sm font-semibold mb-2">Quantity</label>
                        <QuantitySelector
                          quantity={quantity}
                          onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                          min={1}
                          max={999}
                        />
                      </div>

                      {/* Total Price Calculation */}
                      {quantity > 1 && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-text-secondary">Subtotal ({quantity} units):</span>
                            <span className="font-semibold">PKR {(product.price * quantity).toLocaleString()}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between items-center text-sm mb-1">
                              <span className="text-green-600">Bulk Discount ({(discount * 100).toFixed(0)}%):</span>
                              <span className="text-green-600 font-semibold">-PKR {(product.price * quantity * discount).toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-base pt-2 border-t border-blue-300">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-brand-blue">PKR {totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleAddToCart(product, quantity)}
                          className="w-full bg-brand-blue text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          Add {quantity > 1 ? `${quantity} ` : ''}to Cart
                        </button>
                        <button
                          onClick={() => handleRequestQuote(product)}
                          className="w-full bg-white border-2 border-brand-blue text-brand-blue py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-semibold"
                        >
                          <FileText className="h-4 w-4" />
                          Request Quote
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={product.id} className="bg-white rounded-lg border border-separator p-4 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      {/* Clickable Image */}
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={product.images?.[0] || 'https://placehold.co/150x150/e5e5e5/666666?text=Product'}
                          alt={product.name}
                          className="w-40 h-40 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      
                      <div className="flex-1">
                        {/* Clickable Title */}
                        <Link to={`/products/${product.id}`}>
                          <h3 className="font-bold text-xl mb-2 hover:text-brand-blue cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {/* Price */}
                        <div className="flex items-center gap-2 mb-3">
                          <p className="text-2xl font-bold text-brand-blue">
                            PKR {product.price.toLocaleString()}
                          </p>
                          {discount > 0 && (
                            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                              -{(discount * 100).toFixed(0)}%
                            </span>
                          )}
                          <span className="text-sm text-text-secondary">per unit</span>
                        </div>

                        {/* Bulk Discount Display */}
                        <div className="mb-4">
                          <BulkDiscountDisplay currentQuantity={quantity} />
                        </div>

                        {/* Quantity Selector */}
                        <div className="max-w-xs mb-3">
                          <label className="block text-sm font-semibold mb-2">Quantity</label>
                          <QuantitySelector
                            quantity={quantity}
                            onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                            min={1}
                            max={999}
                          />
                        </div>

                        {/* Total Price */}
                        {quantity > 1 && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
                            <div className="flex justify-between items-center text-sm mb-1">
                              <span className="text-text-secondary">Subtotal ({quantity} units):</span>
                              <span className="font-semibold">PKR {(product.price * quantity).toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                              <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-green-600">Bulk Discount ({(discount * 100).toFixed(0)}%):</span>
                                <span className="text-green-600 font-semibold">-PKR {(product.price * quantity * discount).toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center text-base pt-2 border-t border-blue-300">
                              <span className="font-bold">Total:</span>
                              <span className="font-bold text-brand-blue">PKR {totalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 justify-center min-w-[200px]">
                        <button
                          onClick={() => handleAddToCart(product, quantity)}
                          className="bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold whitespace-nowrap"
                        >
                          Add {quantity > 1 ? `${quantity} ` : ''}to Cart
                        </button>
                        <button
                          onClick={() => handleRequestQuote(product)}
                          className="bg-white border-2 border-brand-blue text-brand-blue px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-semibold"
                        >
                          <FileText className="h-5 w-5" />
                          Request Quote
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
