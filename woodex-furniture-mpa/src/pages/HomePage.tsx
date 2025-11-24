import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, FileText, Users, Truck } from 'lucide-react';
import { useState } from 'react';
import SEO from '../components/SEO';
import StructuredData, {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebsiteSchema,
} from '../components/StructuredData';

const HomePage = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const products = [
    {
      id: 'chairs',
      name: 'Ergonomic Chairs',
      description: 'Premium comfort with advanced lumbar support',
      image: '/images/ergonomic_chair_7.jpg',
    },
    {
      id: 'desks',
      name: 'Executive Desks',
      description: 'Sophisticated design meets functionality',
      image: '/images/executive_desk_7.jpg',
    },
    {
      id: 'workstations',
      name: 'Office Workstations',
      description: 'Maximize productivity with modular solutions',
      image: '/images/office_workstations_8.jpg',
    },
    {
      id: 'reception',
      name: 'Reception Furniture',
      description: 'Make lasting first impressions',
      image: '/images/reception_furniture_6.jpg',
    },
    {
      id: 'tables',
      name: 'Meeting Tables',
      description: 'Collaborative spaces for team success',
      image: '/images/meeting_table_7.jpg',
    },
    {
      id: 'sofas',
      name: 'Office Sofas',
      description: 'Professional comfort for reception areas',
      image: '/images/office_sofa_6.jpg',
    },
    {
      id: 'storage',
      name: 'Office Storage',
      description: 'Organize with style and efficiency',
      image: '/images/office_storage_9.jpg',
    },
  ];

  const services = [
    {
      name: 'E-Quotation',
      description: 'Get instant quotes for your furniture needs online',
      path: '/e-quotation',
      icon: FileText,
    },
    {
      name: 'Planning Ideas',
      description: 'Expert workspace design consultation',
      path: '/services#planning',
      icon: Users,
    },
    {
      name: 'Delivery & Installation',
      description: 'Complete setup service at your location',
      path: '/services#delivery',
      icon: Truck,
    },
  ];

  const testimonials = [
    {
      name: 'Ahmed Hassan',
      company: 'Tech Solutions Ltd.',
      rating: 5,
      text: 'Exceptional quality and service. The custom workstations transformed our office space completely.',
    },
    {
      name: 'Sara Khan',
      company: 'Marketing Pro Agency',
      rating: 5,
      text: 'Professional team, timely delivery, and beautiful furniture. Highly recommend Woodex!',
    },
    {
      name: 'Imran Ali',
      company: 'Financial Consultants',
      rating: 5,
      text: 'The ergonomic chairs have significantly improved our team\'s comfort and productivity.',
    },
  ];

  return (
    <div className="bg-white">
      <SEO
        title="Premium Office Furniture Manufacturer in Pakistan"
        description="Woodex Furniture offers premium custom office furniture in Pakistan. Ergonomic chairs, executive desks, workstations, and complete workspace solutions. Design-to-delivery service in Karachi and nationwide."
        keywords="office furniture Pakistan, custom furniture Karachi, ergonomic chairs Pakistan, executive desks Karachi, office workstations, meeting tables, reception furniture, storage solutions, workspace design"
        ogType="website"
      />
      <StructuredData data={getOrganizationSchema()} />
      <StructuredData data={getLocalBusinessSchema()} />
      <StructuredData data={getWebsiteSchema()} />

      {/* Hero Section */}
      <section className="bg-white">
        {/* Main Hero Content */}
        <div className="relative overflow-hidden">
          {/* Background Image Section */}
          <div 
            className="bg-cover bg-center min-h-[600px] md:min-h-[700px] relative"
            style={{
              backgroundImage: 'url(/images/hero_background_7.jpg)',
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Content */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Work Your Way
                </h1>
                <h2 className="text-2xl md:text-3xl font-medium text-white mb-8">
                  Modern office furniture designed for productivity and comfort
                </h2>
                <p className="text-lg text-white/90 mb-8 max-w-2xl leading-relaxed">
                  Discover our comprehensive range of premium office furniture including ergonomic chairs, 
                  executive desks, workstations, and complete workspace solutions.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-300 shadow-lg"
                  >
                    <span>Explore Collection</span>
                  </Link>
                  <Link
                    to="/e-quotation"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-all duration-300"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose Woodex?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We deliver comprehensive office furniture solutions with premium quality and professional service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4">{service.name}</h3>
                    <p className="text-neutral-600">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Product Categories
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover our comprehensive range of premium office furniture designed to enhance productivity and comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products?category=${product.id}`}
                className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{product.name}</h3>
                  <p className="text-neutral-600 mb-4 text-sm">{product.description}</p>
                  <div className="flex items-center text-primary font-medium text-sm">
                    <span>View Products</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Trusted by businesses across Pakistan for premium office furniture solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-600 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-semibold text-neutral-900">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-500">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Office?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Get a free consultation and quote for your office furniture needs. 
            Our expert team will help you create the perfect workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/e-quotation"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;