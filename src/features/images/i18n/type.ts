import imagesPtBr from "./locales/pt-BR";
import imagesEn from "./locales/en";
import imagesEs from "./locales/es";
import imagesFr from "./locales/fr";

export type ImagesTranslations = typeof imagesPtBr;

// Type check to ensure all locales have the same structure
export const _typeCheck: Record<"pt-BR" | "en" | "es" | "fr", ImagesTranslations> = {
  "pt-BR": imagesPtBr,
  en: imagesEn,
  es: imagesEs,
  fr: imagesFr,
};

