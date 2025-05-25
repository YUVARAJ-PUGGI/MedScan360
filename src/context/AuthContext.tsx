
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback }  from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter(); // Initialize router

  const login = useCallback(() => {
    setIsLoggedIn(true);
    router.push('/dashboard'); // Redirect to dashboard on login
    console.log("Simulated login, redirecting to dashboard.");
  }, [router]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    router.push('/'); // Redirect to home on logout
    console.log("Simulated logout, redirecting to home.");
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
