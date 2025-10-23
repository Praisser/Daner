import { createContext, useContext, useState, ReactNode } from "react";

export interface AppSettings {
  // Data Processing
  previewRowLimit: number;
  csvDelimiter: "comma" | "semicolon" | "tab" | "pipe";
  
  // Export Settings
  includeMetadata: boolean;
  compressExports: boolean;
  
  // Cleaning Preferences
  confirmBeforeCleaning: boolean;
  showOperationSummary: boolean;
  autoDetectDataTypes: boolean;
  
  // Privacy & Data
  clearDataOnLogout: boolean;
  anonymousUsageStats: boolean;
  
  // Advanced
  processingBatchSize: number;
  enableExperimentalFeatures: boolean;
  developerMode: boolean;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  previewRowLimit: 100,
  csvDelimiter: "comma",
  includeMetadata: true,
  compressExports: false,
  confirmBeforeCleaning: true,
  showOperationSummary: true,
  autoDetectDataTypes: true,
  clearDataOnLogout: true,
  anonymousUsageStats: false,
  processingBatchSize: 1000,
  enableExperimentalFeatures: false,
  developerMode: false,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Try to load settings from localStorage
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("datasetCleanerSettings");
      if (savedSettings) {
        try {
          return { ...defaultSettings, ...JSON.parse(savedSettings) };
        } catch (e) {
          console.error("Failed to parse saved settings", e);
        }
      }
    }
    return defaultSettings;
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("datasetCleanerSettings", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    if (typeof window !== "undefined") {
      localStorage.removeItem("datasetCleanerSettings");
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}