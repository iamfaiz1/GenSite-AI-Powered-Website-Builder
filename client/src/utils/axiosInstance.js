import axios from 'axios';
import serverUrl from '../config/config';

const axiosInstance = axios.create({
    baseURL: serverUrl,
    withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;