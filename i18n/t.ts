import { translations } from "@i18n/index";

export const translate = (
  lang: string,
  path: string,
  vars: Record<string, string | number> = {},
  pluralize: boolean = false
) => {
  const parts = path.split(".");

  let value: any = translations[lang as keyof typeof translations];

  // Navigate to the translation node
  for (const p of parts) {
    if (value[p] === undefined) return path;
    value = value[p];
  }

  // Handle pluralization if requested
  if (pluralize) {
    const n = Number(vars["n"]);
    if (isNaN(n)) {
      console.warn(`t("${path}") called with pluralize=true but vars.n is missing or invalid.`);
      return path;
    }

    if (typeof value !== "object" || value.one === undefined || value.other === undefined) {
      console.warn(`t("${path}") called with pluralize=true but value is not a plural object.`);
      return path;
    }

    // Pick the right form
    value = n <= 1 ? value.one : value.other;
  }

  // Replace interpolations {key}
  if (typeof value === "string") {
    return value.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
  }

  return path;
};

//// Deprecated: do not call `t()` directly because it may use hooks. Use `useT()` in components or `translate(lang, ...)`.
//export const t = (_path: string, _vars?: Record<string, string | number>, _pluralize?: boolean) => {
//  throw new Error("Do not call t() directly. Use useT() inside components or translate(lang, path, ...).");
//};
