import { createContext, useState, useEffect, type ReactNode } from "react";
import { type User } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'utilisateur depuis le storage au chargement
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        console.log("🔐 AuthContext - Chargement:", {
          hasUser: !!storedUser,
          hasToken: !!token,
        });

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ AuthContext - Utilisateur chargé:", parsedUser.email);
          setUser(parsedUser);
        } else {
          console.log("❌ AuthContext - Pas de données d'auth");
        }
      } catch (error) {
        console.error("❌ AuthContext - Erreur:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (user: User, token: string, refreshToken?: string) => {
    setUser(user);

    // Stocker dans localStorage (persistant)
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  const logout = () => {
    setUser(null);

    // Nettoyer tout le storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
