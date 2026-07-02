import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ShieldCheck, 
  Clock, 
  Layers, 
  AlertTriangle, 
  Download, 
  CheckCircle,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Zap,
  Globe,
  CornerDownLeft,
  ChevronRight,
  Terminal
} from 'lucide-react';

const LandingPage = () => {
  // Live demo states for the Hero Inspector
  const [hoveredTerm, setHoveredTerm] = useState(null);
  
  // Interactive search bar simulator state
  const [typedQuery, setTypedQuery] = useState('');
  const sampleQueries = [
    'Scan indemnification liability...',
    'Extract termination notice deadline...',
    'Is there a unilateral non-compete?',
    'Analyze payment late fees terms...'
  ];
  
  useEffect(() => {
    let queryIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
      const currentQuery = sampleQueries[queryIndex];
      
      if (isDeleting) {
        setTypedQuery(currentQuery.substring(0, charIndex - 1));
        charIndex--;
        typingSpeed = 50;
      } else {
        setTypedQuery(currentQuery.substring(0, charIndex + 1));
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentQuery.length) {
        isDeleting = true;
        typingSpeed = 2000; // wait before delete
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        queryIndex = (queryIndex + 1) % sampleQueries.length;
        typingSpeed = 500; // wait before next query
      }

      setTimeout(typeEffect, typingSpeed);
    };

    const initialTimeout = setTimeout(typeEffect, 1000);
    return () => clearTimeout(initialTimeout);
  }, []);

  const bentoItems = [
    {
      title: 'Holographic Timelines',
      description: 'Find auto-renewals, expiration terms, and delivery deadlines automatically.',
      icon: Clock,
      gridSpan: 'md:col-span-2',
      customNode: (
        <div className="space-y-2 mt-4 select-none">
          <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-900 text-xs font-mono">
            <span className="text-primary-400">June 1, 2026</span>
            <span className="text-slate-400">Effective Date</span>
          </div>
          <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-900 text-xs font-mono">
            <span className="text-rose-400">May 1, 2027</span>
            <span className="text-slate-400">Renewal Notice Deadline</span>
          </div>
        </div>
      )
    },
    {
      title: 'Risk Profile Dials',
      description: 'Audit risk levels with our calculated score gauge.',
      icon: AlertTriangle,
      gridSpan: 'md:col-span-1',
      customNode: (
        <div className="flex justify-center items-center mt-3 select-none">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle className="stroke-slate-900" strokeWidth="12" fill="transparent" r="40" cx="50" cy="50" />
              <circle className="stroke-rose-500 shadow-rose-500/20" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="55" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" />
            </svg>
            <span className="absolute text-sm font-mono font-bold text-white">78%</span>
          </div>
        </div>
      )
    },
    {
      title: 'Compliance Checklist',
      description: 'Automate CCPA, GDPR, and mutual confidentiality checks.',
      icon: ShieldCheck,
      gridSpan: 'md:col-span-1',
      customNode: (
        <div className="space-y-2.5 mt-4 select-none text-[10px] font-semibold">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle size={12} />
            <span>GDPR Scope Covenants</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle size={12} />
            <span>Bilateral NDA parameters</span>
          </div>
        </div>
      )
    },
    {
      title: 'AI Copilot QA Chat',
      description: 'Submit complex queries and inspect parsed sections in real-time.',
      icon: MessageSquare,
      gridSpan: 'md:col-span-2',
      customNode: (
        <div className="space-y-2 mt-4 select-none text-[10px] font-mono leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-900">
          <p className="text-primary-400">Q: What are the termination terms?</p>
          <p className="text-slate-400 mt-1">A: Either party may cancel with 30 days prior written notice, per Section 14.2.</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 transition-colors duration-200 selection:bg-primary-500/30 overflow-hidden grid-bg">
      
      {/* Hero Section */}
      <section className="relative pt-36 pb-24 max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Halo background */}
        <div className="absolute top-10 left-1/2 translate-x-[-50%] w-[500px] h-[300px] bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-full filter blur-[120px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Geometric Text & Interactive Prompt */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-xl text-xs font-mono uppercase tracking-widest">
              <Zap size={12} className="text-accent-500 fill-accent-500 animate-pulse" />
              <span>COGNITIVE CONTRACT SCANNER</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-outfit font-extrabold tracking-tight leading-[1.05] text-white">
              Analyze Legal Documents in <br />
              <span className="bg-gradient-to-r from-primary-500 via-indigo-400 to-accent-500 bg-clip-text text-transparent">
                Seconds
              </span> with AI
            </h1>

            <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed max-w-xl">
              Drop agreements, NDAs, or leases into the workspace. Audit hidden liabilities, obligation dates, and check compliance parameters dynamically.
            </p>

            {/* Interactive Simulated Input Prompt bar */}
            <div className="p-1 bg-[#0B0F19]/90 border border-slate-800 rounded-2xl flex items-center shadow-lg max-w-md relative group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-primary-500 pl-1">
                <Terminal size={14} className="animate-pulse" />
              </div>
              <div className="flex-1 pl-3 text-xs font-mono text-slate-400 select-none">
                <span>{typedQuery}</span>
                <span className="w-1 h-3.5 bg-primary-500 ml-1 inline-block animate-pulse"></span>
              </div>
              <Link 
                to="/register"
                className="p-2.5 bg-primary-500 hover:bg-primary-600 rounded-xl text-white shadow-md shadow-primary-500/20 transition-all active:translate-y-[1px]"
              >
                <CornerDownLeft size={12} />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-primary-500/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px] text-xs uppercase tracking-wider"
              >
                Deploy Workspace
              </Link>
              <a
                href="#features"
                className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-350 font-bold py-3.5 px-6 rounded-2xl text-xs transition-all uppercase tracking-wider"
              >
                Explore Bento grid
              </a>
            </div>
          </div>

          {/* Right Column: Live Hover Contract Inspector Widget */}
          <div className="relative">
            <div className="absolute inset-[-10px] bg-primary-500/5 rounded-3xl filter blur-xl animate-soft-pulse pointer-events-none"></div>

            <div className="relative rounded-3xl border border-slate-850 bg-[#0B0F19]/90 p-5 shadow-2xl space-y-4">
              
              {/* Widget Header */}
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] text-slate-500 font-mono pl-1.5 font-bold">interactive_brief_inspector.pdf</span>
                </div>
                <span className="text-[8px] font-mono font-bold text-accent-500 bg-accent-500/10 border border-accent-500/20 px-2 py-0.5 rounded">
                  DEMO PROTOCOL
                </span>
              </div>

              {/* Mock contract text with hoverable terms */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-900 space-y-4 min-h-[170px] relative select-none">
                <p className="text-[11px] leading-relaxed text-slate-450">
                  This Agreement is made and entered into as of the{' '}
                  <span 
                    onMouseEnter={() => setHoveredTerm('date')}
                    onMouseLeave={() => setHoveredTerm(null)}
                    className="landing-highlight text-emerald-400 bg-emerald-500/10 border-b border-emerald-400 font-bold"
                  >
                    1st day of June, 2026
                  </span>{' '}
                  by and between LexiCorp LLC and Sterling Devs.
                </p>

                <p className="text-[11px] leading-relaxed text-slate-450">
                  12. INDEMNIFICATION covenants: The{' '}
                  <span 
                    onMouseEnter={() => setHoveredTerm('indemnity')}
                    onMouseLeave={() => setHoveredTerm(null)}
                    className="landing-highlight text-rose-400 bg-rose-500/10 border-b border-rose-400 font-bold"
                  >
                    Receiving Party agrees to defend, indemnify and hold harmless the Disclosing Party
                  </span>{' '}
                  from any liabilities, costs, damages, or lawsuit expenses arising post-execution.
                </p>

                <p className="text-[11px] leading-relaxed text-slate-450">
                  14. RESOLUTION. Disputes shall be settled via binding arbitration under the{' '}
                  <span 
                    onMouseEnter={() => setHoveredTerm('arbitration')}
                    onMouseLeave={() => setHoveredTerm(null)}
                    className="landing-highlight text-cyan-400 bg-cyan-500/10 border-b border-cyan-400 font-bold"
                  >
                    rules of the American Arbitration Association (AAA)
                  </span>.
                </p>

                {/* Floating tooltips */}
                <AnimatePresence>
                  {hoveredTerm && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-4 right-4 bottom-4 p-4 rounded-xl border bg-slate-900 shadow-xl z-20 space-y-1.5 font-mono text-[10px] text-left"
                      style={{
                        borderColor: hoveredTerm === 'indemnity' ? '#EF4444' : hoveredTerm === 'date' ? '#10B981' : '#06B6D4'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold uppercase tracking-widest text-slate-500">AI AUDIT NOTE</span>
                        <span className={`font-black uppercase tracking-wider ${
                          hoveredTerm === 'indemnity' ? 'text-rose-500' : hoveredTerm === 'date' ? 'text-emerald-500' : 'text-cyan-500'
                        }`}>
                          {hoveredTerm === 'indemnity' ? '🚨 HIGH RISK' : hoveredTerm === 'date' ? '📅 DATE EXTRACTED' : '✅ LOW RISK'}
                        </span>
                      </div>
                      <p className="text-slate-350 leading-relaxed font-semibold">
                        {hoveredTerm === 'indemnity' 
                          ? 'Unilateral obligation shifts all contract liability from LexiCorp to your team. Recommendation: Request reciprocal covenants.'
                          : hoveredTerm === 'date'
                          ? 'Contract effective starting date. Auto-renewal notice window initiates 30 days prior to contract expiration.'
                          : 'AAA Arbitration rules are standard. No venue is explicitly defined, which might increase dispute costs. Defaulting state: NY.'
                        }
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Visual footer details */}
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                <Sparkles size={11} className="text-primary-500 animate-pulse" />
                <span>Hover over highlighted terms to run AI Audit scanner simulation.</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features Asymmetric Bento Grid */}
      <section id="features" className="py-24 bg-[#02050E]/80 border-t border-slate-900/60 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-3.5">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Smarter Contract Audits
            </h2>
            <p className="text-slate-400 font-semibold text-sm sm:text-base leading-relaxed">
              We replace tedious manual legal review loops with widescreen bento diagnostics tools.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {bentoItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-[#0B0F19]/40 border border-slate-850 hover:border-primary-500/50 shadow-glow-primary transition-all duration-300 flex flex-col justify-between min-h-[220px] ${item.gridSpan}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center">
                        <Icon size={16} className="stroke-[2.5]" />
                      </div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{item.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">{item.description}</p>
                  </div>
                  {item.customNode}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HUD SaaS Pricing tiers */}
      <section id="pricing" className="py-24 bg-[#030712] border-t border-slate-900/60">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Simple pricing, scaled for growth</h2>
            <p className="text-slate-400 font-semibold">Start auditing contracts for free, then upgrade as your workspace logs expand.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl bg-[#0B0F19]/20 border border-slate-850 flex flex-col justify-between hover:border-slate-800 transition-all font-mono">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">DEV_LICENSE</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="ml-1 text-xs text-slate-500">/ forever</span>
                </div>
                <p className="mt-4 text-[10px] text-slate-400 leading-relaxed font-semibold">
                  Test the parsing syntax. Audit up to 5 agreements per month.
                </p>
                <ul className="mt-8 space-y-2 text-[10px] font-bold text-slate-400">
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={12} className="text-emerald-500" />
                    <span>PDF, DOCX, TXT formats</span>
                  </li>
                  <li className="flex items-center space-x-2 text-slate-655 line-through">
                    <span>AI vector chat assistant</span>
                  </li>
                </ul>
              </div>
              <Link to="/register" className="mt-8 block w-full text-center py-3 px-4 rounded-xl text-[10px] font-bold border border-slate-800 text-slate-300 hover:bg-slate-900 transition-colors uppercase tracking-wider">
                GET DEV LICENSE
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl bg-[#0B0F19]/70 border-2 border-primary-500 flex flex-col justify-between shadow-glow-primary hover:scale-[1.01] transition-all font-mono relative">
              <span className="absolute top-0 right-1/2 translate-x-1/2 translate-y-[-50%] bg-primary-500 text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded">
                RECOMMENDED
              </span>
              <div>
                <span className="text-[9px] font-bold text-primary-400 uppercase tracking-widest">PRO_LICENSE</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$29</span>
                  <span className="ml-1 text-xs text-slate-400">/ month</span>
                </div>
                <p className="mt-4 text-[10px] text-slate-350 leading-relaxed font-semibold font-sans">
                  Designed for small businesses, legal departments, and operational advisors.
                </p>
                <ul className="mt-8 space-y-2 text-[10px] font-bold text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={12} className="text-emerald-500" />
                    <span>Unlimited contract audits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={12} className="text-emerald-500" />
                    <span>Live vector-store AI Chat (RAG)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={12} className="text-emerald-500" />
                    <span>Export reports as PDF & DOCX</span>
                  </li>
                </ul>
              </div>
              <Link to="/register" className="mt-8 block w-full text-center py-3.5 px-4 rounded-xl text-[10px] font-black bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 transition-all uppercase tracking-wider">
                DEPLOY PRO WORKSPACE
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-[#0B0F19]/20 border border-slate-850 flex flex-col justify-between hover:border-slate-800 transition-all font-mono">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">ENT_LICENSE</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$99</span>
                  <span className="ml-1 text-xs text-slate-500">/ month</span>
                </div>
                <p className="mt-4 text-[10px] text-slate-400 leading-relaxed font-semibold">
                  For corporate law departments requiring strict vector isolations.
                </p>
                <ul className="mt-8 space-y-2 text-[10px] font-bold text-slate-400">
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={12} className="text-emerald-500" />
                    <span>Everything in Pro license</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={12} className="text-emerald-500" />
                    <span>Custom AI prompt guidelines</span>
                  </li>
                </ul>
              </div>
              <a href="mailto:sales@lexiguard.ai" className="mt-8 block w-full text-center py-3 px-4 rounded-xl text-[10px] font-bold border border-slate-800 text-slate-300 hover:bg-slate-900 transition-colors uppercase tracking-wider">
                REQUEST ENT AUDIT
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* High-Tech CTA */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-indigo-700 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[600px] h-[600px] bg-white/5 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-outfit font-extrabold tracking-tight">Audit Legal Documents Smarter</h2>
          <p className="text-xs sm:text-sm text-primary-100 max-w-lg mx-auto leading-relaxed font-semibold">
            Deploy an instance on our cloud vector server. Audits execute instantly with TLS isolated encryption schemas.
          </p>
          <div className="pt-3">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-primary-600 font-bold px-6 py-4 rounded-2xl shadow-xl transition-all hover:translate-y-[-2px] text-xs uppercase tracking-wider font-mono"
            >
              <span>Initialize Node</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900/60 text-center text-[10px] font-mono tracking-wider font-bold">
        <p>© 2026 LEXIGUARD.AI CORE WORKSPACE. TLS SECURE DATA PACKETS • ZERO DATA RETENTION PROTOCOL.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
