import { useCurrentLanguage } from "@hooks/useCurrentLanguage";
import { translate } from "./t";

export const useT = () => {
  const lang = useCurrentLanguage();
  return (path: string, vars: Record<string, string | number> = {}, pluralize: boolean = false) =>
    translate(lang, path, vars, pluralize);
};