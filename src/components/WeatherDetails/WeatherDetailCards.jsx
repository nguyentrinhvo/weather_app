/**
 * WeatherDetailCards — Configuration and rendering of individual weather metric cards.
 */
import { useMemo } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useTranslation } from '../../context/LanguageContext';
import {
  getHumidityLevel,
  getUVLevel,
  getUpcomingHours,
  celsiusToFahrenheit,
  getDailyForecasts,
  formatTime,
} from '../../utils';
import {
  Sun,
  Leaf,
  Thermometer,
  Droplets,
  ChartColumnBig,
  CloudRain,
  Wind,
  Sunrise,
  Sunset,
} from 'lucide-react';
import ProgressBar from './ProgressBar';
import WindGauge from './WindGauge';

/** Color class mapping for card icons */
const ICON_COLOR_MAP = {
  amber: 'text-amber-500',
  emerald: 'text-emerald-500',
  orange: 'text-orange-500',
  blue: 'text-blue-500',
  indigo: 'text-indigo-500',
  sky: 'text-sky-500',
};

const WeatherDetailCards = () => {
  const { weatherData, unit } = useWeather();
  const { t } = useTranslation();
  const current = weatherData?.current;
  const aqi = weatherData?.aqi;

  const dailyData = useMemo(() => getDailyForecasts(weatherData?.daily), [weatherData]);

  const chanceOfRain = useMemo(() => {
    const hours = getUpcomingHours(weatherData?.hourly, 8, weatherData?._timezone);
    if (!hours.length) return 0;
    return Math.round(hours.reduce((s, h) => s + (h.precipProb || 0), 0) / hours.length);
  }, [weatherData]);

  if (!current) return null;

  const humidity = current.relative_humidity_2m;
  const precip = current.precipitation;
  const feelsLikeC = Math.round(current.apparent_temperature);
  const feelsLike = unit === 'celsius' ? feelsLikeC : celsiusToFahrenheit(feelsLikeC);
  const unitSymbol = unit === 'celsius' ? '°' : '°F';
  const uvIndex = Math.round(current.uv_index || 0);
  const windSpeed = current.wind_speed_10m;
  const windDeg = current.wind_direction_10m;

  const todaySunrise = dailyData?.[0]?.sunrise ? formatTime(dailyData[0].sunrise) : '--:--';
  const todaySunset = dailyData?.[0]?.sunset ? formatTime(dailyData[0].sunset) : '--:--';

  const humidityLevel = getHumidityLevel(humidity);
  const uvLevel = getUVLevel(uvIndex);

  let aqiColor = '#4caf50';
  let aqiLabel = t('weatherDetails.aqiLevels.good');
  if (aqi) {
    if (aqi.us_aqi > 50) { aqiColor = '#ffeb3b'; aqiLabel = t('weatherDetails.aqiLevels.moderate'); }
    if (aqi.us_aqi > 100) { aqiColor = '#ff9800'; aqiLabel = t('weatherDetails.aqiLevels.sensitive'); }
    if (aqi.us_aqi > 150) { aqiColor = '#f44336'; aqiLabel = t('weatherDetails.aqiLevels.unhealthy'); }
    if (aqi.us_aqi > 200) { aqiColor = '#9c27b0'; aqiLabel = t('weatherDetails.aqiLevels.veryUnhealthy'); }
    if (aqi.us_aqi > 300) { aqiColor = '#b71c1c'; aqiLabel = t('weatherDetails.aqiLevels.hazardous'); }
  }

  const cards = [
    {
      id: 'uv-card',
      icon: <Sun size={28} strokeWidth={1.5} />,
      title: t('weatherDetails.uvIndex'),
      value: uvIndex.toString(),
      label: t(`weatherDetails.uvLevels.${uvLevel.label}`),
      labelClass: `bg-[${uvLevel.color}]/20 text-[${uvLevel.color}] filter drop-shadow-sm`,
      gauge: <ProgressBar value={uvIndex} max={11} color={uvLevel.color} segments={['0-2', '3-5', '6-7', '8-10', '11+']} />,
      color: 'amber',
    },
    ...(aqi ? [{
      id: 'aqi-card',
      icon: <Leaf size={28} strokeWidth={1.5} />,
      title: t('weatherDetails.aqi'),
      value: `${aqi.us_aqi}`,
      label: aqiLabel,
      labelClass: 'px-2 py-0.5 rounded-md text-xs font-bold bg-white shadow-sm',
      labelStyle: { color: aqiColor },
      gauge: <ProgressBar value={aqi.us_aqi} max={500} color={aqiColor} segments={['0', '100', '200', '300', '400', '500']} />,
      color: 'emerald',
    }] : []),
    {
      id: 'feels-like-card',
      icon: <Thermometer size={28} strokeWidth={1.5} />,
      title: t('weatherDetails.feelsLike'),
      value: `${feelsLike}${unitSymbol}`,
      gauge: <ProgressBar value={unit === 'celsius' ? feelsLike + 20 : feelsLike} max={unit === 'celsius' ? 70 : 140} color="#ff7043" segments={['0°', '20°', '40°', '60°']} />,
      color: 'orange',
    },
    {
      id: 'humidity-card',
      icon: <Droplets size={28} strokeWidth={1.5} />,
      title: t('weatherDetails.humidity'),
      value: `${humidity}%`,
      label: t(`weatherDetails.humidityLevels.${humidityLevel}`),
      labelClass: humidity <= 40 ? 'bg-green-100 text-green-700' : humidity <= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700',
      gauge: <ProgressBar value={humidity} max={100} color={humidity <= 40 ? '#4caf50' : humidity <= 70 ? '#ff9800' : '#f44336'} segments={[t('weatherDetails.humidityLevels.good'), t('weatherDetails.humidityLevels.normal'), t('weatherDetails.humidityLevels.bad')]} />,
      color: 'blue',
    },
    {
      id: 'rain-chance-card',
      icon: <CloudRain size={28} strokeWidth={1.5} />,
      title: t('weatherDetails.chanceOfRain'),
      value: `${chanceOfRain}%`,
      gauge: <ProgressBar value={chanceOfRain} max={100} color="#42a5f5" segments={['0%', '25%', '50%', '75%', '100%']} />,
      color: 'blue',
    },
    {
      id: 'precipitation-card',
      icon: <ChartColumnBig size={28} strokeWidth={1.5} />,
      title: t('weatherDetails.precipitation'),
      value: `${precip} mm`,
      gauge: <ProgressBar value={precip} max={50} color="#2196f3" segments={['0', '10', '20', '30', '40', '50']} />,
      color: 'indigo',
    },
    {
      id: 'wind-card',
      icon: <Wind size={28} strokeWidth={1.5} />,
      title: t('weatherDetails.wind'),
      value: null,
      gauge: <WindGauge speed={windSpeed} deg={windDeg} />,
      color: 'sky',
    },
    {
      id: 'sunrise-card',
      icon: <Sunrise size={32} strokeWidth={1.5} />,
      title: t('weatherDetails.sunrise'),
      value: todaySunrise,
      color: 'amber',
    },
    {
      id: 'sunset-card',
      icon: <Sunset size={32} strokeWidth={1.5} />,
      title: t('weatherDetails.sunset'),
      value: todaySunset,
      color: 'orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
      {cards.map((card) => (
        <div
          className="bg-white/60 rounded-3xl p-4 sm:p-5 flex flex-col gap-3 border border-white/50 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
          key={card.id}
          id={card.id}
        >
          <div className="flex items-center justify-between text-gray-500/80">
            <span className="font-bold text-[10px] sm:text-[11px] tracking-widest uppercase opacity-70">{card.title}</span>
            <div className={`p-2 rounded-xl bg-slate-500/10 ${ICON_COLOR_MAP[card.color] || 'text-gray-400'} transition-colors`}>
              {card.icon}
            </div>
          </div>
          {card.value && (
            <div className="flex items-end gap-3 my-1">
              <span className="text-3xl font-black text-gray-800 tracking-tight">{card.value}</span>
              {card.label && (
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${card.labelClass}`}
                  style={card.labelStyle}
                >
                  {card.label}
                </span>
              )}
            </div>
          )}
          <div className="mt-auto pt-2">{card.gauge}</div>
        </div>
      ))}
    </div>
  );
};

export default WeatherDetailCards;
