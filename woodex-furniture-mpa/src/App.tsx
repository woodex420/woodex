import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import CustomizationPage from './pages/CustomizationPage';
import EQuotationPage from './pages/EQuotationPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiesPage from './pages/CookiesPage';
import SitemapPage from './pages/SitemapPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/ProductsPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import AdminServicesPage from './pages/admin/ServicesPage';
import ServiceFormPage from './pages/admin/ServiceFormPage';
import TestimonialsPage from './pages/admin/TestimonialsPage';
import FAQsPage from './pages/admin/FAQsPage';
import FAQFormPage from './pages/admin/FAQFormPage';
import BlogPage from './pages/admin/BlogPage';
import OrdersPage from './pages/admin/OrdersPage';
import RoomPackagesPage from './pages/RoomPackagesPage';
import RoomPackageDetailPage from './pages/RoomPackageDetailPage';
import B2BAccountPage from './pages/B2BAccountPage';
import VirtualShowroomPage from './pages/VirtualShowroomPage';
import QuotationRequestPage from './pages/quotations/QuotationRequestPage';
import QuotationDetailPage from './pages/quotations/QuotationDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ReturnRequestPage from './pages/ReturnRequestPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="room-packages" element={<RoomPackagesPage />} />
              <Route path="room-packages/:slug" element={<RoomPackageDetailPage />} />
              <Route path="virtual-showroom" element={<VirtualShowroomPage />} />
              <Route path="b2b-account" element={<B2BAccountPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="customization" element={<CustomizationPage />} />
              <Route path="e-quotation" element={<EQuotationPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="cookies" element={<CookiesPage />} />
              <Route path="sitemap" element={<SitemapPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="track-order" element={<OrderTrackingPage />} />
              <Route path="return-request" element={<ReturnRequestPage />} />
              <Route path="quotations/request" element={<QuotationRequestPage />} />
              <Route path="quotations/:id" element={<QuotationDetailPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/edit/:id" element={<ProductFormPage />} />
                <Route path="services" element={<AdminServicesPage />} />
                <Route path="services/new" element={<ServiceFormPage />} />
                <Route path="services/edit/:id" element={<ServiceFormPage />} />
                <Route path="testimonials" element={<TestimonialsPage />} />
                <Route path="faqs" element={<FAQsPage />} />
                <Route path="faqs/new" element={<FAQFormPage />} />
                <Route path="faqs/edit/:id" element={<FAQFormPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="orders" element={<OrdersPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
