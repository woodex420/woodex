import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2, CreditCard, Banknote, Building2, Smartphone, Truck, AlertCircle } from 'lucide-react';

// NOTE: Replace with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: user?.email || '',
    customer_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: 'Sindh',
    postal_code: '',
    country: 'Pakistan',
    payment_method: 'cash_on_delivery',
    delivery_type: 'standard',
    notes: '',
  });

  const [shippingFee, setShippingFee] = useState(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [inventoryChecked, setInventoryChecked] = useState(false);
  const [inventoryError, setInventoryError] = useState('');

  const tax = cartTotal * 0.02;
  const total = cartTotal + shippingFee + tax;

  // Calculate delivery cost when postal code or city changes
  useEffect(() => {
    if (formData.postal_code && formData.city && cartTotal > 0) {
      calculateDeliveryCost();
    }
  }, [formData.postal_code, formData.city, formData.delivery_type, cartTotal]);

  // Check inventory availability when cart changes
  useEffect(() => {
    checkInventoryAvailability();
  }, [cart]);

  const calculateDeliveryCost = async () => {
    if (!formData.postal_code || !formData.city) return;

    setCalculatingShipping(true);
    setShippingError('');

    try {
      const response = await fetch(
        'https://vocqqajpznqyopjcymer.supabase.co/functions/v1/delivery-calculator',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            postal_code: formData.postal_code,
            city: formData.city,
            delivery_type: formData.delivery_type,
            cart_total: cartTotal
          })
        }
      );

      const result = await response.json();

      if (response.ok && result.delivery_cost !== undefined) {
        setShippingFee(result.delivery_cost);
        if (result.free_delivery) {
          setShippingError('🎉 Free delivery applied!');
        }
      } else {
        throw new Error(result.error || 'Failed to calculate delivery cost');
      }
    } catch (error) {
      console.error('Delivery calculation error:', error);
      setShippingError('Could not calculate delivery cost. Using standard rate.');
      setShippingFee(2000); // Fallback to standard rate
    } finally {
      setCalculatingShipping(false);
    }
  };

  const checkInventoryAvailability = async () => {
    if (cart.length === 0) return;

    setInventoryError('');
    setInventoryChecked(false);

    try {
      // Check each product's inventory
      const inventoryChecks = await Promise.all(
        cart.map(async (item) => {
          const { data: inventory, error } = await supabase
            .from('inventory')
            .select('stock_quantity, reserved_quantity')
            .eq('product_id', item.product_id)
            .maybeSingle();

          if (error) throw error;

          if (!inventory) {
            return { product: item.product_name, available: false, reason: 'No inventory record' };
          }

          const available = inventory.stock_quantity - inventory.reserved_quantity;
          if (available < item.quantity) {
            return {
              product: item.product_name,
              available: false,
              reason: `Only ${available} available (you ordered ${item.quantity})`
            };
          }

          return { product: item.product_name, available: true };
        })
      );

      const unavailableItems = inventoryChecks.filter(check => !check.available);
      
      if (unavailableItems.length > 0) {
        setInventoryError(
          `Some items are not available: ${unavailableItems.map(i => `${i.product} - ${i.reason}`).join(', ')}`
        );
        setInventoryChecked(false);
      } else {
        setInventoryChecked(true);
      }
    } catch (error) {
      console.error('Inventory check error:', error);
      setInventoryError('Could not verify inventory. Please contact support.');
      setInventoryChecked(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep1 = () => {
    return formData.customer_name && formData.customer_email && formData.customer_phone;
  };

  const validateStep2 = () => {
    const hasAddress = formData.address_line1 && formData.city && formData.postal_code;
    return hasAddress && inventoryChecked && !inventoryError;
  };

  const handleCODOrder = async () => {
    try {
      // Final inventory check before order placement
      if (!inventoryChecked) {
        alert('Please verify inventory availability before placing order.');
        return;
      }

      const orderNumber = `WDX${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // Create a guest user ID if not logged in
      let orderUserId = user?.id;
      if (!orderUserId) {
        // Create a guest customer entry
        const { data: guestUser } = await supabase
          .from('customers')
          .insert([{
            full_name: formData.customer_name,
            email: formData.customer_email,
            phone: formData.customer_phone,
            customer_type: 'retail',
            status: 'active',
          }])
          .select()
          .single();
        orderUserId = guestUser?.id;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          user_id: orderUserId,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          shipping_address: {
            street: formData.address_line1 + (formData.address_line2 ? ', ' + formData.address_line2 : ''),
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
          },
          status: 'pending',
          payment_status: 'pending',
          payment_method: formData.payment_method,
          subtotal: cartTotal,
          tax: tax,
          shipping_fee: shippingFee,
          total: total,
          currency: 'PKR',
          notes: formData.notes,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.product_price,
        image_url: item.product_image,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Reserve inventory using inventory-tracker edge function
      try {
        await fetch(
          'https://vocqqajpznqyopjcymer.supabase.co/functions/v1/inventory-tracker',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
              order_id: order.id,
              action: 'reserve'
            })
          }
        );
      } catch (invError) {
        console.error('Inventory reservation error:', invError);
        // Continue with order even if reservation fails - can be handled manually
      }

      // Create delivery record
      try {
        await supabase
          .from('deliveries')
          .insert([{
            order_id: order.id,
            delivery_type: formData.delivery_type,
            status: 'pending',
            delivery_cost: shippingFee,
            delivery_address: {
              street: formData.address_line1 + (formData.address_line2 ? ', ' + formData.address_line2 : ''),
              city: formData.city,
              state: formData.state,
              postal_code: formData.postal_code,
              country: formData.country,
            },
            recipient_name: formData.customer_name,
            recipient_phone: formData.customer_phone
          }]);
      } catch (delError) {
        console.error('Delivery record creation error:', delError);
        // Continue with order
      }

      // Clear cart
      await clearCart();

      // Send confirmation email
      try {
        const functions = import.meta.env.VITE_SUPABASE_URL + '/functions/v1';
        await fetch(`${functions}/send-order-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            orderNumber: order.order_number,
            customerEmail: formData.customer_email,
            customerName: formData.customer_name,
            orderItems: orderItems,
            totalAmount: total,
          }),
        });
      } catch (emailError) {
        console.log('Email notification error:', emailError);
      }

      // Redirect to confirmation
      navigate(`/order-confirmation?order_id=${order.id}&order_number=${order.order_number}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  const handleStripePayment = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        alert('Stripe is not configured. Please use another payment method.');
        return;
      }

      // Create payment intent
      const functions = import.meta.env.VITE_SUPABASE_URL + '/functions/v1';
      const response = await fetch(`${functions}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` : '',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'pkr',
          cartItems: cart.map(item => ({
            product_id: item.product_id,
            name: item.product_name,
            price: item.product_price,
            quantity: item.quantity,
            image: item.product_image,
          })),
          customerEmail: formData.customer_email,
          customerName: formData.customer_name,
          customerPhone: formData.customer_phone,
          shippingAddress: {
            street: formData.address_line1 + (formData.address_line2 ? ', ' + formData.address_line2 : ''),
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
          },
        }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Redirect to Stripe Checkout or use Elements
      const { error } = await stripe.confirmCardPayment(result.data.clientSecret);

      if (error) {
        throw error;
      }

      // Clear cart
      await clearCart();

      // Send confirmation
      try {
        await fetch(`${functions}/send-order-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: result.data.orderId,
            orderNumber: result.data.orderNumber,
            customerEmail: formData.customer_email,
            customerName: formData.customer_name,
            orderItems: cart,
            totalAmount: total,
          }),
        });
      } catch (emailError) {
        console.log('Email error:', emailError);
      }

      // Redirect to confirmation
      navigate(`/order-confirmation?order_id=${result.data.orderId}&order_number=${result.data.orderNumber}`);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again or use another payment method.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      if (formData.payment_method === 'stripe') {
        await handleStripePayment();
      } else {
        await handleCODOrder();
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#C2F21E] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B0E01C] transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">1. Customer Information</h2>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2F21E] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="customer_email"
                          value={formData.customer_email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2F21E] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          name="customer_phone"
                          value={formData.customer_phone}
                          onChange={handleInputChange}
                          required
                          placeholder="+92 XXX XXXXXXX"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2F21E] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => validateStep1() && setStep(2)}
                      disabled={!validateStep1()}
                      className="w-full bg-[#C2F21E] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B0E01C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Shipping Address */}
              {step >= 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">2. Shipping Address</h2>
                    {step > 2 && (
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input
                          type="text"
                          name="address_line1"
                          value={formData.address_line1}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2F21E] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input
                          type="text"
                          name="address_line2"
                          value={formData.address_line2}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2F21E] focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2F21E] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2F21E] focus:border-transparent"
                          >
                            <option value="Sindh">Sindh</option>
                            <option value="Punjab">Punjab</option>
                            <option value="KPK">KPK</option>
                            <option value="Balochistan">Balochistan</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                          <input
                            type="text"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2F21E] focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Delivery Type Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Truck className="inline h-4 w-4 mr-1" />
                          Delivery Type *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <label className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            formData.delivery_type === 'standard'
                              ? 'border-[#C2F21E] bg-[#C2F21E]/10'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            <input
                              type="radio"
                              name="delivery_type"
                              value="standard"
                              checked={formData.delivery_type === 'standard'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <span className="font-medium">Standard</span>
                            <span className="text-xs text-gray-600">2-7 days</span>
                          </label>
                          <label className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            formData.delivery_type === 'express'
                              ? 'border-[#C2F21E] bg-[#C2F21E]/10'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            <input
                              type="radio"
                              name="delivery_type"
                              value="express"
                              checked={formData.delivery_type === 'express'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <span className="font-medium">Express</span>
                            <span className="text-xs text-gray-600">1-5 days</span>
                          </label>
                          <label className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            formData.delivery_type === 'same_day'
                              ? 'border-[#C2F21E] bg-[#C2F21E]/10'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            <input
                              type="radio"
                              name="delivery_type"
                              value="same_day"
                              checked={formData.delivery_type === 'same_day'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <span className="font-medium">Same Day</span>
                            <span className="text-xs text-gray-600">Today</span>
                          </label>
                        </div>
                      </div>

                      {/* Shipping Cost Display */}
                      {calculatingShipping && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Calculating delivery cost...
                        </div>
                      )}
                      {shippingError && (
                        <div className="flex items-center gap-2 text-sm bg-yellow-50 p-3 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <span className="text-yellow-800">{shippingError}</span>
                        </div>
                      )}
                      {shippingFee > 0 && !calculatingShipping && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Delivery Cost:</strong> PKR {shippingFee.toLocaleString()}
                          </p>
                        </div>
                      )}
                      
                      {/* Inventory Check Status */}
                      {inventoryError && (
                        <div className="flex items-center gap-2 text-sm bg-red-50 p-3 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-800">{inventoryError}</span>
                        </div>
                      )}
                      {inventoryChecked && !inventoryError && (
                        <div className="flex items-center gap-2 text-sm bg-green-50 p-3 rounded-lg">
                          <span className="text-green-800">✓ All items are in stock</span>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => validateStep2() && setStep(3)}
                          disabled={!validateStep2()}
                          className="flex-1 bg-[#C2F21E] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B0E01C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment Method */}
              {step >= 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">3. Payment Method</h2>
                  
                  <div className="space-y-3 mb-6">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-[#C2F21E] transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cash_on_delivery"
                        checked={formData.payment_method === 'cash_on_delivery'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <Banknote className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="font-medium">Cash on Delivery</span>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-[#C2F21E] transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="stripe"
                        checked={formData.payment_method === 'stripe'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="font-medium">Credit/Debit Card (Stripe)</span>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-[#C2F21E] transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={formData.payment_method === 'bank_transfer'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <Building2 className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="font-medium">Bank Transfer</span>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-[#C2F21E] transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="easypaisa"
                        checked={formData.payment_method === 'easypaisa'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <Smartphone className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="font-medium">EasyPaisa / JazzCash</span>
                    </label>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2F21E] focus:border-transparent"
                      placeholder="Special instructions for your order..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#C2F21E] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B0E01C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">
                        PKR {(item.product_price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>PKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : `PKR ${shippingFee.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (2%)</span>
                  <span>PKR {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[#C2F21E]">PKR {total.toLocaleString()}</span>
                </div>
              </div>

              {shippingFee > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                  💡 Free shipping on orders over PKR 100,000
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
