import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Briefcase, MessageSquare, HelpCircle, FileText } from 'lucide-react';

interface Stats {
  products: number;
  services: number;
  testimonials: number;
  faqs: number;
  blog_posts: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    services: 0,
    testimonials: 0,
    faqs: 0,
    blog_posts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [products, services, testimonials, faqs, blogPosts] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('faqs').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        products: products.count || 0,
        services: services.count || 0,
        testimonials: testimonials.count || 0,
        faqs: faqs.count || 0,
        blog_posts: blogPosts.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { name: 'Services', value: stats.services, icon: Briefcase, color: 'bg-green-500' },
    { name: 'Testimonials', value: stats.testimonials, icon: MessageSquare, color: 'bg-purple-500' },
    { name: 'FAQs', value: stats.faqs, icon: HelpCircle, color: 'bg-orange-500' },
    { name: 'Blog Posts', value: stats.blog_posts, icon: FileText, color: 'bg-pink-500' },
  ];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${card.color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.name}
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {card.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to Woodex CMS</h2>
        <p className="text-gray-600">
          Use the navigation menu to manage your website content. You can add, edit, and delete
          products, services, testimonials, FAQs, and blog posts.
        </p>
      </div>
    </div>
  );
}
