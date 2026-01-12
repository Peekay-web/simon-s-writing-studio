const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://simon-s-writing-studio.onrender.com' 
    : '');

export default API_BASE_URL;