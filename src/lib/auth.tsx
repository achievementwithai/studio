"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebase";
import { Bot } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

// This is now a mock user profile for development
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role?: "admin" | "user";
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginAs: (role: "user" | "admin") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginAs: () => {},
  logout: () => {},
});

const MOCK_USERS = {
    user: {
        uid: 'mock-user-id',
        email: 'user@example.com',
        displayName: 'John Doe',
        role: 'user',
        avatarUrl: 'https://placehold.co/100x100.png',
    },
    admin: {
        uid: 'mock-admin-id',
        email: 'admin@example.com',
        displayName: 'Jane Admin',
        role: 'admin',
        avatarUrl: 'https://placehold.co/100x100.png',
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
        const storedUser = sessionStorage.getItem('mockUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Could not parse mock user from session storage", error);
    }
    setLoading(false);
  }, []);
  
  const loginAs = (role: 'user' | 'admin') => {
    const mockUser = MOCK_USERS[role];
    sessionStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser(mockUser);
    router.push('/dashboard');
  }

  const logout = () => {
    sessionStorage.removeItem('mockUser');
    setUser(null);
    router.push('/');
  }

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === '/';
      const isDashboardPage = pathname.startsWith('/dashboard');

      if (user && isAuthPage) {
        router.push("/dashboard");
      } else if (!user && isDashboardPage) {
        router.push('/');
      }
    }
  }, [user, loading, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, loginAs, logout }}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
