import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  total: number;
  created_at: string;
  confirmed_date?: string;
  shipped_date?: string;
  delivered_at?: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Delivery {
  tracking_number?: string;
  courier_name?: string;
  delivery_type: string;
  status: string;
  scheduled_date?: string;
  delivered_date?: string;
}

const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'production', label: 'In Production', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const trackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    setOrderItems([]);
    setDelivery(null);

    try {
      // Find order by order number
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, customer:customers(*)')
        .eq('order_number', orderNumber.trim().toUpperCase())
        .maybeSingle();

      if (orderError) throw orderError;

      if (!orderData) {
        setError('Order not found. Please check your order number and try again.');
        return;
      }

      // Verify email matches (basic security)
      if (orderData.customer?.email?.toLowerCase() !== email.toLowerCase().trim()) {
        setError('Order number and email do not match.');
        return;
      }

      setOrder(orderData);

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderData.id);

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);

      // Fetch delivery information
      const { data: deliveryData, error: deliveryError } = await supabase
        .from('deliveries')
        .select('*')
        .eq('order_id', orderData.id)
        .maybeSingle();

      if (!deliveryError && deliveryData) {
        setDelivery(deliveryData);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('An error occurred while tracking your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex(s => s.key === status);
    return index === -1 ? 0 : index;
  };

  const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString()}`;
  
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-2xl font-bold">WOODEX</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">Track Your Order</h1>
            <p className="text-[#595C59]">Enter your order number and email to track your order status</p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={trackOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., WDX-001"
                  required
                  className="w-full px-4 py-3 border border-[#595C59]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2F21E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-[#595C59]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2F21E]"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C2F21E] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#C2F21E]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
          </div>

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Order Status Timeline */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-black mb-6">Order Status</h2>
                
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-[#595C59]/20">
                    <div
                      className="h-full bg-[#C2F21E] transition-all duration-500"
                      style={{
                        width: `${(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100}%`
                      }}
                    />
                  </div>

                  {/* Status Steps */}
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = getStatusIndex(order.status) >= index;
                      const isCurrent = getStatusIndex(order.status) === index;

                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                              isCompleted
                                ? 'bg-[#C2F21E] text-black'
                                : 'bg-white border-2 border-[#595C59]/20 text-[#595C59]'
                            } ${isCurrent ? 'ring-4 ring-[#C2F21E]/30' : ''}`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <p className={`text-xs font-medium text-center max-w-[80px] ${
                            isCompleted ? 'text-black' : 'text-[#595C59]'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-[#FAFAFA] rounded-lg">
                  <p className="text-sm text-[#595C59] mb-1">Current Status</p>
                  <p className="text-lg font-bold text-black capitalize">{order.status.replace('_', ' ')}</p>
                  {order.confirmed_date && (
                    <p className="text-sm text-[#595C59] mt-2">
                      Confirmed: {formatDate(order.confirmed_date)}
                    </p>
                  )}
                  {order.shipped_date && (
                    <p className="text-sm text-[#595C59]">
                      Shipped: {formatDate(order.shipped_date)}
                    </p>
                  )}
                  {order.delivered_at && (
                    <p className="text-sm text-[#595C59]">
                      Delivered: {formatDate(order.delivered_at)}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Information */}
              {delivery && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-black mb-4">Delivery Information</h2>
                  <div className="space-y-3">
                    {delivery.tracking_number && (
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-[#595C59]" />
                        <div>
                          <p className="text-sm text-[#595C59]">Tracking Number</p>
                          <p className="font-medium text-black">{delivery.tracking_number}</p>
                        </div>
                      </div>
                    )}
                    {delivery.courier_name && (
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-[#595C59]" />
                        <div>
                          <p className="text-sm text-[#595C59]">Courier</p>
                          <p className="font-medium text-black">{delivery.courier_name}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-[#595C59]" />
                      <div>
                        <p className="text-sm text-[#595C59]">Delivery Type</p>
                        <p className="font-medium text-black capitalize">
                          {delivery.delivery_type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    {delivery.scheduled_date && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-[#595C59]" />
                        <div>
                          <p className="text-sm text-[#595C59]">Scheduled Delivery</p>
                          <p className="font-medium text-black">{formatDate(delivery.scheduled_date)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Order Items</h2>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-[#FAFAFA] rounded-lg">
                      <div>
                        <p className="font-medium text-black">{item.product_name}</p>
                        <p className="text-sm text-[#595C59]">
                          Quantity: {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      <p className="font-bold text-black">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#595C59]/20">
                  <div className="flex justify-between mb-2">
                    <p className="text-[#595C59]">Subtotal</p>
                    <p className="font-medium text-black">{formatCurrency(order.subtotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-bold text-black">Total</p>
                    <p className="font-bold text-black text-xl">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-[#C2F21E] rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-black mb-2">Need Help?</h3>
                <p className="text-black/80 mb-4">Contact our support team for any questions about your order</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+923001234567"
                    className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-black/90 transition"
                  >
                    <Phone className="h-5 w-5" />
                    Call Us
                  </a>
                  <a
                    href="mailto:support@woodex.pk"
                    className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition"
                  >
                    <Mail className="h-5 w-5" />
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
