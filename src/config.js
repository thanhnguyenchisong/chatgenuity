const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080';
const INTERVIEW_HOST = import.meta.env.VITE_INTERVIEW_HOST || 'http://localhost:8800';
const KL_HOST = import.meta.env.VITE_KL_HOST || 'http://localhost:9000';
const KL_REALM= import.meta.env.VITE_KL_REALM || 'chatbotdev';
const KL_CLIENT= import.meta.env.VITE_KL_CLIENT || 'chatbotclient';
export { API_HOST, INTERVIEW_HOST, KL_HOST, KL_REALM, KL_CLIENT };