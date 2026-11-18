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

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1';
const AQI_URL = 'https://air-quality-api.open-meteo.com/v1';

/**
 * Re-export WMO condition lookup for convenience
 */
export const getConditionFromCode = getCode;

/**
 * Fetches comprehensive weather data for coordinates.
 * Includes current, hourly (next 48h), and daily (7-day) forecasts.
 */
export const getWeatherData = async (lat, lon) => {
  const weatherPromise = fetchWithRetry(`${BASE_URL}/forecast`, {
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
      'precipitation', 'weather_code', 'wind_speed_10m', 'wind_direction_10m',
      'uv_index', 'surface_pressure', 'cloud_cover', 'is_day',
    ].join(','),
    hourly: [
      'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
      'precipitation_probability', 'precipitation', 'weather_code',
      'wind_speed_10m', 'wind_direction_10m', 'uv_index', 'is_day',
    ].join(','),
    daily: [
      'weather_code', 'temperature_2m_max', 'temperature_2m_min',
      'apparent_temperature_max', 'apparent_temperature_min',
      'sunrise', 'sunset', 'uv_index_max',
      'precipitation_sum', 'precipitation_probability_max',
      'wind_speed_10m_max', 'wind_direction_10m_dominant',
    ].join(','),
    forecast_days: 10,
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
    timezone: 'auto',
  });

  const aqiPromise = fetchWithRetry(`${AQI_URL}/air-quality`, {
    latitude: lat,
    longitude: lon,
    current: ['us_aqi', 'pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone'].join(','),
    timezone: 'auto',
  });

  const [weatherData, aqiData] = await Promise.all([weatherPromise, aqiPromise]);
  return {
    ...weatherData,
    aqi: aqiData.current,
  };
};

/**
 * Searches cities by name using Open-Meteo Geocoding API.
 */
export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const data = await fetchWithRetry(`${GEO_URL}/search`, {
    name: query,
    count: 6,
    language: 'en',
    format: 'json',
  });
  return data.results || [];
};

export { clearCache } from './apiClient';
