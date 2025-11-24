import { invoke } from "@tauri-apps/api/core";
import { createSignal } from "solid-js";

const [isDockerOnline, setIsDockerOnline] = createSignal(true);

export async function dockerInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  try {
    const result = await invoke<T>(command, args);

    setIsDockerOnline(true);

    console.log(result);
    return result;
  } catch (error) {
    console.error(`[Middleware] ❌ Erro em ${command}:`, error);

    const errString = String(error);
    if (
      errString.includes("connect") ||
      errString.includes("socket") ||
      errString.includes("os error") ||
      errString.includes("hyper legacy client")
    ) {
      console.log("[Middleware] Detectado falha crítica. Mudando para OFFLINE.");
      setIsDockerOnline(false);
    }

    throw error;
  }
}

export { isDockerOnline, setIsDockerOnline };
