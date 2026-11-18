import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { useWeather } from '../../context/WeatherContext';
import { getConditionFromCode } from '../../services/weatherApi';
import {
  formatHour,
  getUpcomingHours,
  celsiusToFahrenheit,
} from '../../utils';
import { useTranslation } from '../../context/LanguageContext';
import AnimatedIcon from '../Common/AnimatedIcon';
import { CalendarDays, CloudRain } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const HourlyForecast = () => {
  const { weatherData, unit } = useWeather();
  const { t, language } = useTranslation();

  const hourlyData = useMemo(() => {
    return getUpcomingHours(weatherData?.hourly, 12, weatherData?._timezone);
  }, [weatherData]);

  const chartData = useMemo(() => {
    if (!hourlyData.length) return null;
    const labels = hourlyData.map((h) => formatHour(h.time, h.isNow, language, weatherData?._timezone));
    const temps = hourlyData.map((h) =>
      unit === 'celsius' ? Math.round(h.temp) : celsiusToFahrenheit(h.temp)
    );
    return {
      labels,
      datasets: [{
        data: temps,
        fill: true,
        backgroundColor: 'rgba(58, 123, 213, 0.15)',
        borderColor: 'rgba(58, 123, 213, 0.8)',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#3a7bd5',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        tension: 0.4,
      }],
    };
  }, [hourlyData, unit]);

  const chartOptions = useMemo(() => {
    const isDay = weatherData?.current?.is_day !== 0;
    const chartTextColor = isDay ? '#1f2937' : '#f3f4f6';
    const gridColor = isDay ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
    
    return {
      responsive: true,
      maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(30, 60, 114, 0.95)',
        titleFont: { family: 'Inter', size: 14, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          label: (ctx) =>
            `${Math.round(ctx.parsed.y)}${unit === 'celsius' ? '°C' : '°F'}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 13, weight: 'bold' }, color: chartTextColor },
        border: { display: false },
      },
      y: {
        grid: { color: gridColor, drawBorder: false },
        ticks: {
          font: { family: 'Inter', size: 13, weight: 'bold' },
          color: chartTextColor,
          stepSize: 1,
          callback: (v) => `${Math.round(v)}°`,
        },
        border: { display: false },
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };
  }, [unit, weatherData]);

  if (!hourlyData.length) return null;

  const tzOpt = weatherData?._timezone ? { timeZone: weatherData._timezone } : {};
  const currentDateString = new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    ...tzOpt
  }).format(new Date());

  return (
    <section className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/50 mb-6" id="hourly-forecast">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 capitalize">{currentDateString}</h2>
        <button
          onClick={() => document.getElementById('daily-forecast')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50/80 hover:bg-blue-100 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm border border-blue-100 cursor-pointer"
        >
          <CalendarDays size={16} strokeWidth={2.5} /> {t('dailyForecast.title')}
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 w-full pb-2">
        {hourlyData.map((item, idx) => {
          const cond = getConditionFromCode(item.weatherCode);
          const displayTemp = unit === 'celsius'
            ? Math.round(item.temp)
            : celsiusToFahrenheit(item.temp);
          return (
            <div
              className="flex flex-col items-center justify-between min-w-0 p-2 sm:p-3 rounded-2xl border border-white/50 bg-white/60 text-gray-700 shadow-sm transition-all hover:scale-105"
              key={item.time}
            >
              <span className="text-[10px] sm:text-xs font-bold mb-1 text-blue-600">{formatHour(item.time, item.isNow, language, weatherData?._timezone)}</span>
              <AnimatedIcon weatherCode={item.weatherCode} isDay={item.isNow ? (weatherData?.current?.is_day !== 0) : (item.isDay !== 0)} size={40} className="mb-1" />
              <span className="text-sm sm:text-lg font-black text-gray-800">{displayTemp}°</span>
              <span className="text-[10px] font-bold mt-1 whitespace-nowrap flex items-center justify-center gap-0.5 text-blue-500">
                <CloudRain size={10} strokeWidth={2.5} /> {item.precipProb || 0}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="h-56 mt-4 w-full relative">
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>
    </section>
  );
};

export default HourlyForecast;
