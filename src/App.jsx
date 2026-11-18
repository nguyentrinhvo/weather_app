import { WeatherProvider, useWeather } from './context/WeatherContext';
import Sidebar from './components/Sidebar/Sidebar';
import HourlyForecast from './components/HourlyForecast/HourlyForecast';
import WeatherDetails from './components/WeatherDetails/WeatherDetails';
import DailyForecast from './components/DailyForecast/DailyForecast';
import WeatherMap from './components/Map/WeatherMap';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorFallback from './components/ErrorFallback/ErrorFallback';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import BackToTop from './components/Common/BackToTop';
import { getBackgroundClass } from './utils/backgroundTheme';
import WeatherReminders from './components/WeatherDetails/WeatherReminders';

const WeatherDashboard = () => {
  const { loading, error, weatherData } = useWeather();
  const { language } = useTranslation();

  const isDay = weatherData?.current?.is_day !== 0;
  const bgClass = weatherData?.current ? getBackgroundClass(weatherData.current.weather_code, isDay) : 'from-blue-100 via-blue-200 to-indigo-100';

  if (error && !weatherData) return <ErrorFallback />;
 
  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 bg-gradient-to-b ${bgClass} font-sans ${!isDay ? 'night-mode' : ''}`}>
      {loading && <LoadingSpinner />}
      <div className="flex flex-col xl:flex-row w-full max-w-[1600px] mx-auto min-h-screen p-3 sm:p-6 lg:p-8 gap-6 xl:gap-8" id="weather-dashboard">
        <div className="w-full xl:w-80 flex-shrink-0 relative z-20 xl:sticky xl:top-8 h-fit">
          <Sidebar />
        </div>
        <main className="flex-1 flex flex-col gap-6" id="main-content">
          <WeatherReminders />
          <HourlyForecast />
          <WeatherDetails />
          <DailyForecast />
          <WeatherMap />
        </main>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="min-h-screen w-full text-gray-800 selection:bg-blue-300 selection:text-blue-900 relative">
      <WeatherDashboard />
      <BackToTop />
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <WeatherProvider>
        <AppContent />
      </WeatherProvider>
    </LanguageProvider>
  );
};

export default App;
