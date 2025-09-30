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
  Sparkles,
} from "lucide-react";

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
          <div>
            <Link
              to={item.path}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                isActiveItem
                  ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white border border-blue-400/30 shadow-lg shadow-blue-500/10"
                  : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
              } ${level > 0 ? "ml-6" : ""}`}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

              {/* Indicateur actif */}
              {isActiveItem && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-full" />
              )}

              <div
                className={`flex-shrink-0 relative ${
                  isActiveItem
                    ? "text-white"
                    : "text-white/60 group-hover:text-white"
                }`}
              >
                {item.icon}
                {isActiveItem && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                )}
              </div>

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium text-sm">{item.title}</span>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          isActiveItem
                            ? "bg-white/20 text-white"
                            : "bg-blue-500/20 text-blue-300"
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
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
                      >
                        <div
                          className={`transform transition-transform duration-200 ${
                            isExpanded ? "rotate-90" : "rotate-0"
                          }`}
                        >
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Sous-menus */}
        {hasChildren && !isCollapsed && isExpanded && (
          <div className="mt-2 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}

        {/* Tooltip pour sidebar collapsed */}
        {isCollapsed && hoveredItem === item.path && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800/95 backdrop-blur-sm text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl border border-white/20">
            {item.title}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-l-4 border-l-slate-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`relative h-screen flex flex-col transition-all duration-500 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Background avec effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-blue-900/90 to-indigo-900/95 backdrop-blur-xl"></div>

      {/* Éléments décoratifs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="absolute top-20 left-4 w-8 h-8 bg-blue-400/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-32 right-4 w-6 h-6 bg-indigo-400/20 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 left-2 w-4 h-4 bg-purple-400/20 rounded-full blur-sm"></div>
      </div>

      {/* Header */}
      <div className="relative flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Gestion
              </span>
              <span className="text-xs text-blue-300/70 font-medium">
                école
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onToggle}
          className="relative p-2 rounded-xl bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
        >
          <div
            className={`transform transition-transform duration-300 ${
              isCollapsed ? "rotate-0" : "rotate-180"
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </div>
        </button>
      </div>

      {/* Navigation Menu - Scrollable if needed */}
      <nav className="relative flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Scrollbar personnalisée */}
        <style>{`
          .overflow-y-auto::-webkit-scrollbar {
            width: 4px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.5);
            border-radius: 2px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.7);
          }
        `}</style>

        {menuItems.map((item) => (
          <div key={item.path}>{renderMenuItem(item)}</div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="relative flex-shrink-0 p-4 border-t border-white/10">
          <div className="relative bg-gradient-to-r from-white/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 overflow-hidden">
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] hover:translate-x-[100%]"></div>

            <div className="relative flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-blue-200/70 mb-1 font-medium">
                  Version
                </div>
                <div className="text-sm font-bold text-white">1.0.0</div>
              </div>
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
