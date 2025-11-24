import { Palette, Ruler, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomizationPage = () => {
  const customOptions = [
    {
      icon: Ruler,
      title: 'Custom Dimensions',
      description: 'Perfect fit for your unique space requirements',
      options: ['Custom heights', 'Specific widths', 'Depth adjustments', 'Modular sizing'],
    },
    {
      icon: Palette,
      title: 'Materials & Finishes',
      description: 'Choose from premium materials and finishes',
      options: ['Solid wood', 'Engineered wood', 'Metal frames', 'Glass tops', 'Laminate finishes'],
    },
    {
      icon: Sparkles,
      title: 'Color & Texture',
      description: 'Match your brand identity and office aesthetics',
      options: ['Custom color matching', 'Texture selection', 'Dual-tone finishes', 'Brand colors'],
    },
    {
      icon: CheckCircle,
      title: 'Special Features',
      description: 'Add functionality tailored to your needs',
      options: ['Cable management', 'Built-in charging', 'Adjustable heights', 'Integrated storage'],
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Initial Consultation',
      description:
        'Share your vision, requirements, and space constraints with our design team. We discuss materials, budget, and timeline.',
    },
    {
      step: '02',
      title: 'Design Development',
      description:
        'Our designers create detailed 3D models and technical drawings based on your specifications. Review and refine until perfect.',
    },
    {
      step: '03',
      title: 'Material Selection',
      description:
        'Choose from our extensive range of premium materials, finishes, and colors. We provide samples for your approval.',
    },
    {
      step: '04',
      title: 'Prototype & Approval',
      description:
        'For complex projects, we create a prototype for your inspection. Make final adjustments before full production.',
    },
    {
      step: '05',
      title: 'Manufacturing',
      description:
        'Our skilled craftsmen bring your design to life with precision manufacturing and rigorous quality control.',
    },
    {
      step: '06',
      title: 'Delivery & Installation',
      description:
        'Professional delivery and installation ensure your custom furniture is set up perfectly and ready to use.',
    },
  ];

  const portfolioItems = [
    {
      name: 'Custom Executive Suite',
      description: 'Bespoke executive furniture with integrated technology',
      image: '/images/executive_desk_7.jpg',
    },
    {
      name: 'Brand-Matched Workstations',
      description: 'Custom color workstations matching corporate brand',
      image: '/images/office_workstations_8.jpg',
    },
    {
      name: 'Designer Reception Desk',
      description: 'Unique reception counter with LED lighting',
      image: '/images/reception_furniture_6.jpg',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-primary-500 text-neutral-900 font-heading font-bold text-sm rounded-full">
              NEW SERVICE
            </span>
          </div>
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-5xl lg:text-6xl text-neutral-900 mb-6">
              Custom Furniture Design
            </h1>
            <p className="font-body text-xl text-neutral-700 leading-relaxed mb-8">
              Transform your vision into reality with our bespoke furniture design service. Every
              piece crafted to your exact specifications, brand identity, and space requirements.
            </p>
            <Link
              to="/e-quotation"
              className="inline-flex items-center px-8 py-4 bg-primary-500 text-neutral-900 font-heading font-bold text-lg rounded-md hover:bg-primary-600 hover:scale-105 transition-all duration-normal"
            >
              Start Your Custom Project
            </Link>
          </div>
        </div>
      </section>

      {/* Customization Options */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-4">
              Customization Options
            </h2>
            <p className="font-body text-lg text-neutral-700 max-w-2xl mx-auto">
              Endless possibilities to create furniture that perfectly fits your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {customOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div
                  key={index}
                  className="bg-background-section p-8 rounded-lg hover:shadow-card transition-all duration-normal"
                >
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="h-8 w-8 text-neutral-900" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-2xl text-neutral-900 mb-3">
                        {option.title}
                      </h3>
                      <p className="font-body text-base text-neutral-700 mb-4">
                        {option.description}
                      </p>
                      <ul className="space-y-2">
                        {option.options.map((item, idx) => (
                          <li
                            key={idx}
                            className="font-body text-sm text-neutral-600 flex items-center"
                          >
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-4">
              Our Custom Design Process
            </h2>
            <p className="font-body text-lg text-neutral-700 max-w-2xl mx-auto">
              From concept to completion in six transparent steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-card">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-6">
                  <span className="font-heading font-bold text-2xl text-neutral-900">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-neutral-900 mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-base text-neutral-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Examples */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-4">
              Custom Projects Showcase
            </h2>
            <p className="font-body text-lg text-neutral-700 max-w-2xl mx-auto">
              Examples of bespoke furniture we've created for our clients
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-normal overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-slow"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="font-body text-base text-neutral-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Timeline */}
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-lg shadow-card">
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-6">
                Custom Pricing
              </h2>
              <p className="font-body text-lg text-neutral-700 mb-6">
                Custom furniture pricing varies based on complexity, materials, and size. Our
                typical custom projects range from:
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-body text-base text-neutral-700">
                    Single piece (desk/chair)
                  </span>
                  <span className="font-heading font-bold text-xl text-primary-500">
                    PKR 50,000+
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-base text-neutral-700">
                    Complete office suite
                  </span>
                  <span className="font-heading font-bold text-xl text-primary-500">
                    PKR 500,000+
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-base text-neutral-700">
                    Large-scale projects
                  </span>
                  <span className="font-heading font-bold text-xl text-primary-500">
                    Custom Quote
                  </span>
                </div>
              </div>
              <p className="font-body text-sm text-neutral-600 italic">
                Final pricing provided after consultation and design approval
              </p>
            </div>
            <div className="bg-white p-12 rounded-lg shadow-card">
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-6">
                Project Timeline
              </h2>
              <p className="font-body text-lg text-neutral-700 mb-6">
                Typical custom furniture project timelines:
              </p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading font-semibold text-base text-neutral-900">
                      Design Phase
                    </span>
                    <span className="font-body text-sm text-neutral-600">1-2 weeks</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading font-semibold text-base text-neutral-900">
                      Approval & Material Sourcing
                    </span>
                    <span className="font-body text-sm text-neutral-600">1 week</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading font-semibold text-base text-neutral-900">
                      Manufacturing
                    </span>
                    <span className="font-body text-sm text-neutral-600">3-6 weeks</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading font-semibold text-base text-neutral-900">
                      Delivery & Installation
                    </span>
                    <span className="font-body text-sm text-neutral-600">1-2 days</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
              <p className="font-body text-sm text-neutral-600 italic mt-6">
                Total project duration: 6-10 weeks on average
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
          <h2 className="font-heading font-bold text-4xl mb-6">
            Ready to Create Your Custom Furniture?
          </h2>
          <p className="font-body text-xl mb-8 text-neutral-100 max-w-2xl mx-auto">
            Schedule a consultation with our design team to discuss your vision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/e-quotation"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-neutral-900 font-heading font-bold text-lg rounded-md hover:bg-primary-600 hover:scale-105 transition-all duration-normal"
            >
              Request Custom Quote
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-heading font-bold text-lg rounded-md border-2 border-white hover:bg-white hover:text-neutral-900 transition-all duration-normal"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomizationPage;
