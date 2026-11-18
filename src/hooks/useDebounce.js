import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value by the specified delay.
 * Useful for delaying search API calls until the user stops typing.
 *
 * @param {*} value - The value to debounce
 * @param {number} [delay=500] - Delay in milliseconds
 * @returns {*} The debounced value
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
