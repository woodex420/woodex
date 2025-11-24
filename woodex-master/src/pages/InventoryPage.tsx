import { useState, useEffect } from 'react';
import { supabase, Profile, Inventory, StockMovement, Product } from '../lib/supabase';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';

interface InventoryPageProps {
  profile?: Profile | null;
}

interface InventoryWithProduct extends Inventory {
  product?: Product;
  recentMovements?: StockMovement[];
}

const InventoryPage = ({ profile }: InventoryPageProps) => {
  const [inventory, setInventory] = useState<InventoryWithProduct[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryWithProduct | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adjustmentModal, setAdjustmentModal] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [searchTerm, filterType, inventory]);

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const { data: inventoryData, error } = await supabase
        .from('inventory')
        .select(`
          *,
          product:products(*)
        `)
        .order('stock_quantity', { ascending: true });

      if (error) throw error;

      // Fetch recent stock movements for each item
      const inventoryWithMovements = await Promise.all(
        (inventoryData || []).map(async (item) => {
          const { data: movements } = await supabase
            .from('stock_movements')
            .select('*')
            .eq('product_id', item.product_id)
            .order('created_at', { ascending: false })
            .limit(5);

          return {
            ...item,
            recentMovements: movements || []
          };
        })
      );

      setInventory(inventoryWithMovements);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    // Apply stock level filter
    if (filterType === 'low') {
      filtered = filtered.filter(
        item => item.stock_quantity > 0 && item.stock_quantity <= item.low_stock_threshold
      );
    } else if (filterType === 'out') {
      filtered = filtered.filter(item => item.stock_quantity === 0);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.product?.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInventory(filtered);
  };

  const getStockStatus = (item: InventoryWithProduct) => {
    if (item.stock_quantity === 0) {
      return { label: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    } else if (item.stock_quantity <= item.low_stock_threshold) {
      return { label: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    } else {
      return { label: 'In Stock', color: 'text-green-600 bg-green-100' };
    }
  };

  const getInventoryStats = () => {
    return {
      total: inventory.length,
      lowStock: inventory.filter(
        item => item.stock_quantity > 0 && item.stock_quantity <= item.low_stock_threshold
      ).length,
      outOfStock: inventory.filter(item => item.stock_quantity === 0).length,
      totalValue: inventory.reduce(
        (sum, item) => sum + (item.stock_quantity * (item.product?.price || 0)),
        0
      )
    };
  };

  const adjustStock = async () => {
    if (!selectedItem || adjustmentQuantity === 0) return;

    try {
      // Calculate new quantity
      const newQuantity = selectedItem.stock_quantity + adjustmentQuantity;

      if (newQuantity < 0) {
        alert('Cannot reduce stock below zero');
        return;
      }

      // Update inventory
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ stock_quantity: newQuantity })
        .eq('id', selectedItem.id);

      if (updateError) throw updateError;

      // Record stock movement
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert({
          product_id: selectedItem.product_id,
          variant_id: selectedItem.variant_id,
          movement_type: adjustmentQuantity > 0 ? 'inbound' : 'adjustment',
          quantity: Math.abs(adjustmentQuantity),
          reason: adjustmentReason,
          performed_by: profile?.id
        });

      if (movementError) throw movementError;

      alert('Stock adjusted successfully!');
      setAdjustmentModal(false);
      setAdjustmentQuantity(0);
      setAdjustmentReason('');
      fetchInventory();
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Failed to adjust stock. Please try again.');
    }
  };

  const viewItemDetails = (item: InventoryWithProduct) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const openAdjustmentModal = (item: InventoryWithProduct) => {
    setSelectedItem(item);
    setAdjustmentModal(true);
  };

  const stats = getInventoryStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-lime"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">Inventory Management</h1>
        <p className="text-text-secondary">Monitor and manage product stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Products</p>
              <p className="text-3xl font-bold text-text-primary mt-1">{stats.total}</p>
            </div>
            <Package className="h-10 w-10 text-accent-lime" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.lowStock}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.outOfStock}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Inventory Value</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                PKR {stats.totalValue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-separator">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filterType === 'all'
                  ? 'bg-accent-lime text-black'
                  : 'bg-white border border-separator text-text-secondary hover:bg-surface-gray'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterType('low')}
              className={`px-4 py-2 rounded-lg transition ${
                filterType === 'low'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white border border-separator text-text-secondary hover:bg-surface-gray'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilterType('out')}
              className={`px-4 py-2 rounded-lg transition ${
                filterType === 'out'
                  ? 'bg-red-500 text-white'
                  : 'bg-white border border-separator text-text-secondary hover:bg-surface-gray'
              }`}
            >
              Out of Stock
            </button>
          </div>

          <button
            onClick={fetchInventory}
            className="px-4 py-2 bg-accent-lime text-black rounded-lg hover:bg-accent-lime/90 transition flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-separator overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-gray border-b border-separator">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Stock Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Reserved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Threshold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-separator">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-text-secondary">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  const available = item.stock_quantity - item.reserved_quantity;

                  return (
                    <tr key={item.id} className="hover:bg-surface-gray transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <span className="text-sm font-medium text-text-primary">
                            {item.product?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {item.product?.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                        {item.stock_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                        {item.reserved_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {available}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {item.low_stock_threshold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => viewItemDetails(item)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openAdjustmentModal(item)}
                          className="text-accent-lime hover:text-accent-lime/80 transition"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-separator">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary">
                  {selectedItem.product?.name}
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-secondary text-sm">Stock Quantity</p>
                  <p className="text-2xl font-bold text-text-primary">{selectedItem.stock_quantity}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Reserved Quantity</p>
                  <p className="text-2xl font-bold text-yellow-600">{selectedItem.reserved_quantity}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Available</p>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedItem.stock_quantity - selectedItem.reserved_quantity}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Low Stock Threshold</p>
                  <p className="text-2xl font-bold text-text-primary">{selectedItem.low_stock_threshold}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Recent Stock Movements</h3>
                <div className="space-y-2">
                  {selectedItem.recentMovements && selectedItem.recentMovements.length > 0 ? (
                    selectedItem.recentMovements.map((movement, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-surface-gray rounded-lg">
                        <div className="flex items-center gap-2">
                          {movement.movement_type === 'inbound' ? (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-red-600" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-text-primary capitalize">
                              {movement.movement_type}
                            </p>
                            <p className="text-xs text-text-secondary">{movement.reason || 'No reason provided'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-text-primary">
                            {movement.movement_type === 'inbound' ? '+' : '-'}{movement.quantity}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {new Date(movement.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-text-secondary text-sm">No recent movements</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-separator">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 bg-accent-lime text-black rounded-lg hover:bg-accent-lime/90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjustment Modal */}
      {adjustmentModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-separator">
              <h2 className="text-2xl font-bold text-text-primary">Adjust Stock</h2>
              <p className="text-text-secondary">{selectedItem.product?.name}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Adjustment Quantity
                </label>
                <input
                  type="number"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                  placeholder="Enter quantity (positive or negative)"
                  className="w-full px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Current: {selectedItem.stock_quantity} | New: {selectedItem.stock_quantity + adjustmentQuantity}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Reason
                </label>
                <textarea
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="Enter reason for adjustment"
                  rows={3}
                  className="w-full px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
                />
              </div>
            </div>

            <div className="p-6 border-t border-separator flex gap-3">
              <button
                onClick={() => {
                  setAdjustmentModal(false);
                  setAdjustmentQuantity(0);
                  setAdjustmentReason('');
                }}
                className="flex-1 px-4 py-2 border border-separator rounded-lg hover:bg-surface-gray transition"
              >
                Cancel
              </button>
              <button
                onClick={adjustStock}
                disabled={adjustmentQuantity === 0 || !adjustmentReason}
                className="flex-1 px-4 py-2 bg-accent-lime text-black rounded-lg hover:bg-accent-lime/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
