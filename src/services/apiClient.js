/**
 * API Client — HTTP fetching with cache and retry logic.
 * Shared across all API service modules.
 */
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true,
});

/** In-memory cache */
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getCacheKey = (url, params) => {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return `${url}?${sorted}`;
};

const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) return cached.data;
  cache.delete(key);
  return null;
};

const setCache = (key, data) => cache.set(key, { data, timestamp: Date.now() });

/**
 * Fetch with exponential backoff retry.
 */
export const fetchWithRetry = async (url, params, retries = 3) => {
  const cacheKey = getCacheKey(url, params);
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await api.get(url, { params });
      setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
    }
  }
};

/** Clear cache */
export const clearCache = () => cache.clear();
