import { useEffect, useState } from 'react';
import { getCourseRecommendations, Course } from '../services/api';
import { PlayCircle, Star } from 'lucide-react';

export default function CourseList({ topicId }: { topicId: number }) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourseRecommendations(topicId);
                setCourses(data);
            } catch (error) {
                console.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [topicId]);

    if (loading) return <div className="text-slate-500 animate-pulse">Scanning library for optimal resources...</div>;
    if (courses.length === 0) return <div className="text-slate-500">No courses recommended for this topic yet.</div>;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Star className="text-yellow-500" size={18} /> Recommended Resources
            </h3>
            <div className="grid gap-4">
                {courses.map((course) => (
                    <a 
                        key={course.id} 
                        href={course.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="group flex flex-col p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-indigo-500 hover:bg-slate-800 transition-all"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
                                {course.title}
                            </h4>
                            <PlayCircle size={20} className="text-slate-500 group-hover:text-indigo-400" />
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">{course.description}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}