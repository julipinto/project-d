import type { Component } from "solid-js";
import { FolderOpen } from "lucide-solid";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { DynamicList } from "../../../../ui/dynamic-list";
import type { SetStoreFunction } from "solid-js/store";
import type { RunConfig } from "../../hooks/use-run-container";

interface Props {
  mounts: RunConfig["mounts"];
  setForm: SetStoreFunction<RunConfig>;
  onAdd: () => void;
  onRemove: (i: number) => void;
}

export const MountsSection: Component<Props> = (props) => {
  const handleBrowse = async (index: number) => {
    try {
      const selected = await openDialog({ directory: true, multiple: false });
      if (selected && typeof selected === "string") {
        props.setForm("mounts", index, "hostPath", selected);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DynamicList
      label="Volumes (Bind Mounts)"
      items={props.mounts}
      onAdd={props.onAdd}
      onRemove={props.onRemove}
      emptyText="Nenhum volume montado."
      renderItem={(item, i) => (
        <div class="col-span-2 grid grid-cols-2 gap-2">
          <div class="relative flex items-center">
            <input
              placeholder="Host (/home/...)"
              class="bg-black/20 border border-neutral-700 rounded-l px-2 py-1 text-sm text-white w-full pr-8"
              value={item.hostPath}
              onInput={(e) => props.setForm("mounts", i, "hostPath", e.currentTarget.value)}
            />
            <button
              type="button"
              onClick={() => handleBrowse(i)}
              class="absolute right-0 h-full px-2 bg-neutral-800 hover:bg-neutral-700 border-y border-r border-neutral-700 rounded-r text-neutral-400 hover:text-white"
            >
              <FolderOpen class="w-3 h-3" />
            </button>
          </div>
          <input
            placeholder="No Container (/data)"
            class="bg-black/20 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full"
            value={item.containerPath}
            onInput={(e) => props.setForm("mounts", i, "containerPath", e.currentTarget.value)}
          />
        </div>
      )}
    />
  );
};
