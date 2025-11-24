import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, MapPin, CreditCard, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OrderDetails {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: any;
  created_at: string;
  order_items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    image_url: string | null;
  }>;
}

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order_id');
  const orderNumber = searchParams.get('order_number');

  useEffect(() => {
    if (!orderId && !orderNumber) {
      setError('No order information provided');
      setLoading(false);
      return;
    }

    loadOrderDetails();
  }, [orderId, orderNumber]);

  const loadOrderDetails = async () => {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_name,
            quantity,
            price,
            image_url
          )
        `);

      if (orderId) {
        query = query.eq('id', orderId);
      } else if (orderNumber) {
        query = query.eq('order_number', orderNumber);
      }

      const { data, error: fetchError } = await query.single();

      if (fetchError) throw fetchError;
      setOrder(data);
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Unable to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#C2F21E]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to find your order'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#C2F21E] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B0E01C] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">Order Number:</span>
            <span className="font-mono font-bold text-lg">{order.order_number}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#C2F21E]" />
              Customer Details
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Name:</span> <strong>{order.customer_name}</strong></p>
              <p><span className="text-gray-600">Email:</span> <strong>{order.customer_email}</strong></p>
              <p><span className="text-gray-600">Phone:</span> <strong>{order.customer_phone}</strong></p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C2F21E]" />
              Shipping Address
            </h3>
            <div className="text-sm text-gray-600">
              {order.shipping_address ? (
                <>
                  <p>{order.shipping_address.street}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.postal_code}</p>
                  <p>{order.shipping_address.state}</p>
                  <p>{order.shipping_address.country}</p>
                </>
              ) : (
                <p>Address information not available</p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#C2F21E]" />
              Payment Details
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Method:</span> <strong className="capitalize">{order.payment_method}</strong></p>
              <p>
                <span className="text-gray-600">Status:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment_status}
                </span>
              </p>
              <p><span className="text-gray-600">Total:</span> <strong className="text-lg">PKR {order.total_amount.toLocaleString()}</strong></p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.order_items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    PKR {item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Amount</span>
              <span className="text-[#C2F21E]">PKR {order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-900">What's Next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>You'll receive a confirmation email at <strong>{order.customer_email}</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>We'll process your order within 1-2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>You'll receive shipping updates via email</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Track your order status in your account</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/account')}
            className="bg-[#C2F21E] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#B0E01C] transition-colors"
          >
            View Order Status
          </button>
          <button
            onClick={() => navigate('/products')}
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
