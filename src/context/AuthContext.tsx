import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: (token: string) => Promise<boolean>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
const STORAGE_KEY = 'desenvolver_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEY);
        if (storedToken === AUTH_TOKEN) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, []);

  const authenticate = async (token: string): Promise<boolean> => {
    try {
      if (token === AUTH_TOKEN) {
        localStorage.setItem(STORAGE_KEY, token);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setShowAuthModal(true);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      authenticate,
      logout,
      showAuthModal,
      setShowAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};