import { useEffect, useState } from 'react';
import { Lightbulb, Package, Truck, Wrench, Ruler, HeadphonesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

// Icon mapping
const iconMap: Record<string, any> = {
  Lightbulb,
  Package,
  Truck,
  Wrench,
  Ruler,
  HeadphonesIcon,
};

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  features: string[] | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Professional Office Furniture Services in Pakistan - Woodex"
        description="Comprehensive office furniture services including space planning, custom design, delivery, installation, and maintenance. Expert solutions for businesses across Pakistan."
        keywords="office furniture services, workspace planning, custom furniture design, furniture installation, furniture delivery Pakistan"
        ogImage="/images/services-og.jpg"
      />

      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
            { '@type': 'ListItem', position: 2, name: 'Services', item: '/services' },
          ],
        }}
      />

      <div className="min-h-screen bg-white py-12 sm:py-16 lg:py-20">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Our Services
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions to transform your workspace
            </p>
          </div>

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {services.map((service) => {
                const IconComponent = service.icon && iconMap[service.icon] ? iconMap[service.icon] : Package;
                
                return (
                  <div
                    key={service.id}
                    className="group bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:border-primary"
                  >
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4 group-hover:bg-primary transition-colors duration-300">
                        <IconComponent className="w-8 h-8 text-primary group-hover:text-black transition-colors duration-300" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {service.features && service.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-lg mb-3">Key Features:</h4>
                        <ul className="space-y-2">
                          {service.features.slice(0, 5).map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {service.image_url && (
                      <div className="mt-4 rounded-lg overflow-hidden">
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services available at the moment.</p>
            </div>
          )}

          {/* Why Choose Us Section */}
          <div className="mt-16 lg:mt-24 bg-gray-50 rounded-3xl p-8 lg:p-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">
              Why Choose Woodex Services?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Workspace?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get in touch with our team to discuss your requirements and receive a custom solution tailored to your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="btn-primary text-lg px-8 py-4"
              >
                Get Started
              </Link>
              <Link
                to="/e-quotation"
                className="btn-secondary text-lg px-8 py-4"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesPage;
