import { useState, useEffect } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, FileText, Send, TrendingUp } from 'lucide-react';

interface QuotationsPageProps {
  profile?: Profile | null;
}

interface Quotation {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company: string;
  status: string;
  total_amount: number;
  created_at: string;
  valid_until: string;
  viewed_at: string | null;
  approved_at: string | null;
}

const QuotationsPage = ({ profile }: QuotationsPageProps) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [quotationItems, setQuotationItems] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0,
    viewed: 0,
    approved: 0,
    totalValue: 0
  });

  useEffect(() => {
    loadQuotations();
    loadStats();
  }, []);

  const loadQuotations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('Error loading quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('status, total_amount');

      if (error) throw error;

      const statsData = {
        total: data?.length || 0,
        draft: data?.filter(q => q.status === 'draft').length || 0,
        sent: data?.filter(q => q.status === 'sent').length || 0,
        viewed: data?.filter(q => q.status === 'viewed').length || 0,
        approved: data?.filter(q => q.status === 'approved').length || 0,
        totalValue: data?.reduce((sum, q) => sum + parseFloat(q.total_amount || 0), 0) || 0
      };

      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadQuotationDetails = async (quotation: Quotation) => {
    try {
      const { data, error } = await supabase
        .from('quotation_items')
        .select('*')
        .eq('quotation_id', quotation.id);

      if (error) throw error;
      setQuotationItems(data || []);
      setSelectedQuotation(quotation);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading quotation details:', error);
    }
  };

  const updateQuotationStatus = async (quotationId: string, newStatus: string) => {
    try {
      const { error } = await supabase.functions.invoke('quotation-status-updater', {
        body: {
          quotationId,
          newStatus,
          userId: profile?.id,
          userName: profile?.full_name || 'Admin'
        }
      });

      if (error) throw error;

      await loadQuotations();
      await loadStats();
      
      if (selectedQuotation?.id === quotationId) {
        setSelectedQuotation({ ...selectedQuotation, status: newStatus });
      }

      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const generatePDF = async (quotationId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('quotation-pdf-generator', {
        body: { quotationId }
      });

      if (error) throw error;

      const pdfWindow = window.open('', '_blank');
      if (pdfWindow && data.data.htmlContent) {
        pdfWindow.document.write(data.data.htmlContent);
        pdfWindow.document.close();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = 
      q.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.customer_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.customer_company || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'expired': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">Quotations</h1>
        <p className="text-text-secondary">Manage customer quotation requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Quotes</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-text-secondary opacity-50" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Sent</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.sent}</p>
            </div>
            <Send className="h-8 w-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Viewed</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.viewed}</p>
            </div>
            <Eye className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Value</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {(stats.totalValue / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-text-secondary opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-separator">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by quote number, customer name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-text-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-lg border border-separator overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-text-primary border-r-transparent"></div>
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div className="text-center p-12">
            <FileText className="h-16 w-16 mx-auto text-text-secondary opacity-50 mb-4" />
            <p className="text-text-secondary">No quotations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-separator">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Quote #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-separator">
                {filteredQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-primary">{quotation.quote_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-primary font-medium">{quotation.customer_name || 'N/A'}</div>
                      <div className="text-sm text-text-secondary">{quotation.customer_email || 'N/A'}</div>
                      {quotation.customer_company && (
                        <div className="text-xs text-text-secondary">{quotation.customer_company}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                        {getStatusIcon(quotation.status)}
                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-text-primary">
                        PKR {Number(quotation.total_amount).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-secondary">
                        {new Date(quotation.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-secondary">
                        {quotation.valid_until ? new Date(quotation.valid_until).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => loadQuotationDetails(quotation)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => generatePDF(quotation.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Generate PDF"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-separator">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    Quotation {selectedQuotation.quote_number}
                  </h2>
                  <p className="text-text-secondary mt-1">
                    Created: {new Date(selectedQuotation.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Name:</span>
                    <span className="ml-2 text-text-primary font-medium">{selectedQuotation.customer_name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Email:</span>
                    <span className="ml-2 text-text-primary font-medium">{selectedQuotation.customer_email || 'N/A'}</span>
                  </div>
                  {selectedQuotation.customer_phone && (
                    <div>
                      <span className="text-text-secondary">Phone:</span>
                      <span className="ml-2 text-text-primary font-medium">{selectedQuotation.customer_phone}</span>
                    </div>
                  )}
                  {selectedQuotation.customer_company && (
                    <div>
                      <span className="text-text-secondary">Company:</span>
                      <span className="ml-2 text-text-primary font-medium">{selectedQuotation.customer_company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Items</h3>
                <div className="border border-separator rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-center">Qty</th>
                        <th className="px-4 py-2 text-right">Unit Price</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-separator">
                      {quotationItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{item.item_name}</td>
                          <td className="px-4 py-2 text-center">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">PKR {parseFloat(item.unit_price).toLocaleString()}</td>
                          <td className="px-4 py-2 text-right font-medium">PKR {parseFloat(item.line_total).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Management */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Status Management</h3>
                <div className="flex flex-wrap gap-2">
                  {['draft', 'sent', 'viewed', 'approved', 'rejected', 'expired'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateQuotationStatus(selectedQuotation.id, status)}
                      disabled={selectedQuotation.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        selectedQuotation.status === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Total Amount:</span>
                    <span className="font-bold text-lg text-text-primary">
                      PKR {Number(selectedQuotation.total_amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => generatePDF(selectedQuotation.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-separator text-text-primary rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsPage;
