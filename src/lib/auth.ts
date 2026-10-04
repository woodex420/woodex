import { supabase, isSupabaseConfigured, type Profile } from './supabase';

/**
 * Local ("conditional") admin login.
 *
 * The Woodex master platform normally authenticates through Supabase. That
 * requires a provisioned Supabase project *and* a user row in `auth.users`,
 * which makes the deployed demo unreachable for anyone without those
 * credentials (see `DEMO_CREDENTIALS.md`).
 *
 * This module adds a conditional branch to the login flow:
 *
 *   username === ADMIN_USERNAME  &&  password === ADMIN_PASSWORD
 *
 * When that condition is met we mint a local session (persisted in
 * `localStorage`) together with a synthetic `admin` profile, so the whole
 * dashboard becomes usable with zero backend configuration. Every other
 * username/password combination still goes through Supabase exactly as before.
 *
 * NOTE: this is a client-side convenience/demo gate only. Anything shipped to
 * the browser is public, so it must NOT be relied on as real access control.
 * Server-side data access is still governed by Supabase RLS policies.
 */

/** Username accepted by the conditional local login. */
export const ADMIN_USERNAME = 'admin';

/** Password accepted by the conditional local login. */
export const ADMIN_PASSWORD = 'admin';

/** Aliases that also resolve to the local admin account. */
const ADMIN_IDENTIFIERS: readonly string[] = [
  ADMIN_USERNAME,
  'admin@woodex.local',
  'admin@woodex-demo.com',
];

const DEMO_SESSION_KEY = 'woodex.local-admin-session';

/** Stable pseudo user id used for the local admin session. */
export const LOCAL_ADMIN_ID = 'local-admin';

/** A minimal shape that mirrors the parts of a Supabase user we rely on. */
export interface LocalUser {
  id: string;
  email: string;
  app_metadata: { provider: 'local'; providers: ['local'] };
  user_metadata: { full_name: string; role: 'admin' };
  aud: string;
  created_at: string;
}

export interface LocalAdminSession {
  user: LocalUser;
  profile: Profile;
  /** Marks the session as locally issued (never from Supabase). */
  local: true;
  signed_in_at: string;
}

const nowIso = () => new Date().toISOString();

export const LOCAL_ADMIN_PROFILE: Profile = {
  id: LOCAL_ADMIN_ID,
  full_name: 'Administrator',
  role: 'admin',
  email: 'admin@woodex.local',
  phone: '',
  department: 'Management',
  avatar_url: undefined,
  created_at: nowIso(),
  updated_at: nowIso(),
};

const buildSession = (): LocalAdminSession => ({
  local: true,
  signed_in_at: nowIso(),
  profile: { ...LOCAL_ADMIN_PROFILE },
  user: {
    id: LOCAL_ADMIN_ID,
    email: LOCAL_ADMIN_PROFILE.email!,
    app_metadata: { provider: 'local', providers: ['local'] },
    user_metadata: {
      full_name: LOCAL_ADMIN_PROFILE.full_name,
      role: 'admin',
    },
    aud: 'authenticated',
    created_at: LOCAL_ADMIN_PROFILE.created_at,
  },
});

/**
 * The "conditional" test: does this identifier/password pair unlock the local
 * admin account? The username is matched case-insensitively and trimmed, the
 * password must match exactly.
 */
export function isLocalAdminLogin(
  identifier: string = '',
  password: string = '',
): boolean {
  const id = identifier.trim().toLowerCase();
  return ADMIN_IDENTIFIERS.includes(id) && password === ADMIN_PASSWORD;
}

/**
 * Creates and persists the local admin session. Returns the session so the
 * caller can hydrate React state without a page reload.
 */
export function signInLocalAdmin(): LocalAdminSession {
  const session = buildSession();
  try {
    window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    // Private browsing / disabled storage: keep going with an in-memory session.
    console.warn('Could not persist local admin session:', err);
  }
  return session;
}

/** Reads (and validates) a previously persisted local admin session. */
export function getLocalAdminSession(): LocalAdminSession | null {
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<LocalAdminSession>;
    if (parsed?.local !== true || parsed?.user?.id !== LOCAL_ADMIN_ID) {
      clearLocalAdminSession();
      return null;
    }

    return {
      ...buildSession(),
      signed_in_at: parsed.signed_in_at ?? nowIso(),
    };
  } catch {
    clearLocalAdminSession();
    return null;
  }
}

/** Drops the persisted local admin session. */
export function clearLocalAdminSession(): void {
  try {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
  } catch {
    /* nothing to clean up */
  }
}

/**
 * Signs out of whichever auth path is active: the local admin session and/or
 * the Supabase session. Safe to call even when Supabase is not configured.
 */
export async function signOutOfEverything(): Promise<void> {
  clearLocalAdminSession();

  if (!isSupabaseConfigured) return;

  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase sign-out failed:', err);
  }
}
