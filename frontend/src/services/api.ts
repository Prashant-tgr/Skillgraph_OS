import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const generateDynamicPath = async (goal: string, style: string, time: string) => {
    const res = await axios.post(`${API_BASE_URL}/path/generate-dynamic`, {
        goal, learning_style: style, time_constraint: time
    });
    return res.data;
};

export const fetchNodeDetails = async (topic: string, style: string) => {
    const res = await axios.post(`${API_BASE_URL}/node/details`, { 
        topic, learning_style: style 
    });
    return res.data;
};

export const generateQuiz = async (topic: string, difficulty: string) => {
    const res = await axios.post(`${API_BASE_URL}/quiz/generate`, { 
        topic, difficulty 
    });
    return res.data;
};

// Added the Tutor Agent API call
export const askTutor = async (topic: string, description: string, question: string) => {
    const res = await axios.post(`${API_BASE_URL}/chat/ask`, { 
        topic, description, question 
    });
    return res.data;
};
