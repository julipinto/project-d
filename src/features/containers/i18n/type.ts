import containersPtBr from "./locales/pt-BR";
import containersEn from "./locales/en";
import containersEs from "./locales/es";
import containersFr from "./locales/fr";

export type ContainersTranslations = typeof containersPtBr;

// Type check to ensure all locales have the same structure
export const _typeCheck: Record<"pt-BR" | "en" | "es" | "fr", ContainersTranslations> = {
  "pt-BR": containersPtBr,
  en: containersEn,
  es: containersEs,
  fr: containersFr,
};
