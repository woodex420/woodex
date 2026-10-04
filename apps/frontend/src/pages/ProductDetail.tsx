import { useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { productId } = useParams()

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 gap-12">
          <div className="bg-slate-100 rounded-lg h-96"></div>
          <div>
            <h1 className="text-4xl font-bold mb-4">Product Name</h1>
            <p className="text-amber-600 text-2xl font-bold mb-6">PKR 0.00</p>
            <p className="text-slate-600 mb-8">Product description will go here</p>
            <button className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
