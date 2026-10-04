export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Orders</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Order #</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                No orders found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
