import { type Component, For } from "solid-js";
import { Copy } from "lucide-solid";
import { Section, InfoGrid, InfoItem } from "./layout-helpers";
import type { ContainerInspectInfo } from "../../../types";
import { Button } from "../../../../../ui/button";
import { useI18n } from "../../../../../i18n";

interface Props {
  data: ContainerInspectInfo | undefined;
}

export const FormattedView: Component<Props> = (props) => {
  if (!props.data) return null;

  const { t } = useI18n();

  const envs = () => props.data?.Config?.Env || [];
  const networks = () =>
    (props.data?.NetworkSettings?.Networks || {}) as Record<string, { IPAddress?: string }>;
  const ports = () =>
    (props.data?.NetworkSettings?.Ports || {}) as Record<
      string,
      Array<{ HostIp: string; HostPort: string }> | null
    >;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div class="space-y-2 max-w-5xl mx-auto">
      {/* --- SEÇÃO 1: BÁSICO --- */}
      <Section title={t("containers.inspect.basic.title")}>
        <InfoGrid>
          <InfoItem label={t("containers.inspect.basic.idFull")} value={props.data?.Id} />
          <InfoItem label={t("containers.inspect.basic.image")} value={props.data?.Config?.Image} />
          <InfoItem
            label={t("containers.inspect.basic.command")}
            value={props.data?.Config?.Cmd?.join(" ")}
          />
          <InfoItem
            label={t("containers.inspect.basic.status")}
            value={props.data?.State?.Status}
          />
          <InfoItem
            label={t("containers.inspect.basic.createdAt")}
            value={props.data?.Created ? new Date(props.data.Created).toLocaleString() : "-"}
          />
          <InfoItem label={t("containers.inspect.basic.platform")} value={props.data?.Platform} />
        </InfoGrid>
      </Section>

      {/* --- SEÇÃO 2: REDE --- */}
      <Section title={t("containers.inspect.network.title")}>
        <div class="bg-neutral-900/50 border border-neutral-800 rounded p-4 font-mono text-xs space-y-4">
          {/* IPs */}
          <div>
            <div class="text-neutral-500 mb-2 font-bold uppercase text-[10px]">
              {t("containers.inspect.network.ipAddresses")}
            </div>
            <For each={Object.entries(networks())}>
              {([name, net]) => (
                <div class="flex justify-between border-b border-neutral-800 pb-1 mb-1 last:border-0">
                  <span class="text-blue-300">{name}</span>
                  <span class="text-emerald-400">
                    {(net as { IPAddress?: string }).IPAddress ||
                      t("containers.inspect.network.hostNone")}
                  </span>
                </div>
              )}
            </For>
          </div>

          {/* Portas */}
          <div>
            <div class="text-neutral-500 mb-2 font-bold uppercase text-[10px]">
              {t("containers.inspect.network.portMapping")}
            </div>
            <div class="grid grid-cols-1 gap-1">
              <For each={Object.entries(ports())}>
                {([port, bindings]) => (
                  <div class="flex justify-between">
                    <span class="text-amber-400">{port}</span>
                    <span class="text-neutral-300">
                      {bindings
                        ? // CORREÇÃO 3: Tipagem do item binding individual
                          (bindings as Array<{ HostIp: string; HostPort: string }>)
                            .map((b) => `${b.HostIp}:${b.HostPort}`)
                            .join(", ")
                        : "-"}
                    </span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </Section>

      {/* --- SEÇÃO 3: ENV VARS --- */}
      <Section title={t("containers.inspect.env.title", { count: envs().length })}>
        <div class="grid grid-cols-1 gap-2">
          <For each={envs()}>
            {(env: string) => {
              const [key, ...rest] = env.split("=");
              const value = rest.join("=");
              return (
                <div class="flex items-center justify-between group bg-neutral-900/50 border border-neutral-800 p-3 rounded hover:border-neutral-700 transition-colors">
                  <div class="flex flex-col overflow-hidden">
                    <span class="text-blue-400 font-mono font-bold text-xs">{key}</span>
                    <span
                      class="text-neutral-300 font-mono text-sm break-all mt-1 truncate"
                      title={value}
                    >
                      {value}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(value)}
                    class="opacity-0 group-hover:opacity-100 shrink-0 h-7 w-7 text-neutral-500 hover:text-white"
                    title={t("containers.inspect.env.copyValue")}
                  >
                    <Copy class="w-3.5 h-3.5" />
                  </Button>
                </div>
              );
            }}
          </For>
        </div>
      </Section>
    </div>
  );
};
