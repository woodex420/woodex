import { useEffect, useState } from 'react';
import { supabase, type Profile, type Customer } from '../lib/supabase';
import { Plus, Users, Edit, Trash2, Phone, Mail, MessageCircle } from 'lucide-react';
import CustomerFormModal from '../components/customers/CustomerFormModal';

interface CustomersPageProps {
  profile: Profile | null;
}

const CustomersPage = ({ profile }: CustomersPageProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Delete customer "${customer.full_name}"?`)) return;
    try {
      const { error } = await supabase.from('customers').delete().eq('id', customer.id);
      if (error) throw error;
      fetchCustomers();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const canEdit = profile?.role === 'admin' || profile?.role === 'editor';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-4xl font-bold text-text-primary mb-2">Customers</h1><p className="text-text-secondary">{customers.length} customers in database</p></div>
        {canEdit && <button onClick={() => { setSelectedCustomer(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-text-primary text-white px-6 py-3 rounded-md hover:bg-text-primary-alt transition-colors"><Plus className="h-5 w-5" />Add Customer</button>}
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-text-primary border-r-transparent"></div></div>
      ) : (
        <div className="bg-white rounded-lg border border-separator overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted"><tr><th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Customer</th><th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Contact</th><th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Type</th><th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Score</th>{canEdit && <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>}</tr></thead>
            <tbody className="divide-y divide-separator">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4"><div className="font-semibold text-text-primary">{customer.full_name}</div>{customer.company_name && <div className="text-sm text-text-secondary">{customer.company_name}</div>}</td>
                  <td className="px-6 py-4"><div className="flex flex-col gap-1"><span className="flex items-center gap-2 text-sm"><Phone className="h-3 w-3" />{customer.phone}</span>{customer.email && <span className="flex items-center gap-2 text-sm"><Mail className="h-3 w-3" />{customer.email}</span>}{customer.whatsapp_number && <span className="flex items-center gap-2 text-sm text-green-600"><MessageCircle className="h-3 w-3" />WhatsApp</span>}</div></td>
                  <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">{customer.customer_type}</span></td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full capitalize ${customer.status === 'active' ? 'bg-green-100 text-green-800' : customer.status === 'lead' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{customer.status}</span></td>
                  <td className="px-6 py-4"><span className="font-semibold text-text-primary">{customer.lead_score}</span></td>
                  {canEdit && <td className="px-6 py-4 text-right"><button onClick={() => { setSelectedCustomer(customer); setIsModalOpen(true); }} className="text-text-primary hover:text-text-primary-alt mr-3"><Edit className="h-4 w-4 inline" /></button><button onClick={() => handleDelete(customer)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4 inline" /></button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && customers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-separator"><Users className="h-12 w-12 text-text-secondary mx-auto mb-4" /><p className="text-text-secondary mb-4">No customers yet</p>{canEdit && <button onClick={() => setIsModalOpen(true)} className="bg-text-primary text-white px-6 py-2 rounded-md hover:bg-text-primary-alt">Add First Customer</button>}</div>
      )}

      <CustomerFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchCustomers} customer={selectedCustomer} />
    </div>
  );
};

export default CustomersPage;
