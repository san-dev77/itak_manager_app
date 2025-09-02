import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

interface TopbarProps {
  onSidebarToggle: () => void;
  isSidebarCollapsed: boolean;
  user: {
    first_name: string;
    last_name: string;
    role: string;
    email: string;
  };
}

const Topbar = ({ onSidebarToggle, isSidebarCollapsed, user }: TopbarProps) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    // Nettoyer le stockage
    localStorage.removeItem("itak_token");
    localStorage.removeItem("itak_user");
    sessionStorage.removeItem("itak_token");
    sessionStorage.removeItem("itak_user");

    // Rediriger vers la page d'accueil
    navigate("/");
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      student: "Élève",
      teacher: "Enseignant/Enseignante",
      staff: "Personnel administratif",
      parent: "Parent",
      admin: "Administrateur/Administratrice",
    };
    return roleLabels[role] || role;
  };

  const notifications = [
    {
      id: 1,
      title: "Nouveau cours ajouté",
      message: "Le cours de Mathématiques a été créé",
      time: "Il y a 5 min",
      isRead: false,
    },
    {
      id: 2,
      title: "Rapport disponible",
      message: "Votre rapport mensuel est prêt",
      time: "Il y a 1 heure",
      isRead: false,
    },
    {
      id: 3,
      title: "Mise à jour système",
      message: "Nouvelle version disponible",
      time: "Il y a 2 heures",
      isRead: true,
    },
  ];

  return (
    <motion.header
      className="bg-white border-b border-blue-100 px-6 py-4 flex items-center justify-between w-full"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <div className="w-5 h-5 flex flex-col gap-1">
            <div className="w-full h-0.5 bg-current rounded-full"></div>
            <div className="w-full h-0.5 bg-current rounded-full"></div>
            <div className="w-full h-0.5 bg-current rounded-full"></div>
          </div>
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-blue-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-80 pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-900 placeholder-blue-400"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-80 bg-white border border-blue-200 rounded-lg shadow-lg z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 border-b border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900">
                  Notifications
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-blue-50 hover:bg-blue-50 transition-colors ${
                      !notification.isRead ? "bg-blue-25" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          !notification.isRead ? "bg-blue-500" : "bg-blue-200"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-blue-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-blue-400 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-blue-100">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Voir toutes les notifications
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-blue-900">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-xs text-blue-600">
                {getRoleLabel(user.role)}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-blue-600" />
          </button>

          {/* User Dropdown */}
          {isUserMenuOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-64 bg-white border border-blue-200 rounded-lg shadow-lg z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.first_name.charAt(0)}
                    {user.last_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-blue-600">{user.email}</div>
                    <div className="text-xs text-blue-500">
                      {getRoleLabel(user.role)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  <User className="h-4 w-4" />
                  Mon Profil
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </button>
              </div>

              <div className="p-2 border-t border-blue-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Topbar;
