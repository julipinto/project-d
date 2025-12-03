import { createEffect, createSignal, onCleanup } from "solid-js";
import { useQuery, useQueryClient } from "@tanstack/solid-query";
import { invoke } from "@tauri-apps/api/core";
import { dockerInvoke, isDockerOnline, setIsDockerOnline } from "../../../lib/docker-state";

const [pendingAction, setPendingAction] = createSignal<"start" | "stop" | null>(null);

const SYSTEM_KEY = ["docker-system-status"];

export function useDockerSystem() {
  const queryClient = useQueryClient();

  const isToggling = () => pendingAction() !== null;

  // 1. Ping query
  const query = useQuery(() => ({
    queryKey: SYSTEM_KEY,
    queryFn: async () => {
      try {
        await invoke("ping_docker");
        return true;
      } catch (_e) {
        return false;
      }
    },
    refetchOnWindowFocus: true,
    retry: false,
    refetchInterval: (q) => {
      if (isToggling()) return false;
      return q.state.data === false ? 2000 : 10000;
    },
  }));

  // 2. Recovery polling
  createEffect(() => {
    let interval: number | undefined;

    if (!isDockerOnline()) {
      interval = setInterval(async () => {
        try {
          const isActive = await invoke<boolean>("is_docker_service_active");
          if (isActive) {
            console.log("✅ SystemD active. Reconnecting Docker...");
            await dockerInvoke("ping_docker");
            queryClient.invalidateQueries();
          }
        } catch (_e) {
          /* silent retry */
        }
      }, 5000) as unknown as number;
    }

    onCleanup(() => {
      if (interval) clearInterval(interval);
    });
  });

  const toggleDockerService = async (action: "start" | "stop") => {
    if (isToggling()) return;

    setPendingAction(action);

    try {
      if (action === "start") queryClient.setQueryData(SYSTEM_KEY, true);

      await dockerInvoke("manage_docker", { action });

      if (action === "stop") setIsDockerOnline(false);

      setTimeout(async () => {
        await query.refetch();
        await queryClient.invalidateQueries();
        setPendingAction(null);
      }, 3000);
    } catch (err) {
      alert(`Error while managing Docker: ${err}`);
      setPendingAction(null);
      query.refetch();
    }
  };

  return {
    isChecking: query.isLoading,
    isDockerOnline,
    toggleDockerService,
    pendingAction,
    isToggling,
    refetch: query.refetch,
  };
}
