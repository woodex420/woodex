import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Filter, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductFormModal from '../components/ProductFormModal';
import ImportExportModal from '../components/ImportExportModal';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category_id: string;
  is_active: boolean;
  stock_quantity: number;
  categories?: { name: string; slug: string };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter]);

  async function loadCategories() {
    try {
      const { data, error } = await supabase.functions.invoke('category-crud', {
        body: { operation: 'get_all' }
      });
      if (error) throw error;
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('product-crud', {
        body: { operation: 'get_all' }
      });

      if (error) throw error;
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterProducts() {
    let filtered = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p =>
        statusFilter === 'active' ? p.is_active : !p.is_active
      );
    }

    setFilteredProducts(filtered);
  }

  function toggleProductSelection(productId: string) {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  }

  function toggleSelectAll() {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  }

  async function handleDelete(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.functions.invoke('product-crud', {
        body: { operation: 'delete', productId }
      });

      if (error) throw error;
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  }

  async function handleBulkDelete() {
    if (selectedProducts.size === 0) {
      alert('No products selected');
      return;
    }

    if (!confirm(`Delete ${selectedProducts.size} products?`)) return;

    try {
      const { error } = await supabase.functions.invoke('bulk-operations', {
        body: {
          operation: 'bulk_delete',
          productIds: Array.from(selectedProducts)
        }
      });

      if (error) throw error;
      setSelectedProducts(new Set());
      loadProducts();
    } catch (error) {
      console.error('Failed to delete products:', error);
      alert('Failed to delete products');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
            <p className="text-slate-400">{filteredProducts.length} products found</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowImportExport(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="w-5 h-5" />
              Import/Export
            </button>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setShowFormModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>

        {selectedProducts.size > 0 && (
          <div className="mb-4 p-4 bg-blue-600/10 border border-blue-600 rounded-lg flex items-center justify-between">
            <span className="text-white">{selectedProducts.size} products selected</span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedProducts(new Set())}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900"
                  />
                </th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Product</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Price</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Stock</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                      <div>
                        <div className="text-white font-medium">{product.name}</div>
                        <div className="text-slate-400 text-sm">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {product.categories?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-white font-medium">
                    PKR {product.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm ${product.stock_quantity <= 10 ? 'text-red-400' : 'text-slate-300'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.is_active
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-red-600/20 text-red-400'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setShowFormModal(true);
                        }}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No products found
          </div>
        )}
      </div>
    </div>

    {/* Modals */}
    <ProductFormModal
      isOpen={showFormModal}
      onClose={() => {
        setShowFormModal(false);
        setEditingProduct(null);
      }}
      onSuccess={() => {
        loadProducts();
        setShowFormModal(false);
        setEditingProduct(null);
      }}
      product={editingProduct}
      categories={categories}
    />

    <ImportExportModal
      isOpen={showImportExport}
      onClose={() => setShowImportExport(false)}
      onSuccess={() => {
        loadProducts();
        setShowImportExport(false);
      }}
    />
    </>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
