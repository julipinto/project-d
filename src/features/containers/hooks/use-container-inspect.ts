import { useQuery } from "@tanstack/solid-query";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";
import { useDockerSystem } from "../../system/hooks/use-docker-system";
import type { ContainerInspectInfo } from "../types";

export function useContainerInspect(id: string) {
  const system = useDockerSystem();

  return useQuery(() => ({
    queryKey: ["container-inspect", id],
    queryFn: async () => {
      return await dockerInvoke<ContainerInspectInfo>("inspect_container", { id });
    },
    enabled: isDockerOnline() && !system.isToggling() && !!id,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  }));
}
