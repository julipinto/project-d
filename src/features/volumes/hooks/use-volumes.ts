import { useQuery } from "@tanstack/solid-query";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";
import { useDockerSystem } from "../../system/hooks/use-docker-system";
import type { Volume } from "../types";

export function useVolumes(searchParam: () => string) {
  const system = useDockerSystem();

  return useQuery(() => ({
    queryKey: ["volumes", searchParam()],
    queryFn: async () => {
      return await dockerInvoke<Volume[]>("list_volumes", {
        search: searchParam() || null,
      });
    },
    enabled: isDockerOnline() && !system.isToggling(),
    refetchOnWindowFocus: false,
    staleTime: 10000,
  }));
}
