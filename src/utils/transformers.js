/**
 * Weather Data Transformers
 * Functions that reshape raw Open-Meteo API data into usable structures.
 */

/**
 * Get upcoming hourly data from Open-Meteo arrays.
 * @param {object} hourly - The hourly object from API
 * @param {number} count - Number of hours to get
 * @param {string} timezone - City timezone
 * @returns {Array} Array of hourly data objects
 */
export const getUpcomingHours = (hourly, count = 8, timezone) => {
  if (!hourly?.time) return [];

  let currentHourStr;
  if (timezone) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const get = (type) => parts.find(p => p.type === type)?.value;
    currentHourStr = `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:00`;
  } else {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    currentHourStr = `${y}-${m}-${d}T${h}:00`;
  }

  const results = [];
  for (let i = 0; i < hourly.time.length && results.length < count; i++) {
    if (hourly.time[i] >= currentHourStr) {
      results.push({
        time: hourly.time[i],
        temp: hourly.temperature_2m[i],
        humidity: hourly.relative_humidity_2m[i],
        apparentTemp: hourly.apparent_temperature[i],
        precipProb: hourly.precipitation_probability[i],
        precip: hourly.precipitation[i],
        weatherCode: hourly.weather_code[i],
        windSpeed: hourly.wind_speed_10m[i],
        windDir: hourly.wind_direction_10m[i],
        uvIndex: hourly.uv_index[i],
        isDay: hourly.is_day[i],
        isNow: results.length === 0,
      });
    }
  }
  return results;
};

/**
 * Get daily forecasts from Open-Meteo arrays.
 * @param {object} daily - The daily object from API
 * @returns {Array} Array of daily data objects
 */
export const getDailyForecasts = (daily) => {
  if (!daily?.time) return [];
  return daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weather_code[i],
    maxTemp: daily.temperature_2m_max[i],
    minTemp: daily.temperature_2m_min[i],
    maxApparentTemp: daily.apparent_temperature_max[i],
    minApparentTemp: daily.apparent_temperature_min[i],
    sunrise: daily.sunrise[i],
    sunset: daily.sunset[i],
    uvIndexMax: daily.uv_index_max[i],
    precipSum: daily.precipitation_sum[i],
    precipProbMax: daily.precipitation_probability_max[i],
    maxWindSpeed: daily.wind_speed_10m_max[i],
    windDir: daily.wind_direction_10m_dominant[i],
  })).filter(Boolean).slice(0, 8);
};
