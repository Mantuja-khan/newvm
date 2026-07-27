// Dynamic API Base URL Configurator for Local & Production VPS (vmsolutiions.com)
export const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      // In production on vmsolutiions.com, route API via relative /api endpoint
      return `${window.location.protocol}//${window.location.host}/api`;
    }
  }

  return "http://localhost:5001/api";
};

export const API_BASE = getApiBaseUrl();
