export default function Shop() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-12">Our Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Products will be fetched from API */}
          <div className="bg-slate-100 rounded-lg p-6 text-center">
            <div className="bg-slate-200 h-64 mb-4 rounded"></div>
            <h3 className="text-lg font-semibold">Product Name</h3>
            <p className="text-amber-600 text-xl font-bold mt-2">PKR 0.00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
