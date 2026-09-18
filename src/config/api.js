// Dynamic API Base URL Configurator for Local & Production VPS (api.vmsolutiions.com)
export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      // In production on vmsolutiions.com, route API via subdomain https://api.vmsolutiions.com/api
      return `${window.location.protocol}//api.vmsolutiions.com/api`;
    }
  }
  return "http://localhost:5001/api";
};
export const API_BASE = getApiBaseUrl();
