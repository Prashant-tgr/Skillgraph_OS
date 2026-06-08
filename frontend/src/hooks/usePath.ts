import { useState, useEffect } from 'react';
import { generatePath, Topic } from '../services/api';

export function usePath(goalId: number, userId: number) {
    const [path, setPath] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPath = async () => {
            try {
                setLoading(true);
                const data = await generatePath(goalId, userId);
                setPath(data.ordered_path);
                setError(null);
            } catch (err) {
                setError("Failed to calculate the optimal learning vector.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (goalId && userId) {
            fetchPath();
        }
    }, [goalId, userId]);

    return { path, loading, error };
}