import { createContext, useContext, useEffect, useState } from "react";
import { api, type User as ApiUser } from "@/lib/api";

type User = ApiUser | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<ApiUser>;
  register: (name: string, email: string, password: string) => Promise<ApiUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((data) => setUser(data.user))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  }

  async function register(name: string, email: string, password: string) {
    const { token, user } = await api.register({ name, email, password });
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
