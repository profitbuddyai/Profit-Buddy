import axios from 'axios';
import BASE_URL from '../../config';

export const authClient = axios.create({
  baseURL: BASE_URL,
});

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ProfitBuddyToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const publicClient = axios.create({
  baseURL: BASE_URL,
});
