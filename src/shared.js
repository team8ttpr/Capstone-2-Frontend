const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname === 'capstone-2-frontend-tan.vercel.app' || 
   window.location.hostname.includes('vercel.app'));

export const API_URL = isProduction 
  ? "https://capstone-2-backend-three.vercel.app"
  : "http://localhost:8080";

export const FRONTEND_URL = isProduction 
  ? "https://capstone-2-frontend-tan.vercel.app" 
  : "http://localhost:3000";