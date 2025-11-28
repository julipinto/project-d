import type { Component } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import type { RunConfig } from "../../hooks/use-run-container";

interface Props {
  form: RunConfig;
  setForm: SetStoreFunction<RunConfig>;
}

export const BasicFields: Component<Props> = (props) => {
  return (
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2 sm:col-span-1">
        <label
          for="image"
          class="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2"
        >
          Imagem
        </label>
        <input
          id="image"
          type="text"
          value={props.form.image}
          onInput={(e) => props.setForm("image", e.currentTarget.value)}
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
          id="name"
          type="text"
          value={props.form.name}
          onInput={(e) => props.setForm("name", e.currentTarget.value)}
          placeholder="ex: meu-servidor-web"
          class="w-full bg-black/40 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500/50 outline-none text-sm"
        />
      </div>
    </div>
  );
};
