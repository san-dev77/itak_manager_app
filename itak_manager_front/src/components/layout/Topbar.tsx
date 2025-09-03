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
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between w-full shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSidebarToggle}
          className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-sm"
        >
          <div className="w-5 h-5 flex flex-col gap-1">
            <div className="w-full h-0.5 bg-current rounded-full transition-all duration-200"></div>
            <div className="w-full h-0.5 bg-current rounded-full transition-all duration-200"></div>
            <div className="w-full h-0.5 bg-current rounded-full transition-all duration-200"></div>
          </div>
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-80 pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200 bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-sm"
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
            className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-sm relative"
          >
            <Bell className="h-5 w-5" />
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? "bg-blue-25" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          !notification.isRead ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-medium text-sm shadow-sm">
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-xs text-gray-500">
                {getRoleLabel(user.role)}
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-medium text-lg shadow-sm">
                    {user.first_name.charAt(0)}
                    {user.last_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-base">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {user.email}
                    </div>
                    <div className="text-xs text-blue-600 font-medium mt-1 bg-blue-50 px-2 py-1 rounded-lg inline-block">
                      {getRoleLabel(user.role)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Mon Profil</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Paramètres</span>
                </button>
              </div>

              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Se déconnecter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
