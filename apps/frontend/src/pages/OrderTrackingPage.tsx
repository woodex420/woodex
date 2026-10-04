import { useState } from 'react'

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderNumber}?email=${email}`)
      const data = await response.json()
      // Display order details
      console.log(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <h1 className="text-4xl font-bold mb-12">Track Your Order</h1>
        <div className="bg-slate-50 p-8 rounded-lg">
          <input
            type="text"
            placeholder="Order Number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-6"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Track Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
