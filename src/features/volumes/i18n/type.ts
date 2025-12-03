import volumesPtBr from "./locales/pt-BR";
import volumesEn from "./locales/en";
import volumesEs from "./locales/es";
import volumesFr from "./locales/fr";

export type VolumesTranslations = typeof volumesPtBr;

// Type check to ensure all locales have the same structure
export const _typeCheck: Record<"pt-BR" | "en" | "es" | "fr", VolumesTranslations> = {
  "pt-BR": volumesPtBr,
  en: volumesEn,
  es: volumesEs,
  fr: volumesFr,
};
