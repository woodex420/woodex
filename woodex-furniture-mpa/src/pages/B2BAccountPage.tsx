import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Building2, Users, ShoppingCart, TrendingUp, Settings, CreditCard } from 'lucide-react';

interface Company {
  id: string;
  company_name: string;
  discount_tier: string;
  credit_limit: number;
  payment_terms: string;
}

interface B2BUser {
  role: string;
  department: string;
  approval_limit: number;
  can_approve_orders: boolean;
  can_place_orders: boolean;
}

export default function B2BAccountPage() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [b2bUser, setB2BUser] = useState<B2BUser | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchB2BData();
  }, [user]);

  const fetchB2BData = async () => {
    try {
      // Fetch B2B user record
      const { data: userData } = await supabase
        .from('b2b_users')
        .select('*, company:b2b_companies(*)')
        .eq('user_id', user?.id)
        .single();

      if (userData) {
        setB2BUser(userData);
        setCompany(userData.company);

        // Fetch company orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        setOrders(ordersData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-r-transparent"></div>
      </div>
    );
  }

  if (!company || !b2bUser) {
    return (
      <div className="min-h-screen bg-surface-base py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg border border-separator p-8 text-center">
            <Building2 className="h-16 w-16 text-text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">B2B Account Setup Required</h2>
            <p className="text-text-secondary mb-6">
              You don't have a B2B company account yet. Contact our sales team to set up your enterprise account.
            </p>
            <a
              href="/contact"
              className="inline-block bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    );
  }

  const discountPercentage = company.discount_tier === 'premium' ? 10 : company.discount_tier === 'standard' ? 5 : 0;

  return (
    <div className="min-h-screen bg-surface-base py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-8">B2B Account Dashboard</h1>

        {/* Company Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-separator p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-blue text-white p-3 rounded-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Company</p>
                <h3 className="text-xl font-bold">{company.company_name}</h3>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Payment Terms:</span>
                <span className="font-semibold">{company.payment_terms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Discount Tier:</span>
                <span className="font-semibold capitalize">{company.discount_tier}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-separator p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 text-white p-3 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Credit Limit</p>
                <h3 className="text-xl font-bold">PKR {company.credit_limit.toLocaleString()}</h3>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-text-secondary">Available:</span>
                <span className="font-semibold text-green-600">PKR {company.credit_limit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-separator p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-orange text-white p-3 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Your Discount</p>
                <h3 className="text-xl font-bold">{discountPercentage}%</h3>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              Automatic discount on all orders
            </p>
          </div>
        </div>

        {/* User Role & Permissions */}
        <div className="bg-white rounded-lg border border-separator p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Account</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Role & Department</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Role:</span>
                  <span className="font-semibold capitalize">{b2bUser.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Department:</span>
                  <span className="font-semibold">{b2bUser.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Approval Limit:</span>
                  <span className="font-semibold">PKR {b2bUser.approval_limit?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Permissions</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={b2bUser.can_place_orders} disabled className="rounded" />
                  <span className="text-sm">Can Place Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={b2bUser.can_approve_orders} disabled className="rounded" />
                  <span className="text-sm">Can Approve Orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-separator p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Company Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-text-secondary mx-auto mb-3" />
              <p className="text-text-secondary">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted-bg">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">Order #</th>
                    <th className="text-left p-3 text-sm font-semibold">Date</th>
                    <th className="text-left p-3 text-sm font-semibold">Total</th>
                    <th className="text-left p-3 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t border-separator">
                      <td className="p-3 text-sm">{order.order_number}</td>
                      <td className="p-3 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-sm font-semibold">PKR {order.total_amount?.toLocaleString()}</td>
                      <td className="p-3 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
