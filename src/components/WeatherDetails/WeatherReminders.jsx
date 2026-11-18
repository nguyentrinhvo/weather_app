/**
 * WeatherReminders — "Advice for you" section with dynamic reminders.
 */
import { useMemo } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useTranslation } from '../../context/LanguageContext';
import { getUpcomingHours } from '../../utils';
import { Sun, Shield, CloudRain, Droplets, Wind } from 'lucide-react';

const WeatherReminders = () => {
  const { weatherData } = useWeather();
  const { t } = useTranslation();
  const current = weatherData?.current;
  const aqi = weatherData?.aqi;
  const isDay = current?.is_day !== 0;

  const chanceOfRain = useMemo(() => {
    const hours = getUpcomingHours(weatherData?.hourly, 8, weatherData?._timezone);
    if (!hours.length) return 0;
    return Math.round(hours.reduce((s, h) => s + (h.precipProb || 0), 0) / hours.length);
  }, [weatherData]);

  const reminders = useMemo(() => {
    if (!current) return [];
    let items = [];
    if (current.uv_index >= 6) {
      items.push({ icon: <Sun size={20} className="text-orange-500" />, text: t('weatherDetails.reminders.uv') });
    }
    if (chanceOfRain >= 40 || current.precipitation > 0) {
      items.push({ icon: <CloudRain size={20} className={isDay ? "text-blue-500" : "text-blue-300"} />, text: t('weatherDetails.reminders.rain') });
    }
    if (aqi && aqi.us_aqi >= 100) {
      items.push({ icon: <Shield size={20} className={isDay ? "text-red-500" : "text-red-400"} />, text: t('weatherDetails.reminders.aqi') });
    }
    if (current.temperature_2m <= 10) {
      items.push({ icon: <Sun size={20} className={isDay ? "text-indigo-400" : "text-indigo-300"} />, text: t('weatherDetails.reminders.cold') });
    } else if (current.temperature_2m >= 34) {
      items.push({ icon: <Sun size={20} className={isDay ? "text-red-500" : "text-red-400"} />, text: t('weatherDetails.reminders.hot') });
    }
    if (current.relative_humidity_2m >= 70) {
      items.push({ icon: <Droplets size={20} className={isDay ? "text-teal-500" : "text-teal-300"} />, text: t('weatherDetails.reminders.highHumidity') });
    }
    if (current.wind_speed_10m >= 30) {
      items.push({ icon: <Wind size={20} className={isDay ? "text-sky-500" : "text-sky-300"} />, text: t('weatherDetails.reminders.strongWind') });
    }
    if (items.length === 0) {
      items.push({ icon: <Sun size={20} className={isDay ? "text-green-500" : "text-green-400"} />, text: t('weatherDetails.reminders.mild') });
    }
    return items;
  }, [current, chanceOfRain, aqi, t, isDay]);

  if (!reminders.length) return null;

  return (
    <div className="bg-white/60 rounded-3xl p-5 border border-white/50 shadow-sm backdrop-blur-md">
      <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Shield size={18} strokeWidth={2.5} /> {t('weatherDetails.remindersTitle')}
      </h3>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        {reminders.map((r, i) => (
          <div key={i} className="flex-1 min-w-[280px] flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]">
            <div className="p-2.5 rounded-xl bg-slate-500/10 text-blue-500 transition-colors">{r.icon}</div>
            <span className="font-bold text-gray-800 text-sm leading-relaxed">{r.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherReminders;
