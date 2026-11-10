import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Shield,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { navigationConfig } from '@/lib/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import type { AuthUser, UserRole } from '@/types/auth.type';
import type { NavigationGroup, NavigationItem } from '@/types/navigation.type';
import { useNavigate, useLocation } from 'react-router-dom';

export const ApplicationSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const user: AuthUser | null = useAuthStore((state) => state.user);
  const { theme, toggleTheme } = useThemeStore();

  const userRole: UserRole = (user?.role?.toLowerCase() as UserRole) || 'customer';
  const navigationGroups: NavigationGroup[] = navigationConfig[userRole] || navigationConfig.customer;

  const username = user?.username || 'Guest User';
  const userEmail = user?.email || 'guest@example.com';
  const userAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=2563eb&textColor=ffffff`;

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside
      className={`relative flex flex-col h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-300 ease-in-out select-none ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-lg text-slate-900 dark:text-white tracking-wide truncate">
              Nepal<span className="text-blue-500">Telecom</span>
            </span>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/65 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/70 transition-all duration-200 ${isCollapsed ? 'absolute -right-3.5 top-5 z-20 shadow-md bg-white dark:bg-slate-800' : ''
            }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {navigationGroups.map((group: NavigationGroup, groupIdx: number) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed && group.label && (
              <h3 className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {group.label}
              </h3>
            )}

            {group.items.map((item: NavigationItem) => {
              const Icon = item.icon;
              const isActive = currentPath === item.url;

              return (
                <button
                  key={item.url}
                  onClick={() => navigate(item.url)}
                  title={isCollapsed ? item.title : undefined}
                  className={`relative flex items-center w-full h-11 px-3.5 rounded-lg font-medium text-sm transition-all duration-200 group ${isActive
                    ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1 before:bg-blue-500 before:rounded-r-full'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    } ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                      }`}
                  />

                  {!isCollapsed && (
                    <span className="ml-3 truncate">{item.title}</span>
                  )}

                  {item.badge && (
                    <span
                      className={`flex items-center justify-center text-xs font-semibold rounded-full bg-blue-500 text-white ${isCollapsed
                        ? 'absolute top-1.5 right-1.5 w-4 h-4 text-[10px]'
                        : 'ml-auto px-2 py-0.5'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile Section with Theme Switcher */}
      <div className="relative p-3 border-t border-slate-200 dark:border-slate-800/80" ref={menuRef}>
        {isProfileMenuOpen && (
          <div
            className={`absolute bottom-full mb-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl p-1.5 z-50 text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-150 ${isCollapsed ? 'left-14 w-48' : 'left-3 right-3'
              }`}
          >
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 mb-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">{username}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
            </div>

            <button
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <User className="w-4 h-4 mr-2.5 text-slate-500 dark:text-slate-400" />
              View Profile
            </button>
            <button
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Shield className="w-4 h-4 mr-2.5 text-slate-500 dark:text-slate-400" />
              Account & Security
            </button>

            {/* Theme Toggle Button in Popup */}
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span className="flex items-center">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 mr-2.5 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 mr-2.5 text-blue-600" />
                )}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
              <span className="text-[10px] uppercase bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                {theme}
              </span>
            </button>

            <div className="my-1 border-t border-slate-100 dark:border-slate-700/50" />

            <button
              onClick={() => {
                setIsProfileMenuOpen(false);
                useAuthStore.getState().logout();

                navigate("/login", {
                  replace: true,
                  state: null,
                });
              }}
              className="flex items-center w-full px-3 py-2 text-xs font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2.5 text-red-500 dark:text-red-400" />
              Log Out
            </button>
          </div>
        )}

        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className={`flex items-center w-full p-2 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 group ${isProfileMenuOpen ? 'bg-slate-100 dark:bg-slate-800' : ''
            } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
        >
          <div className="relative shrink-0">
            <img
              src={userAvatar}
              alt={username}
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-slate-200 dark:ring-slate-700/50 group-hover:ring-blue-500/50 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </div>

          {!isCollapsed && (
            <div className="ml-3 text-left overflow-hidden">
              <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                {username}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">
                {userRole}
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default ApplicationSidebar;
