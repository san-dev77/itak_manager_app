import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { User } from "../../services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification
    const checkAuth = () => {
      const userData =
        localStorage.getItem("itak_user") ||
        sessionStorage.getItem("itak_user");
      const token =
        localStorage.getItem("itak_access_token") ||
        sessionStorage.getItem("itak_access_token");

      if (userData && token) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error(
            "Erreur lors du parsing des données utilisateur:",
            error
          );
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Cloner les enfants et passer l'utilisateur comme prop
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { user } as { user: User });
        }
        return child;
      })}
    </>
  );
};

export default ProtectedRoute;
