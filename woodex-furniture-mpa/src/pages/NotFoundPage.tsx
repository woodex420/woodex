import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="bg-white min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-8 text-center">
        <div className="mb-8">
          <h1 className="font-heading font-extrabold text-9xl text-primary-500 mb-4">404</h1>
          <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-4">
            Page Not Found
          </h2>
          <p className="font-body text-xl text-neutral-700 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-neutral-900 font-heading font-bold text-lg rounded-md hover:bg-primary-600 hover:scale-105 transition-all duration-normal"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-neutral-900 font-heading font-bold text-lg rounded-md border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-normal"
          >
            <Search className="mr-2 h-5 w-5" />
            Browse Products
          </Link>
        </div>

        <div className="mt-12 pt-12 border-t border-neutral-200">
          <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-4">
            Popular Pages
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/about"
              className="text-primary-500 font-body font-semibold hover:underline"
            >
              About Us
            </Link>
            <Link
              to="/services"
              className="text-primary-500 font-body font-semibold hover:underline"
            >
              Services
            </Link>
            <Link
              to="/customization"
              className="text-primary-500 font-body font-semibold hover:underline"
            >
              Customization
            </Link>
            <Link
              to="/e-quotation"
              className="text-primary-500 font-body font-semibold hover:underline"
            >
              Get Quote
            </Link>
            <Link
              to="/contact"
              className="text-primary-500 font-body font-semibold hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
