"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";

export interface UserProfile extends User {
  role?: "admin" | "user";
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        const unsubSnapshot = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                 setUser({
                    ...authUser,
                    role: userData.role,
                    avatarUrl: userData.avatarUrl,
                    displayName: userData.displayName || authUser.displayName,
                });
            } else {
                setUser(authUser);
            }
             setLoading(false);
        });
        return () => unsubSnapshot();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  
    useEffect(() => {
    if (!loading && user) {
      // Assuming you want to redirect to /dashboard after login
      // and you are not on a dashboard page already.
      if(window.location.pathname === '/' || window.location.pathname === '/auth'){
          router.push("/dashboard");
      }
    }
  }, [user, loading, router]);


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Bot className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
