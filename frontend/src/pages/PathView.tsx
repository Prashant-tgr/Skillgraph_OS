import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import CourseList from '../components/CourseList';
import ProgressChart from '../components/ProgressChart';

export default function PathView() {
    const { topicId } = useParams();
    const navigate = useNavigate();

    // In a real app, you'd fetch the specific topic details based on the ID
    // For now, we use placeholder data to structure the UI
    const topicDetails = {
        title: "Topic Analysis",
        description: "Explore the core concepts and test your knowledge against the graph.",
        mastery: 45
    };

    return (
        <div className="min-h-screen bg-[#020617] p-8 text-slate-200">
            <div className="max-w-5xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Graph
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details & Progress */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                    <BrainCircuit size={28} />
                                </div>
                                <ProgressChart percentage={topicDetails.mastery} />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-100 mb-2">{topicDetails.title} Node</h1>
                            <p className="text-slate-400 text-sm mb-6">{topicDetails.description}</p>
                            
                            <button 
                                onClick={() => navigate(`/quiz/${topicId}`)}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                            >
                                Take Knowledge Check
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Recommendations */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full">
                            <CourseList topicId={Number(topicId)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}