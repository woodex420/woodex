interface Props {
  profile: any
}

export default function DashboardPage({ profile }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-slate-600 text-sm font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-amber-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-slate-600 text-sm font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-amber-600">PKR 0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-slate-600 text-sm font-semibold mb-2">Products</h3>
          <p className="text-3xl font-bold text-amber-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-slate-600 text-sm font-semibold mb-2">Customers</h3>
          <p className="text-3xl font-bold text-amber-600">0</p>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome, {profile?.full_name || 'Admin'}!</h2>
        <p className="text-slate-600">Dashboard statistics will load here</p>
      </div>
    </div>
  )
}
