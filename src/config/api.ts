const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://simon-writing-studio-backend.onrender.com' 
    : 'http://localhost:5000');

export default API_BASE_URL;