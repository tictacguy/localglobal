import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import type { User } from "./types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const { user } = await api.get<{ user: User }>("/auth/me");
      setUser(user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { user } = await api.post<{ user: User }>("/auth/login", { email, password });
    setUser(user);
    return user;
  }

  async function register(data: { firstName: string; lastName: string; email: string; password: string }) {
    const { user } = await api.post<{ user: User }>("/auth/register", data);
    setUser(user);
    return user;
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, loading, setUser, login, register, logout, refresh }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
