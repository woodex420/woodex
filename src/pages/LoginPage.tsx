import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Eye, EyeOff, ShieldCheck, UserRound } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  isLocalAdminEnabled,
  isLocalAdminLogin,
  signInLocalAdmin,
  type LocalAdminSession,
} from '../lib/auth';

interface LoginPageProps {
  /** Called when the conditional local admin login succeeds. */
  onLocalLogin?: (session: LocalAdminSession) => void;
}

const LoginPage = ({ onLocalLogin }: LoginPageProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  /** Branch 1: the conditional local `admin` / `admin` login. */
  const handleLocalAdminLogin = () => {
    const session = signInLocalAdmin();

    if (!session) {
      // Gate is closed (production build without VITE_ENABLE_LOCAL_ADMIN).
      setError('Local admin access is disabled on this deployment.');
      return;
    }

    setNotice(`Signed in as ${session.profile.full_name} (local admin).`);

    if (onLocalLogin) {
      // Parent hydrates its auth state, so we can route straight in.
      onLocalLogin(session);
      navigate('/dashboard', { replace: true });
      return;
    }

    // No parent hook available: reload so the persisted session is picked up.
    window.location.assign('/dashboard');
  };

  /** Branch 2: the normal Supabase email + password login. */
  const handleSupabaseLogin = async (email: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase is not configured for this deployment. Use the local admin account, or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      );
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      // Conditional: `admin` / `admin` unlocks the dashboard without Supabase.
      if (isLocalAdminLogin(username, password)) {
        handleLocalAdminLogin();
        return;
      }

      const identifier = username.trim();
      if (!identifier.includes('@')) {
        throw new Error(
          'Enter a valid email address, or use the local admin account.',
        );
      }

      await handleSupabaseLogin(identifier);
    } catch (err: any) {
      setError(err?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const fillLocalAdminCredentials = () => {
    setUsername(ADMIN_USERNAME);
    setPassword(ADMIN_PASSWORD);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base px-4 py-10">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-text-primary mb-2">WOODEX</h1>
          <p className="text-lg text-text-secondary">Master Platform</p>
        </div>

        <div className="bg-white p-8 rounded-lg border border-separator">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div
                role="alert"
                className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800"
              >
                {error}
              </div>
            )}

            {notice && !error && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
                {notice}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary text-text-primary"
                placeholder="admin"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-separator rounded-md focus:outline-none focus:ring-2 focus:ring-text-primary text-text-primary"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-text-primary text-white py-3 rounded-md font-medium hover:bg-text-primary-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Local admin shortcut - hidden entirely when the gate is closed */}
          {isLocalAdminEnabled && (
          <div className="mt-6 rounded-md border border-separator bg-muted p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  Local admin access (demo)
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                  <UserRound className="h-4 w-4 shrink-0" />
                  <span>
                    username <code className="font-mono">{ADMIN_USERNAME}</code> / password{' '}
                    <code className="font-mono">{ADMIN_PASSWORD}</code>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={fillLocalAdminCredentials}
                  className="mt-3 text-sm font-medium text-text-primary underline underline-offset-2 hover:text-text-primary-alt"
                >
                  Fill credentials
                </button>
              </div>
            </div>
          </div>
          )}

          {!isSupabaseConfigured && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Supabase is not configured on this build, so email logins are disabled. The
                local admin account above still works.
              </span>
            </div>
          )}

          <p className="mt-6 text-sm text-text-secondary text-center">
            Woodex Master Platform - Comprehensive business management solution
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
