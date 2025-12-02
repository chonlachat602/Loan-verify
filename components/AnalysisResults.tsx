
import React, { useState } from 'react';
import { AnalysisResult, BankRecommendation, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
  lang: Language;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onReset, lang }) => {
  const t = TRANSLATIONS[lang];
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  // Score Gauge Data
  const scoreData = [
    { name: 'Score', value: result.creditworthinessScore },
    { name: 'Remaining', value: 100 - result.creditworthinessScore }
  ];

  const getScoreColor = (score: number) => {
      if (score >= 70) return '#4ade80'; // Green-400
      if (score >= 50) return '#fbbf24'; // Amber-400
      return '#f87171'; // Red-400
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-fade-in pb-24">
      
      {/* Premium Hero Card */}
      <div className="relative rounded-3xl overflow-hidden text-white shadow-2xl shadow-indigo-200">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-900 z-0"></div>
        {/* Glossy effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 p-8 md:p-12 grid md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2 space-y-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-medium text-indigo-200 border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                        AI Assessment Complete
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t.resultsHeader}</h2>
                </div>
                
                <p className="text-indigo-100/80 text-lg font-light leading-relaxed max-w-2xl border-l-2 border-indigo-400/50 pl-6">
                    {result.summary}
                </p>
                
                <div className="flex flex-wrap items-end gap-4 pt-4">
                    {/* Income Card */}
                    <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10 min-w-[140px]">
                        <p className="text-xs text-indigo-300 uppercase font-semibold mb-1 flex items-center gap-1">
                            {t.monthlyIncome} 
                        </p>
                        <p className="text-2xl font-bold text-white">฿{result.profile.estimatedMonthlyIncome.toLocaleString()}</p>
                    </div>

                    {/* DTI Card */}
                    <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10 min-w-[140px]">
                        <p className="text-xs text-indigo-300 uppercase font-semibold mb-1 flex items-center gap-1">
                            {t.dti}
                        </p>
                        <p className="text-2xl font-bold text-white">{result.profile.debtServiceRatio}%</p>
                    </div>

                    {/* View Details Button */}
                    <button 
                        onClick={() => setShowBreakdown(true)}
                        className="h-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-bold text-indigo-200 hover:text-white transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        {t.viewDetails}
                    </button>
                </div>
            </div>

            {/* Score Circle */}
            <div className="flex flex-col items-center justify-center">
                <div className="w-64 h-64 relative">
                    {/* Glass backplate for chart */}
                    <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm scale-90"></div>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={scoreData}
                            cx="50%"
                            cy="50%"
                            innerRadius={85}
                            outerRadius={100}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                            paddingAngle={5}
                        >
                            <Cell fill={getScoreColor(result.creditworthinessScore)} />
                            <Cell fill="rgba(255,255,255,0.1)" />
                        </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-7xl font-bold tracking-tighter text-white drop-shadow-lg">
                            {result.creditworthinessScore}
                        </span>
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest mt-2">{t.scoreLabel}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    {t.profileHeader}
                </h3>
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <p className="text-sm text-slate-500 font-medium">{t.jobStability}</p>
                         <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                             result.profile.employmentStability === 'High' ? 'bg-green-100 text-green-700' : 
                             result.profile.employmentStability === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                             'bg-red-100 text-red-700'
                         }`}>
                             {t.stability[result.profile.employmentStability]}
                         </div>
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1 bg-green-100 rounded-full text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">{t.strengths}</h4>
                        </div>
                        <ul className="space-y-2 pl-2">
                            {result.profile.strengths.map((s, i) => (
                                <li key={i} className="text-sm text-slate-600 font-medium flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full bg-green-400 mt-2 shrink-0"></span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1 bg-red-100 rounded-full text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">{t.weaknesses}</h4>
                        </div>
                        <ul className="space-y-2 pl-2">
                            {result.profile.weaknesses.map((w, i) => (
                                <li key={i} className="text-sm text-slate-600 font-medium flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 pl-2">
                {t.recommendationsHeader}
            </h3>
            
            <div className="grid gap-5">
                {result.recommendations.map((rec, idx) => (
                    <BankCard key={idx} recommendation={rec} lang={lang} />
                ))}
            </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="px-10 py-4 bg-white border border-slate-200 text-slate-700 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold text-sm shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          {t.resetButton}
        </button>
      </div>

      {/* Financial Breakdown Modal */}
      {showBreakdown && (
          <div 
              className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
              onClick={() => setShowBreakdown(false)}
          >
              <div 
                  className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
              >
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="text-lg font-bold text-slate-900">{t.breakdownTitle}</h3>
                      <button 
                          onClick={() => setShowBreakdown(false)}
                          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
                      {/* Income Section */}
                      <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{t.bdIncomeTitle}</h4>
                          <div className="space-y-3">
                              {result.profile.incomeBreakdown ? (
                                  <>
                                      <div className="flex justify-between items-center text-sm">
                                          <span className="text-slate-600">{t.bdBase}</span>
                                          <span className="font-semibold text-slate-900">฿{result.profile.incomeBreakdown.baseIncome.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                          <span className="text-slate-600">{t.bdVar}</span>
                                          <span className="font-semibold text-green-600">+฿{result.profile.incomeBreakdown.variableIncome.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm bg-red-50 p-2 rounded-lg border border-red-100">
                                          <span className="text-red-700 font-medium">{t.bdHaircut}</span>
                                          <span className="font-bold text-red-700">-฿{result.profile.incomeBreakdown.haircutApplied.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-base pt-2 border-t border-slate-100 mt-2">
                                          <span className="font-bold text-indigo-900">{t.monthlyIncome}</span>
                                          <span className="font-bold text-indigo-600 text-lg">฿{result.profile.estimatedMonthlyIncome.toLocaleString()}</span>
                                      </div>
                                      <div className="text-xs text-slate-500 italic mt-2 bg-slate-50 p-3 rounded-lg">
                                          <span className="font-bold text-slate-600 not-italic mr-1">{t.bdExplanation}:</span>
                                          {result.profile.incomeBreakdown.explanation}
                                      </div>
                                  </>
                              ) : <p className="text-sm text-slate-400">No breakdown available</p>}
                          </div>
                      </div>

                      {/* Debt Section */}
                      <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{t.bdDebtTitle}</h4>
                          <div className="space-y-3">
                              {result.profile.debtBreakdown ? (
                                  <>
                                      <div className="flex justify-between items-center text-sm">
                                          <span className="text-slate-600">{t.bdDebtExisting}</span>
                                          <span className="font-semibold text-slate-900">฿{result.profile.debtBreakdown.totalExistingDebt.toLocaleString()}</span>
                                      </div>
                                      
                                      {result.profile.debtBreakdown.detectedDebts.length > 0 && (
                                          <div className="pl-4 border-l-2 border-slate-200 text-xs text-slate-500 space-y-1 mb-2">
                                              <p className="font-medium text-slate-400 mb-1">{t.bdDetectedList}:</p>
                                              {result.profile.debtBreakdown.detectedDebts.map((d,i) => (
                                                  <div key={i}>• {d}</div>
                                              ))}
                                          </div>
                                      )}

                                      <div className="flex justify-between items-center text-sm">
                                          <span className="text-slate-600">{t.bdDebtNew}</span>
                                          <span className="font-semibold text-indigo-600">+฿{result.profile.debtBreakdown.estimatedHomeInstallment.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-base pt-2 border-t border-slate-100 mt-2">
                                          <span className="font-bold text-indigo-900">{t.bdTotalDebt}</span>
                                          <span className="font-bold text-red-500 text-lg">฿{(result.profile.debtBreakdown.totalExistingDebt + result.profile.debtBreakdown.estimatedHomeInstallment).toLocaleString()}</span>
                                      </div>
                                  </>
                              ) : <p className="text-sm text-slate-400">No breakdown available</p>}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

const BankCard: React.FC<{ recommendation: BankRecommendation, lang: Language }> = ({ recommendation, lang }) => {
    const t = TRANSLATIONS[lang];
    const isRecommended = recommendation.status === 'Recommended';
    
    return (
        <div className={`group p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
            isRecommended 
            ? 'bg-white border-indigo-100 shadow-lg shadow-indigo-100 hover:border-indigo-200' 
            : 'bg-white border-slate-100 hover:border-slate-200'
        }`}>
            {isRecommended && <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>}
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`text-lg font-bold ${isRecommended ? 'text-slate-900' : 'text-slate-600'}`}>
                            {recommendation.bankName}
                        </div>
                        {isRecommended && (
                             <span className="px-2.5 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">
                                 {t.topPick}
                             </span>
                        )}
                    </div>
                    
                    <h5 className="text-sm font-semibold text-slate-700 mb-2">{recommendation.productName}</h5>
                    
                    {/* Matching Logic Badge */}
                    <div className="text-slate-500 text-sm leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Why this match?</span>
                       {recommendation.reason}
                    </div>
                    
                    {recommendation.interestRateHighlight && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold border border-amber-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            {recommendation.interestRateHighlight}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end">
                    <div className={`text-2xl font-bold ${isRecommended ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {recommendation.matchScore}%
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{t.matchScore}</div>
                </div>
            </div>
        </div>
    );
};
