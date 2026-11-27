import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { nameFromEmail } from '../utils/user';

export type User = {
  name: string;
  email: string;
};

// 'restoring' means we're still reading the saved session from storage,
// so the app doesn't yet know whether to show Login or Home.
type AuthStatus = 'restoring' | 'signedOut' | 'signedIn';

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  hasOnboarded: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

export const STORAGE_KEYS = {
  session: '@streaks/session',
  onboarded: '@streaks/onboarded',
} as const;

const MOCK_SIGN_IN_DELAY_MS = 900;

const AuthContext = createContext<AuthContextValue | null>(null);

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

function parseUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<User>;
    if (typeof value.email === 'string' && typeof value.name === 'string') {
      return { email: value.email, name: value.name };
    }
  } catch {
    // Corrupt data is treated the same as "no session".
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [user, setUser] = useState<User | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        const [session, onboarded] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.session),
          AsyncStorage.getItem(STORAGE_KEYS.onboarded),
        ]);
        if (cancelled) return;

        const savedUser = parseUser(session);
        setUser(savedUser);
        setHasOnboarded(onboarded === 'true');
        setStatus(savedUser ? 'signedIn' : 'signedOut');
      } catch {
        // If storage can't be read, fall back to a fresh, signed-out start.
        if (!cancelled) setStatus('signedOut');
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string) => {
    // Mock auth: pretend to call a server, then accept any valid-looking input.
    await wait(MOCK_SIGN_IN_DELAY_MS);

    const normalizedEmail = email.trim().toLowerCase();
    const nextUser: User = {
      email: normalizedEmail,
      name: nameFromEmail(normalizedEmail),
    };

    await AsyncStorage.setItem(STORAGE_KEYS.session, JSON.stringify(nextUser));
    setUser(nextUser);
    setStatus('signedIn');
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.session);
    } catch {
      // Sign out locally even if storage fails, so the user is never stuck signed in.
    }
    setUser(null);
    setStatus('signedOut');
  }, []);

  const completeOnboarding = useCallback(async () => {
    setHasOnboarded(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.onboarded, 'true');
    } catch {
      // Not critical: the worst case is seeing onboarding again next launch.
    }
  }, []);

  const value = useMemo(
    () => ({ status, user, hasOnboarded, signIn, signOut, completeOnboarding }),
    [status, user, hasOnboarded, signIn, signOut, completeOnboarding],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return context;
}
