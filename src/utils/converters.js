/**
 * Weather Data Converters
 * Unit conversions and weather-level classifications.
 */

/**
 * Convert Celsius to Fahrenheit.
 */
export const celsiusToFahrenheit = (c) => Math.round(c * 9 / 5 + 32);

/**
 * Wind direction from degrees.
 */
export const getWindDirection = (degrees) => {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(degrees / 22.5) % 16];
};

/**
 * UV index level.
 */
export const getUVLevel = (uvi) => {
  if (uvi <= 2) return { label: 'low', color: '#4caf50' };
  if (uvi <= 5) return { label: 'medium', color: '#ff9800' };
  if (uvi <= 7) return { label: 'high', color: '#f44336' };
  if (uvi <= 10) return { label: 'very high', color: '#9c27b0' };
  return { label: 'extreme', color: '#d50000' };
};

/**
 * Humidity level.
 */
export const getHumidityLevel = (h) => {
  if (h <= 40) return 'good';
  if (h <= 70) return 'normal';
  return 'bad';
};
