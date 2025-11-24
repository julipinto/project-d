import { createSignal } from "solid-js";

export type ViewType = "containers" | "images" | "volumes" | "settings";

const [isSidebarExpanded, setIsSidebarExpanded] = createSignal(true);

const [activeView, setActiveView] = createSignal<ViewType>("containers");

export const useUIStore = () => {
  return {
    isSidebarExpanded,
    toggleSidebar: () => setIsSidebarExpanded((prev) => !prev),
    activeView,
    setActiveView,
  };
};
