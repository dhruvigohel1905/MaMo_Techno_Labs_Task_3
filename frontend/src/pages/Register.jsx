import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Check blank fields
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Match password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Socket connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden grid-bg select-none">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[500px] h-[300px] bg-primary-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-7 rounded-2xl bg-[#0B0F19]/90 border border-slate-850 shadow-2xl relative z-10 dark:neon-card font-mono text-xs"
      >
        {/* Card Header styling */}
        <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Scale size={16} />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white uppercase tracking-wider font-sans">LexiGuard Console</h1>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">REGISTER_INTERFACE</span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>

        {/* Error Notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2.5 bg-rose-500/10 border border-rose-500/25 p-3.5 rounded-xl text-[10px] font-bold text-rose-500 mb-5 uppercase tracking-wide"
          >
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>ERR: {error}</span>
          </motion.div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-widest mb-1.5 pl-1">
              INPUT_FULL_NAME
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <User size={14} />
              </span>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-850 focus:border-primary-500 rounded-xl text-slate-350 outline-none transition-all font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-widest mb-1.5 pl-1">
              INPUT_EMAIL_ADDR
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail size={14} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="you@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-850 focus:border-primary-500 rounded-xl text-slate-350 outline-none transition-all font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-widest mb-1.5 pl-1">
              INPUT_PASS_SECRET
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock size={14} />
              </span>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-850 focus:border-primary-500 rounded-xl text-slate-350 outline-none transition-all font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-widest mb-1.5 pl-1">
              CONFIRM_PASS_SECRET
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock size={14} />
              </span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-850 focus:border-primary-500 rounded-xl text-slate-350 outline-none transition-all font-semibold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center space-x-2 text-[10px] tracking-widest disabled:opacity-50 uppercase hover:translate-y-[-1px] active:translate-y-[1px]"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>CREATING_NODE...</span>
              </>
            ) : (
              <span>INITIALIZE_NODE</span>
            )}
          </button>
        </form>

        {/* Auth redirects */}
        <div className="mt-6 pt-4 border-t border-slate-850 text-center text-[10px] font-bold text-slate-550 flex items-center justify-between">
          <span>EXISTING_NODE_DETECTED?</span>
          <Link
            to="/login"
            className="text-primary-400 hover:underline hover:text-primary-300 transition-colors uppercase"
          >
            LOGIN_INTERFACE
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Register;
