import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, ArrowRight, Check } from 'lucide-react';

interface RoomPackage {
  id: string;
  name: string;
  slug: string;
  package_type: string;
  description: string;
  base_price: number;
  discount_percentage: number;
  featured_image?: string;
  included_products: any;
  is_featured: boolean;
}

export default function RoomPackagesPage() {
  const [packages, setPackages] = useState<RoomPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('room_packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching room packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const packageTypes = [
    { value: 'all', label: 'All Packages' },
    { value: 'executive_office', label: 'Executive Office' },
    { value: 'reception_area', label: 'Reception Area' },
    { value: 'workspace', label: 'Workspace' },
    { value: 'workstation', label: 'Workstation' },
    { value: 'small_office', label: 'Small Office' },
    { value: 'medium_office', label: 'Medium Office' },
    { value: 'corporate_office', label: 'Corporate Office' },
  ];

  const filteredPackages = selectedType === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.package_type === selectedType);

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-blue to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Complete Office Solutions</h1>
            <p className="text-xl text-blue-100 mb-8">
              Pre-configured furniture packages designed for every workspace need. 
              Save up to 15% with our comprehensive room packages.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Check className="h-5 w-5" />
                <span>Curated Collections</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Check className="h-5 w-5" />
                <span>Bulk Discounts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Check className="h-5 w-5" />
                <span>Professional Design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b border-separator py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3">
            {packageTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedType === type.value
                    ? 'bg-brand-blue text-white'
                    : 'bg-muted-bg text-text-secondary hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-blue border-r-transparent"></div>
              <p className="mt-4 text-text-secondary">Loading packages...</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary text-lg">No packages found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => {
                const discountedPrice = pkg.base_price * (1 - pkg.discount_percentage / 100);
                return (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-lg border border-separator hover:shadow-xl transition-shadow overflow-hidden group"
                  >
                    {pkg.is_featured && (
                      <div className="bg-brand-orange text-white px-4 py-2 text-sm font-semibold">
                        Popular Choice
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-text-primary mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-text-secondary mb-4 line-clamp-2">
                        {pkg.description}
                      </p>
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          {pkg.discount_percentage > 0 && (
                            <span className="text-2xl text-text-secondary line-through">
                              PKR {pkg.base_price.toLocaleString()}
                            </span>
                          )}
                          <span className="text-4xl font-bold text-brand-blue">
                            PKR {discountedPrice.toLocaleString()}
                          </span>
                        </div>
                        {pkg.discount_percentage > 0 && (
                          <span className="inline-block mt-2 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                            Save {pkg.discount_percentage}%
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/room-packages/${pkg.slug}`}
                        className="flex items-center justify-center gap-2 w-full bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors group"
                      >
                        View Details
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted-bg py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Why Choose Our Room Packages?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Curated Selection</h3>
              <p className="text-text-secondary">
                Professionally designed furniture combinations that work perfectly together
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brand-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">%</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Best Value</h3>
              <p className="text-text-secondary">
                Save up to 15% compared to buying individual items
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Setup</h3>
              <p className="text-text-secondary">
                Complete office setup delivered and installed in days, not weeks
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
