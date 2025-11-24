// @ts-nocheck
import { useEffect, useState } from 'react';
import { Package, ShoppingBag, FolderTree, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalCategories: number;
  lowStockProducts: number;
}

interface CategoryData {
  category: string;
  count: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const { data: statsData, error: statsError } = await supabase.functions.invoke('analytics', {
        body: { operation: 'get_dashboard_stats' }
      });

      if (statsError) throw statsError;
      setStats(statsData.data);

      const { data: categoryStats, error: categoryError } = await supabase.functions.invoke('analytics', {
        body: { operation: 'get_category_distribution' }
      });

      if (categoryError) throw categoryError;
      setCategoryData(categoryStats.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome to WoodEx Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats?.totalProducts || 0}
          color="bg-blue-600"
        />
        <StatCard
          icon={ShoppingBag}
          label="Active Products"
          value={stats?.activeProducts || 0}
          color="bg-green-600"
        />
        <StatCard
          icon={FolderTree}
          label="Categories"
          value={stats?.totalCategories || 0}
          color="bg-purple-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={stats?.lowStockProducts || 0}
          color="bg-yellow-600"
        />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Products by Category</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="category" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <QuickStatItem label="Active Products" value={stats?.activeProducts || 0} total={stats?.totalProducts || 0} />
            <QuickStatItem label="Inactive Products" value={stats?.inactiveProducts || 0} total={stats?.totalProducts || 0} />
            <QuickStatItem label="Low Stock Items" value={stats?.lowStockProducts || 0} total={stats?.totalProducts || 0} />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
          <div className="space-y-4">
            <StatusItem label="Database" status="Operational" color="green" />
            <StatusItem label="Storage" status="Operational" color="green" />
            <StatusItem label="Edge Functions" status="Operational" color="green" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-slate-400 text-sm">{label}</div>
          <div className="text-2xl font-bold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

function QuickStatItem({ label, value, total }: any) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">{value}/{total}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function StatusItem({ label, status, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
        <span className="text-white text-sm">{status}</span>
      </div>
    </div>
  );
}
