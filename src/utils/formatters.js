/**
 * Date & Time Formatting Utilities
 * All functions related to formatting dates/times for display.
 */

/**
 * Format ISO time string to "HH:MM".
 */
export const formatTime = (isoStr) => {
  if (!isoStr) return '--:--';
  const date = new Date(isoStr);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Format ISO time string for hourly display.
 * Returns "Now" for current hour.
 */
export const formatHour = (isoStr, isNow = false, language = 'en') => {
  if (isNow) return language === 'vi' ? 'Bây giờ' : 'Now';
  const date = new Date(isoStr);
  return `${date.getHours().toString().padStart(2, '0')}:00`;
};

/**
 * Format date to "Today DD Mon".
 */
export const formatDate = (dateStr, language = 'en', timezone) => {
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  const tzOpt = timezone ? { timeZone: timezone } : {};
  const date = new Date(dateStr);
  
  const dayStr = date.toLocaleDateString(locale, { day: 'numeric', month: 'short', ...tzOpt });
  
  const nowStr = new Date().toLocaleDateString('en-CA', tzOpt);
  const dateStrFormatted = date.toLocaleDateString('en-CA', tzOpt);
  
  if (dateStrFormatted === nowStr) {
    return language === 'vi' ? `Hôm nay, ${dayStr}` : `Today, ${dayStr}`;
  }
  return date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', ...tzOpt });
};

/**
 * Format date to day name with localization.
 */
export const formatDay = (dateStr, language = 'en', timezone) => {
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  const tzOpt = timezone ? { timeZone: timezone } : {};
  
  const nowStr = new Date().toLocaleDateString('en-CA', tzOpt);
  const dateStrFormatted = dateStr.slice(0, 10);
  
  if (dateStrFormatted === nowStr) {
    return language === 'vi' ? 'Hôm nay' : 'Today';
  }
  
  const nowInHq = new Date(new Date().toLocaleString('en-US', tzOpt));
  nowInHq.setDate(nowInHq.getDate() + 1);
  const tomorrowStr = nowInHq.toLocaleDateString('en-CA');
  
  if (dateStrFormatted === tomorrowStr) {
    return language === 'vi' ? 'Ngày mai' : 'Tomorrow';
  }
  
  return new Date(dateStr).toLocaleDateString(locale, { weekday: 'long' });
};
