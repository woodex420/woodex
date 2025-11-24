import { useState, useEffect } from 'react';
import { supabase, Profile, Return, Order } from '../lib/supabase';
import { RotateCcw, AlertCircle, CheckCircle, XCircle, Search, RefreshCw, Eye } from 'lucide-react';

interface ReturnsPageProps {
  profile?: Profile | null;
}

interface ReturnWithOrder extends Return {
  order?: Order & { customer?: any };
}

const ReturnsPage = ({ profile }: ReturnsPageProps) => {
  const [returns, setReturns] = useState<ReturnWithOrder[]>([]);
  const [filteredReturns, setFilteredReturns] = useState<ReturnWithOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReturn, setSelectedReturn] = useState<ReturnWithOrder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'complete'>('approve');
  const [actionNotes, setActionNotes] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Returns' },
    { value: 'requested', label: 'Requested' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'received', label: 'Received' },
    { value: 'inspected', label: 'Inspected' },
    { value: 'completed', label: 'Completed' }
  ];

  const statusColors: Record<string, string> = {
    requested: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    received: 'bg-indigo-100 text-indigo-800',
    inspected: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800'
  };

  const reasonCategoryLabels: Record<string, string> = {
    defective: 'Defective Product',
    wrong_item: 'Wrong Item',
    not_as_described: 'Not as Described',
    changed_mind: 'Changed Mind',
    other: 'Other'
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  useEffect(() => {
    filterReturns();
  }, [searchTerm, statusFilter, returns]);

  const fetchReturns = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('returns')
        .select(`
          *,
          order:orders(
            *,
            customer:customers(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReturns(data || []);
    } catch (error) {
      console.error('Error fetching returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReturns = () => {
    let filtered = returns;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        r =>
          r.return_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.order?.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.order?.customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReturns(filtered);
  };

  const openActionModal = (returnItem: ReturnWithOrder, action: 'approve' | 'reject' | 'complete') => {
    setSelectedReturn(returnItem);
    setActionType(action);
    setActionNotes('');
    setActionModal(true);
  };

  const processAction = async () => {
    if (!selectedReturn) return;

    try {
      let newStatus = selectedReturn.status;
      const updatePayload: any = {
        admin_notes: actionNotes,
        updated_at: new Date().toISOString()
      };

      if (actionType === 'approve') {
        newStatus = 'approved';
        updatePayload.status = newStatus;
        updatePayload.approved_by = profile?.id;
        updatePayload.approved_at = new Date().toISOString();
      } else if (actionType === 'reject') {
        newStatus = 'rejected';
        updatePayload.status = newStatus;
      } else if (actionType === 'complete') {
        newStatus = 'completed';
        updatePayload.status = newStatus;
        updatePayload.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('returns')
        .update(updatePayload)
        .eq('id', selectedReturn.id);

      if (error) throw error;

      alert('Return updated successfully!');
      setActionModal(false);
      fetchReturns();
    } catch (error) {
      console.error('Error processing return:', error);
      alert('Failed to process return. Please try again.');
    }
  };

  const viewReturnDetails = (returnItem: ReturnWithOrder) => {
    setSelectedReturn(returnItem);
    setShowDetailsModal(true);
  };

  const getReturnStats = () => {
    return {
      total: returns.length,
      requested: returns.filter(r => r.status === 'requested').length,
      approved: returns.filter(r => r.status === 'approved').length,
      completed: returns.filter(r => r.status === 'completed').length
    };
  };

  const formatCurrency = (amount?: number) =>
    amount ? `PKR ${amount.toLocaleString()}` : 'Not calculated';
  
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const stats = getReturnStats();

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
        <h1 className="text-4xl font-bold text-text-primary mb-2">Returns & Exchanges</h1>
        <p className="text-text-secondary">Manage customer return and exchange requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Returns</p>
              <p className="text-3xl font-bold text-text-primary mt-1">{stats.total}</p>
            </div>
            <RotateCcw className="h-10 w-10 text-accent-lime" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Requested</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.requested}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Approved</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
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
              placeholder="Search by return number, order number, or customer name..."
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
            onClick={fetchReturns}
            className="px-4 py-2 bg-accent-lime text-black rounded-lg hover:bg-accent-lime/90 transition flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-lg border border-separator overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-gray border-b border-separator">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Return Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Type
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
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-secondary">
                    No returns found
                  </td>
                </tr>
              ) : (
                filteredReturns.map((returnItem) => (
                  <tr key={returnItem.id} className="hover:bg-surface-gray transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                      {returnItem.return_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {returnItem.order?.order_number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-text-primary">
                          {returnItem.order?.customer?.full_name || 'Guest'}
                        </div>
                        <div className="text-text-secondary">
                          {returnItem.order?.customer?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <div>{reasonCategoryLabels[returnItem.reason_category]}</div>
                      <div className="text-xs text-text-tertiary truncate max-w-xs">
                        {returnItem.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-text-secondary">
                      {returnItem.return_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[returnItem.status]
                        }`}
                      >
                        {returnItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => viewReturnDetails(returnItem)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        View
                      </button>
                      {returnItem.status === 'requested' && (
                        <>
                          <button
                            onClick={() => openActionModal(returnItem, 'approve')}
                            className="text-green-600 hover:text-green-800 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openActionModal(returnItem, 'reject')}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {returnItem.status === 'inspected' && (
                        <button
                          onClick={() => openActionModal(returnItem, 'complete')}
                          className="text-accent-lime hover:text-accent-lime/80 transition"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-separator">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary">
                  Return Details - {selectedReturn.return_number}
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
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Return Information</h3>
                <div className="bg-surface-gray p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Order Number:</span> {selectedReturn.order?.order_number}</p>
                  <p><span className="font-medium">Status:</span> <span className="capitalize">{selectedReturn.status}</span></p>
                  <p><span className="font-medium">Type:</span> <span className="capitalize">{selectedReturn.return_type.replace('_', ' ')}</span></p>
                  <p><span className="font-medium">Reason Category:</span> {reasonCategoryLabels[selectedReturn.reason_category]}</p>
                  <p><span className="font-medium">Refund Amount:</span> {formatCurrency(selectedReturn.refund_amount)}</p>
                  <p><span className="font-medium">Created:</span> {formatDate(selectedReturn.created_at)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Customer Notes</h3>
                <div className="bg-surface-gray p-4 rounded-lg">
                  <p className="text-text-secondary">{selectedReturn.customer_notes || 'No notes provided'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Reason Details</h3>
                <div className="bg-surface-gray p-4 rounded-lg">
                  <p className="text-text-secondary">{selectedReturn.reason}</p>
                </div>
              </div>

              {selectedReturn.admin_notes && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Admin Notes</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-text-secondary">{selectedReturn.admin_notes}</p>
                  </div>
                </div>
              )}

              {selectedReturn.images && selectedReturn.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Images</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedReturn.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Return evidence ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
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

      {/* Action Modal */}
      {actionModal && selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-separator">
              <h2 className="text-2xl font-bold text-text-primary capitalize">
                {actionType} Return
              </h2>
              <p className="text-text-secondary">{selectedReturn.return_number}</p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Admin Notes
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Add notes about this action..."
                rows={4}
                className="w-full px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-lime"
              />
            </div>

            <div className="p-6 border-t border-separator flex gap-3">
              <button
                onClick={() => setActionModal(false)}
                className="flex-1 px-4 py-2 border border-separator rounded-lg hover:bg-surface-gray transition"
              >
                Cancel
              </button>
              <button
                onClick={processAction}
                className={`flex-1 px-4 py-2 rounded-lg transition ${
                  actionType === 'reject'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-accent-lime text-black hover:bg-accent-lime/90'
                }`}
              >
                Confirm {actionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsPage;
