import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const { isAuthed, user, handleLogout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isActive = (path) => location.pathname === path;
  
  // Debug logging to see when auth state changes
  console.log('Navbar render - isAuthed:', isAuthed, 'user:', user);

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  function handleLogoutClick() {
    setIsSidebarOpen(false);
    handleLogout();
  }

  // Navigation items for authenticated users
  const authNavItems = [
    { to: '/my-projects', label: 'My Projects', icon: '📁' },
    { to: '/app', label: 'Workspace', icon: '🎵' },
    { to: '/shared', label: 'Discover', icon: '🔍' },
  ];

  // Navigation items for non-authenticated users
  const publicNavItems = [
    // No navigation items for public users
  ];

  const navItems = isAuthed ? authNavItems : publicNavItems;

  return (
    <>
      {/* Desktop Navbar */}
      <header className="fixed top-0 inset-x-0 z-30 bg-gradient-to-r from-black/90 via-black/80 to-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl hidden md:block">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <span className="text-xl">🎵</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  TrackStack
                </span>
                <span className="text-xs text-zinc-400 -mt-1">Music Platform</span>
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(item.to)
                      ? 'bg-white/10 text-white border border-white/20 shadow-lg'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side - Auth/User */}
          <div className="flex items-center gap-4">
            {isAuthed && (
              <>
                {/* Logout Button - Only show when logged in */}
                <button
                  onClick={handleLogoutClick}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-200 border border-rose-400/30 hover:from-rose-500/30 hover:to-pink-500/30 hover:border-rose-400/50 hover:shadow-lg hover:shadow-rose-500/25"
                >
                  <span className="flex items-center gap-2">
                    <span>🚪</span>
                    Logout
                  </span>
                </button>
              </>
            )}
            {/* Login/Signup buttons removed from desktop navbar - only in mobile sidebar */}
          </div>
        </div>

        {/* Animated Bottom Border */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px]">
          <div className="h-full w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse" />
          <div className="absolute inset-0 blur-md opacity-40 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 inset-x-0 z-30 bg-gradient-to-r from-black/90 to-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl md:hidden">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Menu Button */}
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2">
            
            <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TrackStack
            </span>
          </Link>
          
          {/* Spacer for centering */}
          <div className="w-10"></div>
        </div>

        {/* Animated Bottom Border */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px]">
          <div className="h-full w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse" />
          <div className="absolute inset-0 blur-md opacity-40 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeSidebar}
        />
        
        {/* Sidebar */}
        <div className="absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-[#0b0b0c] to-[#1a1a1c] border-r border-white/10 shadow-2xl">
          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-white">Navigation</h2>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Info - Removed for cleaner design */}

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(item.to)
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-200 border border-indigo-400/30 shadow-lg'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="mt-8 pt-6 border-t border-white/10">
              {isAuthed ? (
                <button
                  onClick={handleLogoutClick}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-200 border border-rose-400/30 hover:from-rose-500/30 hover:to-pink-500/30 hover:shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🚪</span>
                    Logout
                  </span>
                </button>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={closeSidebar}
                    className="block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-blue-500/30 text-center"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>🔑</span>
                      Login
                    </span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeSidebar}
                    className="block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold hover:from-purple-600 hover:to-blue-700 text-center shadow-lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>✨</span>
                      Get Started
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

