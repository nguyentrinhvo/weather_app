import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useWeather } from '../../context/WeatherContext';
import { useTranslation } from '../../context/LanguageContext';
import { Map as MapIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in React
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom smaller marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [20, 32], // Reduced from [25, 41]
  iconAnchor: [10, 32], // Centered at bottom
  popupAnchor: [1, -30],
  shadowSize: [32, 32]
});

const MapUpdater = React.memo(({ center }) => {
  const map = useMap();
  useEffect(() => {
    const currentZoom = map.getZoom();
    // Maintain current zoom or use 10 if it's the first time/low zoom
    const zoom = currentZoom < 5 ? 10 : currentZoom;
    map.setView(center, zoom, { animate: true });
  }, [center, map]);
  return null;
});

const WeatherMap = () => {
  const { city } = useWeather();
  const { t, language } = useTranslation();
  const [radarTime, setRadarTime] = useState(null);
  const [activeLayer, setActiveLayer] = useState('precipitation');

  useEffect(() => {
    const fetchRadarTime = async () => {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await res.json();
        // Get the latest timestamp from the past array
        if (data?.radar?.past?.length > 0) {
          setRadarTime(data.radar.past[data.radar.past.length - 1].time);
        }
      } catch (err) {
        console.error('Failed to fetch radar time:', err);
      }
    };
    fetchRadarTime();
  }, []);

  if (!city || !city.lat || !city.lon) return null;

  const position = [city.lat, city.lon];

  return (
    <section className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/50 mb-6" id="weather-map">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MapIcon className="text-blue-500" size={24} />
          {t('map.title')}
        </h2>
        <div className="flex bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-white/60 shadow-sm">
          <button
            onClick={() => setActiveLayer('precipitation')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              activeLayer === 'precipitation'
                ? 'bg-blue-500 text-white shadow'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/40'
            }`}
          >
            {t('map.precipitation')}
          </button>
          <button
            onClick={() => setActiveLayer('temperature')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              activeLayer === 'temperature'
                ? 'bg-orange-500 text-white shadow'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/40'
            }`}
          >
            {t('map.temperature')}
          </button>
        </div>
      </div>
      
      <div className="w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative z-10">
        <MapContainer 
          center={position} 
          zoom={10} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 10 }}
        >
          <TileLayer
            attribution='&copy; Google Maps'
            url={`https://mt1.google.com/vt/lyrs=m&hl=${language}&x={x}&y={y}&z={z}`}
            className="grayscale-map"
          />
          {activeLayer === 'precipitation' && radarTime && (
            <TileLayer
              attribution='&copy; RainViewer'
              url={`https://tilecache.rainviewer.com/v2/radar/${radarTime}/256/{z}/{x}/{y}/2/1_1.png`}
              opacity={0.6}
              maxNativeZoom={6}
              maxZoom={18}
            />
          )}
          {activeLayer === 'temperature' && (
            <TileLayer
              attribution='&copy; OpenWeatherMap'
              url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=b1b15e88fa797225412429c1c50c122a1"
              opacity={0.6}
            />
          )}
          <MapUpdater center={position} />
          <Marker position={position} icon={customMarkerIcon}>
            <Popup>
              <div className="font-bold text-gray-800">{city.name}</div>
              <div className="text-sm text-gray-500">{city.country}</div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Color Legend */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-[400] bg-white/90 backdrop-blur-md p-2 sm:p-3 rounded-xl shadow-lg border border-white/50 pointer-events-none transition-all duration-300">
          <p className="font-bold text-[10px] sm:text-xs text-gray-700 mb-1 sm:mb-1.5 px-0.5">
            {activeLayer === 'precipitation' ? t('map.precipitation') : t('map.temperature')}
          </p>
          <div className="flex flex-col gap-0.5 sm:gap-1 w-24 sm:w-32">
            <div 
              className="h-3 w-full rounded-md shadow-sm border border-black/5" 
              style={{ 
                background: activeLayer === 'precipitation' 
                  ? 'linear-gradient(to right, #00ECEC, #01A0F6, #0000F6, #00FF00, #FFFF00, #FF9000, #FF0000, #FF00FF)'
                  : 'linear-gradient(to right, #821692, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)'
              }}
            />
            {activeLayer === 'temperature' ? (
              <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-gray-500 px-0.5">
                <span>-40°C</span>
                <span>+40°C</span>
              </div>
            ) : (
              <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase px-0.5">
                 <span>{t('map.light')}</span>
                 <span>{t('map.heavy')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherMap;
