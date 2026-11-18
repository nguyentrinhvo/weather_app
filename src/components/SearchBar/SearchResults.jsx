import { FiMapPin } from 'react-icons/fi';
import { useTranslation } from '../../context/LanguageContext';

const SearchResults = ({ isOpen, searchResults, searchLoading, debouncedQuery, activeIndex, handleSelect, setActiveIndex, dropdownRef }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  if (searchResults.length > 0) {
    return (
      <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-64 overflow-y-auto z-50 scrollbar-hide search-results-dropdown" ref={dropdownRef} role="listbox" id="search-results">
        {searchResults.map((city, idx) => (
          <li
            key={city.id || `${city.lat}-${city.lon}`}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${idx === activeIndex ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            onClick={() => handleSelect(city)}
            onMouseEnter={() => setActiveIndex(idx)}
            role="option"
            aria-selected={idx === activeIndex}
          >
            <FiMapPin className={`flex-shrink-0 ${idx === activeIndex ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
            <div className="flex flex-col overflow-hidden">
              <span className={`font-bold truncate ${idx === activeIndex ? 'text-blue-700' : 'text-gray-800'}`}>{city.name}</span>
              <span className="text-xs text-gray-500 font-medium truncate">
                {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (!searchResults.length && !searchLoading && debouncedQuery) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4 text-center" ref={dropdownRef}>
        <p className="text-gray-500 font-medium">{t('sidebar.noResults') || 'No cities found'}</p>
      </div>
    );
  }

  return null;
};

export default SearchResults;
