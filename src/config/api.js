// Centralized API Base URL helper for development & production environments
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000'
).replace(/\/$/, '');
