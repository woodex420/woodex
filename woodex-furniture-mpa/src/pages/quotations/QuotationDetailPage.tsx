import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function QuotationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quotation, setQuotation] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadQuotation();
  }, [id]);

  const loadQuotation = async () => {
    try {
      const { data: quotationData, error: quotationError } = await supabase
        .from('quotations')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (quotationError) throw quotationError;
      if (!quotationData) {
        alert('Quotation not found');
        navigate('/');
        return;
      }

      setQuotation(quotationData);

      const { data: itemsData, error: itemsError } = await supabase
        .from('quotation_items')
        .select('*')
        .eq('quotation_id', id);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);

      // Log view activity
      if (quotationData.status === 'sent') {
        await supabase.functions.invoke('quotation-status-updater', {
          body: {
            quotationId: id,
            newStatus: 'viewed'
          }
        });
      }
    } catch (error) {
      console.error('Error loading quotation:', error);
      alert('Failed to load quotation');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('quotation-pdf-generator', {
        body: { quotationId: id }
      });

      if (error) throw error;
      
      // Open PDF in new tab (in production, would be actual PDF file)
      const pdfWindow = window.open('', '_blank');
      if (pdfWindow && data.data.htmlContent) {
        pdfWindow.document.write(data.data.htmlContent);
        pdfWindow.document.close();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotation...</p>
        </div>
      </div>
    );
  }

  if (!quotation) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Quotation {quotation.quote_number}
              </h1>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  quotation.status === 'approved' ? 'bg-green-100 text-green-800' :
                  quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  quotation.status === 'viewed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                </span>
                <span className="text-sm text-gray-600">
                  Created: {new Date(quotation.created_at).toLocaleDateString()}
                </span>
                {quotation.valid_until && (
                  <span className="text-sm text-gray-600">
                    Valid Until: {new Date(quotation.valid_until).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={generatePDF}
              disabled={generating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {generating ? 'Generating...' : 'Download PDF'}
            </button>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{quotation.customer_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{quotation.customer_email || 'N/A'}</span>
              </div>
              {quotation.customer_phone && (
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium">{quotation.customer_phone}</span>
                </div>
              )}
              {quotation.customer_company && (
                <div>
                  <span className="text-gray-600">Company:</span>
                  <span className="ml-2 font-medium">{quotation.customer_company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Unit Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.item_name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-600">{item.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        PKR {parseFloat(item.unit_price).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        PKR {parseFloat(item.line_total).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-2 max-w-md ml-auto">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">PKR {parseFloat(quotation.subtotal).toLocaleString()}</span>
              </div>
              {parseFloat(quotation.discount_amount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-PKR {parseFloat(quotation.discount_amount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (17% GST):</span>
                <span className="font-medium">PKR {parseFloat(quotation.tax_amount).toLocaleString()}</span>
              </div>
              {parseFloat(quotation.shipping_cost) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">PKR {parseFloat(quotation.shipping_cost).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-300 flex justify-between text-lg font-bold text-blue-600">
                <span>Total Amount:</span>
                <span>PKR {parseFloat(quotation.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quotation.notes && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Notes:</h3>
              <p className="text-gray-700 text-sm">{quotation.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/products')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
