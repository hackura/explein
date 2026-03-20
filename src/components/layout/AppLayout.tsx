import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50 selection:bg-blue-200">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={cn("flex flex-1 flex-col h-full overflow-hidden transition-all duration-300", isCollapsed ? "lg:pl-20" : "lg:pl-64")}>
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button 
            type="button" 
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6 justify-end">
            {/* Topbar placeholders (e.g. search, notifications) can go here */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
