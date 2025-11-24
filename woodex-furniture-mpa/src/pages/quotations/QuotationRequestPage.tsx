import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../contexts/CartContext';

interface QuotationItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  customizations?: Record<string, any>;
}

export default function QuotationRequestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [notes, setNotes] = useState('');
  const [calculatedQuote, setCalculatedQuote] = useState<any>(null);

  useEffect(() => {
    // Load items from cart or URL params
    const source = searchParams.get('source');
    
    if (source === 'cart' && cart.length > 0) {
      const cartItems = cart.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.product_price,
        customizations: {}
      }));
      setItems(cartItems);
    } else if (source === 'product') {
      const productId = searchParams.get('productId');
      const productName = searchParams.get('productName');
      const price = parseFloat(searchParams.get('price') || '0');
      
      if (productId && productName) {
        setItems([{
          product_id: productId,
          product_name: productName,
          quantity: 1,
          unit_price: price,
          customizations: {}
        }]);
      }
    }
  }, [searchParams, cart]);

  const calculateQuotation = async () => {
    if (items.length === 0) return;

    setCalculating(true);
    try {
      const { data, error } = await supabase.functions.invoke('quotation-calculator', {
        body: {
          items: items.map(item => ({
            productId: item.product_id,
            productName: item.product_name,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            customizations: item.customizations || {}
          })),
          customerTier: 'standard'
        }
      });

      if (error) throw error;
      setCalculatedQuote(data.data);
    } catch (error) {
      console.error('Error calculating quotation:', error);
      alert('Failed to calculate quotation. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      calculateQuotation();
    }
  }, [items]);

  const updateItemQuantity = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, quantity);
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Please add at least one item to the quotation');
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      alert('Please provide your name and email');
      return;
    }

    setLoading(true);
    try {
      // Generate quote number
      const quoteNumber = `QT-${Date.now().toString().slice(-8)}`;
      
      // Calculate expiry date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Create quotation
      const { data: quotation, error: quotationError } = await supabase
        .from('quotations')
        .insert([{
          quote_number: quoteNumber,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          customer_company: customerInfo.company,
          status: 'draft',
          subtotal: parseFloat(calculatedQuote?.subtotalAfterDiscount || '0'),
          tax_amount: parseFloat(calculatedQuote?.taxAmount || '0'),
          discount_amount: parseFloat(calculatedQuote?.totalDiscount || '0'),
          shipping_cost: parseFloat(calculatedQuote?.shippingCost || '0'),
          total_amount: parseFloat(calculatedQuote?.finalTotal || '0'),
          currency: 'PKR',
          valid_until: expiryDate.toISOString().split('T')[0],
          notes: notes
        }])
        .select()
        .single();

      if (quotationError) throw quotationError;

      // Create quotation items
      const quotationItems = calculatedQuote.items.map((item: any) => ({
        quotation_id: quotation.id,
        product_id: item.productId,
        item_name: item.productName,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unitPrice),
        line_total: parseFloat(item.totalPrice),
        customizations: item.customizations
      }));

      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(quotationItems);

      if (itemsError) throw itemsError;

      // Log activity
      await supabase.from('quotation_activities').insert([{
        quotation_id: quotation.id,
        activity_type: 'created',
        description: 'Quotation created from e-commerce platform',
        metadata: { source: searchParams.get('source') }
      }]);

      // Sync with CRM
      try {
        await supabase.functions.invoke('quotation-crm-sync', {
          body: { quotationId: quotation.id, syncType: 'full' }
        });
      } catch (crmError) {
        console.error('CRM sync failed:', crmError);
      }

      // Send notifications to customer and admin
      try {
        // Customer notification
        await supabase.functions.invoke('quotation-notifications', {
          body: {
            quotationId: quotation.id,
            eventType: 'created',
            recipientType: 'customer'
          }
        });

        // Admin notification
        await supabase.functions.invoke('quotation-notifications', {
          body: {
            quotationId: quotation.id,
            eventType: 'created',
            recipientType: 'admin'
          }
        });
      } catch (notificationError) {
        console.error('Notification failed:', notificationError);
        // Don't fail the whole operation if notifications fail
      }

      // Clear cart if source was cart
      if (searchParams.get('source') === 'cart') {
        await clearCart();
      }

      alert('Quotation request submitted successfully! We will contact you shortly.');
      navigate(`/quotations/${quotation.id}`);
      
    } catch (error) {
      console.error('Error submitting quotation:', error);
      alert('Failed to submit quotation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Request Quotation</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={customerInfo.company}
                  onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Items</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                    <p className="text-sm text-gray-600">PKR {item.unit_price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItemQuantity(index, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Calculated Quote */}
          {calculatedQuote && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quote Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">PKR {parseFloat(calculatedQuote.subtotal).toLocaleString()}</span>
                </div>
                {parseFloat(calculatedQuote.totalDiscount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-PKR {parseFloat(calculatedQuote.totalDiscount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (17% GST):</span>
                  <span className="font-medium">PKR {parseFloat(calculatedQuote.taxAmount).toLocaleString()}</span>
                </div>
                {parseFloat(calculatedQuote.shippingCost) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">PKR {parseFloat(calculatedQuote.shippingCost).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between text-lg font-bold text-blue-600">
                  <span>Total:</span>
                  <span>PKR {parseFloat(calculatedQuote.finalTotal).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Any special requirements or questions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || calculating || items.length === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Quotation Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
