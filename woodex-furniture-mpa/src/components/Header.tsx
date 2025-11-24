import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Clock, ShoppingCart, Search, User, FileText } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cart } = useCart();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const mainNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Room Packages', path: '/room-packages' },
    { name: 'Virtual Showroom', path: '/virtual-showroom' },
    { name: 'Series', path: '/series' },
    { name: 'Projects', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'B2B', path: '/b2b-account' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const utilityLinks = [
    { name: 'Showrooms', path: '/showrooms' },
    { name: 'Warranty', path: '/warranty' },
    { name: 'Designing', path: '/design' },
  ];

  const handleSearch = () => {
    // Implement search functionality
    console.log('Search triggered');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white'
      }`}
    >
      {/* Top Utility Bar */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8">
            {/* Utility Links */}
            <nav className="hidden lg:flex items-center space-x-4 text-xs text-neutral-500">
              <span>Showrooms</span>
              <span className="text-gray-300">|</span>
              <span>Material and Colors</span>
              <span className="text-gray-300">|</span>
              <span>Warranty</span>
            </nav>
            
            {/* Language/Currency Selector */}
            <div className="hidden lg:flex items-center space-x-4 text-xs text-neutral-500">
              <span>English</span>
              <span className="text-gray-300">|</span>
              <span>AED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Account Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-wide">
                WOODEX
              </h1>
            </Link>

            {/* Utility Icons */}
            <div className="flex items-center space-x-6">
              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="p-2 text-neutral-700 hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Sign In Link */}
              <Link
                to="/account"
                className="hidden sm:flex items-center text-sm text-neutral-700 hover:text-primary transition-colors"
                aria-label="Sign In"
              >
                Sign in
              </Link>
              
              {/* Shopping Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-neutral-700 hover:text-primary transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sale-red text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-neutral-700 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Side Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={handleSearch}
                className="p-1 text-neutral-700 hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
              
              <Link
                to="/e-quotation"
                className="flex items-center space-x-2 text-sm font-medium text-neutral-700 hover:text-primary transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>E-Quotation</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <span className="text-sm text-neutral-600 mr-2">Menu</span>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-neutral-700 hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden fixed top-[140px] left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-all duration-300 overflow-y-auto max-h-[calc(100vh-140px)] ${
          isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
      >
        <nav className="px-4 py-6 space-y-2">
          {mainNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block py-3 px-4 text-base font-medium transition-colors rounded-md ${
                location.pathname === link.path
                  ? 'bg-gray-50 text-primary border-l-4 border-primary'
                  : 'text-neutral-700 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Utility Actions */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={handleSearch}
              className="flex items-center space-x-3 py-3 px-4 text-base font-medium text-neutral-700 hover:bg-gray-50 hover:text-primary transition-colors w-full text-left rounded-md"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
            
            <Link
              to="/account"
              className="flex items-center space-x-3 py-3 px-4 text-base font-medium text-neutral-700 hover:bg-gray-50 hover:text-primary transition-colors rounded-md"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
            
            <Link
              to="/e-quotation"
              className="flex items-center space-x-3 py-3 px-4 text-base font-medium text-neutral-700 hover:bg-gray-50 hover:text-primary transition-colors rounded-md"
            >
              <FileText className="h-4 w-4" />
              <span>E-Quotation</span>
            </Link>
          </div>

          {/* Mobile Utility Links */}
          <div className="pt-4 border-t border-gray-200 space-y-1">
            <span className="block py-2 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Services</span>
            <Link to="/showrooms" className="block py-2 px-4 text-sm text-neutral-600 hover:bg-gray-50 hover:text-primary transition-colors rounded-md">
              Showrooms
            </Link>
            <Link to="/warranty" className="block py-2 px-4 text-sm text-neutral-600 hover:bg-gray-50 hover:text-primary transition-colors rounded-md">
              Warranty
            </Link>
            <Link to="/design" className="block py-2 px-4 text-sm text-neutral-600 hover:bg-gray-50 hover:text-primary transition-colors rounded-md">
              Design Services
            </Link>
          </div>

          {/* Mobile Contact Info */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <a href="tel:+923224000768" className="flex items-center space-x-3 text-neutral-700 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Phone className="h-4 w-4 text-neutral-500 flex-shrink-0" />
              <span className="text-sm font-medium">+92 322 4000 768</span>
            </a>
            <div className="flex items-center space-x-3 text-neutral-700 px-4 py-3">
              <Clock className="h-4 w-4 text-neutral-500 flex-shrink-0" />
              <span className="text-sm">Mon-Fri 10:30 AM - 7:30 PM</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;