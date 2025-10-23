import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useTheme, themes } from "./ThemeContext";

interface ThemeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeSelector({ open, onOpenChange }: ThemeSelectorProps) {
  const { currentTheme, setTheme } = useTheme();

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-white max-w-2xl glass-dialog border" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
        <DialogHeader>
          <DialogTitle className="text-white">Choose a Theme</DialogTitle>
          <DialogDescription style={{ color: "var(--color-text-muted)" }}>
            Select a color theme for daner
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border glass-light`}
                style={{
                  backgroundColor: currentTheme.id === theme.id ? `${theme.colors.accent}20` : "rgba(255, 255, 255, 0.03)",
                  borderColor: currentTheme.id === theme.id ? `${theme.colors.accent}66` : "rgba(255, 255, 255, 0.05)",
                }}
                onMouseEnter={(e) => {
                  if (currentTheme.id !== theme.id) {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme.id !== theme.id) {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                  }
                }}
              >
                <div className="text-left">
                  <p className="text-white font-medium">{theme.name}</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>{theme.description}</p>
                </div>
                {currentTheme.id === theme.id && (
                  <Check className="w-5 h-5 flex-shrink-0" style={{ color: theme.colors.accent }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}