import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://envest-wmvt.onrender.com/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - maybe redirect to login');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
