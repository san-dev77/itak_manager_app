import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Calendar,
  GraduationCap,
  UserCheck,
  ClipboardCheck,
  LogOut,
} from "lucide-react";
import logoCyberSchool from "../../assets/cyberschool.jpg";
import { usePermissions } from "../../hooks/usePermissions";
import { useAuth } from "../../hooks/useAuth";
import type { MenuKey } from "../../config/permissions";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  menuKey?: MenuKey;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { canAccessMenu, roleLabel } = usePermissions();
  const { user, logout } = useAuth();

  const allMenuItems: MenuItem[] = [
    {
      title: "Tableau de bord",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      menuKey: "dashboard",
    },
    {
      title: "Utilisateurs",
      path: "/users",
      icon: <Users className="w-5 h-5" />,
      menuKey: "users",
    },
    {
      title: "Étudiants",
      path: "/students",
      icon: <UserCheck className="w-5 h-5" />,
      menuKey: "students",
    },
    {
      title: "Classes & Matières",
      path: "/classes-subjects",
      icon: <BookOpen className="w-5 h-5" />,
      menuKey: "classes",
    },
    {
      title: "Calendrier",
      path: "/calendar",
      icon: <Calendar className="w-5 h-5" />,
      menuKey: "calendar",
    },
    {
      title: "Année scolaire",
      path: "/school-years",
      icon: <GraduationCap className="w-5 h-5" />,
      menuKey: "school-years",
    },
    {
      title: "Finances",
      path: "/finances",
      icon: <DollarSign className="w-5 h-5" />,
      menuKey: "finances",
    },
    {
      title: "Assurance Qualité",
      path: "/qualite",
      icon: <ClipboardCheck className="w-5 h-5" />,
      menuKey: "qualite",
    },
    {
      title: "Affectations",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
      menuKey: "settings",
    },
  ];

  const menuItems = allMenuItems.filter(
    (item) => !item.menuKey || canAccessMenu(item.menuKey)
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div
      className={`h-screen flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg p-1 flex-shrink-0">
                <img
                  src={logoCyberSchool}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm">UPCD-ITAK</h1>
                <p className="text-xs text-slate-400">Gestion Universitaire</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-white rounded-lg p-1 mx-auto">
              <img
                src={logoCyberSchool}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <div key={item.path} className="relative">
              <Link
                to={item.path}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span className={active ? "text-white" : "text-slate-400"}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </Link>

              {/* Tooltip for collapsed mode */}
              {isCollapsed && hoveredItem === item.path && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-lg">
                  {item.title}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-slate-800">
        {!isCollapsed && user ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate">{roleLabel}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full p-2.5 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
