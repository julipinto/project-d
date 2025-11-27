import { useQuery } from "@tanstack/solid-query";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";
import { useDockerSystem } from "../../system/hooks/use-docker-system";
import type { ImageSummary } from "../types";

export function useImages(searchParam: () => string) {
  const system = useDockerSystem();

  const query = useQuery(() => ({
    queryKey: ["images", searchParam()],
    queryFn: async () => {
      return await dockerInvoke<ImageSummary[]>("list_images", {
        search: searchParam() || null,
      });
    },
    enabled: isDockerOnline() && !system.isToggling(),
    refetchOnWindowFocus: false,
    staleTime: 60000,
  }));

  return query;
}
