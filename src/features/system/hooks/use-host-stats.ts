import { createSignal, onCleanup, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";

interface HostStats {
  cpu_usage: number;
  memory_used: number;
  memory_total: number;
}

const DEFAULT_INTERVAL = 3 * 1000;

export function useHostStats() {
  const [stats, setStats] = createSignal<HostStats>({
    cpu_usage: 0,
    memory_used: 0,
    memory_total: 0,
  });

  onMount(() => {
    const fetchStats = async () => {
      try {
        const data = await invoke<HostStats>("get_host_stats");
        setStats(data);
      } catch (_e) {}
    };

    fetchStats();

    const interval = setInterval(fetchStats, DEFAULT_INTERVAL);

    onCleanup(() => clearInterval(interval));
  });

  return stats;
}
