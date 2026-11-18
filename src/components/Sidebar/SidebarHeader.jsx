/**
 * SidebarHeader — App logo, unit toggle, and language switch.
 */
import { FiGlobe } from 'react-icons/fi';
import { useWeather } from '../../context/WeatherContext';
import { useTranslation } from '../../context/LanguageContext';

const SidebarHeader = () => {
  const { unit, toggleUnit } = useWeather();
  const { language, toggleLanguage, t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-1 gap-1">
      <div className="flex items-center">
        <h1 className="text-[1.05rem] sm:text-lg font-black tracking-tight text-gray-800 truncate">WhereThe4Cast</h1>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleUnit}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-bold text-blue-600 transition-all border border-blue-100 shadow-sm"
        >
          {unit === 'celsius' ? '°F' : '°C'}
        </button>
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/60 hover:bg-white rounded-xl text-xs font-bold text-blue-600 transition-all border border-blue-100 shadow-sm"
          title={t('sidebar.switchTo') + ' ' + (language === 'en' ? 'Tiếng Việt' : 'English')}
        >
          <FiGlobe size={14} />
          {language === 'en' ? 'EN' : 'VI'}
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
