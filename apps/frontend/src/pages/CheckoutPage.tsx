import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

export default function CheckoutPage() {
  const { total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      // Call Stripe API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })
      const data = await response.json()
      // Redirect to Stripe Checkout
      window.location.href = data.sessionUrl
    } catch (error) {
      console.error('Checkout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <h1 className="text-4xl font-bold mb-12">Checkout</h1>
        <div className="bg-slate-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <p className="text-xl font-bold text-amber-600">Total: PKR {total.toFixed(2)}</p>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Pay with Stripe'}
        </button>
      </div>
    </div>
  )
}
