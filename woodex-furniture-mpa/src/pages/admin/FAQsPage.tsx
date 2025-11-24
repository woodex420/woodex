import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type FAQ = Database['public']['Tables']['faqs']['Row'];

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadFAQs();
    } catch (error) {
      console.error('Error toggling FAQ status:', error);
    }
  };

  const deleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      loadFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading FAQs...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">FAQs</h1>
        <Link
          to="/admin/faqs/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-primary/90"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add FAQ
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="divide-y divide-gray-200">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                  {faq.category && (
                    <span className="mt-2 inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {faq.category}
                    </span>
                  )}
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      faq.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleActive(faq.id, faq.is_active)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                  >
                    {faq.is_active ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <Link
                    to={`/admin/faqs/edit/${faq.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => deleteFAQ(faq.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {faqs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No FAQs found
          </div>
        )}
      </div>
    </div>
  );
}
