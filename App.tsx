
import React, { useState, useEffect } from 'react';
import { FileUploader } from './components/FileUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { getRequiredDocs, TRANSLATIONS, LOAN_TIPS, ADVICE_TEXT } from './constants';
import { UploadedFile, AnalysisResult, Language, ApplicantType, EvaluationMode } from './types';
import { analyzeDocuments } from './services/geminiService';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('th');
  const [applicantType, setApplicantType] = useState<ApplicantType | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showLongWait, setShowLongWait] = useState(false);
  
  // Hybrid Mode States
  const [evaluationMode, setEvaluationMode] = useState<EvaluationMode>('manual');
  const [manualIncome, setManualIncome] = useState<string>('');
  const [manualDebt, setManualDebt] = useState<string>('');

  const t = TRANSLATIONS[lang];

  // Smart Loading Effect
  useEffect(() => {
    if (isAnalyzing) {
        setLoadingStep(0);
        setShowLongWait(false);
        // Slower intervals to match real API latency (15-20s)
        const intervals = [1000, 4000, 8000, 12000, 16000]; 
        const timers = intervals.map((time, index) => 
            setTimeout(() => setLoadingStep(index + 1), time)
        );
        
        // Show long wait message after 12 seconds
        const longWaitTimer = setTimeout(() => {
            setShowLongWait(true);
        }, 12000);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(longWaitTimer);
        };
    }
  }, [isAnalyzing]);

  const handleFilesAdded = (newFiles: UploadedFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleAnalyze = async () => {
    if (files.length === 0 || !applicantType) {
      setError(t.errorNoFile);
      return;
    }
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeDocuments(files, lang, applicantType);
      
      // Artificial delay to ensure user sees the "Matching" step if API is too fast
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      setAnalysisResult(result);
      
      // Trigger Confetti if score is high
      if (result.creditworthinessScore >= 80) {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      }
    } catch (err: any) {
      setError(err.message || t.errorGeneric);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setAnalysisResult(null);
    setError(null);
    setLoadingStep(0);
    setShowLongWait(false);
    setEvaluationMode('manual');
    setManualIncome('');
    setManualDebt('');
    setApplicantType(null);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'th' ? 'en' : 'th');
  };

  const getTypeLabel = (type: ApplicantType) => {
    switch (type) {
      case 'Salaried': return t.typeSalaried;
      case 'BusinessOwner': return t.typeBusinessOwner;
      case 'Freelance': return t.typeFreelance;
      case 'Farmer': return t.typeFarmer;
      case 'Investor': return t.typeInvestor;
      default: return '';
    }
  };

  // Quick Calc Logic
  const calculateDTI = () => {
    const income = parseFloat(manualIncome.replace(/,/g, ''));
    const debt = parseFloat(manualDebt.replace(/,/g, ''));
    if (isNaN(income) || income === 0) return 0;
    const dti = (debt / income) * 100;
    return Math.min(Math.max(dti, 0), 100);
  };

  const dtiValue = calculateDTI();
  
  const getDTIStatus = (dti: number) => {
      if(dti === 0 && !manualIncome) return 'neutral';
      
      // Strict Rules per user request
      if(dti <= 35) return 'good';     // Ideal
      if(dti <= 50) return 'fair';     // Acceptable
      return 'risk';                   // High Risk (> 50%)
  };
  
  const dtiStatus = getDTIStatus(dtiValue);
  const adviceText = applicantType === 'Salaried' 
    ? (dtiStatus === 'risk' ? ADVICE_TEXT[lang].risk : ADVICE_TEXT[lang].salaried)
    : ADVICE_TEXT[lang].risk;

  // MODERN PROGRESS BAR STEPPER (3 Steps now: Career -> Assess -> Result)
  const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="w-full max-w-md mx-auto mb-10">
        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2 px-1">
            <span className={currentStep >= 1 ? "text-indigo-600" : ""}>{t.step1}</span>
            <span className={currentStep >= 2 ? "text-indigo-600" : ""}>{t.step2}</span>
            <span className={currentStep >= 3 ? "text-indigo-600" : ""}>{t.step3}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
        </div>
    </div>
  );

  // KNOWLEDGE SECTION COMPONENT
  const KnowledgeSection = () => (
    <div className="mt-24 animate-fade-in-up">
        <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">{t.knowledgeTitle}</h2>
            <p className="text-slate-500 mt-2">{t.knowledgeDesc}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOAN_TIPS.map((tip, index) => (
                <div key={index} className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${index === 0 ? 'bg-gradient-to-br from-slate-900 to-indigo-900 text-white border-none shadow-xl shadow-indigo-200 md:col-span-2 lg:col-span-1' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-white/10 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                            {tip.icon === 'calculator' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>}
                            {tip.icon === 'piggy' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5c-1.5 0-2.8.6-3.5 1.3-1.9-1.3-4.2-1.3-6 0C8.8 5.6 7.5 5 6 5c-2.2 0-4 1.8-4 4 0 1.1.4 2 .9 2.8C2.4 12.3 2 13.1 2 14c0 2.2 1.8 4 4 4h12c2.2 0 4-1.8 4-4 0-.9-.4-1.7-.9-2.2.5-.8.9-1.7.9-2.8 0-2.2-1.8-4-4-4z"/><path d="M16 14v4"/><path d="M8 14v4"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/></svg>}
                            {tip.icon === 'statement' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                            {tip.icon === 'clock' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                            {tip.icon === 'debt' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                            {tip.icon === 'card' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
                            {tip.icon === 'docs' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>}
                        </div>
                        <h3 className={`font-bold ${index === 0 ? 'text-white' : 'text-slate-800'}`}>
                            {tip.title[lang]}
                        </h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${index === 0 ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {tip.content[lang]}
                    </p>
                    {tip.highlight && (
                        <div className="mt-4 inline-block px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-xs font-bold text-green-400">
                            {tip.highlight[lang]}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );

  // CURRENT STEP LOGIC (1-3 scale)
  const currentAppStep = analysisResult ? 3 : applicantType ? 2 : 1;

  if (analysisResult) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            <header className="sticky top-0 z-30 glass-panel border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200">
                            LV
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            {t.appTitle}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleLanguage} className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors uppercase tracking-wide">
                            {lang === 'th' ? 'TH | EN' : 'EN | TH'}
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-grow">
                <StepIndicator currentStep={3} />
                <AnalysisResults result={analysisResult} onReset={handleReset} lang={lang} />
            </main>
             <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4 text-indigo-400 font-bold">
                        <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center">L</div>
                        LoanVerify AI
                    </div>
                    <p className="text-sm max-w-xl mx-auto mb-8 text-slate-500">
                        {t.disclaimer}
                    </p>
                    <div className="flex justify-center gap-6 text-xs font-medium uppercase tracking-wider text-slate-600">
                        <span className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</span>
                        <span className="hover:text-indigo-400 cursor-pointer transition-colors">Contact</span>
                    </div>
                    <div className="mt-8 text-xs text-slate-700">
                        © 2024 LoanVerify AI. Powered by Google Gemini.
                    </div>
                </div>
            </footer>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col overflow-x-hidden relative">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px]"></div>
      </div>

      <header className="sticky top-0 z-30 glass-panel border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
             <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200">
                 LV
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                {t.appTitle}
             </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleLanguage} className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors uppercase tracking-wide">
               {lang === 'th' ? 'TH | EN' : 'EN | TH'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 w-full relative z-10 flex-grow">
        <StepIndicator currentStep={currentAppStep} />

        {/* STEP 1: CAREER SELECTION */}
        {!applicantType && (
          <div className="animate-fade-in">
             <div className="text-center mb-12 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{t.selectTypeTitle}</h2>
                <p className="text-lg text-slate-500 font-light">{t.selectTypeDesc}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 'Salaried', icon: 'building', label: t.typeSalaried, desc: t.typeSalariedDesc },
                  { id: 'BusinessOwner', icon: 'store', label: t.typeBusinessOwner, desc: t.typeBusinessOwnerDesc },
                  { id: 'Freelance', icon: 'laptop', label: t.typeFreelance, desc: t.typeFreelanceDesc },
                  { id: 'Farmer', icon: 'leaf', label: t.typeFarmer, desc: t.typeFarmerDesc },
                  { id: 'Investor', icon: 'chart', label: t.typeInvestor, desc: t.typeInvestorDesc },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setApplicantType(type.id as ApplicantType)}
                    className="group flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors duration-300">
                        {type.icon === 'building' && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M16 18h.01"/></svg>}
                        {type.icon === 'store' && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>}
                        {type.icon === 'laptop' && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/><circle cx="12" cy="11" r="2"/></svg>}
                        {type.icon === 'leaf' && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 18v-8"/><path d="M7 14c-2.5 0-4.5-2.5-4.5-5S5 4 8 4c2 0 3 2 4 4 1-2 2-4 4-4 3 0 5.5 2.5 5.5 5S19.5 14 17 14"/><path d="M12 18c-2 0-3 2-4 4"/><path d="M12 18c2 0 3 2 4 4"/></svg>}
                        {type.icon === 'chart' && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{type.label}</h3>
                    <p className="text-sm text-slate-500 font-light">{type.desc}</p>
                  </button>
                ))}
             </div>
             {/* Knowledge Section below selection */}
             <KnowledgeSection />
          </div>
        )}

        {/* STEP 2: UPLOAD / EVALUATE */}
        {applicantType && (
          <div className="animate-fade-in space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setApplicantType(null)}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide">{t.step2}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-xs font-medium text-slate-500">{getTypeLabel(applicantType)}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{t.heroTitle}</h2>
              </div>
            </div>
            
            {/* HYBRID MODE SWITCHER */}
            <div className="flex justify-center mb-8">
                <div className="bg-slate-100 p-1 rounded-full flex gap-1 relative">
                    <button 
                        onClick={() => setEvaluationMode('manual')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 z-10 ${evaluationMode === 'manual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {t.modeManual}
                    </button>
                    <button 
                        onClick={() => setEvaluationMode('ai')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 z-10 ${evaluationMode === 'ai' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {t.modeAI}
                    </button>
                </div>
            </div>

            {/* MANUAL CALCULATOR MODE */}
            {evaluationMode === 'manual' && (
                <div className="animate-fade-in bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-slate-900">{t.quickCalcTitle}</h3>
                        <p className="text-slate-500 text-sm mt-2">{t.quickCalcDesc}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t.inputIncome}</label>
                                <input 
                                    type="number" 
                                    value={manualIncome}
                                    onChange={(e) => setManualIncome(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-900"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t.inputDebt}</label>
                                <input 
                                    type="number" 
                                    value={manualDebt}
                                    onChange={(e) => setManualDebt(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-900"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* DTI Gauge */}
                        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
                             <div className="relative z-10 text-center">
                                 <span className="text-xs font-bold text-slate-400 uppercase">DTI Score</span>
                                 <div className={`text-4xl font-black my-2 ${dtiStatus === 'good' ? 'text-green-500' : dtiStatus === 'fair' ? 'text-amber-500' : dtiStatus === 'risk' ? 'text-red-500' : 'text-slate-300'}`}>
                                     {dtiValue.toFixed(1)}%
                                 </div>
                                 <div className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${dtiStatus === 'good' ? 'bg-green-100 text-green-700' : dtiStatus === 'fair' ? 'bg-amber-100 text-amber-700' : dtiStatus === 'risk' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-500'}`}>
                                     {dtiStatus === 'good' ? t.calcResultGood : dtiStatus === 'fair' ? t.calcResultFair : dtiStatus === 'risk' ? t.calcResultRisk : '...'}
                                 </div>
                             </div>
                             {/* Gauge visual background */}
                             <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-200">
                                 <div 
                                    className={`h-full transition-all duration-500 ${dtiStatus === 'good' ? 'bg-green-500' : dtiStatus === 'fair' ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${dtiValue}%` }}
                                 ></div>
                             </div>
                        </div>
                    </div>
                    
                    {/* Advice Text */}
                    {dtiValue > 0 && (
                        <div className={`mt-6 p-4 rounded-xl border text-sm ${dtiStatus === 'good' ? 'bg-green-50 border-green-100 text-green-700' : dtiStatus === 'fair' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                             {adviceText}
                        </div>
                    )}

                    {/* UPSELL to AI */}
                    {dtiValue > 0 && dtiStatus !== 'risk' && (
                        <div className="mt-8 pt-8 border-t border-slate-100 text-center animate-fade-in">
                            <button 
                                onClick={() => setEvaluationMode('ai')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                {t.verifyWithAI}
                            </button>
                            <p className="text-xs text-slate-400 mt-2">{t.verifyDesc}</p>
                        </div>
                    )}
                </div>
            )}

            {/* AI UPLOAD MODE */}
            {evaluationMode === 'ai' && (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {getRequiredDocs(lang, applicantType).map((doc) => (
                        <FileUploader
                        key={doc.id}
                        {...doc}
                        files={files}
                        onFilesAdded={handleFilesAdded}
                        onFileRemove={handleFileRemove}
                        lang={lang}
                        />
                    ))}
                    </div>

                    {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {error}
                    </div>
                    )}

                    <div className="flex justify-center pb-20">
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className={`
                        relative overflow-hidden group px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-300 transform hover:-translate-y-1
                        ${isAnalyzing ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:shadow-2xl hover:shadow-indigo-200'}
                        `}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                        {isAnalyzing ? (
                            <>Processing...</>
                        ) : (
                            <>
                            {t.startAnalysis}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </>
                        )}
                        </span>
                        {!isAnalyzing && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
                    </button>
                    </div>
                </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
             <div className="flex items-center justify-center gap-2 mb-4 text-indigo-400 font-bold">
                 <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center">L</div>
                 LoanVerify AI
             </div>
             <p className="text-sm max-w-xl mx-auto mb-8 text-slate-500">
                {t.disclaimer}
             </p>
             <div className="flex justify-center gap-6 text-xs font-medium uppercase tracking-wider text-slate-600">
                 <span className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</span>
                 <span className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</span>
                 <span className="hover:text-indigo-400 cursor-pointer transition-colors">Contact</span>
             </div>
             <div className="mt-8 text-xs text-slate-700">
                 © 2024 LoanVerify AI. Powered by Google Gemini.
             </div>
        </div>
      </footer>

      {/* Smart Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="text-white w-8 h-8 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">AI Analysis in Progress</h3>
                
                {/* Steps */}
                <div className="space-y-3 text-left bg-white/5 p-6 rounded-2xl border border-white/10">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className={`flex items-center gap-3 transition-all duration-500 ${step <= loadingStep ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-2'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step < loadingStep ? 'bg-green-500 text-white' : step === loadingStep ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-700 text-slate-400'}`}>
                                {step < loadingStep ? '✓' : step}
                            </div>
                            <span className={`text-sm font-medium ${step === loadingStep ? 'text-white' : 'text-slate-400'}`}>
                                {t[`loadingStep${step}` as keyof typeof t] as string}
                            </span>
                        </div>
                    ))}
                    
                    {/* Long Wait Message */}
                    {showLongWait && (
                        <div className="pt-2 mt-2 border-t border-white/5 animate-fade-in">
                            <p className="text-xs text-indigo-300 font-medium animate-pulse flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                {t.loadingLongWait}
                            </p>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    {t.secureBadge}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
