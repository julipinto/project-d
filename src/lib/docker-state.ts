import { invoke } from "@tauri-apps/api/core";
import { createSignal } from "solid-js";

// Global Docker connectivity state
const [isDockerOnline, setIsDockerOnline] = createSignal(true);

export async function dockerInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  try {
    const result = await invoke<T>(command, args);

    // If the call succeeds, make sure we mark Docker as online
    if (!isDockerOnline()) {
      setIsDockerOnline(true);
    }

    return result;
  } catch (error) {
    console.error(`[Middleware] ❌ Erro em ${command}:`, error);

    const errString = String(error).toLowerCase();

    // --- Whitelist: business errors that should NOT take the app offline ---
    const nonCriticalErrors = [
      "port is already allocated", // Port already in use
      "address already in use", // Port-in-use variation
      "container already exists", // Duplicate name
      "no such container", // Container 404
      "no such image", // Image 404
      "conflict", // Generic Docker conflict errors
      "container criado", // Custom Rust message when create succeeds but start fails
    ];

    // If the error is one of these, just rethrow so the UI can show a toast,
    // but do NOT mark Docker as offline.
    const isBusinessError = nonCriticalErrors.some((msg) => errString.includes(msg));

    if (isBusinessError) {
      throw error;
    }

    // --- Blacklist: errors that indicate a critical connectivity problem ---
    if (
      errString.includes("connect") ||
      errString.includes("socket") ||
      errString.includes("os error") ||
      errString.includes("hyper legacy client") ||
      errString.includes("connection refused")
    ) {
      console.log("[Middleware] Critical connection failure detected. Switching to OFFLINE state.");
      setIsDockerOnline(false);
    }

    throw error;
  }
}

export { isDockerOnline, setIsDockerOnline };
