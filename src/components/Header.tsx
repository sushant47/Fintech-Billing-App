import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Grid,
  Check,
  ExternalLink,
  ChevronDown,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { NavItem } from '../types';

interface HeaderProps {
  currentView: NavItem;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectView: (view: NavItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  onSelectView,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Payment Received',
      desc: 'Acme Corp paid $12,450.00 for INV-2023-089',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Invoice Overdue Notice',
      desc: 'INV-2023-085 (Stark Industries) is 15 days overdue',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'New Client Registered',
      desc: 'Globex Inc billing contact updated',
      time: 'Yesterday',
      unread: false,
    },
  ];

  const getSearchPlaceholder = () => {
    switch (currentView) {
      case 'clients':
        return 'Search clients...';
      case 'invoices':
        return 'Search invoices...';
      case 'inventory':
        return 'Search catalog items & services...';
      default:
        return 'Search invoices, clients...';
    }
  };

  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Invoice Management';
      case 'invoices':
        return 'Invoice Management';
      case 'clients':
        return 'Invoice Management';
      case 'inventory':
        return 'Invoice Management';
      case 'templates':
        return 'Invoice Management';
      case 'settings':
        return 'System Configuration';
      case 'support':
        return 'Help Center';
      default:
        return 'Invoice Management';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Hamburger & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="font-semibold text-slate-800 text-base md:text-lg tracking-tight">
            {getBreadcrumbTitle()}
          </span>
        </div>

        {/* Right Side: Search & Icons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end max-w-xl">
          {/* Search Bar matching screenshot */}
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={getSearchPlaceholder()}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-lg pl-9 pr-3 py-1.5 sm:py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowAppsMenu(false);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-800">Notifications</span>
                  <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-left hover:bg-slate-50 transition-colors ${
                        n.unread ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grid / App launcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAppsMenu(!showAppsMenu);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Apps"
            >
              <Grid className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </button>

            {showAppsMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    onSelectView('dashboard');
                    setShowAppsMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-xs font-medium cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1 font-bold">
                    📊
                  </span>
                  Analytics
                </button>
                <button
                  onClick={() => {
                    onSelectView('templates');
                    setShowAppsMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-xs font-medium cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1 font-bold">
                    🎨
                  </span>
                  Templates
                </button>
                <button
                  onClick={() => {
                    onSelectView('clients');
                    setShowAppsMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-xs font-medium cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 font-bold">
                    👥
                  </span>
                  Clients
                </button>
                <button
                  onClick={() => {
                    onSelectView('inventory');
                    setShowAppsMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-xs font-medium cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-1 font-bold">
                    📦
                  </span>
                  Catalog
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative pl-1">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
                setShowAppsMenu(false);
              }}
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900/20 cursor-pointer"
              aria-label="User profile"
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                alt="Elena Vance"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-slate-200"
                referrerPolicy="no-referrer"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Elena Vance</p>
                  <p className="text-[11px] text-slate-500">elena.vance@fintrack.pro</p>
                  <span className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
                    Finance Admin
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onSelectView('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    Security & Billing
                  </button>
                  <button
                    onClick={() => {
                      onSelectView('support');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Help & Documentation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
