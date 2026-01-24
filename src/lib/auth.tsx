import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Role = "farmer" | "retailer" | "agent";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  region: string;
  profile?: Record<string, unknown>;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

type AuthCtx = AuthState & {
  setAuth: (next: AuthState) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

const LS_KEY = "agri360_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, user: null });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as AuthState;
      if (parsed?.token && parsed?.user) setState(parsed);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthCtx>(() => {
    const setAuth = (next: AuthState) => {
      setState(next);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    };
    const logout = () => {
      setState({ token: null, user: null });
      localStorage.removeItem(LS_KEY);
    };
    return { ...state, setAuth, logout };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

