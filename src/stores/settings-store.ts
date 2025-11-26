import { createPersistentSignal } from "../utils/persistent";

const [showSystemMonitor, setShowSystemMonitor] = createPersistentSignal<boolean>(
  "settings.showSystemMonitor",
  true,
);

export const useSettingsStore = () => {
  return {
    showSystemMonitor,
    setShowSystemMonitor,
  };
};
