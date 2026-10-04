export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Products</h1>
      <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 mb-6">
        + Add Product
      </button>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Product Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                No products found. Start by adding a new product.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
