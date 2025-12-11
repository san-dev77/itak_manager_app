import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Layout from "./Layout";

interface AuthenticatedPageProps {
  children: ReactNode;
}

/**
 * Composant centralisé pour toutes les pages authentifiées.
 * Gère automatiquement :
 * - La vérification de l'authentification
 * - L'affichage du loader pendant le chargement
 * - La redirection vers login si non authentifié
 * - Le passage des données utilisateur au Layout
 */
const AuthenticatedPage = ({ children }: AuthenticatedPageProps) => {
  const { user, isLoading } = useAuth();

  // Vérification alternative via localStorage (pour le premier rendu)
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");
  const hasStoredAuth = !!(storedUser && storedToken);

  // Loading state
  if (isLoading && !hasStoredAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas d'auth, rediriger vers login
  if (!user && !hasStoredAuth) {
    return <Navigate to="/login" replace />;
  }

  // Récupérer les données utilisateur (du contexte ou du localStorage)
  const userData = user || (storedUser ? JSON.parse(storedUser) : null);

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout
      user={{
        firstName: userData.firstName || "Utilisateur",
        lastName: userData.lastName || "",
        role: userData.role || "user",
        email: userData.email || "",
      }}
    >
      {children}
    </Layout>
  );
};

export default AuthenticatedPage;

