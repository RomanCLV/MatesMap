// types/form-config.ts

import { Activity, SportType } from "./activity";

// Types de champs de formulaire
export type FieldType = "number" | "boolean" | "string" | "select";

export interface BaseFieldConfig {
  name: string;
  label: string;
  icon?: string;
  required?: boolean;
  placeholder?: string;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // "km", "min/km", "m", etc.
}

export interface BooleanFieldConfig extends BaseFieldConfig {
  type: "boolean";
  defaultValue?: boolean;
}

export interface StringFieldConfig extends BaseFieldConfig {
  type: "string";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  forbiddenChars?: string[];
  forbiddenValues?: string[];
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: Array<{ value: string; label: string }>;
}

export type FieldConfig =
  | NumberFieldConfig
  | BooleanFieldConfig
  | StringFieldConfig
  | SelectFieldConfig;

// Configuration d'un formulaire pour un sport
export interface SportFormConfig {
  sport: SportType;
  fields: Record<string, FieldConfig>;
}

// Configuration d'affichage pour une activité
export interface DisplayFieldConfig {
  label: string;
  icon?: string;
  format?: (value: any) => string; // Fonction de formatage personnalisée
  unit?: string;
  hidden?: boolean; // Pour masquer certains champs dans certaines vues
}

export interface SportDisplayConfig {
  sport: SportType;
  fields: Record<string, DisplayFieldConfig>;
  summary?: (activity: Activity) => string; // Résumé en une ligne
}
