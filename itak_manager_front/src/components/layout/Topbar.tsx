import { useState } from "react";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useInstitution } from "../../hooks/useInstitution";
import type { Institution } from "../../contexts/InstitutionContext";

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

const Topbar = ({ onSidebarToggle, user }: TopbarProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isInstitutionMenuOpen, setIsInstitutionMenuOpen] = useState(false);
  const {
    selectedInstitution,
    institutions,
    setSelectedInstitution,
    isLoading: institutionsLoading,
  } = useInstitution();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      super_admin: "Président / DG",
      admin: "Administrateur",
      scolarite: "Scolarité",
      finance: "Comptabilité",
      qualite: "Assurance Qualité",
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
      isRead: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Menu Toggle */}
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
        >
          <div className="w-5 h-5 flex flex-col justify-center gap-1">
            <div className="w-5 h-0.5 bg-current rounded" />
            <div className="w-5 h-0.5 bg-current rounded" />
            <div className="w-5 h-0.5 bg-current rounded" />
          </div>
        </button>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-72 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Affectation Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsInstitutionMenuOpen(!isInstitutionMenuOpen);
              setIsUserMenuOpen(false);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
          >
            <Building2 className="w-4 h-4" />
            <span className="hidden md:block text-sm font-medium">
              {selectedInstitution ? selectedInstitution.name : "Sélectionner"}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Institution Dropdown */}
          {isInstitutionMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-700">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  Institution
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {institutionsLoading ? (
                  <div className="p-4 text-center text-slate-400 text-sm">
                    Chargement...
                  </div>
                ) : institutions.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-sm">
                    Aucune affectation
                  </div>
                ) : (
                  institutions.map((institution: Institution) => (
                    <button
                      key={institution.id}
                      onClick={() => {
                        setSelectedInstitution(institution);
                        setIsInstitutionMenuOpen(false);
                        // Recharger la page pour appliquer le filtre
                        window.location.reload();
                      }}
                      className={`w-full text-left p-3 hover:bg-slate-700 transition-colors ${
                        selectedInstitution?.id === institution.id
                          ? "bg-blue-500/20 border-l-2 border-blue-500"
                          : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-white">
                        {institution.name}
                      </p>
                      {institution.description && (
                        <p className="text-xs text-slate-400 mt-1">
                          {institution.description}
                        </p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsUserMenuOpen(false);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  Notifications
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${
                      !notif.isRead ? "bg-blue-500/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      )}
                      <div className={!notif.isRead ? "" : "ml-5"}>
                        <p className="text-sm font-medium text-white">
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {notif.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-700">
                <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 font-medium py-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                  Voir tout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-400">
                {getRoleLabel(user.role)}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {/* User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
              {/* User Info */}
              <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Mon Profil</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Paramètres</span>
                </button>
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-slate-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Déconnexion</span>
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
