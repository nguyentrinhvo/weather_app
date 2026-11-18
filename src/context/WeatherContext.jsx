/**
 * Weather Context Provider
 * Centralized state management using React Context + useReducer.
 * Adapted for Open-Meteo API data structure.
 */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { getWeatherData, searchCities } from '../services/weatherApi';
import { interpretQuery } from '../utils/cityMapping';

const WeatherContext = createContext(null);

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_WEATHER_DATA: 'SET_WEATHER_DATA',
  SET_CITY: 'SET_CITY',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCH_LOADING: 'SET_SEARCH_LOADING',
  SET_UNIT: 'SET_UNIT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_SAVED_CITIES: 'SET_SAVED_CITIES',
};

// Initialize savedCities from localStorage safely
const getStoredCities = () => {
  try {
    const stored = localStorage.getItem('savedCities');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState = {
  weatherData: null,
  city: { name: 'Hanoi', country: 'Vietnam', lat: 21.0285, lon: 105.8542 },
  loading: true,
  error: null,
  searchResults: [],
  searchLoading: false,
  unit: 'celsius',
  savedCities: getStoredCities(),
};

const weatherReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_WEATHER_DATA:
      return { ...state, weatherData: action.payload, loading: false, error: null };
    case ACTIONS.SET_CITY:
      return { ...state, city: action.payload, searchResults: [] };
    case ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload, searchLoading: false };
    case ACTIONS.SET_SEARCH_LOADING:
      return { ...state, searchLoading: action.payload };
    case ACTIONS.SET_UNIT:
      return { ...state, unit: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTIONS.SET_SAVED_CITIES:
      return { ...state, savedCities: action.payload };
    default:
      return state;
  }
};

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const fetchWeatherData = useCallback(async (lat, lon) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const data = await getWeatherData(lat, lon);
      // Store timezone from the API response for timezone-aware formatting
      data._timezone = data.timezone;
      data._utcOffsetSeconds = data.utc_offset_seconds;
      dispatch({ type: ACTIONS.SET_WEATHER_DATA, payload: data });
    } catch (error) {
      const message = error.response?.data?.reason ||
                      error.message ||
                      'Failed to fetch weather data. Please try again.';
      dispatch({ type: ACTIONS.SET_ERROR, payload: message });
    }
  }, []);

  const selectCity = useCallback((city) => {
    dispatch({ type: ACTIONS.SET_CITY, payload: city });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const searchCity = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: [] });
      return;
    }
    dispatch({ type: ACTIONS.SET_SEARCH_LOADING, payload: true });
    try {
      const interpreted = interpretQuery(query);
      const results = await searchCities(interpreted);
      const formatted = results.map((r) => ({
        name: r.name,
        country: r.country,
        admin1: r.admin1,
        lat: r.latitude,
        lon: r.longitude,
        id: r.id,
      }));
      dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: formatted });
    } catch {
      dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: [] });
    }
  }, []);

  const toggleUnit = useCallback(() => {
    dispatch({
      type: ACTIONS.SET_UNIT,
      payload: state.unit === 'celsius' ? 'fahrenheit' : 'celsius',
    });
  }, [state.unit]);

  const retry = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
    fetchWeatherData(state.city.lat, state.city.lon);
  }, [fetchWeatherData, state.city]);

  // Fetch weather whenever city changes
  useEffect(() => {
    fetchWeatherData(state.city.lat, state.city.lon);
  }, [state.city, fetchWeatherData]);

  // Sync saved cities to localStorage
  useEffect(() => {
    localStorage.setItem('savedCities', JSON.stringify(state.savedCities));
  }, [state.savedCities]);

  // Request actual geolocation on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${state.language || 'vi'}`);
            const data = await res.json();
            const locationName = data.city || data.locality || data.principalSubdivision || 'Current Location';
            const countryName = data.countryName || 'Auto';
            dispatch({
              type: ACTIONS.SET_CITY,
              payload: { name: locationName, country: countryName, lat, lon },
            });
          } catch {
            dispatch({
              type: ACTIONS.SET_CITY,
              payload: {
                name: 'Current Location',
                country: 'Auto',
                lat,
                lon,
              },
            });
          }
        },
        (error) => {
          console.warn('Geolocation denied or failed. Falling back to default (Hanoi).', error);
        }
      );
    }
  }, []);

  const saveCity = useCallback((newCity) => {
    // Prevent duplicates
    if (!state.savedCities.find((c) => c.lat === newCity.lat && c.lon === newCity.lon)) {
      dispatch({ type: ACTIONS.SET_SAVED_CITIES, payload: [...state.savedCities, newCity] });
    }
  }, [state.savedCities]);

  const removeCity = useCallback((cityLat, cityLon) => {
    dispatch({
      type: ACTIONS.SET_SAVED_CITIES,
      payload: state.savedCities.filter((c) => !(c.lat === cityLat && c.lon === cityLon)),
    });
  }, [state.savedCities]);

  const value = {
    ...state,
    selectCity,
    searchCity,
    toggleUnit,
    retry,
    fetchWeatherData,
    saveCity,
    removeCity,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within a WeatherProvider');
  return context;
};

export default WeatherContext;
