/**
 * Background Theme Utility
 * Maps WMO weather codes and day/night status to gradient class names.
 */

export const getBackgroundClass = (code, isDay) => {
  if (!isDay) {
    // Night Themes
    if (code === 0) return 'from-[#0b172e] to-[#122c54]';
    if (code >= 1 && code <= 3) return 'from-[#172535] to-[#2d4761]';
    if (code >= 45 && code <= 48) return 'from-[#131d27] to-[#3a4b57]';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'from-[#101b2b] to-[#25415e]';
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'from-[#182638] to-[#3b5470]';
    if (code >= 95) return 'from-[#0e1620] to-[#203248]';
    return 'from-[#0b172e] to-[#122c54]';
  }
  // Day Themes
  if (code === 0) return 'from-[#2a7bd6] to-[#60a8e6]';
  if (code >= 1 && code <= 2) return 'from-[#4b8cdb] to-[#80bdff]';
  if (code === 3) return 'from-[#556880] to-[#8fa2b8]';
  if (code >= 45 && code <= 48) return 'from-[#768a9b] to-[#a3b8c8]';
  if (code >= 51 && code <= 55) return 'from-[#526a80] to-[#7f9cb5]';
  if ((code >= 56 && code <= 67) || (code >= 80 && code <= 82)) return 'from-[#3b5973] to-[#5a7f9c]';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'from-[#7b9fcc] to-[#aecbf0]';
  if (code >= 95) return 'from-[#435263] to-[#647b94]';
  return 'from-[#2a7bd6] to-[#60a8e6]';
};
