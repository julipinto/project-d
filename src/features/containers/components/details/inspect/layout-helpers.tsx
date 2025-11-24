import type { ParentComponent } from "solid-js";

export const Section: ParentComponent<{ title: string }> = (props) => (
  <section class="mb-8">
    <h3 class="text-lg font-bold text-white mb-4 border-l-4 border-blue-600 pl-3">{props.title}</h3>
    {props.children}
  </section>
);

export const InfoGrid: ParentComponent = (props) => (
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">{props.children}</div>
);

export const InfoItem = (props: { label: string; value?: string | number }) => (
  <div class="bg-neutral-900/30 p-3 rounded border border-neutral-800/50 overflow-hidden">
    <div class="text-neutral-500 text-xs uppercase tracking-wider mb-1">{props.label}</div>
    <div class="text-neutral-200 font-mono text-sm truncate" title={String(props.value)}>
      {props.value || "-"}
    </div>
  </div>
);
