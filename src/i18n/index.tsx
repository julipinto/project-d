import { translator } from "@solid-primitives/i18n";
import type { ParentComponent } from "solid-js";
import { createEffect, createMemo, createSignal, useContext, createContext } from "solid-js";
import { useSettingsStore } from "../stores/settings-store";

// Import translations
import globalPtBr from "./locales/global/pt-BR";
import globalEn from "./locales/global/en";
import globalEs from "./locales/global/es";
import globalFr from "./locales/global/fr";

import containersPtBr from "../features/containers/i18n/locales/pt-BR";
import containersEn from "../features/containers/i18n/locales/en";
import containersEs from "../features/containers/i18n/locales/es";
import containersFr from "../features/containers/i18n/locales/fr";

import imagesPtBr from "../features/images/i18n/locales/pt-BR";
import imagesEn from "../features/images/i18n/locales/en";
import imagesEs from "../features/images/i18n/locales/es";
import imagesFr from "../features/images/i18n/locales/fr";

import volumesPtBr from "../features/volumes/i18n/locales/pt-BR";
import volumesEn from "../features/volumes/i18n/locales/en";
import volumesEs from "../features/volumes/i18n/locales/es";
import volumesFr from "../features/volumes/i18n/locales/fr";

import networksPtBr from "../features/networks/i18n/locales/pt-BR";
import networksEn from "../features/networks/i18n/locales/en";
import networksEs from "../features/networks/i18n/locales/es";
import networksFr from "../features/networks/i18n/locales/fr";

import settingsPtBr from "../features/settings/i18n/locales/pt-BR";
import settingsEn from "../features/settings/i18n/locales/en";
import settingsEs from "../features/settings/i18n/locales/es";
import settingsFr from "../features/settings/i18n/locales/fr";

import systemPtBr from "../features/system/i18n/locales/pt-BR";
import systemEn from "../features/system/i18n/locales/en";
import systemEs from "../features/system/i18n/locales/es";
import systemFr from "../features/system/i18n/locales/fr";

export type Locale = "pt-BR" | "en" | "es" | "fr";

// Helper function to flatten and prefix
function flattenWithPrefix(obj: unknown, prefix: string): Record<string, string> {
  const flattened: Record<string, string> = {};
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return flattened;

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const newKey = `${prefix}.${key}`;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(flattened, flattenWithPrefix(value, newKey));
    } else if (typeof value === "string") {
      flattened[newKey] = value;
    }
  }
  return flattened;
}

const dictionaries = {
  "pt-BR": {
    ...flattenWithPrefix(globalPtBr, "global"),
    ...flattenWithPrefix(containersPtBr, "containers"),
    ...flattenWithPrefix(imagesPtBr, "images"),
    ...flattenWithPrefix(volumesPtBr, "volumes"),
    ...flattenWithPrefix(networksPtBr, "networks"),
    ...flattenWithPrefix(settingsPtBr, "settings"),
    ...flattenWithPrefix(systemPtBr, "system"),
  },
  en: {
    ...flattenWithPrefix(globalEn, "global"),
    ...flattenWithPrefix(containersEn, "containers"),
    ...flattenWithPrefix(imagesEn, "images"),
    ...flattenWithPrefix(volumesEn, "volumes"),
    ...flattenWithPrefix(networksEn, "networks"),
    ...flattenWithPrefix(settingsEn, "settings"),
    ...flattenWithPrefix(systemEn, "system"),
  },
  es: {
    ...flattenWithPrefix(globalEs, "global"),
    ...flattenWithPrefix(containersEs, "containers"),
    ...flattenWithPrefix(imagesEs, "images"),
    ...flattenWithPrefix(volumesEs, "volumes"),
    ...flattenWithPrefix(networksEs, "networks"),
    ...flattenWithPrefix(settingsEs, "settings"),
    ...flattenWithPrefix(systemEs, "system"),
  },
  fr: {
    ...flattenWithPrefix(globalFr, "global"),
    ...flattenWithPrefix(containersFr, "containers"),
    ...flattenWithPrefix(imagesFr, "images"),
    ...flattenWithPrefix(volumesFr, "volumes"),
    ...flattenWithPrefix(networksFr, "networks"),
    ...flattenWithPrefix(settingsFr, "settings"),
    ...flattenWithPrefix(systemFr, "system"),
  },
};

// Map language codes from settings to locale codes
const languageToLocale: Record<string, Locale> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
  fr: "fr",
};

export type I18nContextType = {
  locale: () => Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextType | undefined>();

export const I18nProvider: ParentComponent = (props) => {
  const { language } = useSettingsStore();
  const [locale, setLocale] = createSignal<Locale>("pt-BR");

  // Sync locale with settings store
  createEffect(() => {
    const newLocale = languageToLocale[language()] || "pt-BR";
    setLocale(newLocale);
  });

  const dict = createMemo(() => dictionaries[locale()]);
  const t = translator(dict);

  const value: I18nContextType = {
    locale,
    setLocale,
    t: (key: string, params?: Record<string, string | number>) => {
      let translation = t(key);
      if (params && typeof translation === "string") {
        translation = translation.replace(/\{(\w+)\}/g, (_: string, paramKey: string) => {
          return String(params[paramKey] ?? `{${paramKey}}`);
        });
      }
      return typeof translation === "string" ? translation : key;
    },
  };

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
};

// Hook to use i18n
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
