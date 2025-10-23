import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    accentHover: string;
  };
};

export const themes: Theme[] = [
  {
    id: "dark-modern",
    name: "Dark Modern",
    description: "Dark theme with teal accents",
    colors: {
      background: "#0d1117",
      surface: "#161b22",
      surfaceHover: "#1c1f26",
      border: "#30363d",
      text: "#ffffff",
      textMuted: "#8b949e",
      accent: "#14b8a6",
      accentHover: "#0d9488",
    },
  },
  {
    id: "dark-plus",
    name: "Dark+",
    description: "VSCode default dark theme",
    colors: {
      background: "#1e1e1e",
      surface: "#252526",
      surfaceHover: "#2d2d30",
      border: "#3e3e42",
      text: "#d4d4d4",
      textMuted: "#858585",
      accent: "#007acc",
      accentHover: "#005a9e",
    },
  },
  {
    id: "monokai",
    name: "Monokai",
    description: "Classic dark theme",
    colors: {
      background: "#272822",
      surface: "#2e2e2e",
      surfaceHover: "#3e3d32",
      border: "#49483e",
      text: "#f8f8f2",
      textMuted: "#75715e",
      accent: "#66d9ef",
      accentHover: "#4fc3dc",
    },
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    description: "GitHub's dark theme",
    colors: {
      background: "#0d1117",
      surface: "#161b22",
      surfaceHover: "#1c2128",
      border: "#30363d",
      text: "#c9d1d9",
      textMuted: "#8b949e",
      accent: "#58a6ff",
      accentHover: "#388bfd",
    },
  },
  {
    id: "nord",
    name: "Nord",
    description: "Arctic, north-bluish color palette",
    colors: {
      background: "#2e3440",
      surface: "#3b4252",
      surfaceHover: "#434c5e",
      border: "#4c566a",
      text: "#eceff4",
      textMuted: "#d8dee9",
      accent: "#88c0d0",
      accentHover: "#81a1c1",
    },
  },
  {
    id: "dracula",
    name: "Dracula",
    description: "Dark theme with vivid colors",
    colors: {
      background: "#282a36",
      surface: "#343746",
      surfaceHover: "#44475a",
      border: "#6272a4",
      text: "#f8f8f2",
      textMuted: "#6272a4",
      accent: "#bd93f9",
      accentHover: "#9580d6",
    },
  },
  {
    id: "one-dark",
    name: "One Dark Pro",
    description: "Atom's iconic One Dark theme",
    colors: {
      background: "#282c34",
      surface: "#2c313a",
      surfaceHover: "#3e4451",
      border: "#3e4451",
      text: "#abb2bf",
      textMuted: "#5c6370",
      accent: "#61afef",
      accentHover: "#528bcc",
    },
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Fine-tuned for night coders",
    colors: {
      background: "#011627",
      surface: "#01111f",
      surfaceHover: "#1d3b53",
      border: "#1d3b53",
      text: "#d6deeb",
      textMuted: "#637777",
      accent: "#7fdbca",
      accentHover: "#5fb4a2",
    },
  },
];

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty("--color-background", theme.colors.background);
    root.style.setProperty("--color-surface", theme.colors.surface);
    root.style.setProperty("--color-surface-hover", theme.colors.surfaceHover);
    root.style.setProperty("--color-border", theme.colors.border);
    root.style.setProperty("--color-text", theme.colors.text);
    root.style.setProperty("--color-text-muted", theme.colors.textMuted);
    root.style.setProperty("--color-accent", theme.colors.accent);
    root.style.setProperty("--color-accent-hover", theme.colors.accentHover);
  };

  const setTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      localStorage.setItem("themeId", themeId);
    }
  };

  useEffect(() => {
    const savedThemeId = localStorage.getItem("themeId");
    if (savedThemeId) {
      const theme = themes.find((t) => t.id === savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
        applyTheme(theme);
      } else {
        applyTheme(themes[0]);
      }
    } else {
      applyTheme(themes[0]);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}