/**
 * CurrentWeather — Displays current temperature, condition, and icon.
 */
import { useWeather } from '../../context/WeatherContext';
import { useTranslation } from '../../context/LanguageContext';
import { getConditionFromCode } from '../../services/weatherApi';
import { celsiusToFahrenheit, formatDate } from '../../utils';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { WiThermometer } from 'react-icons/wi';
import AnimatedIcon from '../Common/AnimatedIcon';

const CurrentWeather = () => {
  const { weatherData, city, unit, saveCity, removeCity, savedCities } = useWeather();
  const { language, t } = useTranslation();
  const current = weatherData?.current;

  if (!current) return null;

  const tempC = Math.round(current.temperature_2m);
  const feelsLikeC = Math.round(current.apparent_temperature);
  const temp = unit === 'celsius' ? tempC : celsiusToFahrenheit(tempC);
  const feelsLike = unit === 'celsius' ? feelsLikeC : celsiusToFahrenheit(feelsLikeC);
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';
  const condition = getConditionFromCode(current.weather_code);
  const isSaved = savedCities.some(c => c.lat === city.lat && c.lon === city.lon);

  return (
    <>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800 min-w-0" id="current-location">
            <FiMapPin className="text-blue-500 flex-shrink-0" />
            <span>{city.name}, {city.country}</span>
          </div>
          <button 
            onClick={() => isSaved ? removeCity(city.lat, city.lon) : saveCity(city)}
            className={`p-2 rounded-full transition-colors flex-shrink-0 ${isSaved ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-white/60'}`}
            title={isSaved ? "Remove from saved" : "Save city"}
          >
            <FiStar className={isSaved ? "fill-current" : ""} size={20} />
          </button>
        </div>
        <span className="text-gray-500 text-sm font-medium">{formatDate(new Date().toISOString(), language, weatherData?._timezone)}</span>
      </div>

      <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl border border-white/50 shadow-sm transition-transform hover:scale-[1.02] relative overflow-hidden flex-shrink-0" id="current-weather-display">
        <AnimatedIcon weatherCode={current.weather_code} isDay={current.is_day !== 0} size={100} className="mb-2" />
        <div className="flex items-start">
          <span className="text-7xl font-black text-gray-800 tracking-tighter">{temp}</span>
          <span className="text-2xl font-bold text-gray-600 mt-2">{unitSymbol}</span>
        </div>
        <p className="text-lg font-bold text-gray-700 mt-2 capitalize">{t(`weatherDetails.weatherConditions.${condition.id}`) !== `weatherDetails.weatherConditions.${condition.id}` ? t(`weatherDetails.weatherConditions.${condition.id}`) : condition.text}</p>
        <p className="flex items-center gap-1 text-blue-600 mt-2 font-bold text-sm sm:text-base">
          <WiThermometer size={24} className="text-red-500" />
          <span>{t('sidebar.feelsLike')} {feelsLike}{unitSymbol}</span>
        </p>
      </div>
    </>
  );
};

export default CurrentWeather;
