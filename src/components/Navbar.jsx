import React, { useState } from 'react';
import { translations } from '../utils/translations';
import { Menu, X, Globe, Bell, LogIn, LogOut, Award, User, ShoppingBag } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  lang,
  setLang,
  user,
  openAuthModal,
  onLogout,
  notifications = [],
  clearNotifications
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const t = translations[lang];

  const handleNavClick = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ne' : 'en');
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-brand-sand bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('feed')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green text-brand-cream shadow-md transition-transform hover:scale-105 duration-300">
              <span className="text-xl font-bold font-display">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-brand-green leading-none">
                {t.appName}
              </span>
              <span className="text-[10px] text-brand-terracotta font-medium tracking-wider uppercase">
                {t.appSubtitle}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavClick('feed')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === 'feed'
                  ? 'text-brand-green bg-brand-green-pale/50 font-semibold'
                  : 'text-gray-600 hover:text-brand-green hover:bg-gray-50'
              }`}
            >
              {t.feed}
            </button>
            <button
              onClick={() => handleNavClick('leaderboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === 'leaderboard'
                  ? 'text-brand-green bg-brand-green-pale/50 font-semibold'
                  : 'text-gray-600 hover:text-brand-green hover:bg-gray-50'
              }`}
            >
              {t.leaderboard}
            </button>
            {user && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'text-brand-green bg-brand-green-pale/50 font-semibold'
                    : 'text-gray-600 hover:text-brand-green hover:bg-gray-50'
                }`}
              >
                {t.dashboard}
              </button>
            )}
          </div>

          {/* Actions (Language, Notif, Auth) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-sand bg-brand-cream hover:bg-brand-sand/50 text-xs font-semibold text-brand-green transition-all duration-200"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{t.language}</span>
            </button>

            {/* Notifications Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setProfileOpen(false);
                  }}
                  className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-terracotta text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                      {unreadNotifs}
                    </span>
                  )}
                </button>

                {/* Notifications Menu */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-brand-sand bg-white py-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
                      <span className="font-semibold text-sm text-gray-800">Notifications</span>
                      {unreadNotifs > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-[11px] font-medium text-brand-terracotta hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-gray-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`px-4 py-3 text-xs border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50 ${
                              !n.read ? 'bg-brand-green-pale/10 font-medium' : ''
                            }`}
                          >
                            <p className="text-gray-800">{n.text}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Account / Auth */}
            {!user ? (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-green text-brand-cream hover:bg-brand-green-medium font-semibold text-sm shadow-sm transition-all duration-300 hover:shadow-md active:scale-95"
              >
                <LogIn className="h-4 w-4" />
                <span>{t.login}</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-sand bg-white hover:bg-brand-cream text-sm text-gray-800 transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-brand-green text-brand-cream flex items-center justify-center text-xs font-bold font-display">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{user.name}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-brand-sand bg-white py-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-brand-green uppercase tracking-wide">
                        {t[user.role]}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{user.phone}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleNavClick('dashboard');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      <span>{t.dashboard}</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-brand-terracotta hover:bg-brand-terracotta/5 flex items-center gap-2 border-t border-gray-100"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-brand-sand bg-brand-cream text-[11px] font-semibold text-brand-green"
            >
              <Globe className="h-3 w-3" />
              <span>{t.language}</span>
            </button>
            {user && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="p-1.5 text-gray-600 hover:text-brand-green"
              >
                <User className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-sand bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top duration-300">
          <button
            onClick={() => handleNavClick('feed')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              currentView === 'feed' ? 'bg-brand-green-pale/50 text-brand-green' : 'text-gray-700'
            }`}
          >
            {t.feed}
          </button>
          <button
            onClick={() => handleNavClick('leaderboard')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              currentView === 'leaderboard' ? 'bg-brand-green-pale/50 text-brand-green' : 'text-gray-700'
            }`}
          >
            {t.leaderboard}
          </button>
          {user && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                currentView === 'dashboard' ? 'bg-brand-green-pale/50 text-brand-green' : 'text-gray-700'
              }`}
            >
              {t.dashboard}
            </button>
          )}
          
          <div className="pt-3 border-t border-gray-100">
            {!user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-green text-brand-cream font-bold text-sm"
              >
                <LogIn className="h-4 w-4" />
                <span>{t.login}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="px-4 py-1.5">
                  <p className="text-[10px] font-bold text-brand-green uppercase tracking-wider">{t[user.role]}</p>
                  <p className="text-xs text-gray-700 font-semibold">{user.name}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-terracotta/20 text-brand-terracotta bg-brand-terracotta/5 font-bold text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
