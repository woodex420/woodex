// @ts-nocheck - Recharts React 18 type compatibility
import { useEffect, useState } from 'react';
import { supabase, type Profile } from '../lib/supabase';
import { 
  TrendingUp, Users, MessageCircle, FileText, ShoppingCart, DollarSign,
  Package, Truck, RotateCcw, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

interface AnalyticsPageProps {
  profile: Profile | null;
}

const AnalyticsPage = ({ profile }: AnalyticsPageProps) => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [inventoryStats, setInventoryStats] = useState<any>(null);
  const [deliveryStats, setDeliveryStats] = useState<any>(null);
  const [returnStats, setReturnStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');

  useEffect(() => {
    fetchAllAnalytics();
  }, [timeRange]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchOrderAnalytics(),
        fetchInventoryAnalytics(),
        fetchDeliveryAnalytics(),
        fetchReturnAnalytics(),
        fetchRevenueData(),
        fetchTopProducts(),
        fetchWhatsAppAnalytics()
      ]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderAnalytics = async () => {
    try {
      const daysAgo = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const stats = {
        total: orders?.length || 0,
        pending: orders?.filter(o => o.status === 'pending').length || 0,
        confirmed: orders?.filter(o => o.status === 'confirmed').length || 0,
        production: orders?.filter(o => o.status === 'production').length || 0,
        shipped: orders?.filter(o => o.status === 'shipped').length || 0,
        delivered: orders?.filter(o => o.status === 'delivered').length || 0,
        cancelled: orders?.filter(o => o.status === 'cancelled').length || 0,
        totalRevenue: orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
        averageOrderValue: orders?.length ? (orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length) : 0
      };

      setOrderStats(stats);
    } catch (error) {
      console.error('Error fetching order analytics:', error);
    }
  };

  const fetchInventoryAnalytics = async () => {
    try {
      const { data: inventory, error } = await supabase
        .from('inventory')
        .select('*, product:products(name, price)');

      if (error) throw error;

      const stats = {
        totalProducts: inventory?.length || 0,
        lowStock: inventory?.filter(i => i.stock_quantity > 0 && i.stock_quantity <= i.low_stock_threshold).length || 0,
        outOfStock: inventory?.filter(i => i.stock_quantity === 0).length || 0,
        totalValue: inventory?.reduce((sum, i) => sum + (i.stock_quantity * (i.product?.price || 0)), 0) || 0,
        reservedItems: inventory?.reduce((sum, i) => sum + i.reserved_quantity, 0) || 0
      };

      setInventoryStats(stats);
    } catch (error) {
      console.error('Error fetching inventory analytics:', error);
    }
  };

  const fetchDeliveryAnalytics = async () => {
    try {
      const daysAgo = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: deliveries, error } = await supabase
        .from('deliveries')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const stats = {
        total: deliveries?.length || 0,
        pending: deliveries?.filter(d => d.status === 'pending').length || 0,
        inTransit: deliveries?.filter(d => d.status === 'in_transit').length || 0,
        delivered: deliveries?.filter(d => d.status === 'delivered').length || 0,
        failed: deliveries?.filter(d => d.status === 'failed').length || 0,
        deliveryRate: deliveries?.length ? ((deliveries.filter(d => d.status === 'delivered').length / deliveries.length) * 100).toFixed(1) : 0
      };

      setDeliveryStats(stats);
    } catch (error) {
      console.error('Error fetching delivery analytics:', error);
    }
  };

  const fetchReturnAnalytics = async () => {
    try {
      const daysAgo = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: returns, error } = await supabase
        .from('returns')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const stats = {
        total: returns?.length || 0,
        requested: returns?.filter(r => r.status === 'requested').length || 0,
        approved: returns?.filter(r => r.status === 'approved').length || 0,
        completed: returns?.filter(r => r.status === 'completed').length || 0,
        rejected: returns?.filter(r => r.status === 'rejected').length || 0,
        totalRefundAmount: returns?.reduce((sum, r) => sum + (r.refund_amount || 0), 0) || 0
      };

      setReturnStats(stats);
    } catch (error) {
      console.error('Error fetching return analytics:', error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const daysAgo = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: orders, error } = await supabase
        .from('orders')
        .select('created_at, total')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const revenueByDate: Record<string, number> = {};
      orders?.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        revenueByDate[date] = (revenueByDate[date] || 0) + order.total;
      });

      const chartData = Object.entries(revenueByDate).map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }),
        revenue
      }));

      setRevenueData(chartData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const daysAgo = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select('product_name, quantity, subtotal');

      if (error) throw error;

      // Aggregate by product
      const productSales: Record<string, { quantity: number; revenue: number }> = {};
      orderItems?.forEach(item => {
        if (!productSales[item.product_name]) {
          productSales[item.product_name] = { quantity: 0, revenue: 0 };
        }
        productSales[item.product_name].quantity += item.quantity;
        productSales[item.product_name].revenue += item.subtotal;
      });

      const topProductsData = Object.entries(productSales)
        .map(([name, data]) => ({
          name: name.length > 30 ? name.substring(0, 30) + '...' : name,
          quantity: data.quantity,
          revenue: data.revenue
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      setTopProducts(topProductsData);
    } catch (error) {
      console.error('Error fetching top products:', error);
    }
  };

  const fetchWhatsAppAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_daily')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setAnalytics((data || []).reverse());
    } catch (error) {
      console.error('Error fetching WhatsApp analytics:', error);
    }
  };

  // Chart colors
  const COLORS = ['#C2F21E', '#10b981', '#3b82f6', '#f97316', '#a855f7', '#ef4444'];

  // Order status pie chart data
  const orderStatusData = orderStats ? [
    { name: 'Pending', value: orderStats.pending, color: '#fbbf24' },
    { name: 'Confirmed', value: orderStats.confirmed, color: '#3b82f6' },
    { name: 'Production', value: orderStats.production, color: '#a855f7' },
    { name: 'Shipped', value: orderStats.shipped, color: '#6366f1' },
    { name: 'Delivered', value: orderStats.delivered, color: '#10b981' },
    { name: 'Cancelled', value: orderStats.cancelled, color: '#ef4444' }
  ].filter(item => item.value > 0) : [];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Analytics Dashboard</h1>
          <p className="text-text-secondary">Comprehensive business performance metrics</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['7days', '30days', '90days'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition ${
                timeRange === range
                  ? 'bg-accent-lime text-black'
                  : 'bg-white border border-separator text-text-secondary hover:bg-surface-gray'
              }`}
            >
              {range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Order Management KPIs */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Order Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-separator">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-text-primary mt-1">{orderStats?.total || 0}</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-accent-lime" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-separator">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  PKR {(orderStats?.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-separator">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Avg Order Value</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  PKR {Math.round(orderStats?.averageOrderValue || 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-separator">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Delivery Rate</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {deliveryStats?.deliveryRate || 0}%
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory & Logistics KPIs */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Inventory & Logistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-separator">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Products</p>
                <p className="text-3xl font-bold text-text-primary mt-1">{inventoryStats?.totalProducts || 0}</p>
              </div>
              <Package className="h-10 w-10 text-accent-lime" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-separator">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Low Stock</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{inventoryStats?.lowStock || 0}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-separator">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Deliveries</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{deliveryStats?.total || 0}</p>
              </div>
              <Truck className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-separator">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Returns</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{returnStats?.total || 0}</p>
              </div>
              <RotateCcw className="h-10 w-10 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg border border-separator">
          <h2 className="text-xl font-bold text-text-primary mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `PKR ${Number(value).toLocaleString()}`} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-lg border border-separator">
          <h2 className="text-xl font-bold text-text-primary mb-6">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg border border-separator">
          <h2 className="text-xl font-bold text-text-primary mb-6">Top 10 Products by Revenue</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value) => `PKR ${Number(value).toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#C2F21E" name="Revenue (PKR)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Delivery & Returns Status */}
        <div className="bg-white p-6 rounded-lg border border-separator">
          <h2 className="text-xl font-bold text-text-primary mb-6">Delivery & Returns Overview</h2>
          <div className="space-y-6">
            {/* Delivery Stats */}
            <div>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Delivery Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-yellow-800">Pending</span>
                  <span className="text-lg font-bold text-yellow-900">{deliveryStats?.pending || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">In Transit</span>
                  <span className="text-lg font-bold text-blue-900">{deliveryStats?.inTransit || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">Delivered</span>
                  <span className="text-lg font-bold text-green-900">{deliveryStats?.delivered || 0}</span>
                </div>
              </div>
            </div>

            {/* Return Stats */}
            <div>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Return Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-yellow-800">Requested</span>
                  <span className="text-lg font-bold text-yellow-900">{returnStats?.requested || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Approved</span>
                  <span className="text-lg font-bold text-blue-900">{returnStats?.approved || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">Completed</span>
                  <span className="text-lg font-bold text-green-900">{returnStats?.completed || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
