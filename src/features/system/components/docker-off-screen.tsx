import { Power, Activity, Settings, AlertTriangle, Globe, ServerCrash } from "lucide-solid";
import { Show } from "solid-js";
import { useUIStore } from "../../../stores/ui-store";
import { useDockerContextActions } from "../../settings/hooks/use-docker-context-actions";

interface Props {
  onTurnOn: () => void;
  pendingAction: "start" | "stop" | null;
}

export function DockerOffScreen(props: Props) {
  const { setActiveView } = useUIStore();
  const { activeConnection, connectionType } = useDockerContextActions();

  const isLoading = () => props.pendingAction === "start";
  const canTryAutoStart = () => connectionType() === "local";

  return (
    <div class="flex flex-col items-center justify-center h-full w-full p-8 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
      {/* Background Glow (Efeito de Luz Vermelha no fundo) */}
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Card Principal */}
      <div class="relative z-10 flex flex-col items-center max-w-md w-full bg-[#0d1117]/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        {/* Ícone de Erro */}
        <div class="mb-6 relative">
          <div class="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
          <div class="relative bg-[#161b22] p-4 rounded-xl border border-neutral-800 shadow-lg">
            <ServerCrash class="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Título e Subtítulo */}
        <h2 class="text-xl font-bold text-white tracking-tight mb-2">Conexão Indisponível</h2>

        <p class="text-neutral-400 text-sm text-center mb-6 leading-relaxed">
          Não foi possível estabelecer comunicação com o Docker Engine.
          <Show when={connectionType() === "remote"}>
            <br />
            <span class="text-amber-500/90 mt-1 block">
              Verifique sua VPN ou status do servidor remoto.
            </span>
          </Show>
        </p>

        {/* Detalhes Técnicos (Discretos) */}
        <div class="w-full bg-black/30 rounded-lg border border-neutral-800/50 p-3 mb-8 flex items-center gap-3 overflow-hidden">
          <div class="p-1.5 bg-neutral-800 rounded shrink-0 text-neutral-400">
            <Show
              when={connectionType() === "remote"}
              fallback={<AlertTriangle class="w-3.5 h-3.5" />}
            >
              <Globe class="w-3.5 h-3.5" />
            </Show>
          </div>
          <div class="flex flex-col min-w-0 text-left">
            <span class="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
              {connectionType() === "remote" ? "Endpoint Remoto" : "Socket Local"}
            </span>
            <code class="text-xs text-neutral-300 font-mono truncate" title={activeConnection()}>
              {activeConnection()}
            </code>
          </div>
        </div>

        {/* Ações (Botões) */}
        <div class="flex flex-col gap-3 w-full">
          {/* Botão Principal (Start) */}
          <Show when={canTryAutoStart()}>
            <button
              type="button"
              onClick={props.onTurnOn}
              disabled={props.pendingAction !== null}
              class="group relative flex items-center justify-center w-full px-4 py-2.5 font-semibold text-sm text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
            >
              <Show when={isLoading()} fallback={<Power class="w-4 h-4 mr-2" />}>
                <Activity class="w-4 h-4 mr-2 animate-spin" />
              </Show>
              {isLoading() ? "Tentando iniciar..." : "Iniciar Serviço Local"}
            </button>
          </Show>

          {/* Botão Secundário (Settings) */}
          <button
            type="button"
            onClick={() => setActiveView("settings")}
            class="flex items-center justify-center w-full px-4 py-2.5 font-medium text-sm text-neutral-400 transition-all duration-200 bg-transparent hover:bg-neutral-800/50 rounded-lg hover:text-white border border-neutral-800 hover:border-neutral-700 active:scale-[0.98]"
          >
            <Settings class="w-4 h-4 mr-2" />
            Gerenciar Conexões
          </button>
        </div>
      </div>
    </div>
  );
}
