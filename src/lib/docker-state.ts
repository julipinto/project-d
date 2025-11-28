import { invoke } from "@tauri-apps/api/core";
import { createSignal } from "solid-js";

// O Estado Global
const [isDockerOnline, setIsDockerOnline] = createSignal(true);

export async function dockerInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  try {
    const result = await invoke<T>(command, args);

    // Se deu sucesso, garantimos que está online
    if (!isDockerOnline()) {
      setIsDockerOnline(true);
    }

    return result;
  } catch (error) {
    console.error(`[Middleware] ❌ Erro em ${command}:`, error);

    const errString = String(error).toLowerCase();

    // --- LISTA BRANCA (Erros que NÃO devem derrubar o app) ---
    const nonCriticalErrors = [
      "port is already allocated", // Porta em uso
      "address already in use", // Variação de porta em uso
      "container already exists", // Nome duplicado
      "no such container", // 404 de container
      "no such image", // 404 de imagem
      "conflict", // Erros de conflito genéricos do Docker
      "container criado", // Nossa mensagem customizada do Rust quando cria mas falha start
    ];

    // Se o erro for um desses, nós APENAS lançamos o erro para a UI mostrar o Toast,
    // mas NÃO mudamos o isDockerOnline para false.
    const isBusinessError = nonCriticalErrors.some((msg) => errString.includes(msg));

    if (isBusinessError) {
      throw error;
    }

    // --- LISTA NEGRA (Erros que indicam queda do sistema) ---
    if (
      errString.includes("connect") ||
      errString.includes("socket") ||
      errString.includes("os error") ||
      errString.includes("hyper legacy client") ||
      errString.includes("connection refused")
    ) {
      console.log("[Middleware] Detectado falha crítica de conexão. Mudando para OFFLINE.");
      setIsDockerOnline(false);
    }

    throw error;
  }
}

export { isDockerOnline, setIsDockerOnline };
