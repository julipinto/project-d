import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useQueryClient } from "@tanstack/solid-query";
import { getSetting, saveSetting } from "../../../stores/disk-settings-store";

type ConnectionType = "local" | "remote";

interface ContextConfigResponse {
  uri: string;
  connection_type: ConnectionType;
}

// --- Global singleton state ---
// Starts with default values, then is overridden from disk on mount
const [activeConnection, setActiveConnection] = createSignal("unix:///var/run/docker.sock");
const [connectionType, setConnectionType] = createSignal<ConnectionType>("local");
const [customPath, setCustomPath] = createSignal("");

export function useDockerContextActions() {
  const queryClient = useQueryClient();

  // 1. Initial sync: Disk -> Memory -> Rust
  onMount(async () => {
    try {
      const savedConn = await getSetting<string>("docker.active-connection");
      const savedType = await getSetting<ConnectionType>("docker.connection-type");
      // const savedInput = await getSetting<string>("docker.custom-path-input");

      // If there is a saved connection, apply it in Rust and in memory
      if (savedConn) {
        setActiveConnection(savedConn);
        if (savedType) setConnectionType(savedType);

        // Tell Rust to use this socket (fire-and-forget to avoid blocking UI)
        invoke("set_docker_context", { endpoint: savedConn }).catch(console.error);
      }

      // Restore what was previously written in the input
      // if (savedInput) setCustomPath(savedInput);
    } catch (e) {
      console.error("Erro ao carregar configurações:", e);
    }
  });

  // 2. Apply context: UI -> Rust -> Memory -> Disk
  const applyContext = async (endpoint: string) => {
    try {
      // Call Rust and wait for the formatted object { uri, connection_type }
      const response = await invoke<ContextConfigResponse>("set_docker_context", { endpoint });

      console.log("Docker context applied:", response);

      // Update in-memory state
      setActiveConnection(response.uri);
      setConnectionType(response.connection_type);
      // setCustomPath(response.uri); // Also update the visible input

      // Persist on disk
      await saveSetting("docker.active-connection", response.uri);
      await saveSetting("docker.connection-type", response.connection_type);
      await saveSetting("docker.custom-path-input", response.uri);

      // Reset queries so we fetch data from the new Docker context
      queryClient.invalidateQueries();
    } catch (err) {
      alert(`Error connecting to Docker: ${err}`);
    }
  };

  const browseSocketFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        directory: false,
      });

      if (selected === null) return;

      if (typeof selected !== "string") {
        alert("Formato de arquivo não suportado.");
        return;
      }

      // Only update the visible input
      setCustomPath(selected);
      // Save input draft on disk (optional, but good for UX)
      saveSetting("docker.custom-path-input", selected);
    } catch (err) {
      console.error("Erro ao abrir diálogo:", err);
    }
  };

  return {
    activeConnection,
    connectionType,
    browseSocketFile,
    applyContext,
    customPath,
    setCustomPath,
  };
}
