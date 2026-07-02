import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  Trash2, 
  Eye, 
  FileText, 
  AlertTriangle,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnalysisHistory = () => {
  const { refreshStats } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All'); // 'All', 'High', 'Medium', 'Low'

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/history');
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching analysis history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record from your history?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/history/${id}`);
      if (response.data.success) {
        setHistory(history.filter(item => item._id !== id));
        refreshStats();
      }
    } catch (err) {
      console.error('Error deleting analysis record:', err);
      alert('Failed to delete history record.');
    }
  };

  const getRiskBadge = (score) => {
    if (score >= 71) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>High ({score})</span>
        </span>
      );
    } else if (score >= 31) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Medium ({score})</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Low ({score})</span>
        </span>
      );
    }
  };

  // Filter and Search logic
  const filteredHistory = history.filter((item) => {
    const fileName = item.documentId?.fileName || 'Deleted Document';
    const matchesSearch = fileName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (riskFilter === 'All') return matchesSearch;
    if (riskFilter === 'High') return matchesSearch && item.riskScore >= 71;
    if (riskFilter === 'Medium') return matchesSearch && item.riskScore >= 31 && item.riskScore <= 70;
    if (riskFilter === 'Low') return matchesSearch && item.riskScore <= 30;

    return matchesSearch;
  });

  // Date Formatter
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-12 px-6 sm:px-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Analysis History</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Search, filter, and review all previous AI legal audits.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by document name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-2xl text-sm transition-all outline-none"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Risk Level:</span>
            <div className="relative">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 focus:border-primary-500 rounded-2xl text-sm transition-all outline-none font-medium cursor-pointer"
              >
                <option value="All">All Severity Levels</option>
                <option value="High">High Risk Only</option>
                <option value="Medium">Medium Risk Only</option>
                <option value="Low">Low Risk Only</option>
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 pointer-events-none">
                <ChevronDown size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* History Table Container */}
        <div className="bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/60 dark:border-slate-850 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Document Name</th>
                  <th className="px-6 py-4">Audit Date</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm font-medium">Loading history records...</p>
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-slate-400 dark:text-slate-500">
                      <FileText size={40} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-bold">No matching analysis reports found</p>
                      <p className="text-xs mt-1">Try adapting your search keyword or uploading a new file.</p>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => (
                    <tr 
                      key={item._id}
                      onClick={() => navigate(`/analyze/${item._id}`)}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors cursor-pointer"
                    >
                      {/* Name */}
                      <td className="px-6 py-4.5 min-w-[250px]">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center flex-shrink-0">
                            <FileText size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-950 dark:text-white truncate max-w-xs sm:max-w-sm lg:max-w-md">
                              {item.documentId?.fileName || 'Deleted Document'}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-semibold">
                              {item.documentId?.fileType.split('/')[1]?.toUpperCase() || 'RAW TEXT'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4.5 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Risk Score */}
                      <td className="px-6 py-4.5">
                        {getRiskBadge(item.riskScore)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center space-x-1 text-xs text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-0.5 rounded-lg border border-emerald-500/10">
                          Completed
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/analyze/${item._id}`)}
                            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-colors"
                            title="View Analysis Report"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(item._id, e)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-505/10 dark:hover:bg-rose-500/20 text-rose-500 transition-colors"
                            title="Delete Report"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AnalysisHistory;
