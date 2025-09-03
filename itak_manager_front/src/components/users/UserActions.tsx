import { motion } from "framer-motion";
import { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  UserPlus,
  MoreHorizontal,
  Shield,
  GraduationCap,
  Building,
} from "lucide-react";
import type { User } from "../../services/api";

interface UserActionsProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onCreateProfile: (user: User, profileType: "teacher" | "staff") => void;
}

const UserActions = ({
  user,
  onView,
  onEdit,
  onDelete,
  onCreateProfile,
}: UserActionsProps) => {
  const [showActions, setShowActions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowActions(false);
  };

  const handleActionClick = (action: () => void) => {
    action();
    setShowActions(false);
    setShowProfileMenu(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "teacher":
        return <GraduationCap className="w-4 h-4" />;
      case "staff":
        return <Building className="w-4 h-4" />;
      case "student":
        return <Shield className="w-4 h-4" />;
      default:
        return <UserPlus className="w-4 h-4" />;
    }
  };

  //   const getRoleColor = (role: string) => {
  //     switch (role) {
  //       case "teacher":
  //         return "text-purple-600 hover:text-purple-700 hover:bg-purple-50";
  //       case "staff":
  //         return "text-orange-600 hover:text-orange-700 hover:bg-orange-50";
  //       case "student":
  //         return "text-green-600 hover:text-green-700 hover:bg-green-50";
  //       default:
  //         return "text-blue-600 hover:text-blue-700 hover:bg-blue-50";
  //     }
  //   };

  const canCreateProfile = (role: string) => {
    return role === "teacher" || role === "staff";
  };

  return (
    <div className="relative">
      {/* Actions principales */}
      <div className="flex items-center justify-end gap-2">
        {/* Bouton Voir */}
        <button
          onClick={() => handleActionClick(() => onView(user))}
          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          title="Voir les détails"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Bouton Modifier */}
        <button
          onClick={() => handleActionClick(() => onEdit(user))}
          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          title="Modifier l'utilisateur"
        >
          <Edit className="w-4 h-4" />
        </button>

        {/* Bouton Profil spécifique (si applicable) */}
        {canCreateProfile(user.role) && (
          <button
            onClick={handleProfileMenuToggle}
            className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            title="Gérer le profil spécifique"
          >
            {getRoleIcon(user.role)}
          </button>
        )}

        {/* Bouton Plus d'actions */}
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          title="Plus d'actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Menu des profils spécifiques */}
      {showProfileMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-0 mt-2 w-64 bg-white border border-blue-200 rounded-lg shadow-lg z-50"
        >
          <div className="p-3 border-b border-blue-100">
            <h4 className="font-medium text-blue-900">Gérer le profil</h4>
            <p className="text-sm text-blue-600">
              {user.first_name} {user.last_name}
            </p>
          </div>

          <div className="p-2">
            {user.role === "teacher" && (
              <button
                onClick={() =>
                  handleActionClick(() => onCreateProfile(user, "teacher"))
                }
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <div>
                  <div className="font-medium">Profil Enseignant</div>
                  <div className="text-xs text-purple-600">
                    Configurer les matières, diplômes...
                  </div>
                </div>
              </button>
            )}

            {user.role === "staff" && (
              <button
                onClick={() =>
                  handleActionClick(() => onCreateProfile(user, "staff"))
                }
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <Building className="w-4 h-4" />
                <div>
                  <div className="font-medium">Profil Administratif</div>
                  <div className="text-xs text-orange-600">
                    Configurer le poste, responsabilités...
                  </div>
                </div>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Menu des actions supplémentaires */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white border border-blue-200 rounded-lg shadow-lg z-50"
        >
          <div className="p-2">
            <button
              onClick={() => handleActionClick(() => onView(user))}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Voir les détails
            </button>

            <button
              onClick={() => handleActionClick(() => onEdit(user))}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>

            <button
              onClick={() => handleActionClick(() => onDelete(user))}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </motion.div>
      )}

      {/* Overlay pour fermer les menus */}
      {(showActions || showProfileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowActions(false);
            setShowProfileMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default UserActions;
