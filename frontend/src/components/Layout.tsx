"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarProps?: any;
  navbarProps?: any;
}

const Layout = ({
  children,
  showSidebar = true,
  sidebarProps = {},
  navbarProps = {},
}: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to false on mobile

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[var(--color-neutral-dark)] text-[var(--color-tertiary)]">
      {/* Sidebar - Hidden on mobile by default, overlay on mobile */}
      {showSidebar && (
        <>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={closeSidebar}
            />
          )}
          {/* Sidebar */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-50
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${sidebarOpen ? 'block' : 'hidden lg:block'}
          `}>
            <Sidebar
              isOpen={sidebarOpen}
              onClose={closeSidebar}
              {...sidebarProps}
            />
          </div>
        </>
      )}

      {/* Main Content - Takes full width when sidebar is hidden */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar onMenuClick={toggleSidebar} {...navbarProps} />

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
