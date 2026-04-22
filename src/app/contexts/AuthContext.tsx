import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, loginUser, registerUser, signOut, UserData } from '../firebase/auth';
import { toast } from 'sonner';

export type UserRole = 'patient' | 'doctor' | 'admin' | null;

interface User {
  uid: string;
  name: string;
  role: UserRole;
  email: string;
  specialization?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider mounting...');
    
    // Firebase auth state listener
    let unsubscribe: (() => void) | undefined;
    
    try {
      unsubscribe = getCurrentUser((userData: UserData | null) => {
        console.log('Auth state changed:', userData);
        if (userData) {
          setUser({
            uid: userData.uid,
            name: userData.name,
            role: userData.role,
            email: userData.email,
            specialization: userData.specialization,
            phone: userData.phone
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Firebase auth initialization error:', error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userData = await loginUser(email, password);
      setUser({
        uid: userData.uid,
        name: userData.name,
        role: userData.role,
        email: userData.email,
        specialization: userData.specialization,
        phone: userData.phone
      });
      toast.success('Xush kelibsiz!');
    } catch (error: any) {
      toast.error(error.message || 'Kirish xatosi');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, phone: string) => {
    try {
      setLoading(true);
      const userData = await registerUser(email, password, name, phone);
      setUser({
        uid: userData.uid,
        name: userData.name,
        role: userData.role,
        email: userData.email,
        phone: userData.phone
      });
      toast.success('Ro\'yxatdan o\'tdingiz!');
    } catch (error: any) {
      toast.error(error.message || 'Ro\'yxatdan o\'tish xatosi');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      toast.success('Chiqildi');
    } catch (error: any) {
      toast.error(error.message || 'Chiqish xatosi');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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