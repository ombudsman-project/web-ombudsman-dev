import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const condLocalValue = JSON.parse(window.sessionStorage.getItem(key)).remember != null ? true : false;
      const localValue = condLocalValue ? window.sessionStorage.getItem(key) : window.localStorage.getItem(key);
      return localValue ? JSON.parse(localValue) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    const rmbR = value ? value.remember : false;
    rmbR ? window.localStorage.setItem(key, JSON.stringify(value)) : window.sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
