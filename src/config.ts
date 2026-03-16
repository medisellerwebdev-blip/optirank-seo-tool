/// <reference types="vite/client" />
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://optirank-backend.onrender.com';

export const API_ENDPOINTS = {
  CONTENT_GENERATE: `${API_BASE_URL}/api/content/generate`,
  KEYWORDS_RESEARCH: `${API_BASE_URL}/api/keywords/research`,
  SEO_ANALYZE: `${API_BASE_URL}/api/seo/analyze`,
  IMAGE_ANALYZE: `${API_BASE_URL}/api/seo/image-analyze`,
  BACKLINKS_FIND: `${API_BASE_URL}/api/backlinks/find`,
  DASHBOARD_INSIGHTS: `${API_BASE_URL}/api/dashboard/insights`,
  SETTINGS_PROVIDER: `${API_BASE_URL}/api/settings/ai-provider`,
};

export default API_BASE_URL;
