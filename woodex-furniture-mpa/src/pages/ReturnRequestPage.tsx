import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { RotateCcw, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReturnRequestPage = () => {
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: '',
    reasonCategory: 'defective',
    reason: '',
    returnType: 'refund',
    customerNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [returnNumber, setReturnNumber] = useState('');

  const reasonCategories = [
    { value: 'defective', label: 'Defective Product' },
    { value: 'wrong_item', label: 'Wrong Item Received' },
    { value: 'not_as_described', label: 'Not as Described' },
    { value: 'changed_mind', label: 'Changed Mind' },
    { value: 'other', label: 'Other' }
  ];

  const returnTypes = [
    { value: 'refund', label: 'Refund' },
    { value: 'exchange', label: 'Exchange' },
    { value: 'store_credit', label: 'Store Credit' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Find order by order number
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, customer:customers(*)')
        .eq('order_number', formData.orderNumber.trim().toUpperCase())
        .maybeSingle();

      if (orderError) throw orderError;

      if (!orderData) {
        setError('Order not found. Please check your order number and try again.');
        return;
      }

      // Verify email matches
      if (orderData.customer?.email?.toLowerCase() !== formData.email.toLowerCase().trim()) {
        setError('Order number and email do not match.');
        return;
      }

      // Check if order can be returned (must be delivered)
      if (orderData.status !== 'delivered') {
        setError('Returns can only be requested for delivered orders.');
        return;
      }

      // Check if return already exists
      const { data: existingReturn } = await supabase
        .from('returns')
        .select('id')
        .eq('order_id', orderData.id)
        .maybeSingle();

      if (existingReturn) {
        setError('A return request already exists for this order.');
        return;
      }

      // Call return-processor edge function
      const response = await fetch(
        'https://vocqqajpznqyopjcymer.supabase.co/functions/v1/return-processor',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            order_id: orderData.id,
            reason: formData.reason,
            reason_category: formData.reasonCategory,
            return_type: formData.returnType,
            customer_notes: formData.customerNotes
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit return request');
      }

      const result = await response.json();
      
      setReturnNumber(result.return_number);
      setSuccess(true);
      
      // Reset form
      setFormData({
        orderNumber: '',
        email: '',
        reasonCategory: 'defective',
        reason: '',
        returnType: 'refund',
        customerNotes: ''
      });
    } catch (err) {
      console.error('Error submitting return request:', err);
      setError('An error occurred while submitting your return request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Header */}
        <header className="bg-black text-white py-4">
          <div className="container mx-auto px-4">
            <Link to="/" className="text-2xl font-bold">WOODEX</Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-black mb-2">Return Request Submitted</h2>
              <p className="text-[#595C59] mb-6">
                Your return request has been successfully submitted. Our team will review it and contact you within 1-2 business days.
              </p>
              
              <div className="bg-[#FAFAFA] rounded-lg p-6 mb-6">
                <p className="text-sm text-[#595C59] mb-1">Return Number</p>
                <p className="text-2xl font-bold text-black">{returnNumber}</p>
                <p className="text-xs text-[#595C59] mt-2">
                  Please save this number for tracking your return request
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/track-order"
                  className="block w-full bg-[#C2F21E] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#C2F21E]/90 transition"
                >
                  Track Your Order
                </Link>
                <Link
                  to="/"
                  className="block w-full bg-white border-2 border-black text-black px-6 py-3 rounded-lg font-medium hover:bg-[#FAFAFA] transition"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-2xl font-bold">WOODEX</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#C2F21E] rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-2">Request a Return</h1>
            <p className="text-[#595C59]">
              We're sorry you're not satisfied. Please fill out the form below to request a return.
            </p>
          </div>

          {/* Return Policy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Return Policy</p>
                <ul className="text-blue-800 space-y-1">
                  <li>• Returns accepted within 7 days of delivery</li>
                  <li>• Product must be in original condition with packaging</li>
                  <li>• Custom-made items cannot be returned</li>
                  <li>• Refunds processed within 5-7 business days</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Return Request Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Information */}
              <div>
                <h2 className="text-xl font-bold text-black mb-4">Order Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Order Number *
                    </label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="e.g., WDX-001"
                      required
                      className="w-full px-4 py-3 border border-[#595C59]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2F21E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 border border-[#595C59]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2F21E]"
                    />
                  </div>
                </div>
              </div>

              {/* Return Details */}
              <div>
                <h2 className="text-xl font-bold text-black mb-4">Return Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Reason for Return *
                    </label>
                    <select
                      value={formData.reasonCategory}
                      onChange={(e) => setFormData({ ...formData, reasonCategory: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-[#595C59]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2F21E]"
                    >
                      {reasonCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Please describe the issue *
                    </label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Provide details about why you're returning this item..."
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-[#595C59]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2F21E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Return Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {returnTypes.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, returnType: type.value })}
                          className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                            formData.returnType === type.value
                              ? 'border-[#C2F21E] bg-[#C2F21E] text-black'
                              : 'border-[#595C59]/30 bg-white text-black hover:border-[#595C59]/50'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.customerNotes}
                      onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
                      placeholder="Any additional information you'd like to share..."
                      rows={3}
                      className="w-full px-4 py-3 border border-[#595C59]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2F21E]"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload Note */}
              <div className="bg-[#FAFAFA] rounded-lg p-4">
                <div className="flex gap-3">
                  <Upload className="h-5 w-5 text-[#595C59] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-black mb-1">Photo Documentation</p>
                    <p className="text-[#595C59]">
                      For defective or damaged items, our support team may request photos via email to process your return faster.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Link
                  to="/"
                  className="flex-1 bg-white border-2 border-black text-black px-6 py-3 rounded-lg font-medium hover:bg-[#FAFAFA] transition text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#C2F21E] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#C2F21E]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Return Request'}
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-[#595C59] text-sm">
              Need help? Contact us at{' '}
              <a href="mailto:support@woodex.pk" className="text-black font-medium hover:underline">
                support@woodex.pk
              </a>
              {' '}or call{' '}
              <a href="tel:+923001234567" className="text-black font-medium hover:underline">
                +92 300 1234567
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestPage;
