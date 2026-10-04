import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { items, total, removeItem } = useCart()

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-12">Shopping Cart</h1>
        {items.length === 0 ? (
          <p className="text-center text-slate-600">Your cart is empty</p>
        ) : (
          <div>
            <div className="space-y-4 mb-12">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <span>{item.productName || `Product ${item.productId}`}</span>
                  <span>PKR {item.price}</span>
                  <button onClick={() => removeItem(item.id)} className="text-red-600">Remove</button>
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold mb-4">Total: PKR {total.toFixed(2)}</p>
              <a href="/checkout" className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700">
                Proceed to Checkout
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
