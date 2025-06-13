import { onMounted, onUnmounted, ref } from "vue";

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
  const getInitialValue = () => safeParseJSON(getLocalValue(key), defaultValue);

  const value = ref(getInitialValue());

  const updateValue = (newValue: T) => {
    value.value = newValue;
  };

  const setValue = (newValue: T) => {
    try {
      if (newValue !== value.value) {
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

  const handleStorage = (event: StorageEvent) => {
    if (event.key === key) {
      try {
        updateValue(JSON.parse(event.newValue ?? ""));
      } catch (e) {}
    }
  };

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    try {
      updateValue(JSON.parse(customEvent.detail));
    } catch (e) {}
  };

  onMounted(() => {
    window.addEventListener("storage", handleStorage);
    window.addEventListener(getCustomEventName(key), handleCustomEvent);
  });

  onUnmounted(() => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(getCustomEventName(key), handleCustomEvent);
  });

  return { value, setValue };
};
