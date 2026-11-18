/**
 * SavedCities — List of favorite/saved cities with remove button.
 */
import { FiMapPin, FiTrash2 } from 'react-icons/fi';
import { useWeather } from '../../context/WeatherContext';
import { useTranslation } from '../../context/LanguageContext';

const SavedCities = () => {
  const { savedCities, selectCity, removeCity } = useWeather();
  const { t } = useTranslation();

  if (!savedCities.length) return null;

  return (
    <div className="mt-2 flex flex-col gap-3 flex-shrink-0">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('sidebar.favoriteCities')}</h3>
      <div className="flex flex-col gap-2 pb-4">
        {savedCities.map((c, i) => (
          <div key={i} className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/50 hover:bg-white/80 transition-all duration-300 cursor-pointer border border-white/40 shadow-sm hover:shadow-md" onClick={() => selectCity(c)}>
            <div className="flex items-center gap-2.5 truncate">
              <FiMapPin className="text-blue-400" size={16} />
              <span className="font-semibold text-gray-700 truncate">{c.name}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); removeCity(c.lat, c.lon); }}
              className="p-1.5 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Remove city"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCities;
