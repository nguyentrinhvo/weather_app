/**
 * Sidebar — Main sidebar composition.
 * Composes SidebarHeader, SearchBar, CurrentWeather, and SavedCities.
 */
import SidebarHeader from './SidebarHeader';
import CurrentWeather from './CurrentWeather';
import SavedCities from './SavedCities';
import SearchBar from '../SearchBar/SearchBar';

import { useEffect, useRef } from 'react';
import { useWeather } from '../../context/WeatherContext';

const Sidebar = () => {
  const { city } = useWeather();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [city]);

  return (
    <aside className="w-full xl:w-80 flex-shrink-0 bg-white/40 backdrop-blur-md rounded-3xl p-6 flex flex-col gap-4 shadow-lg xl:h-[calc(100vh-3rem)] border border-white/50 relative overflow-visible" id="sidebar">
      <SidebarHeader />

      <div className="relative z-50">
        <SearchBar />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-6 scrollbar-hide">
        <CurrentWeather />
        <SavedCities />
      </div>
    </aside>
  );
};

export default Sidebar;
