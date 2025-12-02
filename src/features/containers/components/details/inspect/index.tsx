import { type Component, createSignal, Show } from "solid-js";
import { Loader2, Code, List } from "lucide-solid";
import { useContainerInspect } from "../../../hooks/use-container-inspect";

// Imports dos subcomponentes
import { FormattedView } from "./formatted-view";
import { JsonViewer } from "./json-viewer";
import { Button } from "../../../../../ui/button";

interface Props {
  containerId: string;
}

export const InspectView: Component<Props> = (props) => {
  const query = useContainerInspect(props.containerId);
  const [showRaw, setShowRaw] = createSignal(false);

  return (
    <div class="h-full flex flex-col bg-[#0d1117] text-sm overflow-hidden">
      {/* Toolbar de Controle */}
      <div class="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm z-10">
        <div class="flex items-center gap-2 text-neutral-400">
          <Show when={showRaw()} fallback={<List class="w-4 h-4 text-blue-500" />}>
            <Code class="w-4 h-4 text-amber-500" />
          </Show>
          <span class="font-medium text-neutral-200">
            {showRaw() ? "JSON Bruto" : "Visão Geral"}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRaw(!showRaw())}
          class="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
        >
          {showRaw() ? "Ver Formatado" : "Ver JSON Puro"}
        </Button>
      </div>

      {/* Área de Conteúdo */}
      <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <Show
          when={!query.isLoading}
          fallback={
            <div class="h-full flex flex-col items-center justify-center text-neutral-500 gap-3">
              <Loader2 class="w-8 h-8 animate-spin text-blue-500" />
              <span>Carregando detalhes do container...</span>
            </div>
          }
        >
          <Show when={!showRaw()} fallback={<JsonViewer data={query.data} />}>
            <FormattedView data={query.data} />
          </Show>
        </Show>
      </div>
    </div>
  );
};
