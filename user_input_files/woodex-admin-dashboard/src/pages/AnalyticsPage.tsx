import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">Track your store performance and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={DollarSign}
          label="Total Revenue"
          value="PKR 2.4M"
          change="+12.5%"
          positive={true}
        />
        <MetricCard
          icon={ShoppingCart}
          label="Total Orders"
          value="324"
          change="+8.2%"
          positive={true}
        />
        <MetricCard
          icon={Users}
          label="New Customers"
          value="89"
          change="+15.3%"
          positive={true}
        />
        <MetricCard
          icon={TrendingUp}
          label="Conversion Rate"
          value="3.24%"
          change="-2.1%"
          positive={false}
        />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Sales Overview</h2>
        <div className="h-80 flex items-center justify-center text-slate-400">
          Sales chart will be displayed here
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Top Products</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="text-white">Product {i}</div>
                <div className="text-slate-400">PKR {(Math.random() * 100000 + 50000).toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <div className="text-white text-sm">Activity {i}</div>
                  <div className="text-slate-400 text-xs">{i} hours ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, change, positive }: any) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={`text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <div className="text-slate-400 text-sm mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
