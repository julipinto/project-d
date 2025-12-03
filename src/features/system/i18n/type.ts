import systemPtBr from "./locales/pt-BR";
import systemEn from "./locales/en";
import systemEs from "./locales/es";
import systemFr from "./locales/fr";

export type SystemTranslations = typeof systemPtBr;

// Type check to ensure all locales have the same structure
export const _typeCheck: Record<"pt-BR" | "en" | "es" | "fr", SystemTranslations> = {
  "pt-BR": systemPtBr,
  en: systemEn,
  es: systemEs,
  fr: systemFr,
};
