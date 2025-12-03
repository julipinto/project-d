import settingsPtBr from "./locales/pt-BR";
import settingsEn from "./locales/en";
import settingsEs from "./locales/es";
import settingsFr from "./locales/fr";

export type SettingsTranslations = typeof settingsPtBr;

// Type check to ensure all locales have the same structure
export const _typeCheck: Record<"pt-BR" | "en" | "es" | "fr", SettingsTranslations> = {
  "pt-BR": settingsPtBr,
  en: settingsEn,
  es: settingsEs,
  fr: settingsFr,
};

