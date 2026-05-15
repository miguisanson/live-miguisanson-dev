import * as React from "react";
import { mockUsers, SESSION_STORAGE_KEY } from "../data/mock-users";
import type { DemoUser } from "../types/auth";

interface AuthContextShape {
  user: DemoUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  quickLogin: (email: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextShape | null>(null);

function readStoredUser(): DemoUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { email: string };
    const user = mockUsers.find((item) => item.email === parsed.email);
    return user ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [user, setUser] = React.useState<DemoUser | null>(() => readStoredUser());

  const persist = React.useCallback((next: DemoUser | null) => {
    if (!next) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ email: next.email }));
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const found = mockUsers.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { ok: false as const, error: "No demo user found for this email." };
    }
    if (found.password !== password) {
      return { ok: false as const, error: "Invalid demo password." };
    }
    setUser(found);
    persist(found);
    return { ok: true as const };
  }, [persist]);

  const quickLogin = React.useCallback(async (email: string) => {
    const found = mockUsers.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { ok: false as const, error: "Quick sign-in user not found." };
    }
    setUser(found);
    persist(found);
    return { ok: true as const };
  }, [persist]);

  const logout = React.useCallback(() => {
    setUser(null);
    persist(null);
  }, [persist]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        quickLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextShape {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
