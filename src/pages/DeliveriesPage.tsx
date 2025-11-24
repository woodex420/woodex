import { useState, useEffect } from 'react';
import { supabase, Profile, Delivery, Order } from '../lib/supabase';
import { Truck, Package, MapPin, Calendar, Search, RefreshCw, CheckCircle } from 'lucide-react';

interface DeliveriesPageProps {
  profile?: Profile | null;
}

interface DeliveryWithOrder extends Delivery {
  order?: Order & { customer?: any };
}

const DeliveriesPage = ({ profile }: DeliveriesPageProps) => {
  const [deliveries, setDeliveries] = useState<DeliveryWithOrder[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<DeliveryWithOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryWithOrder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    tracking_number: '',
    courier_name: '',
    status: '',
    notes: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Deliveries' },
    { value: 'pending', label: 'Pending' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' }
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    picked_up: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [searchTerm, statusFilter, deliveries]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          order:orders(
            *,
            customer:customers(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDeliveries = () => {
    let filtered = deliveries;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        d =>
          d.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.order?.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.courier_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDeliveries(filtered);
  };

  const openUpdateModal = (delivery: DeliveryWithOrder) => {
    setSelectedDelivery(delivery);
    setUpdateData({
      tracking_number: delivery.tracking_number || '',
      courier_name: delivery.courier_name || '',
      status: delivery.status,
      notes: delivery.notes || ''
    });
    setUpdateModal(true);
  };

  const updateDelivery = async () => {
    if (!selectedDelivery) return;

    try {
      const updatePayload: any = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      if (updateData.status === 'delivered') {
        updatePayload.delivered_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('deliveries')
        .update(updatePayload)
        .eq('id', selectedDelivery.id);

      if (error) throw error;

      alert('Delivery updated successfully!');
      setUpdateModal(false);
      fetchDeliveries();
    } catch (error) {
      console.error('Error updating delivery:', error);
      alert('Failed to update delivery. Please try again.');
    }
  };

  const getDeliveryStats = () => {
    return {
      total: deliveries.length,
      pending: deliveries.filter(d => d.status === 'pending').length,
      in_transit: deliveries.filter(d => d.status === 'in_transit').length,
      delivered: deliveries.filter(d => d.status === 'delivered').length
    };
  };

  const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString()}`;
  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString('en-PK') : 'Not set';

  const stats = getDeliveryStats();

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
        <h1 className="text-4xl font-bold text-text-primary mb-2">Delivery Management</h1>
        <p className="text-text-secondary">Track and manage order deliveries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Deliveries</p>
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
              <p className="text-text-secondary text-sm">In Transit</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.in_transit}</p>
            </div>
            <Truck className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Delivered</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.delivered}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
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
              placeholder="Search by tracking number, order number, or courier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
            />
          </div>

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

          <button
            onClick={fetchDeliveries}
            className="px-4 py-2 bg-accent-lime text-black rounded-lg hover:bg-accent-lime/90 transition flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Deliveries Table */}
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
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Courier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Delivery Type
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
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-secondary">
                    No deliveries found
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-surface-gray transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                      {delivery.order?.order_number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-text-primary">
                          {delivery.order?.customer?.full_name || 'Guest'}
                        </div>
                        <div className="text-text-secondary">{delivery.recipient_phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {delivery.tracking_number || 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {delivery.courier_name || 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-text-secondary">
                      {delivery.delivery_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[delivery.status]
                        }`}
                      >
                        {delivery.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openUpdateModal(delivery)}
                        className="text-accent-lime hover:text-accent-lime/80 transition"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {updateModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-separator">
              <h2 className="text-2xl font-bold text-text-primary">Update Delivery</h2>
              <p className="text-text-secondary">Order: {selectedDelivery.order?.order_number}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={updateData.tracking_number}
                    onChange={(e) => setUpdateData({ ...updateData, tracking_number: e.target.value })}
                    className="w-full px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Courier Name
                  </label>
                  <input
                    type="text"
                    value={updateData.courier_name}
                    onChange={(e) => setUpdateData({ ...updateData, courier_name: e.target.value })}
                    className="w-full px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Delivery Status
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
                >
                  {statusOptions.slice(1).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Notes
                </label>
                <textarea
                  value={updateData.notes}
                  onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
                />
              </div>
            </div>

            <div className="p-6 border-t border-separator flex gap-3">
              <button
                onClick={() => setUpdateModal(false)}
                className="flex-1 px-4 py-2 border border-separator rounded-lg hover:bg-surface-gray transition"
              >
                Cancel
              </button>
              <button
                onClick={updateDelivery}
                className="flex-1 px-4 py-2 bg-accent-lime text-black rounded-lg hover:bg-accent-lime/90 transition"
              >
                Update Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveriesPage;
