import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  GraduationCap,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import logoItak from "../../assets/logo itak.png";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      title: "Tableau de bord",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: "Utilisateurs",
      path: "/users",
      icon: <Users className="w-5 h-5" />,
      badge: 1247,
    },
    {
      title: "Cours",
      path: "/courses",
      icon: <BookOpen className="w-5 h-5" />,
      badge: 89,
    },
    {
      title: "Calendrier",
      path: "/calendar",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      title: "Notes",
      path: "/grades",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: "Classes",
      path: "/classes",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      title: "Établissements",
      path: "/schools",
      icon: <Building className="w-5 h-5" />,
    },
    {
      title: "Rapports",
      path: "/reports",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Paramètres",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.div
      className={`bg-white border-r border-blue-100 h-screen flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-blue-100">
        {!isCollapsed && (
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <img src={logoItak} alt="ITAK Manager" className="w-8 h-8" />
            <span className="text-lg font-bold text-blue-900">ITAK</span>
          </motion.div>
        )}

        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Menu - Scrollable if needed */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <motion.div
            key={item.path}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive(item.path)
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-700 hover:bg-blue-50 hover:text-blue-800"
              }`}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex-shrink-0">{item.icon}</div>

              {!isCollapsed && (
                <motion.div
                  className="flex-1 flex items-center justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="font-medium">{item.title}</span>
                  {item.badge && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              )}

              {/* Tooltip pour sidebar collapsed */}
              {isCollapsed && hoveredItem === item.path && (
                <motion.div
                  className="absolute left-full ml-2 px-3 py-2 bg-blue-900 text-white text-sm rounded-lg whitespace-nowrap z-50"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.title}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-l-4 border-l-blue-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </motion.div>
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <motion.div
          className="flex-shrink-0 p-4 border-t border-blue-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 mb-1">Version</div>
            <div className="text-sm font-medium text-blue-800">1.0.0</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
