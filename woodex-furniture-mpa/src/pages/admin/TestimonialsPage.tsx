import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      loadTestimonials();
    } catch (error) {
      console.error('Error updating testimonial status:', error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const filteredTestimonials = testimonials.filter((t) =>
    filter === 'all' ? true : t.status === filter
  );

  if (loading) {
    return <div className="text-center py-12">Loading testimonials...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all'
              ? 'bg-primary text-black'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-md ${
            filter === 'pending'
              ? 'bg-primary text-black'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-md ${
            filter === 'approved'
              ? 'bg-primary text-black'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-md ${
            filter === 'rejected'
              ? 'bg-primary text-black'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Rejected
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="divide-y divide-gray-200">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {testimonial.author_name}
                    </h3>
                    {testimonial.rating && (
                      <div className="ml-2 flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {testimonial.author_role && (
                    <p className="text-sm text-gray-600">
                      {testimonial.author_role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  )}
                  <p className="mt-2 text-gray-700">{testimonial.content}</p>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        testimonial.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : testimonial.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {testimonial.status}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                  {testimonial.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(testimonial.id, 'approved')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="Approve"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  {testimonial.status !== 'rejected' && (
                    <button
                      onClick={() => updateStatus(testimonial.id, 'rejected')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Reject"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTestimonial(testimonial.id)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No testimonials found
          </div>
        )}
      </div>
    </div>
  );
}
