import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  BarChart3,
  Building,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
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
  children?: MenuItem[];
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

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
      title: "Classes & Matières",
      path: "/classes-subjects",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      title: "Finances",
      path: "/finances",
      icon: <DollarSign className="w-5 h-5" />,
      children: [
        {
          title: "Vue d'ensemble",
          path: "/finances/overview",
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          title: "Paiements",
          path: "/finances/payments",
          icon: <CreditCard className="w-4 h-4" />,
        },
        {
          title: "Factures",
          path: "/finances/invoices",
          icon: <Receipt className="w-4 h-4" />,
        },
      ],
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
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.title);
    const isActiveItem = isActive(item.path);

    return (
      <div key={item.path}>
        <div className="relative">
          <Link
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
              isActiveItem
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            } ${level > 0 ? "ml-4" : ""}`}
            onMouseEnter={() => setHoveredItem(item.path)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              className={`flex-shrink-0 ${
                isActiveItem
                  ? "text-white"
                  : "text-gray-500 group-hover:text-blue-600"
              }`}
            >
              {item.icon}
            </div>

            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between">
                <span className="font-medium text-sm">{item.title}</span>
                {item.badge && (
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isActiveItem
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(item.title);
                    }}
                    className={`p-1 rounded transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Tooltip pour sidebar collapsed */}
            {isCollapsed && hoveredItem === item.path && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl">
                {item.title}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              </div>
            )}
          </Link>
        </div>

        {/* Sous-menus */}
        {hasChildren && !isCollapsed && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out shadow-sm ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <img src={logoItak} alt="ITAK Manager" className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              ITAK
            </span>
          </div>
        )}

        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-sm"
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
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1 font-medium">
              Version
            </div>
            <div className="text-sm font-semibold text-gray-700">1.0.0</div>
            <div className="text-xs text-gray-400 mt-1">ITAK Manager</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
