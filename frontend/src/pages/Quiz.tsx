import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { submitQuiz } from '../services/api';

export default function Quiz() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Dummy questions for the frontend demonstration
    const [answers, setAnswers] = useState({ q1: '', q2: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Hardcoded user 1 for now
            const data = await submitQuiz(1, Number(topicId), answers);
            setResult(data);
        } catch (error) {
            console.error("Quiz submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] p-8 text-slate-200">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Knowledge Check
                </h1>
                <p className="text-slate-400 mb-8">Test your mastery to unlock the next node in your path.</p>

                {result ? (
                    <div className="text-center py-8">
                        <CheckCircle size={64} className="mx-auto text-emerald-500 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-100">Score: {result.score * 100}%</h2>
                        <p className="text-slate-400 mt-2">Your knowledge graph has been updated.</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Return to Path
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="block text-slate-300 font-medium">1. What is the primary purpose of this topic?</label>
                            <input 
                                type="text" 
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="Type your answer here..."
                                onChange={(e) => setAnswers({...answers, q1: e.target.value})}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                        >
                            {submitting ? 'Evaluating...' : 'Submit Answers'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}