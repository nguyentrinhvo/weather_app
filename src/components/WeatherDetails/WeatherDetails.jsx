/**
 * WeatherDetails — Main composition.
 * Composes WeatherDetailCards.
 */
import { useTranslation } from '../../context/LanguageContext';
import WeatherDetailCards from './WeatherDetailCards';

const WeatherDetails = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 mb-6">
      <section className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/50" id="weather-details">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t('weatherDetails.title')}</h2>
        <WeatherDetailCards />
      </section>
    </div>
  );
};

export default WeatherDetails;
