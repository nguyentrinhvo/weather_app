import { useState } from 'react';
import { LocateFixed } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useWeather } from '../../context/WeatherContext';

const GeolocationButton = ({ onLocateComplete }) => {
  const { selectCity } = useWeather();
  const { t } = useTranslation();
  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!('geolocation' in navigator)) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=vi`);
          const data = await res.json();
          const locationName = data.city || data.locality || data.principalSubdivision || 'Lấy vị trí';
          const countryName = data.countryName || 'Bản đồ';
          selectCity({ name: locationName, country: countryName, lat, lon: lng });
          onLocateComplete();
        } catch {
          selectCity({ name: 'Lấy vị trí', country: 'Bản đồ', lat, lon: lng });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Locate error", error);
        alert(t('sidebar.locationError') || "Could not access location!");
        setIsLocating(false);
      }
    );
  };

  return (
    <button
      onClick={handleGetCurrentLocation}
      disabled={isLocating}
      className={`p-2 rounded-lg transition-colors mix-blend-multiply cursor-pointer flex items-center justify-center ${isLocating ? 'text-gray-400' : 'text-blue-500 hover:text-blue-600 hover:bg-blue-100'}`}
      title={t('sidebar.currentLocation')}
      type="button"
    >
      <LocateFixed size={20} strokeWidth={2.5} className={isLocating ? 'animate-pulse' : ''} />
    </button>
  );
};

export default GeolocationButton;
