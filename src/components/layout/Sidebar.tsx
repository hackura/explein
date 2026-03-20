import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Home, 
  MessageSquare, 
  Library, 
  BookOpen, 
  Settings, 
  LogOut, 
  X,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard', end: true },
  { name: 'AI Assistant', icon: MessageSquare, path: '/dashboard/chat' },
  { name: 'Flashcards', icon: Library, path: '/dashboard/flashcards' },
  { name: 'Smart Notes', icon: BookOpen, path: '/dashboard/notes' },
];

export default function Sidebar({ 
  isOpen, 
  setIsOpen,
  isCollapsed = false,
  setIsCollapsed
}: { 
  isOpen: boolean, 
  setIsOpen: (v: boolean) => void,
  isCollapsed?: boolean,
  setIsCollapsed?: (v: boolean) => void
}) {
  const { user, signOut } = useAuth();
  
  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
      isCollapsed ? "justify-center px-0" : "",
      isActive 
        ? "bg-blue-50 text-blue-700" 
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    );

  const sidebarContent = (
    <div className={cn("flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
      <div className={cn("p-4 flex items-center h-16", isCollapsed ? "justify-center" : "justify-between")}>
        <NavLink to="/dashboard" className="flex items-center gap-1">
          <img src="/logo.svg" alt="E" className="w-7 h-7 drop-shadow-sm transition-transform hover:scale-105" />
          {!isCollapsed && <span className="text-xl font-bold tracking-tight text-foreground">xplein.</span>}
        </NavLink>
        <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            onClick={() => setIsOpen(false)}
            className={navLinkClasses}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Toggle Button for Desktop */}
        {setIsCollapsed && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors", isCollapsed ? "justify-center px-0" : "")}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5 flex-shrink-0" /> : <ChevronLeft className="w-5 h-5 flex-shrink-0" />}
            {!isCollapsed && <span>Collapse</span>}
          </button>
        )}

        {/* Upgrade to Pro - moved to bottom */}
        <NavLink 
          to="/pricing" 
          onClick={() => setIsOpen(false)} 
          className={({isActive}) => cn(navLinkClasses({isActive}), "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800")}
          title={isCollapsed ? "Upgrade to Pro" : undefined}
        >
          <Zap className="w-5 h-5 flex-shrink-0 text-indigo-600" />
          {!isCollapsed && <span className="font-bold">Upgrade to Pro</span>}
        </NavLink>

        <NavLink to="/dashboard/settings" onClick={() => setIsOpen(false)} className={navLinkClasses} title={isCollapsed ? "Settings" : undefined}>
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>

        <button 
          onClick={signOut}
          className={cn("flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors", isCollapsed ? "justify-center px-0" : "")}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
        
        {!isCollapsed && (
          <div className="mt-4 flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
               <span className="text-sm font-medium text-gray-900 truncate">Student</span>
               <span className="text-xs text-gray-500 truncate">{user?.email}</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="mt-4 flex justify-center py-2" title={user?.email || "User Profile"}>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={cn("hidden lg:block lg:fixed lg:inset-y-0 lg:z-50 transition-all duration-300", isCollapsed ? "w-20" : "lg:w-64")}>
        {sidebarContent}
      </div>

      {isOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 max-w-xs flex-col bg-white">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
