import { useLanguage } from "@context/LanguageContext";

export const useCurrentLanguage = () => {
  return useLanguage().language;
};
