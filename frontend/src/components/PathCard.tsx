import { Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PathCardProps {
    id: number;
    title: string;
    description: string;
    nodeCount: number;
}

export default function PathCard({ id, title, description, nodeCount }: PathCardProps) {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/dashboard/${id}`)}
            className="group cursor-pointer p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 bg-slate-800 rounded-xl text-indigo-400 group-hover:text-indigo-300 group-hover:bg-slate-700 transition-colors">
                    <Target size={24} />
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-slate-950 text-slate-400 rounded-full border border-slate-800">
                    {nodeCount} Nodes
                </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-100 mb-2 relative z-10">{title}</h3>
            <p className="text-sm text-slate-400 mb-6 relative z-10 line-clamp-2">{description}</p>
            
            <div className="flex items-center text-indigo-400 text-sm font-medium group-hover:text-indigo-300 relative z-10">
                Generate Path <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
}