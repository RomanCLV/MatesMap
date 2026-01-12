import { useColorScheme } from "react-native";

export function useColorSchemeSafe() {
  return useColorScheme() === "dark" ? "dark" : "light";
}
