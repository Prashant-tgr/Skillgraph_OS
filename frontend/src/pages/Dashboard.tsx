import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ReactFlow, { Background, Controls, Node, Edge, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { generateDynamicPath, generateQuiz, fetchNodeDetails, askTutor } from '../services/api';
import AnalyticsPanel from '../components/AnalyticsPanel';
import { Sparkles, BrainCircuit, X, AlertTriangle, BookOpen, CheckCircle, Video, FileText, Award, Clock, Briefcase, MessageSquare, Send } from 'lucide-react';

export default function Dashboard() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const goal = queryParams.get('goal') || 'Machine Learning';
    const style = queryParams.get('style') || 'Visual';
    const time = queryParams.get('time') || '5 hours/week';

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [loading, setLoading] = useState(true);
    const [graphError, setGraphError] = useState<string | null>(null);
    
    const [masteredNodes, setMasteredNodes] = useState<Set<string>>(new Set());
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [modalMode, setModalMode] = useState<'details' | 'quiz' | 'result' | 'certified'>('details');
    
    const [detailsData, setDetailsData] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [quizData, setQuizData] = useState<any>(null);
    const [quizLoading, setQuizLoading] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [quizScore, setQuizScore] = useState<number>(0);

    // Tutor Chat State
    const [chatHistory, setChatHistory] = useState<{role: 'user'|'tutor', text: string}[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    useEffect(() => {
        const fetchGraph = async () => {
            setLoading(true);
            try {
                const data = await generateDynamicPath(goal, style, time);
                if (!data || !data.nodes) throw new Error("Invalid graph data.");

                const newNodes = data.nodes.map((n: any, i: number) => ({
                    id: String(n.id),
                    position: { x: 300 + (i % 2 === 0 ? -200 : 200), y: i * 350 },
                    data: { rawTitle: n.title, desc: n.description, diff: n.difficulty, hours: n.estimated_hours, project: n.real_world_project }
                }));

                const newEdges = data.edges.map((e: any) => ({
                    id: `e${e.source}-${e.target}`,
                    source: String(e.source),
                    target: String(e.target),
                    animated: true,
                    type: 'smoothstep',
                    style: { stroke: '#4f46e5', strokeWidth: 3, opacity: 0.7 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#4f46e5' },
                }));

                setNodes(newNodes);
                setEdges(newEdges);
            } catch (err: any) {
                setGraphError("The Agentic Engine encountered an error generating this topology. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchGraph();
    }, [goal, style, time]);

    const displayNodes = nodes.map(node => {
        const isMastered = masteredNodes.has(node.data.rawTitle);
        return {
            ...node,
            data: {
                ...node.data,
                label: (
                    <div className={`p-5 w-80 text-left rounded-2xl transition-all duration-300 shadow-xl cursor-pointer relative overflow-hidden
                        ${isMastered 
                            ? 'bg-gradient-to-br from-emerald-900/80 to-slate-900 border border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                            : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]'}`}>
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-[0.02] pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-black tracking-tight text-lg ${isMastered ? 'text-emerald-400' : 'text-slate-50'}`}>{node.data.rawTitle}</h3>
                            {isMastered && <CheckCircle size={22} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                        </div>
                        
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{node.data.desc}</p>
                        
                        <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-700/50 mb-4 flex flex-col gap-2">
                            {node.data.project && (
                                <div className="flex items-start gap-2 text-xs">
                                    <Briefcase size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-300 font-medium leading-tight">{node.data.project}</span>
                                </div>
                            )}
                            {node.data.hours && (
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Clock size={12} className="text-cyan-400" />
                                    <span>Est: {node.data.hours}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider
                                ${isMastered ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50' : 'bg-indigo-950/30 text-indigo-300 border-indigo-800/30'}`}>
                                {isMastered ? 'VERIFIED' : node.data.diff}
                            </span>
                        </div>
                    </div>
                )
            }
        };
    });

    const handleNodeClick = async (_: any, node: Node) => {
        const nodeTitle = node.data.rawTitle;
        setActiveNode(nodeTitle);
        setModalMode('details');
        setDetailsLoading(true);
        setDetailsData(null);
        setChatHistory([]); // Reset chat when switching nodes
        
        try {
            const details = await fetchNodeDetails(nodeTitle, style);
            setDetailsData(details);
        } catch (e) {
            console.error(e);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !activeNode) return;

        const userMsg = chatInput.trim();
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatInput('');
        setChatLoading(true);

        const activeNodeData = nodes.find(n => n.data.rawTitle === activeNode);
        
        try {
            const res = await askTutor(activeNode, activeNodeData?.data.desc || "", userMsg);
            setChatHistory(prev => [...prev, { role: 'tutor', text: res.answer }]);
        } catch (err) {
            setChatHistory(prev => [...prev, { role: 'tutor', text: "Connection to Tutor Agent lost. Please try again." }]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleStartQuiz = async () => {
        setModalMode('quiz');
        setQuizLoading(true);
        setUserAnswers({});
        setQuizData(null);
        
        try {
            const quiz = await generateQuiz(activeNode!, "Intermediate");
            setQuizData(quiz);
        } catch (e) {
            setQuizData({ questions: [] });
        } finally {
            setQuizLoading(false);
        }
    };

    const submitQuiz = () => {
        let correctCount = 0;
        quizData.questions.forEach((q: any, idx: number) => {
            if (userAnswers[idx] === q.correct_index) correctCount++;
        });
        
        const scorePercentage = (correctCount / quizData.questions.length) * 100;
        setQuizScore(scorePercentage);
        setModalMode('result');

        if (scorePercentage >= 50 && activeNode) {
            setMasteredNodes(prev => new Set(prev).add(activeNode));
        }
    };

    const handleValidateGoal = () => {
        if (nodes.length > 0 && masteredNodes.size === nodes.length) {
            setActiveNode("Certification");
            setModalMode("certified");
        } else {
            alert("You must achieve mastery in all topological nodes before validating the final goal.");
        }
    };

    const handleExportSyllabus = () => {
        let markdown = `# Enterprise Curriculum: ${goal}\n`;
        markdown += `*Generated by SkillGraph OS Multi-Agent Architecture*\n\n`;
        markdown += `**Modality:** ${style} | **Bandwidth:** ${time}\n\n`;
        markdown += `---\n\n`;

        nodes.forEach((n, idx) => {
            const isMastered = masteredNodes.has(n.data.rawTitle) ? '[x]' : '[ ]';
            markdown += `## ${idx + 1}. ${n.data.rawTitle} ${isMastered ? '(MASTERED)' : ''}\n`;
            markdown += `* **Difficulty:** ${n.data.diff}\n`;
            markdown += `* **Estimated Time:** ${n.data.hours}\n`;
            markdown += `* **Industry Project:** ${n.data.project}\n\n`;
            markdown += `> ${n.data.desc}\n\n`;
            markdown += `---\n\n`;
        });

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SkillGraph_${goal.replace(/\s+/g, '_')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="h-screen w-full flex bg-[#020617] overflow-hidden font-sans">
            <main className="flex-grow relative flex flex-col">
                <header className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/60 p-4 flex items-center justify-between z-10 shadow-lg">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href='/'}>
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                            <BrainCircuit className="text-white" size={20} />
                        </div>
                        <h1 className="text-xl font-extrabold text-white tracking-tight">SkillGraph <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 ml-1">AI</span></h1>
                    </div>
                </header>

                <div className="flex-grow relative w-full h-full min-h-[500px]">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0"></div>
                    
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                                <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-r-4 border-cyan-400 rounded-full animate-spin direction-reverse"></div>
                                <BrainCircuit className="text-indigo-400 animate-pulse" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Architecting Knowledge Graph</h2>
                            <p className="text-sm text-slate-400 animate-pulse">Running multi agent constraints...</p>
                        </div>
                    ) : graphError ? (
                         <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                            <AlertTriangle className="text-red-400 mb-4" size={48} />
                            <p className="text-red-400 font-bold">{graphError}</p>
                            <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-lg">Try Again</button>
                        </div>
                    ) : (
                        <ReactFlow nodes={displayNodes} edges={edges} fitView onNodeClick={handleNodeClick} className="z-10">
                            <Background color="#1e293b" gap={24} size={2} />
                            <Controls className="bg-slate-800/80 backdrop-blur-md border-slate-700 fill-slate-300 rounded-xl overflow-hidden shadow-xl" />
                        </ReactFlow>
                    )}
                </div>
            </main>

            <AnalyticsPanel 
                goal={goal} 
                totalNodes={nodes.length} 
                masteredCount={masteredNodes.size} 
                onValidate={handleValidateGoal}
                onExport={handleExportSyllabus}
            />

            {/* AI Dynamic Multi-Modal */}
            {activeNode && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                        
                        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                {modalMode === 'details' ? <BookOpen className="text-indigo-400" /> : 
                                 modalMode === 'quiz' ? <Sparkles className="text-indigo-400" /> : 
                                 modalMode === 'certified' ? <Award className="text-emerald-400" /> : <CheckCircle className="text-emerald-400" />}
                                {modalMode === 'details' ? 'Agentic Overview' : 
                                 modalMode === 'quiz' ? 'Adaptive Validation' : 
                                 modalMode === 'certified' ? 'Goal Achieved' : 'Analysis Complete'}
                            </h2>
                            <button onClick={() => setActiveNode(null)} className="text-slate-400 hover:text-white hover:rotate-90 transition-transform">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            
                            {modalMode === 'certified' && (
                                <div className="text-center py-10">
                                    <div className="mx-auto w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                                        <Award size={48} className="text-emerald-400" />
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">System Mastered</h2>
                                    <p className="text-lg text-slate-300 mb-8 max-w-md mx-auto">
                                        You have successfully validated every node in the <span className="text-indigo-400 font-bold">{goal}</span> topology. 
                                    </p>
                                    <button onClick={() => window.location.href='/'} className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 rounded-xl font-bold transition-all shadow-lg scale-105">
                                        Architect New Graph
                                    </button>
                                </div>
                            )}

                            {modalMode !== 'certified' && <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 text-2xl font-black mb-8 tracking-tight">{activeNode}</h3>}

                            {modalMode === 'details' && (
                                <div>
                                    {detailsLoading ? (
                                        <div className="space-y-4 animate-pulse">
                                            <div className="h-20 bg-slate-800 rounded-xl"></div>
                                            <div className="h-12 bg-slate-800 rounded-xl"></div>
                                            <div className="h-12 bg-slate-800 rounded-xl"></div>
                                        </div>
                                    ) : detailsData ? (
                                        <div className="space-y-8">
                                            <div className="bg-indigo-950/20 p-6 rounded-2xl border border-indigo-500/20 leading-relaxed text-slate-200 text-lg">
                                                {detailsData.overview}
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Curated Assets</h4>
                                                <div className="space-y-3">
                                                    {detailsData.resources.map((res: any, idx: number) => (
                                                        <a key={idx} href={res.link} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-indigo-500 hover:bg-slate-800 transition-all group cursor-pointer">
                                                            <div className="p-2 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform">
                                                                {res.type.toLowerCase().includes('video') ? <Video size={20} className="text-rose-400" /> : <FileText size={20} className="text-blue-400" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-base font-bold text-slate-200 group-hover:text-indigo-300 transition">{res.title}</p>
                                                                <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">{res.type}</p>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* TUTOR AGENT CHAT UI */}
                                            <div className="mt-8 border-t border-slate-700/50 pt-8">
                                                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-4">
                                                    <MessageSquare size={16} className="text-cyan-400" /> 
                                                    Ask the Tutor Agent
                                                </h4>
                                                
                                                <div className="bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-64">
                                                    <div className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar">
                                                        {chatHistory.length === 0 ? (
                                                            <p className="text-xs text-slate-500 text-center mt-10">Ask a specific question about {activeNode} before taking the quiz.</p>
                                                        ) : (
                                                            chatHistory.map((msg, i) => (
                                                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'}`}>
                                                                        {msg.text}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                        {chatLoading && (
                                                            <div className="flex justify-start">
                                                                <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-sm flex gap-1">
                                                                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                                                                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                                                                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div ref={chatEndRef} />
                                                    </div>
                                                    <form onSubmit={handleChatSubmit} className="p-2 bg-slate-900 border-t border-slate-800 flex gap-2">
                                                        <input 
                                                            type="text" 
                                                            value={chatInput}
                                                            onChange={(e) => setChatInput(e.target.value)}
                                                            placeholder="Type your question..."
                                                            className="flex-grow bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                                                        />
                                                        <button type="submit" disabled={chatLoading} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors">
                                                            <Send size={16} />
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>

                                            <button onClick={handleStartQuiz} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-[1.02]">
                                                Start 10-Question Mastery Quiz
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-red-400">Failed to load payload.</p>
                                    )}
                                </div>
                            )}

                            {modalMode === 'quiz' && (
                                <div>
                                    {quizLoading ? (
                                        <div className="space-y-6 animate-pulse">
                                            <div className="h-8 w-3/4 bg-slate-800 rounded"></div>
                                            <div className="h-16 bg-slate-800 rounded-xl"></div>
                                            <div className="h-16 bg-slate-800 rounded-xl"></div>
                                        </div>
                                    ) : quizData?.questions?.length > 0 ? (
                                        <div className="space-y-10">
                                            {quizData.questions.map((q: any, qIdx: number) => (
                                                <div key={qIdx} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                                                    <p className="text-slate-100 font-bold mb-6 text-lg leading-snug"><span className="text-indigo-400 mr-2">Q{qIdx + 1}.</span> {q.question}</p>
                                                    <div className="space-y-3">
                                                        {q.options.map((opt: string, optIdx: number) => (
                                                            <label key={optIdx} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${userAnswers[qIdx] === optIdx ? 'border-indigo-500 bg-indigo-500/20 shadow-inner' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}>
                                                                <input 
                                                                    type="radio" 
                                                                    name={`q${qIdx}`} 
                                                                    className="hidden"
                                                                    checked={userAnswers[qIdx] === optIdx}
                                                                    onChange={() => setUserAnswers(prev => ({...prev, [qIdx]: optIdx}))}
                                                                />
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${userAnswers[qIdx] === optIdx ? 'border-indigo-400' : 'border-slate-500'}`}>
                                                                    {userAnswers[qIdx] === optIdx && <div className="w-3 h-3 bg-indigo-400 rounded-full" />}
                                                                </div>
                                                                <span className="text-slate-200 text-base">{opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <button 
                                                onClick={submitQuiz} 
                                                disabled={Object.keys(userAnswers).length !== quizData.questions.length}
                                                className="w-full py-5 mt-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
                                            >
                                                Submit Analysis
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-yellow-500">Could not load assessment constraints.</p>
                                    )}
                                </div>
                            )}

                            {modalMode === 'result' && (
                                <div className="text-center py-10">
                                    <div className={`mx-auto mb-8 flex items-center justify-center w-32 h-32 rounded-full border-[12px] bg-slate-900 ${quizScore >= 50 ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
                                        <span className={`text-4xl font-black ${quizScore >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {quizScore}%
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-3xl font-black text-slate-100 mb-3 tracking-tight">
                                        {quizScore >= 50 ? 'Topology Mastered' : 'Analysis Failed'}
                                    </h3>
                                    <p className="text-slate-400 mb-10 text-lg max-w-md mx-auto">
                                        {quizScore >= 50 
                                            ? 'The analytics engine has verified your understanding. Your graph has been updated.' 
                                            : 'Your accuracy was below the threshold. Use the Tutor Agent to clarify concepts before trying again.'}
                                    </p>

                                    <button onClick={() => setActiveNode(null)} className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-600 hover:border-slate-400 shadow-lg">
                                        Return to Architecture
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}