import { useQuery, useQueryClient } from "@tanstack/solid-query";
import { listen } from "@tauri-apps/api/event";
import { onCleanup, onMount } from "solid-js";
import type { ContainerSummary } from "../types";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";
import { useDockerSystem } from "../../system/hooks/use-docker-system";

export function useContainers(searchParam: () => string) {
  const queryClient = useQueryClient();
  const system = useDockerSystem();

  const query = useQuery(() => ({
    queryKey: ["containers", searchParam()],
    queryFn: async () => {
      return await dockerInvoke<ContainerSummary[]>("list_containers", {
        search: searchParam() || null,
      });
    },
    enabled: isDockerOnline() && !system.isToggling(),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 10000,
  }));

  onMount(async () => {
    let unlisten: (() => void) | undefined;
    try {
      unlisten = await listen("docker-event", () => {
        if (isDockerOnline() && !system.isToggling()) {
          queryClient.invalidateQueries({ queryKey: ["containers"] });
        }
      });
    } catch (e) {
      console.warn(e);
    }
    onCleanup(() => unlisten?.());
  });

  return query;
}
