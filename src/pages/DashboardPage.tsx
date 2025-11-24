import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, type Profile, type AnalyticsDaily } from '../lib/supabase';
import { TrendingUp, Users, FileText, ShoppingCart, MessageCircle, Package } from 'lucide-react';

interface DashboardPageProps {
  profile: Profile | null;
}

const DashboardPage = ({ profile }: DashboardPageProps) => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsDaily | null>(null);
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    quotations: 0,
    orders: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch latest analytics
    const { data: analyticsData } = await supabase
      .from('analytics_daily')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (analyticsData) setAnalytics(analyticsData);

    // Fetch counts
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: customersCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    const { count: quotationsCount } = await supabase
      .from('quotations')
      .select('*', { count: 'exact', head: true });

    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    setStats({
      products: productsCount || 0,
      customers: customersCount || 0,
      quotations: quotationsCount || 0,
      orders: ordersCount || 0,
    });
  };

  const statCards = [
    { name: 'Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { name: 'Customers', value: stats.customers, icon: Users, color: 'bg-green-500' },
    { name: 'Quotations', value: stats.quotations, icon: FileText, color: 'bg-purple-500' },
    { name: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome back, {profile?.full_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white p-6 rounded-lg border border-separator hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-1">{stat.value}</h3>
              <p className="text-sm text-text-secondary">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Analytics Section */}
      {analytics && (
        <div className="bg-white p-6 rounded-lg border border-separator">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Today's Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <MessageCircle className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-text-primary">{analytics.messages_sent}</p>
                <p className="text-sm text-text-secondary">Messages Sent</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-text-primary">{analytics.leads_generated}</p>
                <p className="text-sm text-text-secondary">Leads Generated</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ShoppingCart className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-text-primary">PKR {analytics.revenue.toFixed(0)}</p>
                <p className="text-sm text-text-secondary">Revenue</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border border-separator">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/products')}
            className="p-4 text-left border border-separator rounded-lg hover:bg-muted transition-colors"
          >
            <Package className="h-6 w-6 text-text-primary mb-2" />
            <h3 className="font-semibold text-text-primary">Add Product</h3>
            <p className="text-sm text-text-secondary mt-1">Create new furniture item</p>
          </button>
          <button 
            onClick={() => navigate('/quotations')}
            className="p-4 text-left border border-separator rounded-lg hover:bg-muted transition-colors"
          >
            <FileText className="h-6 w-6 text-text-primary mb-2" />
            <h3 className="font-semibold text-text-primary">New Quotation</h3>
            <p className="text-sm text-text-secondary mt-1">Generate customer quote</p>
          </button>
          <button 
            onClick={() => navigate('/customers')}
            className="p-4 text-left border border-separator rounded-lg hover:bg-muted transition-colors"
          >
            <Users className="h-6 w-6 text-text-primary mb-2" />
            <h3 className="font-semibold text-text-primary">Add Customer</h3>
            <p className="text-sm text-text-secondary mt-1">Register new customer</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
