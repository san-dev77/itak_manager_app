import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import type { MenuKey } from "../../config/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredMenu?: MenuKey;
}

/**
 * Route protégée qui vérifie l'authentification et les permissions.
 * Redirige vers /login si non authentifié.
 */
const ProtectedRoute = ({ children, requiredMenu }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { canAccessMenu } = usePermissions();
  const location = useLocation();

  // Vérification via localStorage (pour éviter le flash de redirection)
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");
  const hasStoredAuth = !!(storedUser && storedToken);

  // Loading - afficher un loader minimal
  if (isLoading && !hasStoredAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Pas authentifié -> rediriger vers login
  if (!hasStoredAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les permissions si requiredMenu est spécifié
  if (requiredMenu && user && !canAccessMenu(requiredMenu)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Accès Non Autorisé
          </h2>
          <p className="text-slate-600 mb-6">
            Vous n'avez pas les permissions pour accéder à cette page.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  // Authentifié et autorisé -> afficher le contenu
  return <>{children}</>;
};

export default ProtectedRoute;
