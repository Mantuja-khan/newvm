// Production-ready dynamic API Base URL Configurator for vmsolutiions.com
export const getApiBaseUrl = () => {
  // If explicitly provided in build/env, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }

  // If in browser context
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // On production domain vmsolutiions.com or www.vmsolutiions.com
    if (host.includes("vmsolutiions.com")) {
      return "https://api.vmsolutiions.com/api";
    }
    // On custom IP or other production hosts
    if (host !== "localhost" && host !== "127.0.0.1") {
      return `${window.location.protocol}//${host}:8003/api`;
    }
  }

  // Local development fallback
  return "http://localhost:8003/api";
};

export const API_BASE = getApiBaseUrl();

