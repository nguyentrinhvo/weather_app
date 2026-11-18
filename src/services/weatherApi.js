/**
 * Weather API Service — Open-Meteo
 * Provides current weather, hourly and daily forecasts.
 * 
 * Configured endpoints:
 * - Weather & Forecast
 * - Air Quality (AQI)
 * - Geocoding (City Search)
 */
import { fetchWithRetry } from './apiClient';
import { getConditionFromCode as getCode } from './weatherCodes';

/**
 * Re-export WMO condition lookup for convenience
 */
export const getConditionFromCode = getCode;

/**
 * Fetches comprehensive weather data for coordinates via backend proxy.
 * Includes current, hourly (next 48h), daily (10-day) forecasts, and AQI.
 */
export const getWeatherData = async (lat, lon) => {
  return fetchWithRetry('weather', { lat, lon });
};

/**
 * Searches cities by name via backend proxy.
 */
export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const data = await fetchWithRetry('search', { q: query });
  return Array.isArray(data) ? data : (data.results || []);
};

export { clearCache } from './apiClient';
