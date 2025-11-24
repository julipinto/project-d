import { For, Show } from "solid-js";
import { RefreshCw, Zap, Box } from "lucide-solid";
import { useImages } from "../hooks/use-images";
import { ImageItemRow } from "./image-item-row";

export function ImageList() {
  const query = useImages();

  return (
    <div class="space-y-6 pb-12">
      {/* Header */}
      <div class="flex justify-between items-end border-b border-neutral-800 pb-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Imagens Locais</h2>
          <p class="text-neutral-500 text-sm mt-1">{query.data?.length || 0} imagens armazenadas</p>
        </div>

        <div class="flex items-center gap-2 text-xs font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 text-neutral-400">
          <Show when={query.isFetching} fallback={<Zap class="w-3 h-3 text-emerald-500" />}>
            <RefreshCw class="w-3 h-3 animate-spin text-blue-500" />
          </Show>
          <span>{query.isFetching ? "SYNCING" : "ONLINE"}</span>
        </div>
      </div>

      {/* Tabela */}
      <div class="border border-neutral-800 rounded-lg bg-neutral-900/40 overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-neutral-900 border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              <th class="p-4 w-[35%]">Tag / Repositório</th>
              <th class="p-4 w-[15%]">ID</th>
              <th class="p-4 w-[15%]">Tamanho</th>
              <th class="p-4 w-[20%]">Criado em</th>
              <th class="p-4 text-right w-[15%]">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800/50 text-sm">
            <For each={query.data}>{(img) => <ImageItemRow image={img} />}</For>

            {/* Fallback para lista vazia */}
            <Show when={query.data?.length === 0}>
              <tr>
                <td colspan={5} class="p-12 text-center text-neutral-500">
                  <div class="flex flex-col items-center gap-2">
                    <Box class="w-8 h-8 opacity-20" />
                    <span class="italic">Nenhuma imagem encontrada localmente.</span>
                  </div>
                </td>
              </tr>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
}
