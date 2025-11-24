import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface CartItem {
  product: {
    id: string;
    name: string;
    category: string;
    dimensions: string;
  };
  material: {
    id: string;
    name: string;
    type: string;
  };
  quantity: number;
  price: number;
}

interface QuoteCartProps {
  cart: CartItem[];
  onClose: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, delta: number) => void;
}

const QuoteCart = ({ cart, onClose, onRemoveItem, onUpdateQuantity }: QuoteCartProps) => {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleRequestQuote = () => {
    // Generate quote request
    const quoteData = {
      timestamp: new Date().toISOString(),
      items: cart,
      totalPrice,
      totalItems,
      requestType: 'Virtual Showroom Quote'
    };

    // Create and download quote file
    const quoteText = `
WOODEX VIRTUAL SHOWROOM - QUOTE REQUEST
========================================

Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

QUOTE SUMMARY:
--------------
Total Items: ${totalItems}
Total Price: ₹${totalPrice.toLocaleString()}

ITEM DETAILS:
${cart.map((item, index) => `
${index + 1}. ${item.product.name}
   Category: ${item.product.category}
   Dimensions: ${item.product.dimensions}
   Material: ${item.material.name} (${item.material.type})
   Quantity: ${item.quantity}
   Unit Price: ₹${(item.price / item.quantity).toLocaleString()}
   Total: ₹${item.price.toLocaleString()}
`).join('\n')}

END OF QUOTE
    `;

    const blob = new Blob([quoteText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WoodEx-Quote-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Quote request has been generated and downloaded. Please contact our sales team for a detailed quotation.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6 text-yellow-400" />
            <div>
              <h2 className="text-xl font-bold text-yellow-400">Quote Cart</h2>
              <p className="text-gray-400 text-sm">{totalItems} items • ₹{totalPrice.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Your quote cart is empty</h3>
              <p className="text-gray-400 text-center max-w-sm">
                Explore our virtual showroom and add products to your cart to receive a custom quote.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.product.id}-${item.material.id}`} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{item.product.name}</h3>
                      <p className="text-gray-400 text-sm">{item.product.category}</p>
                      <p className="text-gray-500 text-xs mt-1">{item.product.dimensions}</p>
                      
                      <div className="mt-2 text-sm">
                        <span className="text-gray-400">Material: </span>
                        <span className="text-white">{item.material.name}</span>
                        <span className="text-gray-500"> ({item.material.type})</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onUpdateQuantity(index, -1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                      >
                        <Minus className="w-4 h-4 mx-auto" />
                      </button>
                      
                      <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                      
                      <button
                        onClick={() => onUpdateQuantity(index, 1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                      >
                        <Plus className="w-4 h-4 mx-auto" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-400 text-xs">
                        ₹{((item.price / item.quantity)).toLocaleString()} × {item.quantity}
                      </p>
                      <p className="text-yellow-400 font-bold">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-white">₹{totalPrice.toLocaleString()}</span>
            </div>
            
            <div className="text-sm text-gray-400 mb-4">
              <p>• Prices exclude taxes and shipping</p>
              <p>• Final quote will be provided by our sales team</p>
              <p>• Customization options available</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={handleRequestQuote}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Request Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteCart;