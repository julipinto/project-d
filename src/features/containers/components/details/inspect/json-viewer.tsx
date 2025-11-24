import type { Component } from "solid-js";
import type { ContainerInspectInfo } from "../../../types";

interface Props {
  data: ContainerInspectInfo | undefined;
}

export const JsonViewer: Component<Props> = (props) => {
  if (!props.data) return null;
  return (
    <pre class="font-mono text-xs text-neutral-400 whitespace-pre-wrap break-all bg-neutral-900 p-4 rounded border border-neutral-800 shadow-inner">
      {JSON.stringify(props.data, null, 2)}
    </pre>
  );
};
