import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Scale,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Document', path: '/upload', icon: UploadCloud },
    { name: 'Analysis History', path: '/history', icon: History },
    { name: 'User Profile', path: '/profile', icon: User },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-400 border-r border-slate-800 p-4">
      {/* Brand logo */}
      <div className="flex items-center space-x-2 pb-8 pt-2 px-2 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
          <Scale size={20} className="stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">LexiGuard.ai</h1>
          <span className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Legal Workspace</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 mt-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/10'
                    : 'hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile & Actions */}
      <div className="pt-4 border-t border-slate-800 space-y-4">
        {/* Theme and Logout toggles */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition-all"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center space-x-3 bg-slate-800/40 p-3 rounded-xl border border-slate-850">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-45 bg-slate-900 border-b border-slate-850 h-16 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
            <Scale size={16} />
          </div>
          <span className="text-sm font-bold text-white">LexiGuard.ai</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar overlay drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative w-72 max-w-xs h-full z-50">
            <div className="absolute top-4 right-[-45px] text-white">
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-slate-800">
                <X size={20} />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen w-64 z-30">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
