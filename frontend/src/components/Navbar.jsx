import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Scale, LogOut, LayoutDashboard, UploadCloud, History, User } from 'lucide-react';

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isWorkspace = ['/dashboard', '/upload', '/history', '/profile'].some(path => location.pathname.startsWith(path)) || location.pathname.startsWith('/analyze');

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Scan', path: '/upload', icon: UploadCloud },
    { name: 'Audit Logs', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-bgDark/80 border-b border-slate-200/50 dark:border-slate-850/60 backdrop-blur-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
                <Scale size={18} className="stroke-[2.5]" />
              </div>
              <span className="text-lg font-outfit font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-primary-600 to-accent-500 dark:from-white dark:via-slate-200 dark:to-accent-400 bg-clip-text text-transparent">
                LexiGuard<span className="text-primary-500">.ai</span>
              </span>
            </Link>

            {/* Private Workspace Navigation links (Horizontal tabs) */}
            {token && isWorkspace && (
              <div className="hidden md:flex items-center space-x-1 bg-slate-100/50 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/40 dark:border-slate-850/50">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      <Icon size={13} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Public landing links */}
            {!isWorkspace && (
              <div className="hidden md:flex items-center space-x-6 text-xs font-bold tracking-wider uppercase text-slate-500">
                <button onClick={() => scrollToSection('features')} className="hover:text-primary-500 transition-colors">Features</button>
                <button onClick={() => scrollToSection('pricing')} className="hover:text-primary-500 transition-colors">Pricing</button>
                <button onClick={() => scrollToSection('testimonials')} className="hover:text-primary-500 transition-colors">Reviews</button>
              </div>
            )}
          </div>

          {/* User actions and controls */}
          <div className="flex items-center space-x-3.5">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200/50 dark:border-slate-850/60 text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Auth configurations */}
            {token ? (
              <div className="flex items-center space-x-3">
                {/* Mobile workspace drawer dropdown list trigger */}
                {isWorkspace && (
                  <div className="md:hidden flex items-center space-x-1.5">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      if (!isActive) return null;
                      return (
                        <span key={item.name} className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-primary-500/10 border border-primary-500/20 text-primary-400">
                          {item.name}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* User avatar displaying */}
                {user && (
                  <Link to="/profile" className="hidden sm:flex items-center space-x-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-850/50 px-3 py-1 rounded-xl group hover:border-primary-500/30 transition-all">
                    <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary-500 transition-colors">{user.name}</span>
                  </Link>
                )}

                {/* Log out */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-xs font-bold text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/10 px-3 py-2 rounded-xl transition-all"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3.5 text-xs font-bold">
                <Link to="/login" className="text-slate-650 hover:text-primary-500 dark:text-slate-350 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl shadow-md shadow-primary-500/15 hover:translate-y-[-1px] active:translate-y-[1px] transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Workspace Nav Items (Sub-menu banner on workspace routes) */}
      {token && isWorkspace && (
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-850/50 bg-white/95 dark:bg-bgDark/95 py-2.5 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center space-y-1 text-[9px] font-bold uppercase tracking-wider ${
                  isActive ? 'text-primary-500' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon size={14} />
                <span>{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
