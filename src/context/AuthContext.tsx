import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';


interface AuthContextType {
  user: any;
  loading: boolean;
  register: (userData: any) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser); // Set user from storage
        }
      } catch (error) {
        console.error('Auto-login failed:', error);
      } finally {
        setInitialized(true); // Mark initialization complete
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      const response = await api.post('/api/auth/register', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        // Phone and address will be ignored unless you add them to your Flask model
      });
      
      if (response.data.user_id) {
        // Optional: Auto-login after registration
        const loginResponse = await api.post('/api/auth/login', {
          email: userData.email,
          password: userData.password
        });
        await AsyncStorage.setItem('token', loginResponse.data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        return loginResponse.data;
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const userData = response.data.user;
      await AsyncStorage.setItem('token', response.data.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData); // This triggers navigation automatically
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

console.log('AuthProvider type:', typeof AuthProvider);

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);