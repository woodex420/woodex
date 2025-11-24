import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { name: 'Ergonomic Chairs', path: '/products#chairs' },
    { name: 'Executive Desks', path: '/products#desks' },
    { name: 'Workstations', path: '/products#workstations' },
    { name: 'Meeting Tables', path: '/products#tables' },
    { name: 'Office Storage', path: '/products#storage' },
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Careers', path: '/contact#careers' },
    { name: 'Contact', path: '/contact' },
  ];

  const servicesLinks = [
    { name: 'Custom Design', path: '/customization' },
    { name: 'E-Quotation', path: '/e-quotation' },
    { name: 'Delivery & Installation', path: '/services#delivery' },
    { name: 'Workspace Planning', path: '/services#planning' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Sitemap', path: '/sitemap' },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      {/* Newsletter Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">Stay Updated</h2>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest office furniture trends, 
              design inspiration, and exclusive offers from Woodex.
            </p>
            <div className="max-w-md mx-auto">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-medium rounded-r-md hover:bg-primary-600 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
          {/* About Us */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold text-primary tracking-wide">
                WOODEX
              </h2>
            </Link>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Pakistan's premium office furniture manufacturer delivering exceptional 
              design-to-delivery solutions for modern workspaces. Committed to innovation, 
              quality, and customer satisfaction.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-600 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-600 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-600 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-600 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-neutral-600 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-neutral-600 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn More */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Learn More</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/awards"
                  className="text-sm text-neutral-600 hover:text-primary transition-colors"
                >
                  Awards
                </Link>
              </li>
              <li>
                <Link
                  to="/ideas"
                  className="text-sm text-neutral-600 hover:text-primary transition-colors"
                >
                  Ideas
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-neutral-600 hover:text-primary transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/support"
                  className="text-sm text-neutral-600 hover:text-primary transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/warranty"
                  className="text-sm text-neutral-600 hover:text-primary transition-colors"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  to="/distributors"
                  className="text-sm text-neutral-600 hover:text-primary transition-colors"
                >
                  Distributors
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-sm text-neutral-600">
                © {currentYear} WOODEX - Pakistan's Premium Office Furniture Manufacturer
              </p>
              <div className="flex items-center space-x-4 text-xs text-neutral-500">
                <span>Showrooms</span>
                <span>|</span>
                <span>Material and Colors</span>
                <span>|</span>
                <span>Warranty</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-neutral-600 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
