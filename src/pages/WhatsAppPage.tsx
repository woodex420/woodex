import { useState, useEffect } from 'react';
import { Profile, supabase } from '../lib/supabase';
import { MessageSquare, Users, TrendingUp, Send, Calendar, BarChart3, Clock, CheckCircle, XCircle, Eye, Filter, Download, Plus, Search, X } from 'lucide-react';

interface WhatsAppPageProps {
  profile?: Profile | null;
}

interface Conversation {
  id: string;
  customer_id: string;
  whatsapp_number: string;
  status: string;
  last_message_at: string;
  total_messages: number;
  lead_score: number;
  customer_stage: string;
  customers: {
    full_name: string;
    email: string;
  };
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  sent_count: number;
  delivered_count: number;
  response_count: number;
  scheduled_at: string;
  created_at: string;
}

interface Analytics {
  metric_date: string;
  total_messages_sent: number;
  total_messages_received: number;
  total_conversations: number;
  active_conversations: number;
  response_rate: number;
  avg_response_time_minutes: number;
  conversion_count: number;
  revenue_attributed: number;
}

const WhatsAppPage = ({ profile }: WhatsAppPageProps) => {
  const [activeTab, setActiveTab] = useState<'conversations' | 'campaigns' | 'analytics' | 'journey'>('conversations');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Summary metrics
  const [metrics, setMetrics] = useState({
    totalConversations: 0,
    activeConversations: 0,
    totalCampaigns: 0,
    avgResponseRate: 0
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'conversations') {
        await fetchConversations();
      } else if (activeTab === 'campaigns') {
        await fetchCampaigns();
      } else if (activeTab === 'analytics') {
        await fetchAnalytics();
      }
      await fetchMetrics();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from('whatsapp_conversations')
      .select(`
        *,
        customers (
          full_name,
          email
        )
      `)
      .order('last_message_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setConversations(data);
    }
  };

  const fetchCampaigns = async () => {
    const { data, error } = await supabase
      .from('whatsapp_campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setCampaigns(data);
    }
  };

  const fetchAnalytics = async () => {
    const { data, error } = await supabase
      .from('whatsapp_analytics')
      .select('*')
      .order('metric_date', { ascending: false })
      .limit(30);

    if (!error && data) {
      setAnalytics(data);
    }
  };

  const fetchMetrics = async () => {
    const { data: convData } = await supabase
      .from('whatsapp_conversations')
      .select('id, status');

    const { data: campaignData } = await supabase
      .from('whatsapp_campaigns')
      .select('id');

    const { data: analyticsData } = await supabase
      .from('whatsapp_analytics')
      .select('response_rate')
      .order('metric_date', { ascending: false })
      .limit(7);

    const totalConversations = convData?.length || 0;
    const activeConversations = convData?.filter(c => c.status === 'active').length || 0;
    const totalCampaigns = campaignData?.length || 0;
    const avgResponseRate = analyticsData && analyticsData.length > 0
      ? analyticsData.reduce((sum, a) => sum + (a.response_rate || 0), 0) / analyticsData.length
      : 0;

    setMetrics({
      totalConversations,
      activeConversations,
      totalCampaigns,
      avgResponseRate: parseFloat(avgResponseRate.toFixed(2))
    });
  };

  const loadConversationMessages = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setConversationMessages([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-chat-messages', {
        body: {
          action: 'get_messages',
          customer_id: conversation.customer_id,
          limit: 100
        }
      });

      if (!error && data?.data?.messages) {
        setConversationMessages(data.data.messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim() || !selectedConversation) return;

    setSendingReply(true);
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-chat-messages', {
        body: {
          action: 'send_reply',
          customer_id: selectedConversation.customer_id,
          message_content: replyMessage
        }
      });

      if (!error && data?.data?.success) {
        setReplyMessage('');
        // Reload messages
        await loadConversationMessages(selectedConversation);
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setSendingReply(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-purple-100 text-purple-800';
      case 'vip': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm === '' || 
      conv.customers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.whatsapp_number.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || conv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredCampaigns = campaigns.filter(camp => {
    const matchesSearch = searchTerm === '' ||
      camp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || camp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">WhatsApp CRM</h1>
        <p className="text-text-secondary">Manage customer conversations, campaigns, and analytics</p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Conversations</p>
              <p className="text-3xl font-bold text-text-primary">{metrics.totalConversations}</p>
            </div>
            <MessageSquare className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Active Conversations</p>
              <p className="text-3xl font-bold text-text-primary">{metrics.activeConversations}</p>
            </div>
            <Users className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Campaigns</p>
              <p className="text-3xl font-bold text-text-primary">{metrics.totalCampaigns}</p>
            </div>
            <Send className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-separator">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Avg Response Rate</p>
              <p className="text-3xl font-bold text-text-primary">{metrics.avgResponseRate}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-separator">
        <div className="border-b border-separator">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'conversations'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Conversations</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'campaigns'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                <span>Campaigns</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('journey')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'journey'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Customer Journey</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Conversations Tab */}
          {activeTab === 'conversations' && (
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search by name or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Conversations List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-2 text-text-secondary">Loading conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
                  <p className="text-text-secondary">No conversations found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Stage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Lead Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Messages
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Last Activity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-separator">
                      {filteredConversations.map((conv) => (
                        <tr 
                          key={conv.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => loadConversationMessages(conv)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-text-primary">
                              {conv.customers?.full_name || 'Unknown'}
                            </div>
                            <div className="text-sm text-text-secondary">
                              {conv.customers?.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                            {conv.whatsapp_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(conv.customer_stage)}`}>
                              {conv.customer_stage}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-semibold text-text-primary">{conv.lead_score}</div>
                              <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${Math.min((conv.lead_score / 100) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                            {conv.total_messages}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                            {conv.last_message_at ? new Date(conv.last_message_at).toLocaleString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {conv.status === 'active' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              {/* Search and Actions */}
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span>New Campaign</span>
                </button>
              </div>

              {/* Campaigns List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-2 text-text-secondary">Loading campaigns...</p>
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="text-center py-12">
                  <Send className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
                  <p className="text-text-secondary">No campaigns found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-separator rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">{campaign.name}</h3>
                          <p className="text-sm text-text-secondary mt-1">{campaign.description}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCampaignStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-text-secondary">Sent</p>
                          <p className="text-lg font-semibold text-text-primary">{campaign.sent_count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary">Delivered</p>
                          <p className="text-lg font-semibold text-text-primary">{campaign.delivered_count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary">Responses</p>
                          <p className="text-lg font-semibold text-text-primary">{campaign.response_count}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-separator flex items-center justify-between">
                        <div className="text-xs text-text-secondary">
                          {campaign.scheduled_at ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(campaign.scheduled_at).toLocaleString()}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Created {new Date(campaign.created_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-2 text-text-secondary">Loading analytics...</p>
                </div>
              ) : analytics.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
                  <p className="text-text-secondary">No analytics data available</p>
                </div>
              ) : (
                <>
                  {/* Recent Performance */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Performance (Last 7 Days)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Sent</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Received</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Response Rate</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Avg Response Time</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Conversions</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-separator">
                          {analytics.slice(0, 7).map((metric) => (
                            <tr key={metric.metric_date}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
                                {new Date(metric.metric_date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-text-primary">
                                {metric.total_messages_sent}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-text-primary">
                                {metric.total_messages_received}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                <span className={`font-semibold ${metric.response_rate >= 50 ? 'text-green-600' : 'text-orange-600'}`}>
                                  {metric.response_rate}%
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-text-primary">
                                {metric.avg_response_time_minutes} min
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-text-primary">
                                {metric.conversion_count}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-text-primary">
                                PKR {Number(metric.revenue_attributed).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Export Button */}
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-gray-100 text-text-primary rounded-lg hover:bg-gray-200 flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      <span>Export Analytics</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Customer Journey Tab */}
          {activeTab === 'journey' && (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Customer Journey Visualization</h3>
              <p className="text-text-secondary max-w-md mx-auto">
                Track customer interactions across all touchpoints. Journey visualization and funnel analysis coming soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-separator">
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  {selectedConversation.customers?.full_name || 'Unknown Customer'}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {selectedConversation.whatsapp_number} • {selectedConversation.customers?.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-3">
              {conversationMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
                  <p className="text-text-secondary">No messages yet</p>
                </div>
              ) : (
                conversationMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.direction === 'inbound' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.direction === 'inbound'
                          ? 'bg-white text-gray-800 shadow'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.direction === 'inbound' ? 'text-gray-500' : 'text-blue-100'}`}>
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Reply Input */}
            <div className="p-6 border-t border-separator bg-white">
              <div className="flex items-end gap-3">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                  className="flex-1 px-4 py-2 border border-separator rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                />
                <button
                  onClick={sendReply}
                  disabled={sendingReply || !replyMessage.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed h-fit flex items-center gap-2"
                >
                  {sendingReply ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppPage;
