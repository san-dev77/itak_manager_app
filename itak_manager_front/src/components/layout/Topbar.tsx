import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";

interface TopbarProps {
  onSidebarToggle: () => void;
  isSidebarCollapsed: boolean;
  user: {
    firstName: string;
    lastName: string;
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
    localStorage.removeItem("itak_access_token");
    localStorage.removeItem("itak_refresh_token");
    localStorage.removeItem("itak_user");
    sessionStorage.removeItem("itak_access_token");
    sessionStorage.removeItem("itak_refresh_token");
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
      className="relative bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center justify-between w-full shadow-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background avec effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-blue-50/80 to-indigo-50/90 backdrop-blur-xl"></div>

      {/* Éléments décoratifs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="absolute top-4 right-20 w-2 h-2 bg-blue-400/30 rounded-full blur-sm"></div>
        <div className="absolute bottom-4 left-1/4 w-1 h-1 bg-indigo-400/30 rounded-full blur-sm"></div>
      </div>

      {/* Left Section */}
      <div className="relative flex items-center gap-4">
        <motion.button
          onClick={onSidebarToggle}
          className="relative p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-slate-700 hover:text-slate-900 hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-5 h-5 flex flex-col gap-1"
            animate={{ rotate: isSidebarCollapsed ? 0 : 90 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full h-0.5 bg-current rounded-full"
              animate={{
                width: isSidebarCollapsed ? "100%" : "60%",
                x: isSidebarCollapsed ? 0 : 2,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-full h-0.5 bg-current rounded-full"
              animate={{ opacity: isSidebarCollapsed ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-full h-0.5 bg-current rounded-full"
              animate={{
                width: isSidebarCollapsed ? "100%" : "60%",
                x: isSidebarCollapsed ? 0 : -2,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.button>

        {/* Search Bar */}
        <motion.div
          className="relative hidden md:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <motion.input
              type="text"
              placeholder="Rechercher..."
              className="w-80 pl-12 pr-4 py-2.5 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-900 placeholder-slate-400 transition-all duration-300 bg-white/40 backdrop-blur-sm focus:bg-white/60 shadow-sm focus:shadow-md"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 pointer-events-none"
              whileFocus={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Right Section */}
      <motion.div
        className="relative flex items-center gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Theme Toggle */}
        <motion.button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="relative p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-slate-700 hover:text-slate-900 hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </motion.div>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-slate-700 hover:text-slate-900 hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isNotificationsOpen ? 15 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bell className="h-5 w-5" />
            </motion.div>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {notifications.filter((n) => !n.isRead).length}
              </motion.span>
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="relative p-4 border-b border-white/20 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Bell className="w-4 h-4 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Notifications
                    </h3>
                    <motion.div
                      className="ml-auto w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      className={`relative p-4 border-b border-white/10 hover:bg-white/30 transition-all duration-200 ${
                        !notification.isRead ? "bg-blue-50/50" : ""
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          className={`w-3 h-3 rounded-full mt-2 ${
                            !notification.isRead
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                              : "bg-slate-300"
                          }`}
                          animate={
                            !notification.isRead ? { scale: [1, 1.2, 1] } : {}
                          }
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-2 font-medium">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <motion.div
                            className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/20 bg-gradient-to-r from-blue-50/30 to-indigo-50/30">
                  <motion.button
                    className="w-full text-center text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Voir toutes les notifications
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {user.firstName?.charAt(0) || "U"}
              {user.lastName?.charAt(0) || "U"}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-slate-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-slate-600 font-medium">
                {getRoleLabel(user.role)}
              </div>
            </div>
            <motion.div
              animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-4 w-4 text-slate-600" />
            </motion.div>
          </motion.button>

          {/* User Dropdown */}
          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="relative p-5 border-b border-white/20 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {user.firstName?.charAt(0) || "U"}
                      {user.lastName?.charAt(0) || "U"}
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-base">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {user.email}
                      </div>
                      <motion.div
                        className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold mt-2 px-3 py-1 rounded-full inline-block"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {getRoleLabel(user.role)}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <motion.button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-white/50 rounded-xl transition-all duration-200 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <User className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    <span className="font-semibold">Mon Profil</span>
                  </motion.button>

                  <motion.button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-white/50 rounded-xl transition-all duration-200 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Settings className="h-4 w-4 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    <span className="font-semibold">Paramètres</span>
                  </motion.button>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-white/20 bg-gradient-to-r from-red-50/30 to-pink-50/30">
                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50/50 rounded-xl transition-all duration-200 group"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-red-500 group-hover:to-pink-500 transition-all duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <LogOut className="h-4 w-4 text-red-600 group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    <span className="font-semibold">Se déconnecter</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Topbar;
