/**
 * WMO Weather Codes Mapping
 * Maps numeric WMO codes to condition identifiers, display text, and icons.
 * Reference: https://open-meteo.com/en/docs
 */

const WMO_CODES = {
  0: { id: 'clear', text: 'Clear sky', icon: '☀️', iconClass: 'sunny' },
  1: { id: 'mostlyClear', text: 'Mainly clear', icon: '🌤️', iconClass: 'partly-cloudy' },
  2: { id: 'partlyCloudy', text: 'Partly cloudy', icon: '⛅', iconClass: 'partly-cloudy' },
  3: { id: 'overcast', text: 'Overcast', icon: '☁️', iconClass: 'cloudy' },
  45: { id: 'fog', text: 'Foggy', icon: '🌫️', iconClass: 'foggy' },
  48: { id: 'fog', text: 'Rime fog', icon: '🌫️', iconClass: 'foggy' },
  51: { id: 'lightDrizzle', text: 'Light drizzle', icon: '🌦️', iconClass: 'drizzle' },
  53: { id: 'drizzle', text: 'Moderate drizzle', icon: '🌦️', iconClass: 'drizzle' },
  55: { id: 'heavyDrizzle', text: 'Dense drizzle', icon: '🌧️', iconClass: 'rainy' },
  56: { id: 'freezingDrizzle', text: 'Freezing drizzle', icon: '🌧️', iconClass: 'rainy' },
  57: { id: 'freezingDrizzle', text: 'Dense freezing drizzle', icon: '🌧️', iconClass: 'rainy' },
  61: { id: 'lightRain', text: 'Slight rain', icon: '🌦️', iconClass: 'rainy' },
  63: { id: 'rain', text: 'Moderate rain', icon: '🌧️', iconClass: 'rainy' },
  65: { id: 'heavyRain', text: 'Heavy rain', icon: '🌧️', iconClass: 'rainy' },
  66: { id: 'freezingRain', text: 'Freezing rain', icon: '🌧️', iconClass: 'rainy' },
  67: { id: 'freezingRain', text: 'Heavy freezing rain', icon: '🌧️', iconClass: 'rainy' },
  71: { id: 'lightSnow', text: 'Slight snow', icon: '🌨️', iconClass: 'snowy' },
  73: { id: 'snow', text: 'Moderate snow', icon: '🌨️', iconClass: 'snowy' },
  75: { id: 'heavySnow', text: 'Heavy snow', icon: '❄️', iconClass: 'snowy' },
  77: { id: 'snowGrains', text: 'Snow grains', icon: '❄️', iconClass: 'snowy' },
  80: { id: 'lightShowers', text: 'Slight showers', icon: '🌦️', iconClass: 'rainy' },
  81: { id: 'showers', text: 'Moderate showers', icon: '🌧️', iconClass: 'rainy' },
  82: { id: 'heavyShowers', text: 'Violent showers', icon: '🌧️', iconClass: 'rainy' },
  85: { id: 'snowShowers', text: 'Slight snow showers', icon: '🌨️', iconClass: 'snowy' },
  86: { id: 'heavySnowShowers', text: 'Heavy snow showers', icon: '❄️', iconClass: 'snowy' },
  95: { id: 'thunderstorm', text: 'Thunderstorm', icon: '⛈️', iconClass: 'thunderstorm' },
  96: { id: 'thunderstormHail', text: 'Thunderstorm with hail', icon: '⛈️', iconClass: 'thunderstorm' },
  99: { id: 'thunderstormHeavyHail', text: 'Thunderstorm with heavy hail', icon: '⛈️', iconClass: 'thunderstorm' },
};

/**
 * Get condition from WMO weather code.
 */
export const getConditionFromCode = (code) =>
  WMO_CODES[code] || { id: 'unknown', text: 'Unknown', icon: '🌡️', iconClass: 'unknown' };
