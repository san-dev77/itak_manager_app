import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

interface AuthContextType {
  user: import('../services/api').User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: import('../services/api').User, token: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (user: import('../services/api').User) => void;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export default useAuth;

