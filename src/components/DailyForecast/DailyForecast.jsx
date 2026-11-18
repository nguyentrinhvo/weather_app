import { useState, useMemo } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getConditionFromCode } from '../../services/weatherApi';
import {
  formatDay,
  getDailyForecasts,
  celsiusToFahrenheit,
} from '../../utils';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { CloudRain } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import AnimatedIcon from '../Common/AnimatedIcon';

const DailyForecast = () => {
  const { weatherData, unit } = useWeather();
  const { t, language } = useTranslation();
  const [expandedDay, setExpandedDay] = useState(null);

  const dailyData = useMemo(() => {
    return getDailyForecasts(weatherData?.daily);
  }, [weatherData]);

  if (!dailyData || !dailyData.length) return null;

  const globalMax = Math.max(...dailyData.map((d) => d.maxTemp));
  const globalMin = Math.min(...dailyData.map((d) => d.minTemp));
  const tempRange = globalMax - globalMin || 1;

  const toggleDay = (dateStr) => {
    setExpandedDay(expandedDay === dateStr ? null : dateStr);
  };

  const getDetailedHoursForDay = (dateStr) => {
    if (!weatherData?.hourly) return [];
    // The target times user requested
    const targetHours = ['01:00', '04:00', '07:00', '10:00', '13:00', '16:00', '19:00', '22:00'];
    
    return weatherData.hourly.time.map((timeISO, index) => {
      if (timeISO.startsWith(dateStr)) {
        const timePart = timeISO.split('T')[1];
        if (targetHours.includes(timePart)) {
          return {
            time: timePart,
            temp: weatherData.hourly.temperature_2m[index],
            weatherCode: weatherData.hourly.weather_code[index],
            precipProb: weatherData.hourly.precipitation_probability[index]
          };
        }
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <section className="bg-white/40 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-lg border border-white/50 mb-6" id="daily-forecast">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{t('dailyForecast.title')}</h2>
      <div className="flex flex-col gap-3">
        {dailyData.map((day, idx) => {
          const cond = getConditionFromCode(day.weatherCode);
          const minTempC = Math.round(day.minTemp);
          const maxTempC = Math.round(day.maxTemp);
          const minTemp = unit === 'celsius' ? minTempC : celsiusToFahrenheit(minTempC);
          const maxTemp = unit === 'celsius' ? maxTempC : celsiusToFahrenheit(maxTempC);
          const barLeft = ((day.minTemp - globalMin) / tempRange) * 100;
          const barWidth = ((day.maxTemp - day.minTemp) / tempRange) * 100;
          const isExpanded = expandedDay === day.date;
          
          const detailedHours = isExpanded ? getDetailedHoursForDay(day.date) : [];

          return (
            <div 
              key={day.date} 
              className={`flex flex-col rounded-2xl transition-all duration-300 ${isExpanded ? 'bg-white/80 shadow-md ring-1 ring-blue-200' : 'bg-white/50 hover:bg-white/70 shadow-sm border border-transparent hover:border-white'}`}
            >
              <div className="flex items-center w-full p-3 sm:p-4 cursor-pointer gap-2 sm:gap-4" onClick={() => toggleDay(day.date)}>
                {/* 1. Day Name */}
                <span className="font-semibold text-gray-700 min-w-[85px] w-[85px] sm:w-28 flex-shrink-0" title={formatDay(day.date, language, weatherData?._timezone)}>
                  {formatDay(day.date, language, weatherData?._timezone)}
                </span>
                
                {/* 2. Icon */}
                <div className="w-8 sm:w-12 flex justify-center flex-shrink-0">
                  <AnimatedIcon weatherCode={day.weatherCode} isDay={true} size={36} className="filter drop-shadow-sm" />
                </div>

                {/* 3. Condition Name */}
                <div className="hidden sm:block w-24 lg:w-36 text-sm font-medium text-gray-500 capitalize truncate flex-shrink-0" title={t(`weatherDetails.weatherConditions.${cond.id}`) !== `weatherDetails.weatherConditions.${cond.id}` ? t(`weatherDetails.weatherConditions.${cond.id}`) : cond.text}>
                  {t(`weatherDetails.weatherConditions.${cond.id}`) !== `weatherDetails.weatherConditions.${cond.id}` ? t(`weatherDetails.weatherConditions.${cond.id}`) : cond.text}
                </div>

                {/* 4. Temp Bar */}
                <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-3 min-w-[70px]">
                  <span className="text-[13px] sm:text-sm font-bold text-gray-500 w-6 sm:w-7 text-right">{minTemp}°</span>
                  <div className="flex-1 h-2.5 bg-gray-200/60 rounded-full overflow-hidden relative max-w-[150px]">
                    <div 
                      className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                      style={{ left: `${Math.max(0, barLeft)}%`, width: `${Math.max(barWidth, 10)}%` }}
                    />
                  </div>
                  <span className="text-[13px] sm:text-sm font-bold text-gray-800 w-6 sm:w-7 text-left">{maxTemp}°</span>
                </div>

                {/* 5. Rain Chance */}
                <div className="min-w-[45px] sm:w-16 flex items-center justify-end gap-1.5 text-[11px] sm:text-xs font-bold text-blue-500 flex-shrink-0" title="Chance of rain">
                  <CloudRain size={12} strokeWidth={2.5} /> {day.precipProbMax}%
                </div>

                {/* 6. Chevron */}
                <div className="w-5 sm:w-6 flex justify-end text-gray-400 flex-shrink-0">
                  {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </div>
              </div>

              {/* Expanded Details - 3 hour intervals */}
              {isExpanded && detailedHours.length > 0 && (
                <div className="mb-2 mx-2 p-3 bg-blue-50/40 rounded-2xl shadow-inner border border-blue-100/50">
                  <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-8 gap-2">
                    {detailedHours.map((hour, i) => {
                      const hCond = getConditionFromCode(hour.weatherCode);
                      const hTempC = Math.round(hour.temp);
                      const hTemp = unit === 'celsius' ? hTempC : celsiusToFahrenheit(hTempC);
                      return (
                        <div key={i} className="flex flex-col items-center justify-center bg-white/70 shadow-sm border border-white p-2 rounded-xl hover:bg-white transition-colors">
                          <span className="text-xs font-semibold text-gray-500 mb-1">{hour.time}</span>
                          <AnimatedIcon weatherCode={hour.weatherCode} isDay={true} size={32} className="mb-1" />
                          <span className="font-bold text-gray-800">{hTemp}°</span>
                          <span className="text-[10px] font-bold text-blue-500 mt-1 flex items-center gap-0.5">
                            <CloudRain size={10} strokeWidth={2.5} /> {hour.precipProb || 0}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DailyForecast;
