import { useCallback, useEffect, useState } from "react";

const safeParseJSON = <T>(value: string | null, fallback: T): T => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
};

const getLocalValue = (key: string) => window.localStorage.getItem(key);

const getCustomEventName = (key: string) => `app:event:localstorage:${key}`;

export const useSyncedLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setVal] = useState(() =>
    safeParseJSON(getLocalValue(key), defaultValue)
  );

  const updateValue = useCallback((newValue: T) => {
    setVal(newValue);
  }, []);

  const setValue = (newValue: T) => {
    try {
      if (newValue !== value) {
        const newJSON = JSON.stringify(newValue);

        // 当前组件更新
        updateValue(newValue);

        // 多组件更新
        const customEvent = new CustomEvent(getCustomEventName(key), {
          detail: newJSON,
        });
        window.dispatchEvent(customEvent);

        // 跨页面更新
        window.localStorage.setItem(key, newJSON);
      }
    } catch (e) {
      console.error("LocalStorage set error:", e);
    }
  };

  const handleStorage = useCallback(
    (event: StorageEvent) => {
      if (event.key === key) {
        try {
          updateValue(JSON.parse(event.newValue ?? ""));
        } catch (e) {}
      }
    },
    [key, updateValue]
  );

  useEffect(() => {
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [handleStorage]);

  const handleCustomEvent = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      try {
        updateValue(JSON.parse(customEvent.detail));
      } catch (e) {}
    },
    [updateValue]
  );

  useEffect(() => {
    const eventName = getCustomEventName(key);
    window.addEventListener(eventName, handleCustomEvent);
    return () => {
      window.removeEventListener(eventName, handleCustomEvent);
    };
  }, [handleCustomEvent, key]);

  return { value, setValue };
};
