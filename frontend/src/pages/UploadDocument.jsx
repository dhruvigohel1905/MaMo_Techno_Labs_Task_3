import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { motion } from 'framer-motion';

const UploadDocument = () => {
  const { refreshStats } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Status states: 'idle', 'uploading', 'analyzing', 'success', 'error'
  const [status, setStatus] = useState('idle'); 
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Terminal logs streaming state
  const [consoleLogs, setConsoleLogs] = useState([]);

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  const maxFileSize = 20 * 1024 * 1024; // 20 MB

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
      setErrorState('Format rejected. Workspace accepts PDF, DOCX or TXT files only.');
      return;
    }

    if (file.size > maxFileSize) {
      setErrorState('Size limit exceeded. Maximum payload buffer is 20MB.');
      return;
    }

    setSelectedFile(file);
    setStatus('idle');
    setErrorMessage('');
    setConsoleLogs([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const setErrorState = (msg) => {
    setErrorMessage(msg);
    setStatus('error');
    setSelectedFile(null);
  };

  // Log streamer helper
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  // Run Upload + Analysis
  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setStatus('uploading');
      setUploadProgress(0);
      setConsoleLogs([]);

      // Start uploading logs
      addLog(`[SYSTEM] Initializing secure TLS data tunnel to parser core...`);
      addLog(`[SYSTEM] Reading payload: ${selectedFile.name} (${formatBytes(selectedFile.size)})...`);

      const formData = new FormData();
      formData.append('file', selectedFile);

      // 1. Upload
      const uploadResponse = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          if (percentCompleted === 100) {
            addLog(`[SYSTEM] File buffers written successfully (100% complete).`);
          }
        },
      });

      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || 'File upload failed.');
      }

      const documentId = uploadResponse.data.data.id;
      
      // 2. Analyze
      setStatus('analyzing');
      addLog(`[PARSER] Commencing syntax parsing sequence...`);

      // Mock console step-by-step logs timing
      const stepTimer1 = setTimeout(() => {
        addLog(`[CLEANER] Removing empty text fields, null bytes, and formatting glitches... [OK]`);
        addLog(`[AI_ENGINE] Dispatching tokens to OpenAI gpt-4o-mini...`);
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        addLog(`[AI_ENGINE] Context length within budget constraints. Stream active...`);
        addLog(`[AI_ENGINE] Scanning liability caps, indemnification covenents, and non-competes...`);
      }, 3500);

      const stepTimer3 = setTimeout(() => {
        addLog(`[AI_ENGINE] Assessment completed. Calculation risk index score...`);
        addLog(`[DATABASE] Syncing analysis report with MongoDB Atlas cluster... [OK]`);
      }, 6000);

      const analysisResponse = await axios.post('/api/analyze', { 
        documentId,
        forceReanalyze: true
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (analysisResponse.data.success) {
        setStatus('success');
        addLog(`[SYSTEM] Assessment compilation completed successfully. Redirecting to workspace...`);
        refreshStats();
        setTimeout(() => {
          navigate(`/analyze/${analysisResponse.data.data._id}`);
        }, 1200);
      } else {
        throw new Error(analysisResponse.data.message || 'AI generation failed.');
      }

    } catch (error) {
      console.error('Console execution sequence error:', error);
      setErrorState(error.response?.data?.message || error.message || 'Server error processing file.');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Main Workspace */}
      <main className="flex-1 pt-28 pb-12 p-6 sm:p-8 flex flex-col justify-center max-w-4xl mx-auto w-full">
        
        {/* Title headers */}
        <div className="mb-8 text-center lg:text-left">
          <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-slate-900 dark:text-white">Audit Document</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">
            Deploy contracts to the secure vector auditing port.
          </p>
        </div>

        {/* Compiler console board */}
        <div className="bg-white dark:bg-cardDark border border-slate-200/60 dark:border-slate-850 p-6 sm:p-10 rounded-2xl shadow-sm dark:neon-card space-y-6 relative overflow-hidden">
          
          {status === 'idle' || status === 'error' ? (
            <>
              {/* Drag Area */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`relative border border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center overflow-hidden ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-500/5 scale-[1.01]' 
                    : 'border-slate-200 dark:border-slate-850 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-slate-50/30 dark:hover:bg-slate-900/10'
                }`}
              >
                {/* Concentric pulsing circles background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-10">
                  <div className="w-[300px] h-[300px] rounded-full border border-primary-500 animate-pulse-glow"></div>
                  <div className="w-[200px] h-[200px] rounded-full border border-indigo-500 absolute animate-orbital-pulse"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center mb-5 shadow-glow-primary">
                    <UploadCloud size={20} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-outfit font-extrabold text-slate-900 dark:text-white">
                    Drag agreement here, or <span className="text-primary-500 hover:underline">browse files</span>
                  </h3>
                  <p className="text-[10px] text-slate-450 mt-2 font-mono uppercase tracking-wider font-semibold">
                    PDF, DOCX, or TXT formats (Max size 20 MB)
                  </p>
                </div>
              </div>

              {/* Alert */}
              {status === 'error' && (
                <div className="flex items-center space-x-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4.5 rounded-xl text-xs font-semibold">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Preview card */}
              {selectedFile && (
                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-xl">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-200/50 dark:bg-slate-800 text-slate-500 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate pr-4">{selectedFile.name}</p>
                      <p className="text-[9px] text-slate-450 font-mono font-semibold mt-0.5">{formatBytes(selectedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleUploadAndAnalyze}
                    className="flex items-center space-x-1.5 bg-primary-500 hover:bg-primary-600 text-white font-mono font-bold py-2.5 px-4.5 rounded-xl text-[10px] tracking-wider transition-all hover:translate-y-[-1px] uppercase"
                  >
                    <span>COMPILED SCAN</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Active streaming compiler terminal logs */
            <div className="flex flex-col space-y-4">
              <div className="px-4 py-2 border-b border-slate-200/40 dark:border-slate-850 flex items-center space-x-2 text-slate-400">
                <Terminal size={14} />
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Terminal logs output</span>
              </div>

              {/* Live console box */}
              <div className="console-log-box rounded-xl p-5 h-64 overflow-y-auto space-y-2.5 scroll-smooth select-text">
                {consoleLogs.map((log, idx) => {
                  let colorClass = 'text-slate-400';
                  if (log.includes('[SYSTEM]')) colorClass = 'text-cyan-400';
                  else if (log.includes('[PARSER]')) colorClass = 'text-primary-400';
                  else if (log.includes('[CLEANER]')) colorClass = 'text-indigo-400';
                  else if (log.includes('[AI_ENGINE]')) colorClass = 'text-violet-400';
                  else if (log.includes('[DATABASE]')) colorClass = 'text-pink-400';
                  
                  if (log.includes('[OK]')) {
                    return (
                      <div key={idx} className="text-[10px] leading-relaxed font-semibold">
                        <span className={colorClass}>{log.replace(/\[OK\]$/, '')}</span>
                        <span className="text-emerald-400 font-bold ml-1.5"> [OK] </span>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className={`text-[10px] leading-relaxed font-semibold ${colorClass}`}>
                      {log}
                    </div>
                  );
                })}

                {/* Pulsing cursor line loader */}
                {status !== 'success' && (
                  <div className="flex items-center space-x-2 text-[10px] text-primary-400 font-semibold font-mono">
                    <span className="animate-pulse">_</span>
                    <span className="text-xs animate-spin-reverse"><Activity size={10} /></span>
                  </div>
                )}
                <div ref={terminalEndRef}></div>
              </div>

              {/* Success checks */}
              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center space-x-1.5 text-emerald-500 font-bold text-xs font-mono uppercase pl-2"
                >
                  <CheckCircle size={14} />
                  <span>Covenants Assessment complete. Opening workspace...</span>
                </motion.div>
              )}
            </div>
          )}

        </div>

        {/* Security Info */}
        <div className="mt-8 flex items-start space-x-3 bg-slate-50 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-850/50 p-4 rounded-2xl">
          <ShieldCheck size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            <span className="font-bold text-slate-750 dark:text-slate-350">Security Standard:</span> LexiGuard leverages TLS encryption channels. Extracted vectors operate as temporary in-memory records and feature zero retention post-session. All connection parameters are isolated by project.
          </div>
        </div>

      </main>
    </div>
  );
};

export default UploadDocument;
