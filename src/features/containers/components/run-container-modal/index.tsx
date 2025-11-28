import { type Component, createMemo, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Play, Terminal, ChevronDown, ChevronUp, Loader2 } from "lucide-solid";
import toast from "solid-toast";
import { type RunConfig, useRunContainer } from "../../hooks/use-run-container";
import { DynamicList } from "../../../../ui/dynamic-list";
import { Modal } from "../../../../ui/modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialImage?: string; // Para pré-preencher se vier da aba de Imagens
}

export const RunContainerModal: Component<Props> = (props) => {
  const { runContainer } = useRunContainer();
  const [isRunning, setIsRunning] = createSignal(false);
  const [showAdvanced, setShowAdvanced] = createSignal(false);

  // Estado do Formulário (Store para facilitar arrays aninhados)
  const [form, setForm] = createStore<RunConfig>({
    image: props.initialImage || "",
    name: "",
    ports: [],
    env: [],
  });

  // Reset ao abrir
  const reset = () => {
    setForm({ image: props.initialImage || "", name: "", ports: [], env: [] });
    setShowAdvanced(false);
  };

  // --- MÁGICA: Gerador de Comando em Tempo Real ---
  const commandPreview = createMemo(() => {
    const parts = ["docker run", "-d"];

    if (form.name) parts.push(`--name ${form.name}`);

    form.ports.forEach((p) => {
      if (p.host && p.container) parts.push(`-p ${p.host}:${p.container}`);
    });

    form.env.forEach((e) => {
      if (e.key) parts.push(`-e ${e.key}=${e.value}`);
    });

    parts.push(form.image || "<imagem>");

    return parts.join(" ");
  });
  // -----------------------------------------------

  const handleSubmit = async () => {
    if (!form.image) return;
    setIsRunning(true);
    try {
      await runContainer(form);
      toast.success(`Container iniciado com sucesso!`);
      props.onClose();
      reset();
    } catch (e) {
      toast.error(String(e));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Rodar Novo Container"
      maxWidth="max-w-2xl"
      footer={
        <div class="flex justify-between w-full items-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced())}
            class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            {showAdvanced() ? <ChevronUp class="w-3 h-3" /> : <ChevronDown class="w-3 h-3" />}
            {showAdvanced() ? "Menos opções" : "Opções avançadas"}
          </button>
          <div class="flex gap-2">
            <button
              type="button"
              onClick={props.onClose}
              disabled={isRunning()}
              class="px-4 py-2 text-sm text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isRunning() || !form.image}
              class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              <Show when={isRunning()} fallback={<Play class="w-4 h-4 fill-current" />}>
                <Loader2 class="w-4 h-4 animate-spin" />
              </Show>
              Run
            </button>
          </div>
        </div>
      }
    >
      <div class="space-y-6">
        {/* 1. Básico */}
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2 sm:col-span-1">
            <label
              for="image"
              class="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2"
            >
              Imagem
            </label>
            <input
              type="text"
              id="image"
              value={form.image}
              onInput={(e) => setForm("image", e.currentTarget.value)}
              placeholder="ex: nginx:latest"
              class="w-full bg-black/40 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500/50 outline-none text-sm font-mono"
            />
          </div>
          <div class="col-span-2 sm:col-span-1">
            <label
              for="name"
              class="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2"
            >
              Nome (Opcional)
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onInput={(e) => setForm("name", e.currentTarget.value)}
              placeholder="ex: meu-servidor-web"
              class="w-full bg-black/40 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500/50 outline-none text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 2. Portas */}
          <DynamicList
            label="Mapeamento de Portas"
            items={form.ports}
            onAdd={() => setForm("ports", [...form.ports, { host: "", container: "" }])}
            onRemove={(i) => setForm("ports", (p) => p.filter((_, idx) => idx !== i))}
            emptyText="Nenhuma porta exposta."
            renderItem={(item, i) => (
              <>
                <input
                  placeholder="Host (8080)"
                  class="bg-black/20 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full"
                  value={item.host}
                  onInput={(e) => setForm("ports", i, "host", e.currentTarget.value)}
                />
                <input
                  placeholder="Container (80)"
                  class="bg-black/20 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full"
                  value={item.container}
                  onInput={(e) => setForm("ports", i, "container", e.currentTarget.value)}
                />
              </>
            )}
          />

          {/* 3. Variáveis de Ambiente (Avançado ou não? Deixei visível pois é comum) */}
          <DynamicList
            label="Variáveis de Ambiente"
            items={form.env}
            onAdd={() => setForm("env", [...form.env, { key: "", value: "" }])}
            onRemove={(i) => setForm("env", (e) => e.filter((_, idx) => idx !== i))}
            emptyText="Nenhuma variável definida."
            renderItem={(item, i) => (
              <>
                <input
                  placeholder="KEY"
                  class="bg-black/20 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full font-mono text-xs"
                  value={item.key}
                  onInput={(e) => setForm("env", i, "key", e.currentTarget.value)}
                />
                <input
                  placeholder="VALUE"
                  class="bg-black/20 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full"
                  value={item.value}
                  onInput={(e) => setForm("env", i, "value", e.currentTarget.value)}
                />
              </>
            )}
          />
        </div>

        {/* 4. Área Avançada (Escondida por padrão) */}
        <Show when={showAdvanced()}>
          <div class="pt-4 border-t border-dashed border-neutral-800 animate-in slide-in-from-top-2 fade-in">
            <p class="text-xs text-neutral-500 italic text-center">
              Opções de Volumes, Rede e Restart Policy virão aqui no futuro.
            </p>
          </div>
        </Show>

        {/* 5. Command Preview */}
        <div class="bg-[#0d1117] border border-neutral-800 rounded-lg p-3 group">
          <div class="flex justify-between items-center mb-2">
            <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
              <Terminal class="w-3 h-3" /> Comando Gerado
            </span>
          </div>
          <code class="block font-mono text-xs text-emerald-400 break-all whitespace-pre-wrap">
            {commandPreview()}
          </code>
        </div>
      </div>
    </Modal>
  );
};
