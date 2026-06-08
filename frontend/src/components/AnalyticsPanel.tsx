import { Activity, Target, Award, Zap, Download } from 'lucide-react';

interface AnalyticsProps {
    goal: string;
    totalNodes: number;
    masteredCount: number;
    onValidate: () => void;
    onExport: () => void; // Added Export Prop
}

export default function AnalyticsPanel({ goal, totalNodes, masteredCount, onValidate, onExport }: AnalyticsProps) {
    const progress = totalNodes > 0 ? Math.round((masteredCount / totalNodes) * 100) : 0;
    const circumference = 2 * Math.PI * 56;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="w-80 bg-slate-900/90 backdrop-blur-xl border-l border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20">
            <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-400" />
                    Live Telemetry
                </h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider truncate">Target: {goal}</p>
            </div>

            <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 shadow-inner flex flex-col items-center">
                <p className="text-sm text-slate-300 mb-4 font-bold w-full text-left">Graph Mastery</p>
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" className="stroke-slate-800" strokeWidth="12" fill="none" />
                        <circle 
                            cx="64" cy="64" r="56" 
                            className="stroke-indigo-500 transition-all duration-1000 ease-out" 
                            strokeWidth="12" fill="none" 
                            strokeLinecap="round"
                            style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset }}
                        />
                    </svg>
                    <span className="absolute text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-cyan-400">
                        {progress}%
                    </span>
                </div>
                <p className="text-xs text-slate-500 mt-4 font-medium">{masteredCount} of {totalNodes} Nodes Mastered</p>
            </div>

            <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <p className="text-sm text-slate-300 mb-4 font-bold flex items-center gap-2 relative z-10">
                    <Zap size={14} className="text-amber-400" /> Adaptive Velocity
                </p>
                <div className="h-24 w-full relative z-10 mt-2">
                    <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path 
                            d={`M0,40 Q15,${40 - (progress * 0.1)} 35,${30 - (progress * 0.2)} T70,${25 - (progress * 0.3)} T100,${20 - (progress * 0.4)} L100,40 Z`} 
                            fill="url(#lineGrad)" 
                            className="transition-all duration-1000"
                        />
                        <path 
                            d={`M0,40 Q15,${40 - (progress * 0.1)} 35,${30 - (progress * 0.2)} T70,${25 - (progress * 0.3)} T100,${20 - (progress * 0.4)}`} 
                            fill="none" 
                            stroke="#818cf8" 
                            strokeWidth="2.5" 
                            strokeLinecap="round"
                            className="transition-all duration-1000 shadow-[0_0_10px_#818cf8]"
                        />
                        <circle cx="100" cy={20 - (progress * 0.4)} r="3" fill="#fff" className="animate-pulse shadow-[0_0_10px_#fff]" />
                    </svg>
                </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-800/50 flex flex-col gap-3">
                <button 
                    onClick={onExport}
                    className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all duration-300"
                >
                    <Download size={16} /> Compile Syllabus (.md)
                </button>

                <button 
                    onClick={onValidate}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300
                        ${progress === 100 
                            ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105' 
                            : 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:bg-indigo-500'}`}
                >
                    {progress === 100 ? <Award size={18} /> : <Target size={18} />}
                    {progress === 100 ? 'Claim Certification' : 'Validate Final Goal'}
                </button>
            </div>
        </div>
    );
}