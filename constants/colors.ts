// Palette de couleurs brutes avec système numérique
export const Colors = {
  brand: {
    primary: "#4A90E2",
    primaryLight: "#9EBDE2",
    secondary: "#34C759",
    secondaryLight: "#8BC79A",
    accent: "#FF9500",
    accentLight: "#FFDBB2",
    error: "#FF3B30",
    errorLight: "#fd857cff",
  },
  // Échelle de gris : 0 (blanc) -> 950 (presque noir)
  gray: {
    0: "#FFFFFF",      // Blanc pur
    50: "#F2F0EF",     // Off-white
    100: "#F5F5F7",    // Très clair
    200: "#E5E5E5",
    300: "#D9D9D9",
    400: "#C5C5CC",
    500: "#B3B3B3",    // Médium
    600: "#8E8E93",
    700: "#666666",
    800: "#1E1E1E",    // Sombre
    900: "#1C1C1E",
    950: "#121212",    // Presque noir
    1000: "#000000",   // Noir pur
  },
} as const;

// Thèmes avec des noms sémantiques qui pointent vers les couleurs
export const LightTheme = {
  isDark: false,
  brand: {
    ...Colors.brand
  },
  background: {
    primary: Colors.gray[50],       // Off-white
    secondary: Colors.gray[100],    // Très clair
    surface: Colors.gray[0],        // Blanc
    card: Colors.gray[0],           // Blanc
    highlight: Colors.gray[200],
    shadow: "rgba(0,0,0,0.1)",
    inverse: Colors.gray[950],
  },
  text: {
    // Hiérarchie de texte
    primary: Colors.gray[900],      // Presque noir
    secondary: Colors.gray[600],    // Gris médium
    tertiary: Colors.gray[500],     // Gris clair
    disabled: Colors.gray[300],     // Très clair
    
    // Sur fonds colorés
    onBrand: Colors.gray[0],        // Blanc
    
    // Sémantique
    error: Colors.brand.error,
    success: Colors.brand.secondary,
    warning: Colors.brand.accent,
    
    // Spéciaux
    inverse: Colors.gray[0],        // Blanc
    link: Colors.brand.primary,
  },
  border: {
    light: Colors.gray[300],
    medium: Colors.gray[600],
    dark: Colors.gray[800],
  },
  button: {
    primary: {
      background: Colors.brand.primary,
      text: Colors.gray[0],
    },
    secondary: {
      background: Colors.brand.secondary,
      text: Colors.gray[0],
    },
    accent: {
      background: Colors.brand.accent,
      text: Colors.gray[0],
    },
    error: {
      background: Colors.brand.error,
      text: Colors.gray[0],
    },
    disabled: {
      background: Colors.gray[400],
      text: Colors.gray[300],
    },
  },
} as const;

export const DarkTheme = {
  isDark: true,
  brand: {
    ...Colors.brand
  },
  background: {
    primary: Colors.gray[950],      // Presque noir
    secondary: Colors.gray[900],    // Très sombre
    surface: Colors.gray[800],      // Sombre
    card: Colors.gray[900],         // Très sombre
    highlight: Colors.gray[700],
    shadow: "rgba(255,255,255,0.05)",
    inverse: Colors.gray[0],
  },
  text: {
    // Hiérarchie de texte
    primary: Colors.gray[0],        // Blanc
    secondary: Colors.gray[300],    // Gris clair
    tertiary: Colors.gray[500],     // Gris médium
    disabled: Colors.gray[600],     // Gris sombre
    
    // Sur fonds colorés
    onBrand: Colors.gray[0],
    
    // Sémantique (versions plus claires pour mode sombre)
    error: Colors.brand.errorLight,
    success: Colors.brand.secondaryLight,
    warning: Colors.brand.accentLight,
    
    // Spéciaux
    inverse: Colors.gray[900],
    link: Colors.brand.primaryLight,
  },
  border: {
    light: Colors.gray[700],
    medium: Colors.gray[500],
    dark: Colors.gray[200],
  },
  button: {
    primary: {
      background: Colors.brand.primary,
      text: Colors.gray[0],
    },
    secondary: {
      background: Colors.brand.secondary,
      text: Colors.gray[0],
    },
    accent: {
      background: Colors.brand.accent,
      text: Colors.gray[0],
    },
    error: {
      background: Colors.brand.error,
      text: Colors.gray[0],
    },
    disabled: {
      background: Colors.gray[700],
      text: Colors.gray[600],
    },
  },
} as const;

export const Themes = {
  light: LightTheme,
  dark: DarkTheme,
} as const;

export type ThemeName = keyof typeof Themes;
export type Theme = typeof Themes[ThemeName];
