import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, apiConfig } from '../config/api';

interface User {
  id: number;
  username: string;
  nombre_completo: string;
  rol?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  // Funciones de autorización
  canEdit: () => boolean;
  canCreate: () => boolean;
  canRead: () => boolean;
  isAdmin: () => boolean;
  isDeveloper: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configurar axios interceptor
  useEffect(() => {
    axios.defaults.baseURL = apiConfig.baseURL;
    axios.defaults.withCredentials = true;

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verificar token al cargar la app (sessionStorage)
  useEffect(() => {
    const storedToken = sessionStorage.getItem('sedeges_token');
    const storedUser = sessionStorage.getItem('sedeges_user');

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn('No se pudo parsear el usuario en sessionStorage');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.AUTH_LOGIN,
        { username, password },
        { withCredentials: true }
      );

      const { token: newToken, usuario: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      // Guardar en sessionStorage
      sessionStorage.setItem('sedeges_token', newToken);
      sessionStorage.setItem('sedeges_user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('sedeges_token');
    sessionStorage.removeItem('sedeges_user');
  };

  // Funciones de autorización
  const canEdit = (): boolean => {
    return user?.rol === 'desarrollador' || user?.rol === 'admin';
  };

  const canCreate = (): boolean => {
    return user?.rol === 'desarrollador' || user?.rol === 'admin' || user?.rol === 'usuario';
  };

  const canRead = (): boolean => {
    return !!user; // Cualquier usuario autenticado puede leer
  };

  const isAdmin = (): boolean => {
    return user?.rol === 'admin' || user?.rol === 'desarrollador';
  };

  const isDeveloper = (): boolean => {
    return user?.rol === 'desarrollador';
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    canEdit,
    canCreate,
    canRead,
    isAdmin,
    isDeveloper
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};