import { useEffect, useState } from 'react';

/**
 * Returns `value` only after the user stops changing it for `delayMs`.
 * Used so we don't call the API on every keystroke.
 */
function useDebounce(value, delayMs = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

export default useDebounce;
