import { useState, useRef, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Map as MapIcon } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useTranslation } from '../../context/LanguageContext';
import useDebounce from '../../hooks/useDebounce';
import GeolocationButton from './GeolocationButton';
import SearchResults from './SearchResults';

const SearchBar = () => {
  const { searchCity, searchResults, searchLoading, selectCity } = useWeather();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery) {
      searchCity(debouncedQuery);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery, searchCity]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    selectCity({ name: city.name, country: city.country, lat: city.lat, lon: city.lon });
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        const target = activeIndex >= 0 ? searchResults[activeIndex] : searchResults[0];
        handleSelect(target);
      }
      return;
    }
    
    if (!isOpen || !searchResults.length) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((p) => (p < searchResults.length - 1 ? p + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((p) => (p > 0 ? p - 1 : searchResults.length - 1));
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default: break;
    }
  };

  const onLocateComplete = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full z-50 group" id="search-bar">
      <div className="relative flex items-center w-full bg-white/70 hover:bg-white/90 focus-within:bg-white/100 rounded-2xl border border-white/50 shadow-sm transition-all focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-300">
        <FiSearch className="absolute left-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input
          ref={inputRef}
          type="text"
          className="w-full bg-transparent py-3.5 pl-12 pr-[74px] text-gray-800 placeholder:text-sm placeholder-gray-500 font-semibold outline-none rounded-2xl"
          placeholder={t('sidebar.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if(query) setIsOpen(true) }}
          aria-label="Search for a city"
          aria-expanded={isOpen}
          id="city-search-input"
        />
        {searchLoading ? (
          <div className="absolute right-4 w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin pointer-events-none" />
        ) : (
          <div className="absolute right-2 flex items-center gap-1.5 z-10">
            <GeolocationButton onLocateComplete={onLocateComplete} />
            <button
              onClick={() => document.getElementById('weather-map')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors mix-blend-multiply cursor-pointer flex items-center justify-center"
              title={t('map.title') || 'Weather Map'}
              type="button"
            >
              <MapIcon size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      <SearchResults 
        isOpen={isOpen}
        searchResults={searchResults}
        searchLoading={searchLoading}
        debouncedQuery={debouncedQuery}
        activeIndex={activeIndex}
        handleSelect={handleSelect}
        setActiveIndex={setActiveIndex}
        dropdownRef={dropdownRef}
      />
    </div>
  );
};

export default SearchBar;
