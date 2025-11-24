import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const SitemapPage = () => {
  const siteStructure = [
    {
      category: 'Main Pages',
      links: [
        { name: 'Home', path: '/', description: 'Our homepage and introduction' },
        { name: 'About Us', path: '/about', description: 'Learn about our company and values' },
        { name: 'Products', path: '/products', description: 'Browse our furniture catalog' },
        { name: 'Services', path: '/services', description: 'Our comprehensive services' },
        { name: 'Portfolio', path: '/portfolio', description: 'View our completed projects' },
        { name: 'Contact', path: '/contact', description: 'Get in touch with us' },
      ],
    },
    {
      category: 'New Services',
      links: [
        { name: 'Customization', path: '/customization', description: 'Custom furniture design' },
        { name: 'E-Quotation', path: '/e-quotation', description: 'Get instant online quotes' },
      ],
    },
    {
      category: 'Legal & Information',
      links: [
        { name: 'Privacy Policy', path: '/privacy', description: 'How we protect your data' },
        { name: 'Terms of Service', path: '/terms', description: 'Terms and conditions' },
        { name: 'Cookie Policy', path: '/cookies', description: 'Our use of cookies' },
      ],
    },
  ];

  return (
    <div className="bg-white">
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <h1 className="font-heading font-bold text-5xl text-neutral-900 mb-4">
            Sitemap
          </h1>
          <p className="font-body text-xl text-neutral-700">
            Navigate through all pages on our website
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {siteStructure.map((section, index) => (
              <div key={index}>
                <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-6 pb-3 border-b-2 border-primary-500">
                  {section.category}
                </h2>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.path}
                        className="group block p-4 rounded-lg hover:bg-background-section transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <h3 className="font-heading font-semibold text-lg text-neutral-900 group-hover:text-primary-500 transition-colors mb-1">
                              {link.name}
                            </h3>
                            <p className="font-body text-sm text-neutral-600">
                              {link.description}
                            </p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-neutral-400 group-hover:text-primary-500 transition-colors ml-2 flex-shrink-0" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
          <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-6">
            Need Help Finding Something?
          </h2>
          <p className="font-body text-lg text-neutral-700 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Contact our team for assistance.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-primary-500 text-neutral-900 font-heading font-bold text-lg rounded-md hover:bg-primary-600 hover:scale-105 transition-all duration-normal"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SitemapPage;
