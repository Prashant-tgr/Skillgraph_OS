import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Target, Clock, Layers, Network, BookOpen, CheckCircle2, Cpu, Terminal, Database, Code2, Zap } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();
    const [goal, setGoal] = useState('');
    const [style, setStyle] = useState('Practical (Project-based)');
    const [time, setTime] = useState('5 hours/week');

    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => { document.documentElement.style.scrollBehavior = 'auto'; };
    }, []);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal) return;
        navigate(`/dashboard/dynamic?goal=${encodeURIComponent(goal)}&style=${encodeURIComponent(style)}&time=${encodeURIComponent(time)}`);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Top Navigation */}
            <nav className="w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 fixed top-0 z-50 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                            <BrainCircuit className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">
                            SkillGraph <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">OS</span>
                        </span>
                    </div>
                    <div className="hidden md:flex gap-8 text-sm font-bold text-slate-400">
                        <a href="#architecture" className="hover:text-indigo-400 transition-colors">System Architecture</a>
                        <a href="#engine" className="hover:text-indigo-400 transition-colors">Agentic Engine</a>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        System Online
                    </div>
                </div>
            </nav>

            {/* Hero Section - Now perfectly centered for maximum impact */}
            <main id="generator" className="pt-40 pb-24 px-6 max-w-5xl mx-auto flex flex-col justify-center items-center text-center min-h-[90vh]">
                
                <div className="space-y-8 relative z-10 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-mono tracking-widest uppercase backdrop-blur-sm mx-auto shadow-xl">
                        <Terminal size={14} className="text-cyan-400"/> Multi-Agent Orchestration
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-white">
                        Algorithmic learning via <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
                            Directed Acyclic Graphs.
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        SkillGraph OS bypasses linear curriculums. It utilizes high-speed LPU inference to dynamically compile a topologically sorted, prerequisite-aware skill matrix tailored to your exact constraints.
                    </p>

                    {/* The Generator Form */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative overflow-hidden mt-12 text-left max-w-3xl mx-auto group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 -z-10"></div>
                        
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 mb-2 uppercase">
                                    <Target size={14} className="text-indigo-400"/> Knowledge Target
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    placeholder="e.g., Implementing Retrieval-Augmented Generation..."
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium text-lg shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 mb-2 uppercase">
                                        <Layers size={14} className="text-cyan-400"/> RAG Modality
                                    </label>
                                    <select 
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-300 focus:border-cyan-500 outline-none appearance-none font-medium cursor-pointer shadow-inner"
                                    >
                                        <option>Visual (Diagrams & Media)</option>
                                        <option>Practical (Project-based)</option>
                                        <option>Theoretical (Research Papers)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 mb-2 uppercase">
                                        <Clock size={14} className="text-emerald-400"/> Temporal Constraint
                                    </label>
                                    <select 
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-300 focus:border-emerald-500 outline-none appearance-none font-medium cursor-pointer shadow-inner"
                                    >
                                        <option>2 hours/week (Accelerated)</option>
                                        <option>5 hours/week (Standard)</option>
                                        <option>15+ hours/week (Deep Dive)</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-[1.02] flex justify-center items-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.2)] mt-2">
                                Compile Architecture <Network size={20} className="transition-transform text-white" />
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Tech Stack Banner */}
            <div className="border-y border-slate-800/50 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 font-black text-xl"><Code2 size={24}/> FastAPI Component</div>
                    <div className="flex items-center gap-2 font-black text-xl"><Network size={24}/> React Flow WebGL</div>
                    <div className="flex items-center gap-2 font-black text-xl"><BrainCircuit size={24}/> LangChain Orchestration</div>
                    <div className="flex items-center gap-2 font-black text-xl"><Zap size={24}/> Groq LPU Hardware</div>
                </div>
            </div>

            {/* Architectural Breakdown (Deep Technical Explanation) */}
            <section id="architecture" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Multi-Agent Intelligence Matrix</h2>
                        <p className="text-slate-400 text-lg">
                            Unlike standard LLM applications that rely on single-prompt generations, SkillGraph OS deploys four specialized models operating asynchronously to ensure data accuracy, JSON strictness, and hallucination reduction.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Agent 1 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20"></div>
                            <Network className="text-indigo-400 mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2 text-white">01. Architect Agent</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                Computes the overarching topological structure. Responsible for resolving prerequisite dependencies and injecting estimated hours and real-world project logic into the final JSON payload.
                            </p>
                        </div>
                        
                        {/* Agent 2 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20"></div>
                            <Database className="text-cyan-400 mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2 text-white">02. Librarian Agent</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                Acts as a localized Retrieval-Augmented Generator (RAG). Extracts user modality constraints to dynamically fetch and format contextually relevant external learning assets.
                            </p>
                        </div>

                        {/* Agent 3 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-rose-500 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20"></div>
                            <Target className="text-rose-400 mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2 text-white">03. Assessment Agent</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                Evaluates mastery via on-the-fly test generation. Employs advanced prompt engineering to avoid trivial memorization questions, forcing application-based logic validation.
                            </p>
                        </div>

                        {/* Agent 4 */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20"></div>
                            <Terminal className="text-emerald-400 mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2 text-white">04. Tutor Agent</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                Provides interactive conversational memory. Injects the specific DAG node's context into the chat matrix, ensuring answers strictly adhere to the current topological boundary.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Execution Box */}
            <section id="engine" className="py-24 bg-slate-900/50 border-t border-slate-800">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <Cpu className="text-slate-400 mx-auto mb-6" size={40} />
                    <h2 className="text-3xl font-black mb-6 tracking-tight">Bulletproof JSON Parsing</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-10">
                        Traditional LLM APIs suffer from formatting hallucinations, crashing React frontends. This architecture implements a robust Regex-based extraction pipeline on the FastAPI backend, guaranteeing strict 100% JSON compliance before returning data payloads to the client.
                    </p>
                    <a href="#generator" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl hover:scale-105">
                        Compile Application
                    </a>
                </div>
            </section>
        </div>
    );
}