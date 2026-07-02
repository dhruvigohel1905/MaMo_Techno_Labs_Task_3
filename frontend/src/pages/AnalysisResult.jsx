import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckSquare, 
  Download, 
  MessageSquare,
  X,
  Send,
  Loader2,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Eye,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToPDF, exportToDOCX } from '../utils/exportHelpers';

const AnalysisResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const documentContainerRef = useRef(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClause, setSelectedClause] = useState(null);
  
  // Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Hello! I am your AI Contract Agent. Ask me to verify liability caps, termination clauses, or payment terms." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef(null);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/analyze/${id}`);
      if (response.data.success) {
        setAnalysis(response.data.data);
        if (response.data.data.clauses && response.data.data.clauses.length > 0) {
          setSelectedClause(response.data.data.clauses[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching analysis details:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  // Click-to-focus Scroll Synchronization
  useEffect(() => {
    if (selectedClause) {
      const timer = setTimeout(() => {
        const el = document.getElementById('highlighted-covenant-node');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedClause]);

  // Scroll chat bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Checklist checkbox save
  const handleChecklistToggle = async (index) => {
    if (!analysis) return;

    const updatedActionItems = [...analysis.actionItems];
    updatedActionItems[index].checked = !updatedActionItems[index].checked;

    setAnalysis({
      ...analysis,
      actionItems: updatedActionItems
    });

    try {
      await axios.put(`/api/analyze/${id}/action-items`, {
        actionItems: updatedActionItems
      });
    } catch (err) {
      console.error('Failed to sync action items state with server:', err);
    }
  };

  // Submit Chat QA
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const query = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: query }]);
    setChatLoading(true);

    try {
      const response = await axios.post(`/api/analyze/${id}/chat`, { question: query });
      if (response.data.success) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: response.data.answer }]);
      }
    } catch (err) {
      console.error('QA Chat error:', err);
      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Error retrieving answer. Please check your OpenAI API key or connection.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Helper to dynamically render raw text and wrap selected snippet in highlights
  const renderDocumentWithHighlights = (rawText, selectedSnippet) => {
    if (!rawText) return null;
    if (!selectedSnippet || selectedSnippet.trim() === '') {
      return <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-400 font-serif leading-relaxed">{rawText}</p>;
    }

    // Strip outer quotes from AI response if present
    const cleanSnippet = selectedSnippet.trim().replace(/^"(.*)"$/, '$1');
    
    // Find index in raw text
    const index = rawText.toLowerCase().indexOf(cleanSnippet.toLowerCase());
    if (index === -1) {
      // Fallback
      return <p className="whitespace-pre-wrap text-sm text-slate-750 dark:text-slate-400 font-serif leading-relaxed">{rawText}</p>;
    }

    const before = rawText.substring(0, index);
    const match = rawText.substring(index, index + cleanSnippet.length);
    const after = rawText.substring(index + cleanSnippet.length);

    return (
      <p className="whitespace-pre-wrap text-xs sm:text-sm text-slate-650 dark:text-slate-400 font-serif leading-relaxed">
        {before}
        <span 
          id="highlighted-covenant-node" 
          className="highlight-active px-2 py-0.5 rounded text-white bg-primary-500 font-sans shadow-glow-primary inline"
        >
          {match}
        </span>
        {after}
      </p>
    );
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgLight dark:bg-bgDark text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 pt-16">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-550 dark:text-slate-450 font-semibold text-xs uppercase tracking-wider">Loading workstation...</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const score = analysis.riskScore || 0;
  const docInfo = analysis.documentId || { fileName: 'Unknown File', fileType: 'application/pdf', fileSize: 0, rawText: '' };

  let scoreColor = 'stroke-emerald-500 text-emerald-500';
  let badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  let riskLabel = 'Low Risk';

  if (score >= 71) {
    scoreColor = 'stroke-rose-500 text-rose-500';
    badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    riskLabel = 'High Risk';
  } else if (score >= 31) {
    scoreColor = 'stroke-amber-500 text-amber-500';
    badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    riskLabel = 'Medium Risk';
  }

  const strokeRadius = 40;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = strokeCircumference - (score / 100) * strokeCircumference;

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-slate-850 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Main Content Pane */}
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 space-y-6 max-w-[1600px] mx-auto w-full flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
        
        {/* Workspace Top Details Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 dark:border-slate-850 pb-4 flex-shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-outfit font-extrabold text-slate-900 dark:text-white truncate">
              {docInfo.fileName}
            </h2>
            <p className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase mt-1">
              FILE SIZE: {formatBytes(docInfo.fileSize)} • PARSED OK
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportToPDF(analysis, docInfo.fileName)}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200/50 dark:border-slate-850/60 text-slate-700 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs transition-all font-mono"
            >
              <Download size={13} />
              <span>PDF</span>
            </button>
            <button
              onClick={() => exportToDOCX(analysis, docInfo.fileName)}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200/50 dark:border-slate-850/60 text-slate-700 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs transition-all font-mono"
            >
              <Download size={13} />
              <span>DOCX</span>
            </button>
          </div>
        </div>

        {/* Triple-Pane Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch flex-1 min-h-0 overflow-hidden pb-4">
          
          {/* Column 1 (20%): Clause Index Directory */}
          <div className="lg:col-span-2 flex flex-col bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-850 rounded-2xl shadow-sm dark:neon-card overflow-hidden">
            <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-850 flex items-center space-x-2">
              <Activity size={14} className="text-primary-500" />
              <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest font-mono">Clauses Directory</span>
            </div>

            {/* Scroll list */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
              {analysis.clauses.map((clause, idx) => {
                const isSelected = selectedClause?.type === clause.type;
                let severityDot = 'bg-emerald-500';
                if (clause.riskLevel === 'High') severityDot = 'bg-rose-500 shadow-rose-500/30';
                else if (clause.riskLevel === 'Medium') severityDot = 'bg-amber-500 shadow-amber-500/30';

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedClause(clause)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col space-y-1 ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-500/5 shadow-sm' 
                        : 'border-slate-100 dark:border-slate-850/60 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${severityDot}`}></span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{clause.type}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono tracking-wider pl-4 uppercase font-semibold">
                      RISK: {clause.riskLevel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2 (50%): Source Document parchment */}
          <div className="lg:col-span-5 flex flex-col bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-850 rounded-2xl shadow-sm dark:neon-card overflow-hidden">
            <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText size={15} className="text-accent-500" />
                <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Covenant Document Viewer</h3>
              </div>
              {selectedClause && (
                <span className="text-[9px] bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2.5 py-0.5 rounded font-mono font-bold">
                  FOCUS: {selectedClause.type.split(' ')[0]}
                </span>
              )}
            </div>

            {/* Scroll body */}
            <div 
              ref={documentContainerRef}
              className="flex-1 p-6 overflow-y-auto bg-slate-50/30 dark:bg-slate-950/40 select-text"
            >
              {renderDocumentWithHighlights(docInfo.rawText, selectedClause?.snippet)}
            </div>
          </div>

          {/* Column 3 (30%): Stacked Info HUD */}
          <div className="lg:col-span-3 flex flex-col space-y-4 min-h-0 overflow-y-auto pr-1">
            
            {/* Summary & Metrics */}
            <div className="bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-850 p-4.5 rounded-2xl shadow-sm dark:neon-card space-y-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={16} className="text-primary-500" />
                  <span className="text-[10px] font-bold uppercase text-slate-450 dark:text-slate-500 tracking-wider font-mono">Executive Summary</span>
                </div>
                <div className={`text-[10px] font-bold ${badgeColor} py-0.5 px-2.5 rounded-md border`}>
                  {riskLabel} ({score})
                </div>
              </div>
              <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                {analysis.summary}
              </p>
            </div>

            {/* Clause Analysis Card Inspector (Detail Box showing selected item) */}
            {selectedClause && (
              <div className="bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-850 p-4.5 rounded-2xl shadow-sm dark:neon-card space-y-3.5 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest font-mono">Covenant Inspector</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    selectedClause.riskLevel === 'High' 
                      ? 'text-rose-500 bg-rose-500/10' 
                      : selectedClause.riskLevel === 'Medium'
                      ? 'text-amber-500 bg-amber-500/10'
                      : 'text-emerald-500 bg-emerald-500/10'
                  }`}>
                    {selectedClause.riskLevel} Risk
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{selectedClause.type}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
                  {selectedClause.description}
                </p>
              </div>
            )}

            {/* Action checklist items */}
            <div className="bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-850 p-4.5 rounded-2xl shadow-sm dark:neon-card space-y-3 flex-shrink-0">
              <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest font-mono block">Action Checklist</span>
              <div className="space-y-2">
                {analysis.actionItems.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleChecklistToggle(idx)}
                    className={`p-2.5 border rounded-xl flex items-center space-x-2.5 cursor-pointer transition-colors text-[10px] font-semibold ${
                      item.checked 
                        ? 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-500' 
                        : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-900/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}}
                      className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 pointer-events-none"
                    />
                    <span className={item.checked ? 'line-through opacity-70' : 'text-slate-700 dark:text-slate-350'}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Advisor Chat (Built in) */}
            <div className="bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-850 rounded-2xl shadow-sm dark:neon-card flex-1 min-h-[220px] flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-1.5">
                  <MessageSquare size={13} className="text-primary-500" />
                  <span className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Chat Copilot</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              {/* Chat bubbles */}
              <div className="flex-grow p-3 overflow-y-auto space-y-3 select-text max-h-[160px]">
                {chatMessages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-2.5 rounded-xl text-[10px] max-w-[85%] leading-relaxed ${
                        isUser 
                          ? 'bg-primary-500 text-white font-semibold rounded-tr-none' 
                          : 'bg-slate-50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-350 border border-slate-100 dark:border-slate-850 rounded-tl-none font-medium'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/30 text-slate-400 border border-slate-100 dark:border-slate-850 rounded-tl-none flex items-center space-x-2 text-[10px]">
                      <Loader2 size={11} className="animate-spin text-primary-500" />
                      <span>Reviewing text...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef}></div>
              </div>

              {/* Form Input footer */}
              <form onSubmit={handleSendChat} className="p-2.5 border-t border-slate-100 dark:border-slate-850 flex-shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask AI Copilot..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-xl text-[10px] outline-none focus:border-primary-500 transition-all font-semibold"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || chatLoading}
                    className="absolute right-1.5 top-1.5 p-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
                  >
                    <Send size={10} />
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default AnalysisResult;
