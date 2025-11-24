import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase, type Product } from '../../lib/supabase';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

const ProductFormModal = ({ isOpen, onClose, onSuccess, product }: ProductFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: 0,
    cost_price: 0,
    stock_status: 'in_stock' as 'in_stock' | 'out_of_stock' | 'made_to_order',
    is_active: true,
    is_featured: false,
    is_customizable: false,
  });

  // Reset form when modal opens or product changes
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          description: product.description || '',
          price: product.price || 0,
          cost_price: product.cost_price || 0,
          stock_status: product.stock_status || 'in_stock',
          is_active: product.is_active ?? true,
          is_featured: product.is_featured ?? false,
          is_customizable: product.is_customizable ?? false,
        });
      } else {
        // Reset to empty form for new product
        setFormData({
          name: '',
          sku: '',
          description: '',
          price: 0,
          cost_price: 0,
          stock_status: 'in_stock',
          is_active: true,
          is_featured: false,
          is_customizable: false,
        });
      }
    }
  }, [isOpen, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({ ...formData, slug, updated_at: new Date().toISOString() })
          .eq('id', product.id);

        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([{ ...formData, slug }]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-separator p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-primary">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Product Name*</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary"
              placeholder="Executive Office Desk"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">SKU*</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary"
                placeholder="WDX-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Stock Status*</label>
              <select
                value={formData.stock_status}
                onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as any })}
                className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary"
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="made_to_order">Made to Order</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Selling Price (PKR)*</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Cost Price (PKR)</label>
              <input
                type="number"
                value={formData.cost_price || ''}
                onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary"
              placeholder="Premium executive office desk crafted from solid oak..."
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-separator"
              />
              <span className="text-sm font-medium text-text-primary">Active (visible on website)</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded border-separator"
              />
              <span className="text-sm font-medium text-text-primary">Featured Product</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_customizable}
                onChange={(e) => setFormData({ ...formData, is_customizable: e.target.checked })}
                className="w-4 h-4 rounded border-separator"
              />
              <span className="text-sm font-medium text-text-primary">Customizable (allow material/finish selection)</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-separator rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-text-primary text-white rounded-md hover:bg-text-primary-alt transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
