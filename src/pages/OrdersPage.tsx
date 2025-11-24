import { useState, useEffect } from 'react';
import { supabase, Profile, Order, Delivery, Return } from '../lib/supabase';
import { Package, Truck, RefreshCw, Search, Filter, Eye, Calendar, DollarSign } from 'lucide-react';

interface OrdersPageProps {
  profile?: Profile | null;
}

interface OrderWithDetails extends Order {
  customer?: any;
  delivery?: Delivery;
  return?: Return;
  items_count?: number;
}

const OrdersPage = ({ profile }: OrdersPageProps) => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'production', label: 'In Production' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    production: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with customer details
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(id, full_name, email, phone, company_name)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items count for each order
      const ordersWithCounts = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { count } = await supabase
            .from('order_items')
            .select('*', { count: 'exact', head: true })
            .eq('order_id', order.id);

          // Fetch delivery info
          const { data: delivery } = await supabase
            .from('deliveries')
            .select('*')
            .eq('order_id', order.id)
            .single();

          // Fetch return info
          const { data: returnData } = await supabase
            .from('returns')
            .select('*')
            .eq('order_id', order.id)
            .single();

          return {
            ...order,
            items_count: count || 0,
            delivery: delivery || undefined,
            return: returnData || undefined
          };
        })
      );

      setOrders(ordersWithCounts);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.phone?.includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(true);

      const response = await fetch(
        'https://vocqqajpznqyopjcymer.supabase.co/functions/v1/order-status-updater',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.getSession()}`
          },
          body: JSON.stringify({
            order_id: orderId,
            new_status: newStatus,
            changed_by: profile?.id || 'admin',
            notes: `Status updated by ${profile?.full_name || 'Admin'}`
          })
        }
      );

      if (response.ok) {
        await fetchOrders();
        alert('Order status updated successfully!');
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const viewOrderDetails = async (order: OrderWithDetails) => {
    try {
      // Fetch complete order details including items
      const { data: items, error } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(name, sku, images)
        `)
        .eq('order_id', order.id);

      if (error) throw error;

      setSelectedOrder({ ...order, items } as any);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalRevenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0)
    };
    return stats;
  };

  const stats = getOrderStats();

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
        <h1 className="text-4xl font-bold text-text-primary mb-2">Order Management</h1>
        <p className="text-text-secondary">Track and manage all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-text-primary mt-1">{stats.total}</p>
            </div>
            <Package className="h-10 w-10 text-accent-lime" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <Calendar className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Shipped</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.shipped}</p>
            </div>
            <Truck className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-separator">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by order number, customer name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-text-tertiary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-accent-lime text-black rounded-lg hover:bg-accent-lime/90 transition flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-separator overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-gray border-b border-separator">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Total
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-secondary">
                    No orders found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-gray transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-text-primary">
                        {order.order_number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-text-primary">
                          {order.customer?.full_name || 'Guest'}
                        </div>
                        <div className="text-text-secondary">
                          {order.customer?.email || order.customer?.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {order.items_count} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updating}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.status]
                        } focus:outline-none focus:ring-2 focus:ring-accent-lime`}
                      >
                        {statusOptions.slice(1).map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="text-accent-lime hover:text-accent-lime/80 transition flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-separator">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary">
                  Order Details - {selectedOrder.order_number}
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
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Customer Information</h3>
                <div className="bg-surface-gray p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedOrder.customer?.full_name}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.customer?.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.customer?.phone}</p>
                  {selectedOrder.customer?.company_name && (
                    <p><span className="font-medium">Company:</span> {selectedOrder.customer?.company_name}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Order Items</h3>
                <div className="space-y-3">
                  {(selectedOrder as any).items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-surface-gray rounded-lg">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{item.product?.name}</p>
                        <p className="text-sm text-text-secondary">SKU: {item.product?.sku}</p>
                        <p className="text-sm text-text-secondary">
                          Quantity: {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-text-primary">{formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Order Summary</h3>
                <div className="bg-surface-gray p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-bold text-lg">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-separator">
                    <span>Payment Status:</span>
                    <span className="font-medium capitalize">{selectedOrder.payment_status}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              {selectedOrder.delivery && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Delivery Information</h3>
                  <div className="bg-surface-gray p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Tracking:</span> {selectedOrder.delivery.tracking_number || 'Not assigned'}</p>
                    <p><span className="font-medium">Courier:</span> {selectedOrder.delivery.courier_name || 'Not assigned'}</p>
                    <p><span className="font-medium">Status:</span> <span className="capitalize">{selectedOrder.delivery.status}</span></p>
                    <p><span className="font-medium">Type:</span> <span className="capitalize">{selectedOrder.delivery.delivery_type}</span></p>
                  </div>
                </div>
              )}

              {/* Return Information */}
              {selectedOrder.return && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Return Information</h3>
                  <div className="bg-red-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Return Number:</span> {selectedOrder.return.return_number}</p>
                    <p><span className="font-medium">Status:</span> <span className="capitalize">{selectedOrder.return.status}</span></p>
                    <p><span className="font-medium">Reason:</span> {selectedOrder.return.reason}</p>
                    <p><span className="font-medium">Type:</span> <span className="capitalize">{selectedOrder.return.return_type}</span></p>
                  </div>
                </div>
              )}
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
    </div>
  );
};

export default OrdersPage;
