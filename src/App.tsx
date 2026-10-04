import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured, type Profile } from './lib/supabase';
import {
  getLocalAdminSession,
  type LocalAdminSession,
} from './lib/auth';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import MaterialsPage from './pages/MaterialsPage';
import CustomersPage from './pages/CustomersPage';
import QuotationsPage from './pages/QuotationsPage';
import OrdersPage from './pages/OrdersPage';
import InventoryPage from './pages/InventoryPage';
import DeliveriesPage from './pages/DeliveriesPage';
import ReturnsPage from './pages/ReturnsPage';
import ShowroomPage from './pages/ShowroomPage';
import WhatsAppPage from './pages/WhatsAppPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

// Layout
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // True while the signed-in session came from the local `admin` login.
  const [isLocalSession, setIsLocalSession] = useState(false);

  const applyLocalSession = (session: LocalAdminSession) => {
    setIsLocalSession(true);
    setUser(session.user);
    setProfile(session.profile);
    setLoading(false);
  };

  const clearSessionState = () => {
    setIsLocalSession(false);
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    let cancelled = false;

    // The local admin session wins: it needs no backend at all.
    const local = getLocalAdminSession();
    if (local) {
      applyLocalSession(local);
    } else if (isSupabaseConfigured) {
      // Check active session
      supabase.auth
        .getSession()
        .then(({ data: { session } }) => {
          if (cancelled) return;
          setUser(session?.user ?? null);
          if (session?.user) {
            fetchProfile(session.user.id);
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error restoring Supabase session:', error);
          if (!cancelled) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      const stillLocal = getLocalAdminSession();
      if (stillLocal) {
        applyLocalSession(stillLocal);
        return;
      }
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    setIsLocalSession(false);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-base">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-text-primary border-r-transparent"></div>
          <p className="mt-4 text-text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLocalLogin={applyLocalSession} />;
  }

  return (
    <DashboardLayout
      profile={profile}
      isLocalSession={isLocalSession}
      onSignOut={clearSessionState}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage profile={profile} />} />
        <Route path="/products" element={<ProductsPage profile={profile} />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/customers" element={<CustomersPage profile={profile} />} />
        <Route path="/quotations" element={<QuotationsPage profile={profile} />} />
        <Route path="/orders" element={<OrdersPage profile={profile} />} />
        <Route path="/inventory" element={<InventoryPage profile={profile} />} />
        <Route path="/deliveries" element={<DeliveriesPage profile={profile} />} />
        <Route path="/returns" element={<ReturnsPage profile={profile} />} />
        <Route path="/showroom" element={<ShowroomPage />} />
        <Route path="/whatsapp" element={<WhatsAppPage profile={profile} />} />
        <Route path="/analytics" element={<AnalyticsPage profile={profile} />} />
        <Route path="/settings" element={<SettingsPage profile={profile} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
