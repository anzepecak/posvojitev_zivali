import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    // NE brišemo tokena avtomatsko tukaj.
    // 401 bomo obravnavali v UI (ali kasneje bolj pametno: samo za določene rute).
    return Promise.reject(err);
  },
);
