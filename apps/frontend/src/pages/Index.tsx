export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">Welcome to WOODEX</h1>
        <p className="text-xl text-slate-600 mb-8">Premium Furniture for Modern Living</p>
        <a href="/shop" className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700">
          Shop Now
        </a>
      </div>
    </div>
  )
}
