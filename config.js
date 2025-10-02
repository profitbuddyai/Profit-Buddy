export let NODE_ENV = import.meta.env.MODE;

if (import.meta.env.VITE_VERCEL_ENV === 'preview') {
  NODE_ENV = 'development';
} else if (import.meta.env.VITE_VERCEL_ENV === 'production') {
  NODE_ENV = 'production';
} else if (!import.meta.env.VITE_VERCEL_ENV) {
  NODE_ENV = 'local';
}

const BASE_URL =
  NODE_ENV === 'production'
    ? 'https://api.profitbuddy.ai/api/v1'
    : NODE_ENV === 'development'
    ? 'https://api-dev.profitbuddy.ai/api/v1'
    : 'http://localhost:2000/api/v1';

export default BASE_URL;
