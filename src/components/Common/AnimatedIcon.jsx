// Eagerly load all weather SVG icons
const iconModules = import.meta.glob(
  '/node_modules/@bybas/weather-icons/production/fill/all/*.svg',
  { eager: true, query: '?url', import: 'default' }
);

// Map icon names to their corresponding URLs
const iconMap = {};
for (const [path, url] of Object.entries(iconModules)) {
  const name = path.split('/').pop().replace('.svg', '');
  iconMap[name] = url;
}

// Map WMO weather codes to appropriate icon names
const getIconName = (code, isDay) => {
  const dn = isDay ? 'day' : 'night';

  if (code === 0) return isDay ? 'clear-day' : 'clear-night';
  if (code === 1 || code === 2) return `partly-cloudy-${dn}`;
  if (code === 3) return `overcast-${dn}`;
  if (code === 45 || code === 48) return `fog-${dn}`;
  if (code >= 51 && code <= 55) return `partly-cloudy-${dn}-drizzle`;
  if (code === 56 || code === 57) return `partly-cloudy-${dn}-sleet`;
  if (code >= 61 && code <= 65) return `partly-cloudy-${dn}-rain`;
  if (code === 66 || code === 67) return `partly-cloudy-${dn}-sleet`;
  if (code >= 71 && code <= 77) return `partly-cloudy-${dn}-snow`;
  if (code >= 80 && code <= 82) return `partly-cloudy-${dn}-rain`;
  if (code === 85 || code === 86) return `partly-cloudy-${dn}-snow`;
  if (code === 95) return `thunderstorms-${dn}-rain`;
  if (code === 96 || code === 99) return `thunderstorms-${dn}-snow`;

  return isDay ? 'clear-day' : 'clear-night';
};

// Render the animated SVG icon with custom wrapper styles
const AnimatedIcon = ({ weatherCode, isDay = true, size = 64, className = "" }) => {
  const iconName = getIconName(weatherCode, isDay);
  const src = iconMap[iconName] || iconMap['not-available'];

  // Render nothing if icon not found
  if (!src) return null;

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <img
        src={src}
        alt={iconName}
        width={size}
        height={size}
        loading="lazy"
        style={{
          objectFit: 'contain',
          filter: 'saturate(1.4) contrast(1.15) drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
        }}
      />
    </div>
  );
};

export default AnimatedIcon;
