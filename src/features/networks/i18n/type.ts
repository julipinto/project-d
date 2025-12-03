import networksPtBr from "./locales/pt-BR";
import networksEn from "./locales/en";
import networksEs from "./locales/es";
import networksFr from "./locales/fr";

export type NetworksTranslations = typeof networksPtBr;

// Type check to ensure all locales have the same structure
export const _typeCheck: Record<"pt-BR" | "en" | "es" | "fr", NetworksTranslations> = {
  "pt-BR": networksPtBr,
  en: networksEn,
  es: networksEs,
  fr: networksFr,
};

