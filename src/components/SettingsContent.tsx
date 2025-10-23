import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSettings } from "./SettingsContext";
import { RotateCcw } from "lucide-react";

export function SettingsContent() {
  const { settings, updateSettings, resetSettings } = useSettings();

  return (
    <div className="space-y-6 mt-4 max-h-[500px] overflow-y-auto pr-2">
      {/* Data Processing */}
      <div className="glass-light rounded-xl p-5 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
        <h4 className="text-white mb-4">Data Processing</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Preview row limit</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Maximum rows to display in preview</p>
            </div>
            <Select 
              value={settings.previewRowLimit.toString()} 
              onValueChange={(value) => updateSettings({ previewRowLimit: parseInt(value) })}
            >
              <SelectTrigger className="w-32 glass-light" style={{ borderColor: "rgba(255, 255, 255, 0.1)", color: "var(--color-text)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-dialog" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <SelectItem value="50" className="select-item-custom">50</SelectItem>
                <SelectItem value="100" className="select-item-custom">100</SelectItem>
                <SelectItem value="500" className="select-item-custom">500</SelectItem>
                <SelectItem value="1000" className="select-item-custom">1000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>CSV delimiter</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Default delimiter for CSV files</p>
            </div>
            <Select 
              value={settings.csvDelimiter} 
              onValueChange={(value: any) => updateSettings({ csvDelimiter: value })}
            >
              <SelectTrigger className="w-32 glass-light" style={{ borderColor: "rgba(255, 255, 255, 0.1)", color: "var(--color-text)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-dialog" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <SelectItem value="comma" className="select-item-custom">Comma (,)</SelectItem>
                <SelectItem value="semicolon" className="select-item-custom">Semicolon (;)</SelectItem>
                <SelectItem value="tab" className="select-item-custom">Tab</SelectItem>
                <SelectItem value="pipe" className="select-item-custom">Pipe (|)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

      {/* Export Settings */}
      <div className="glass-light rounded-xl p-5 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
        <h4 className="text-white mb-4">Export Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Include metadata</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Add cleaning info to exports</p>
            </div>
            <Switch 
              checked={settings.includeMetadata} 
              onCheckedChange={(checked) => updateSettings({ includeMetadata: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Compress exports</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Compress files as .zip</p>
            </div>
            <Switch 
              checked={settings.compressExports} 
              onCheckedChange={(checked) => updateSettings({ compressExports: checked })}
            />
          </div>
        </div>
      </div>

      <Separator style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

      {/* Cleaning Preferences */}
      <div className="glass-light rounded-xl p-5 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
        <h4 className="text-white mb-4">Cleaning Preferences</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Confirm before cleaning</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Show confirmation dialog</p>
            </div>
            <Switch 
              checked={settings.confirmBeforeCleaning} 
              onCheckedChange={(checked) => updateSettings({ confirmBeforeCleaning: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Show operation summary</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Display stats after cleaning</p>
            </div>
            <Switch 
              checked={settings.showOperationSummary} 
              onCheckedChange={(checked) => updateSettings({ showOperationSummary: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Auto-detect data types</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Automatically identify column types</p>
            </div>
            <Switch 
              checked={settings.autoDetectDataTypes} 
              onCheckedChange={(checked) => updateSettings({ autoDetectDataTypes: checked })}
            />
          </div>
        </div>
      </div>

      <Separator style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

      {/* Privacy & Data */}
      <div className="glass-light rounded-xl p-5 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
        <h4 className="text-white mb-4">Privacy & Data</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Clear data on logout</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Auto-delete session data</p>
            </div>
            <Switch 
              checked={settings.clearDataOnLogout} 
              onCheckedChange={(checked) => updateSettings({ clearDataOnLogout: checked })}
            />
          </div>

          <div className="flex items-center space-x-3">
            <Switch 
              id="analytics"
              checked={settings.anonymousAnalytics}
              onCheckedChange={(checked) => updateSettings('anonymousAnalytics', checked)}
            />
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Anonymous usage stats</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Help improve daner</p>
            </div>
          </div>
        </div>
      </div>

      <Separator style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

      {/* Advanced */}
      <div className="glass-light rounded-xl p-5 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
        <h4 className="text-white mb-4">Advanced</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Processing batch size</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Rows processed per batch</p>
            </div>
            <Select 
              value={settings.processingBatchSize.toString()} 
              onValueChange={(value) => updateSettings({ processingBatchSize: parseInt(value) })}
            >
              <SelectTrigger className="w-32 glass-light" style={{ borderColor: "rgba(255, 255, 255, 0.1)", color: "var(--color-text)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-dialog" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <SelectItem value="500" className="select-item-custom">500</SelectItem>
                <SelectItem value="1000" className="select-item-custom">1000</SelectItem>
                <SelectItem value="5000" className="select-item-custom">5000</SelectItem>
                <SelectItem value="10000" className="select-item-custom">10000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Enable experimental features</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Access beta functionality</p>
            </div>
            <Switch 
              checked={settings.enableExperimentalFeatures} 
              onCheckedChange={(checked) => updateSettings({ enableExperimentalFeatures: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg glass-light">
            <div className="flex-1">
              <Label style={{ color: "var(--color-text)" }}>Developer mode</Label>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Show debug information</p>
            </div>
            <Switch 
              checked={settings.developerMode} 
              onCheckedChange={(checked) => updateSettings({ developerMode: checked })}
            />
          </div>
        </div>
      </div>

      <Separator style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

      {/* Reset Button */}
      <div className="pt-2">
        <Button
          variant="outline"
          onClick={resetSettings}
          className="w-full"
          style={{ 
            backgroundColor: "var(--color-background)", 
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)"
          }}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}