import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  FileText, 
  Lock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { user, stats, refreshStats, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      setStatus('error');
      setMessage('Name field cannot be left blank.');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      // Build payload dynamically
      const payload = { name: formData.name };
      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await axios.put('/api/auth/profile', payload);

      if (response.data.success) {
        setStatus('success');
        setMessage('Your profile has been updated successfully.');
        
        // Sync context state
        setUser(response.data.user);
        
        // Clear password fields
        setFormData({
          name: response.data.user.name,
          password: '',
          confirmPassword: '',
        });

        // Sync statistics
        refreshStats();
      }
    } catch (err) {
      console.error('Profile update submit error:', err);
      setStatus('error');
      setMessage(err.response?.data?.message || 'Server error updating profile settings.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Loading...';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-12 px-6 sm:px-8 space-y-6 overflow-y-auto max-w-5xl mx-auto w-full">
        
        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Account Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage your personal credentials and monitor document metrics.
          </p>
        </div>

        {/* Profile Card & Update Form layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Metadata Card (Read Only Summary) */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col items-center text-center">
              
              {/* Profile Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-inner uppercase mb-4">
                {user?.name.charAt(0) || 'U'}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name || 'Loading...'}</h3>
              <p className="text-xs text-slate-400 font-semibold">{user?.email || 'Loading...'}</p>

              <hr className="w-full border-slate-200 dark:border-slate-800 my-5" />

              {/* Stats details */}
              <div className="w-full space-y-3.5 text-left text-xs font-semibold text-slate-500">
                <div className="flex items-center space-x-2.5">
                  <Calendar size={15} className="text-slate-400" />
                  <span>Joined {formatDate(user?.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <FileText size={15} className="text-slate-400" />
                  <span>Analyzed {stats?.documentsAnalyzed ?? 0} Documents</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Modify Details</h3>

              {/* Alert Status Banner */}
              {status === 'success' && (
                <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-xs font-semibold mb-6">
                  <CheckCircle size={16} />
                  <span>{message}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-xs font-semibold mb-6">
                  <AlertCircle size={16} />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 pl-1">
                    Display Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <User size={15} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-2xl text-sm transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Email (Disabled/Locked) */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 pl-1">
                    Email Address (Account Identifier)
                  </label>
                  <div className="relative opacity-60">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <Mail size={15} />
                    </span>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Password field group heading */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mb-4">Reset Password (Optional)</h4>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 pl-1">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <Lock size={15} />
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-2xl text-sm transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 pl-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <Lock size={15} />
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-2xl text-sm transition-all outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating Profile...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default UserProfile;
