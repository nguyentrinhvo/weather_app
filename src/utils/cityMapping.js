/**
 * Bilingual City Mapping Utility
 * Maps Vietnamese transliterations or common city names to their English counterparts
 * for better search results with the Open-Meteo Geocoding API.
 */

const cityMap = {
  "oa sinh tơn": "Washington",
  "luân đôn": "London",
  "lân đôn": "London",
  "mát cơ va": "Moscow",
  "mát-cơ-va": "Moscow",
  "mat xa cơ va": "Moscow",
  "ba lê": "Paris",
  "pa ri": "Paris",
  "bắc kinh": "Beijing",
  "đông kinh": "Tokyo",
  "tô ki ô": "Tokyo",
  "niu óoc": "New York",
  "ni-u lân": "New York",
  "niu uớc": "New York",
  "xơ un": "Seoul",
  "sê un": "Seoul",
  "tân đức lý": "New Delhi",
  "tân đê li": "New Delhi",
  "manila": "Manila",
  "băng cốc": "Bangkok",
  "sài gòn": "Ho Chi Minh City",
  "đà nẵng": "Da Nang",
  "hải phòng": "Hai Phong",
  "cần thơ": "Can Tho",
  "huế": "Hue",
  "quy nhơn": "Qui Nhon",
  "vũng tàu": "Vung Tau",
  "nha trang": "Nha Trang",
  "buôn ma thuột": "Buon Ma Thuot",
  "phnôm pênh": "Phnom Penh",
  "vây-tiêng": "Vientiane",
  "viêng chăn": "Vientiane",
  "nam dinh": "Nam Định",
  "quang binh": "Quảng Bình",
};

/**
 * Normalizes Vietnamese text by removing accents
 */
export const removeAccents = (str) => {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

/**
 * Interprets a search query, mapping transliterations if found.
 */
export const interpretQuery = (query) => {
  const normalizedLower = query.toLowerCase().trim();

  // 1. Direct match in mapping
  if (cityMap[normalizedLower]) {
    return cityMap[normalizedLower];
  }

  // 2. Accent-free match in mapping
  const accentFree = removeAccents(normalizedLower);
  if (cityMap[accentFree]) {
    return cityMap[accentFree];
  }

  // 3. Fallback: just return the original query (Open-Meteo is quite good with basic Latin names)
  return query;
};
