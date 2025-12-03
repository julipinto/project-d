import type { Component } from "solid-js";
import { Calendar, Globe, type LucideIcon, Settings, Shield } from "lucide-solid";
import { formatTimeAgo } from "../../../../utils/format";
import type { Network } from "../../types";
import { useI18n } from "../../../../i18n";

interface Props {
  network?: Network | null;
}

const InfoCard = (props: { label: string; value: string; icon: LucideIcon }) => (
  <div class="bg-[#161b22] border border-neutral-800 p-4 rounded-xl shadow-sm">
    <div class="flex items-center gap-2 text-neutral-500 mb-1">
      <props.icon class="w-4 h-4" />
      <span class="text-[10px] font-bold uppercase tracking-wider">{props.label}</span>
    </div>
    <div class="text-sm font-medium text-white truncate" title={props.value}>
      {props.value}
    </div>
  </div>
);

export const GeneralTab: Component<Props> = (props) => {
  const { t } = useI18n();
  if (!props.network) {
    return (
      <div class="p-12 text-center text-neutral-600 italic">
        {t("networks.details.general.notFound")}
      </div>
    );
  }

  const config = () => props.network?.IPAM?.Config?.[0] || {};

  return (
    <div class="space-y-6 p-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard
          label={t("networks.details.general.driver")}
          value={props.network.Driver}
          icon={Settings}
        />
        <InfoCard
          label={t("networks.details.general.scope")}
          value={props.network.Scope}
          icon={Globe}
        />
        <InfoCard
          label={t("networks.details.general.internal")}
          value={
            props.network.Internal
              ? t("networks.details.general.yes")
              : t("networks.details.general.no")
          }
          icon={Shield}
        />
        <InfoCard
          label={t("networks.details.general.created")}
          value={formatTimeAgo(new Date(props.network.Created).getTime() / 1000)}
          icon={Calendar}
        />
      </div>

      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">
          {t("networks.details.general.ipamTitle")}
        </h3>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label for="subnet" class="text-xs text-neutral-500 block mb-1">
              {t("networks.details.general.subnetLabel")}
            </label>
            <code
              id="subnet"
              class="bg-neutral-900 px-2 py-1 rounded border border-neutral-800 text-emerald-400 font-mono text-sm"
            >
              {config().Subnet || t("networks.details.general.autoNA")}
            </code>
          </div>
          <div>
            <label for="gateway" class="text-xs text-neutral-500 block mb-1">
              {t("networks.details.general.gatewayLabel")}
            </label>
            <code
              id="gateway"
              class="bg-neutral-900 px-2 py-1 rounded border border-neutral-800 text-blue-400 font-mono text-sm"
            >
              {config().Gateway || t("networks.details.general.autoNA")}
            </code>
          </div>
        </div>
      </section>
    </div>
  );
};
