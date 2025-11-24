import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase, type Customer } from '../../lib/supabase';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: Customer | null;
}

const CustomerFormModal = ({ isOpen, onClose, onSuccess, customer }: CustomerFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: customer?.full_name || '',
    company_name: customer?.company_name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    whatsapp_number: customer?.whatsapp_number || '',
    customer_type: customer?.customer_type || 'individual',
    status: customer?.status || 'lead',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (customer) {
        const { error } = await supabase.from('customers').update(formData).eq('id', customer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('customers').insert([formData]);
        if (error) throw error;
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-ink/50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-separator p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-primary">{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="block text-sm font-medium text-text-primary mb-2">Customer Type</label>
              <select value={formData.customer_type} onChange={(e) => setFormData({ ...formData, customer_type: e.target.value as any })} className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary">
                <option value="individual">Individual</option><option value="business">Business</option>
              </select>
            </div>
            <div className="col-span-2"><label className="block text-sm font-medium text-text-primary mb-2">Full Name*</label>
              <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary" placeholder="John Doe" />
            </div>
            {formData.customer_type === 'business' && (
              <div className="col-span-2"><label className="block text-sm font-medium text-text-primary mb-2">Company Name</label>
                <input type="text" value={formData.company_name || ''} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary" placeholder="Acme Corporation" />
              </div>
            )}
            <div><label className="block text-sm font-medium text-text-primary mb-2">Phone*</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary" placeholder="+92 300 1234567" />
            </div>
            <div><label className="block text-sm font-medium text-text-primary mb-2">WhatsApp</label>
              <input type="tel" value={formData.whatsapp_number || ''} onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })} className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary" placeholder="+92 300 1234567" />
            </div>
            <div className="col-span-2"><label className="block text-sm font-medium text-text-primary mb-2">Email</label>
              <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary" placeholder="john@example.com" />
            </div>
            <div className="col-span-2"><label className="block text-sm font-medium text-text-primary mb-2">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary">
                <option value="lead">Lead</option><option value="prospect">Prospect</option><option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-separator rounded-md hover:bg-muted transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-text-primary text-white rounded-md hover:bg-text-primary-alt transition-colors disabled:opacity-50">{loading ? 'Saving...' : (customer ? 'Update Customer' : 'Create Customer')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
