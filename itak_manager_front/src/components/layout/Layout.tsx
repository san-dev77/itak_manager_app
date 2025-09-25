import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface LayoutProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  children: ReactNode;
}

const Layout = ({ user, children }: LayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-blue-50 overflow-hidden">
      {/* Sidebar - Fixed position */}
      <div className="flex-shrink-0">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar - Fixed position */}
        <div className="flex-shrink-0">
          <Topbar
            onSidebarToggle={toggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
            user={user}
          />
        </div>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6 bg-blue-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
