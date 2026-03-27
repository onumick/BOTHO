import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize with initialValue to ensure server/client match during hydration
  const [value, setValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage after mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('localStorage read failed', error);
    } finally {
      setIsInitialized(true);
    }
  }, [key]);

  // Sync to local storage when value changes, but only after initialization
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('localStorage write failed', error);
    }
  }, [key, value, isInitialized]);

  return [value, setValue] as const;
}
