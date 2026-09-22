import axios from 'axios';

// One Axios instance for all calls to OUR backend (never TMDB)
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

export default axiosClient;
