import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  ShieldAlert, 
  Calendar, 
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCheck,
  TrendingUp,
  Activity,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, stats, refreshStats } = useAuth();
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    refreshStats();
    
    const fetchRecentDocs = async () => {
      try {
        setLoadingDocs(true);
        const response = await axios.get('/api/documents');
        if (response.data.success) {
          setRecentDocs(response.data.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching recent documents:', err);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchRecentDocs();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDocClick = async (docId) => {
    try {
      const response = await axios.post('/api/analyze', { documentId: docId });
      if (response.data.success) {
        navigate(`/analyze/${response.data.data._id}`);
      }
    } catch (err) {
      console.error('Error running/retrieving analysis:', err);
      navigate('/history');
    }
  };

  // SVG Chart points
  const chartPoints = [
    { label: 'W1', value: 3 },
    { label: 'W2', value: 7 },
    { label: 'W3', value: 5 },
    { label: 'W4', value: 12 },
    { label: 'W5', value: 9 },
    { label: 'W6', value: 15 },
    { label: 'W7', value: stats?.totalDocuments || 18 }
  ];

  const chartWidth = 500;
  const chartHeight = 110;
  const paddingX = 40;
  const paddingY = 15;

  const maxVal = Math.max(...chartPoints.map(p => p.value), 10);
  const stepX = (chartWidth - paddingX * 2) / (chartPoints.length - 1);

  const points = chartPoints.map((p, idx) => {
    const x = paddingX + idx * stepX;
    const y = chartHeight - paddingY - (p.value / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, label: p.label, value: p.value };
  });

  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Main viewport workspace */}
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Welcome and banner controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 dark:border-slate-850 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Holographic Console</span>
              <span className="text-[10px] font-mono tracking-widest font-black text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/20">
                v1.0.4-ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Welcome back, {user?.name || 'Authorized Auditor'}. Review workspace parameters below.
            </p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-900 dark:bg-primary-500 dark:hover:bg-primary-600 border border-slate-800 dark:border-primary-500/20 text-white font-mono font-bold py-2.5 px-4.5 rounded-xl text-xs tracking-wider transition-all"
          >
            <UploadCloud size={14} />
            <span>DEPLOY SCANNER</span>
          </button>
        </div>

        {/* Tactical Radial HUD Core & Nodes grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-850 p-6 sm:p-8 rounded-2xl shadow-sm dark:neon-card">
          
          {/* Node 1: Left statistics block */}
          <div className="md:col-span-1.5 flex flex-col space-y-6 font-mono">
            {/* Total doc node */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">LOC_DOCS_TOTAL</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
                  {stats?.totalDocuments ?? 0}
                </span>
                <span className="text-[10px] text-slate-500">records</span>
              </div>
            </div>
            {/* Analyzed node */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">LOC_DOCS_AUDITED</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-primary-500 dark:text-primary-400 leading-none">
                  {stats?.documentsAnalyzed ?? 0}
                </span>
                <span className="text-[10px] text-emerald-500 uppercase font-black tracking-wider">completed</span>
              </div>
            </div>
          </div>

          {/* Central Pulsing Radar core */}
          <div className="md:col-span-2 flex flex-col items-center justify-center relative py-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              
              {/* Outer concentric scanning wave */}
              <div className="absolute inset-0 rounded-full border border-dashed border-primary-500/30 animate-scan-slow"></div>
              {/* Inner scanning wave */}
              <div className="absolute inset-4 rounded-full border border-indigo-500/20 animate-orbital-pulse"></div>
              {/* Core ring */}
              <div className="w-20 h-20 rounded-full bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center text-primary-400 shadow-glow-primary relative z-10">
                <Cpu size={20} className="animate-pulse" />
                <span className="text-[8px] font-mono font-extrabold mt-1 text-slate-400 tracking-wider">HUD CORE</span>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-400 mt-4 uppercase tracking-widest">Workspace diagnostics scan active</span>
          </div>

          {/* Node 2: Right statistics block */}
          <div className="md:col-span-1.5 flex flex-col space-y-6 font-mono text-left md:text-right">
            {/* Risk alerts node */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">LOC_RISK_FLAGGED</span>
              <div className="flex items-baseline md:justify-end space-x-2">
                <span className="text-3xl font-extrabold text-rose-500 leading-none">
                  {stats?.riskAlertsFound ?? 0}
                </span>
                <span className="text-[10px] text-rose-500/80 uppercase font-bold">flags</span>
              </div>
            </div>
            {/* Last upload node */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">LOC_LAST_SYNC_DATE</span>
              <div className="flex items-baseline md:justify-end space-x-2">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                  {stats?.lastUploadDate ? formatDate(stats.lastUploadDate) : 'NONE'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Spline Chart Widget */}
        <div className="bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm dark:neon-card flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp size={14} className="text-accent-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Upload Vector Activity</h3>
            </div>
            <span className="text-[8px] font-mono font-bold bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded border border-primary-500/20">
              LOGS RESOLVED
            </span>
          </div>

          {/* SVG Graph spline */}
          <div className="w-full h-24 flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="hudChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#hudChartGrad)" />
              <path d={linePath} fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
              {points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  className="fill-white dark:fill-cardDark stroke-primary-500 stroke-2 hover:r-5 cursor-pointer transition-all"
                />
              ))}
            </svg>
          </div>

          {/* Labels */}
          <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono font-bold px-6 mt-1 border-t border-slate-100 dark:border-slate-850 pt-2.5">
            {chartPoints.map((p, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span>{p.label}</span>
                <span className="text-slate-500 font-medium mt-0.5">({p.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widescreen Audit Logs Feed */}
        <div className="bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-850 rounded-2xl shadow-sm dark:neon-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-850 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Activity size={14} className="text-primary-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Audited Documents Feed</h3>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center space-x-1 font-mono uppercase tracking-wide text-[10px]"
            >
              <span>View History</span>
              <ArrowRight size={10} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {loadingDocs ? (
              <div className="p-8 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-[10px] font-mono uppercase font-bold tracking-wider">Syncing workspace logs...</p>
              </div>
            ) : recentDocs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                <FileText size={28} className="mx-auto mb-3 opacity-30" />
                <p className="text-xs font-bold font-mono">FEED EMPTY</p>
                <p className="text-[10px] mt-0.5">Deploy a contract to generate metrics.</p>
              </div>
            ) : (
              recentDocs.map((doc) => (
                <div 
                  key={doc._id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 flex items-center justify-center flex-shrink-0">
                      <FileText size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate pr-4">{doc.fileName}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-450 mt-1 font-mono tracking-tight font-semibold">
                        <span>{formatBytes(doc.fileSize)}</span>
                        <span>•</span>
                        <span>{doc.fileType.split('/')[1]?.toUpperCase() || 'PDF'}</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDocClick(doc._id)}
                    className="mt-3 sm:mt-0 px-4 py-2 bg-slate-50 hover:bg-primary-500 hover:text-white dark:bg-slate-800 dark:hover:bg-primary-500 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all self-start sm:self-center font-mono uppercase text-[10px]"
                  >
                    View Brief
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
