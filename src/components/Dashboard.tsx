import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Upload, HelpCircle, Settings, CheckCircle2, FileDown, AlertCircle, X } from "lucide-react";
import { SettingsContent } from "./SettingsContent";
import { useSettings } from "./SettingsContext";

interface DashboardProps {
  uploadedFile: File | null;
  isSidebarCollapsed: boolean;
  onUpload?: (file: File) => void;
  onCancel?: () => void;
  uploadTimestamp?: number;
}

type CleaningStep = "initial" | "selecting" | "cleaned";

export function Dashboard({ uploadedFile, isSidebarCollapsed, onUpload, onCancel, uploadTimestamp }: DashboardProps) {
  const { settings } = useSettings();
  const [currentStep, setCurrentStep] = useState<CleaningStep>("initial");
  const [selectedOperations, setSelectedOperations] = useState<string[]>([]);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [confirmCleaningOpen, setConfirmCleaningOpen] = useState(false);
  const [cleaningSummaryOpen, setCleaningSummaryOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cleaningStats, setCleaningStats] = useState({
    rowsBefore: 0,
    rowsAfter: 0,
    duplicatesRemoved: 0,
    missingValuesHandled: 0,
  });

  const cleaningOptions = [
    { id: "duplicates", label: "Remove duplicates" },
    { id: "missing", label: "Handle missing values" },
    { id: "formats", label: "Standardize formats" },
    { id: "normalize", label: "Normalize data" },
    { id: "outliers", label: "Remove outliers" },
    { id: "inconsistencies", label: "Fix inconsistencies" },
    { id: "types", label: "Convert data types" },
    { id: "encode", label: "Encode categorical data" },
  ];

  const sampleData = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", age: 28, city: "New York" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", age: 34, city: "Los Angeles" },
    { id: 3, name: "Carol White", email: "carol@example.com", age: 29, city: "Chicago" },
    { id: 4, name: "David Brown", email: "david@example.com", age: 42, city: "Houston" },
    { id: 5, name: "Emma Davis", email: "emma@example.com", age: 31, city: "Phoenix" },
  ];

  const toggleOperation = (id: string) => {
    setSelectedOperations((prev) =>
      prev.includes(id) ? prev.filter((op) => op !== id) : [...prev, id]
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file type is supported
      const supportedTypes = ['.csv', '.xlsx', '.xls', '.json'];
      const fileExtension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
      
      if (fileExtension && supportedTypes.includes(fileExtension)) {
        if (onUpload) {
          onUpload(file);
        }
      } else {
        alert('Unsupported file type. Please upload CSV, Excel, or JSON files.');
      }
    }
  };

  const handleApplyCleaning = () => {
    setCurrentStep("cleaned");
  };

  const handleExport = async (format: string) => {
    // Mock export functionality - in production this would generate and download the file
    const fileName = `cleaned_data.${format}`;
    console.log(`Exporting as ${format}...`);
    
    // Create mock data based on format
    let content = "";
    let mimeType = "";
    
    if (format === "csv") {
      // Use the CSV delimiter from settings
      const delimiter = settings.csvDelimiter === "comma" ? "," : 
                       settings.csvDelimiter === "semicolon" ? ";" :
                       settings.csvDelimiter === "tab" ? "\t" : "|";
      
      content = `ID${delimiter}Name${delimiter}Email${delimiter}Age${delimiter}City\n`;
      sampleData.forEach(row => {
        content += `${row.id}${delimiter}${row.name}${delimiter}${row.email}${delimiter}${row.age}${delimiter}${row.city}\n`;
      });
      mimeType = "text/csv";
    } else if (format === "json") {
      const dataToExport = settings.includeMetadata ? {
        metadata: {
          exportDate: new Date().toISOString(),
          operationsApplied: selectedOperations,
          rowCount: sampleData.length,
        },
        data: sampleData
      } : sampleData;
      content = JSON.stringify(dataToExport, null, 2);
      mimeType = "application/json";
    } else if (format === "xlsx") {
      // For Excel, we'll create a CSV as a mock
      const delimiter = ",";
      content = `ID${delimiter}Name${delimiter}Email${delimiter}Age${delimiter}City\n`;
      sampleData.forEach(row => {
        content += `${row.id}${delimiter}${row.name}${delimiter}${row.email}${delimiter}${row.age}${delimiter}${row.city}\n`;
      });
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
    
    // Check if compression is enabled
    if (settings.compressExports) {
      // Use JSZip to compress the file
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add metadata file if enabled
      if (settings.includeMetadata && format !== "json") {
        const metadata = {
          exportDate: new Date().toISOString(),
          operationsApplied: selectedOperations,
          rowCount: sampleData.length,
          format: format,
        };
        zip.file("metadata.json", JSON.stringify(metadata, null, 2));
      }
      
      // Add the main data file
      zip.file(fileName, content);
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cleaned_data.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      // Create and trigger download without compression
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  // Reset to selecting view when new file is uploaded
  useEffect(() => {
    if (uploadedFile && uploadTimestamp) {
      setCurrentStep("selecting");
      setSelectedOperations([]);
    } else if (!uploadedFile) {
      setCurrentStep("initial");
    }
  }, [uploadedFile, uploadTimestamp]);

  // Show upload view if no file
  if (!uploadedFile && currentStep === "initial") {
    return (
      <>
        <div className="flex-1 flex flex-col" style={{ backgroundColor: "var(--color-background)" }}>
          {/* Header */}
          <div className="border-b px-8 py-4 flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
            <h2 style={{ color: "var(--color-text)" }}>Smarter cleaning. Better data. Powered by Daner</h2>
            <div className="flex items-center gap-3">
              <button className="transition-colors" style={{ color: "var(--color-text-muted)" }} onClick={() => setHelpDialogOpen(true)}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}>
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="transition-colors" style={{ color: "var(--color-text-muted)" }} onClick={() => setSettingsDialogOpen(true)}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}>
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 glass-light shadow-lg">
                <Upload className="w-12 h-12" style={{ color: "var(--color-accent)" }} />
              </div>
              <h2 className="mb-3" style={{ color: "var(--color-text)" }}>Upload your dataset to start cleaning</h2>
              <p className="mb-8" style={{ color: "var(--color-text-muted)" }}>Supports CSV, Excel, JSON</p>
              <div 
                className="border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer"
                style={{ 
                  borderColor: isDragging ? "var(--color-accent)" : "rgba(255, 255, 255, 0.2)",
                  backgroundColor: isDragging ? "rgba(20, 184, 166, 0.1)" : "rgba(255, 255, 255, 0.03)",
                  backdropFilter: isDragging ? "blur(20px)" : "blur(10px)",
                  transform: isDragging ? "scale(1.02)" : "scale(1)",
                  boxShadow: isDragging ? "0 8px 32px rgba(20, 184, 166, 0.3)" : "none"
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <p style={{ color: isDragging ? "var(--color-accent)" : "var(--color-text-muted)" }}>
                  {isDragging ? "Drop your file here" : "Drag and drop your file here, or click \"Upload Dataset\" in the sidebar"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Dialog */}
        <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
          <DialogContent className="text-white glass-dialog" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <DialogHeader>
              <DialogTitle className="text-white">Help & Documentation</DialogTitle>
              <DialogDescription style={{ color: "var(--color-text-muted)" }}>
                Learn how to use Dataset Cleaner effectively
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="glass-light rounded-xl p-4">
                <h4 className="text-white mb-2">Getting Started</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  Upload your dataset using the sidebar button. Supported formats include CSV, Excel, and JSON files.
                </p>
              </div>
              <div className="glass-light rounded-xl p-4">
                <h4 className="text-white mb-2">Cleaning Operations</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  Select the cleaning operations you want to apply to your dataset. You can choose multiple operations.
                </p>
              </div>
              <div className="glass-light rounded-xl p-4">
                <h4 className="text-white mb-2">Exporting Data</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  After cleaning, you can export your data in CSV, Excel, or JSON format.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
          <DialogContent className="border-gray-700 text-white" style={{ backgroundColor: "var(--color-surface)" }}>
            <DialogHeader>
              <DialogTitle className="text-white">Settings</DialogTitle>
              <DialogDescription style={{ color: "var(--color-text-muted)" }}>
                Configure your Dataset Cleaner preferences
              </DialogDescription>
            </DialogHeader>
            <SettingsContent />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Show cleaning operations view
  if (currentStep === "selecting") {
    return (
      <>
        <div className="flex-1 flex flex-col" style={{ backgroundColor: "var(--color-background)" }}>
          {/* Header */}
          <div className="border-b px-8 py-4 flex items-center justify-between relative" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-3">
              <button 
                className="px-3 py-1.5 rounded-lg transition-all text-sm"
                style={{ 
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                  color: "#ef4444"
                }}
                onClick={onCancel}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                }}
              >
                <div className="flex items-center gap-1.5">
                  <X className="w-4 h-4" />
                  <span>Cancel Session</span>
                </div>
              </button>
            </div>
            <p className="text-sm absolute left-1/2 transform -translate-x-1/2" style={{ color: "var(--color-text-muted)" }}>
              Smarter cleaning. Better data. Powered by Daner
            </p>
            <div className="flex items-center gap-3">
              <button className="transition-colors" style={{ color: "var(--color-text-muted)" }} onClick={() => setHelpDialogOpen(true)}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}>
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="transition-colors" style={{ color: "var(--color-text-muted)" }} onClick={() => setSettingsDialogOpen(true)}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}>
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Cleaning Operations Section */}
              <div>
                <div className="mb-6">
                  <h3 className="mb-2" style={{ color: "var(--color-text)" }}>Select Cleaning Operations</h3>
                  <p style={{ color: "var(--color-text-muted)" }}>
                    Choose the operations you want to apply to your dataset
                  </p>
                </div>

                <div className="rounded-2xl glass-card p-8 shadow-xl transition-all hover:shadow-2xl" style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}>
                  <div className="grid grid-cols-2 gap-4">
                    {cleaningOptions.map((option) => {
                      const isSelected = selectedOperations.includes(option.id);
                      return (
                        <div 
                          key={option.id} 
                          className="flex items-center space-x-3 p-4 rounded-xl transition-all cursor-pointer"
                          style={{
                            backgroundColor: isSelected ? "rgba(20, 184, 166, 0.15)" : "rgba(255, 255, 255, 0.03)",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: isSelected ? "rgba(20, 184, 166, 0.4)" : "rgba(255, 255, 255, 0.05)",
                          }}
                          onClick={() => toggleOperation(option.id)}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                            }
                          }}
                        >
                          <Label
                            htmlFor={option.id}
                            className="cursor-pointer flex-1"
                            style={{ 
                              color: isSelected ? "var(--color-accent)" : "var(--color-text-muted)",
                              fontWeight: isSelected ? "500" : "400"
                            }}
                          >
                            {option.label}
                          </Label>
                          {isSelected && (
                            <CheckCircle2 
                              className="w-4 h-4" 
                              style={{ color: "var(--color-accent)" }} 
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                    <Button
                      onClick={() => {
                        if (settings.confirmBeforeCleaning) {
                          setConfirmCleaningOpen(true);
                        } else {
                          handleApplyCleaning();
                        }
                      }}
                      disabled={selectedOperations.length === 0}
                      className="w-full disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all"
                      style={{ 
                        background: selectedOperations.length > 0 
                          ? "rgba(20, 184, 166, 0.2)" 
                          : "rgba(128, 128, 128, 0.2)",
                        color: selectedOperations.length > 0
                          ? "var(--color-accent)"
                          : "var(--color-text-muted)"
                      }}
                      onMouseEnter={(e) => {
                        if (selectedOperations.length > 0) {
                          e.currentTarget.style.background = "rgba(20, 184, 166, 0.3)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedOperations.length > 0) {
                          e.currentTarget.style.background = "rgba(20, 184, 166, 0.2)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      Apply Cleaning
                    </Button>
                  </div>
                </div>
              </div>

              {/* Data Preview Section */}
              <div>
                <div className="mb-4">
                  <h3 className="mb-2" style={{ color: "var(--color-text)" }}>Data Preview</h3>
                  <p style={{ color: "var(--color-text-muted)" }}>
                    Showing first {Math.min(settings.previewRowLimit, sampleData.length)} of {sampleData.length} rows
                  </p>
                </div>
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent" style={{ borderColor: "var(--color-border)" }}>
                        <TableHead style={{ color: "var(--color-text-muted)" }}>ID</TableHead>
                        <TableHead style={{ color: "var(--color-text-muted)" }}>Name</TableHead>
                        <TableHead style={{ color: "var(--color-text-muted)" }}>Email</TableHead>
                        <TableHead style={{ color: "var(--color-text-muted)" }}>Age</TableHead>
                        <TableHead style={{ color: "var(--color-text-muted)" }}>City</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.slice(0, settings.previewRowLimit).map((row) => (
                        <TableRow key={row.id} style={{ borderColor: "var(--color-border)" }}>
                          <TableCell style={{ color: "var(--color-text-muted)" }}>{row.id}</TableCell>
                          <TableCell style={{ color: "var(--color-text-muted)" }}>{row.name}</TableCell>
                          <TableCell style={{ color: "var(--color-text-muted)" }}>{row.email}</TableCell>
                          <TableCell style={{ color: "var(--color-text-muted)" }}>{row.age}</TableCell>
                          <TableCell style={{ color: "var(--color-text-muted)" }}>{row.city}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Dialog */}
        <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
          <DialogContent className="text-white glass-dialog border" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <DialogHeader>
              <DialogTitle className="text-white">Help & Documentation</DialogTitle>
              <DialogDescription style={{ color: "var(--color-text-muted)" }}>
                Learn how to use Dataset Cleaner effectively
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="glass-light rounded-xl p-4 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                <h4 className="text-white mb-2">Getting Started</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  Upload your dataset using the sidebar button. Supported formats include CSV, Excel, and JSON files.
                </p>
              </div>
              <div className="glass-light rounded-xl p-4 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                <h4 className="text-white mb-2">Cleaning Operations</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  Select the cleaning operations you want to apply to your dataset. You can choose multiple operations.
                </p>
              </div>
              <div className="glass-light rounded-xl p-4 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                <h4 className="text-white mb-2">Exporting Data</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  After cleaning, you can export your data in CSV, Excel, or JSON format.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
          <DialogContent className="text-white glass-dialog border" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <DialogHeader>
              <DialogTitle className="text-white">Settings</DialogTitle>
              <DialogDescription style={{ color: "var(--color-text-muted)" }}>
                Configure your Dataset Cleaner preferences
              </DialogDescription>
            </DialogHeader>
            <SettingsContent />
          </DialogContent>
        </Dialog>

        {/* Confirm Cleaning Dialog */}
        <AlertDialog open={confirmCleaningOpen} onOpenChange={setConfirmCleaningOpen}>
          <AlertDialogContent className="text-white glass-dialog border" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Confirm Cleaning</AlertDialogTitle>
              <AlertDialogDescription style={{ color: "var(--color-text-muted)" }}>
                Are you sure you want to apply the selected cleaning operations to your dataset?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="text-white"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="text-white"
                style={{ backgroundColor: "rgba(20, 184, 166, 0.2)", borderColor: "rgba(20, 184, 166, 0.4)", color: "var(--color-accent)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(20, 184, 166, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(20, 184, 166, 0.2)";
                }}
                onClick={handleApplyCleaning}
              >
                Apply Cleaning
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Show cleaned data view
  if (currentStep === "cleaned") {
    return (
      <>
        <div className="flex-1 flex flex-col" style={{ backgroundColor: "var(--color-background)" }}>
          {/* Header */}
          <div className="border-b px-8 py-4 flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-3">
              <button 
                className="px-3 py-1.5 rounded-lg transition-all text-sm"
                style={{ 
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                  color: "#ef4444"
                }}
                onClick={onCancel}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                }}
              >
                <div className="flex items-center gap-1.5">
                  <X className="w-4 h-4" />
                  <span>Cancel Session</span>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="transition-colors" style={{ color: "var(--color-text-muted)" }} onClick={() => setHelpDialogOpen(true)}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}>
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="transition-colors" style={{ color: "var(--color-text-muted)" }} onClick={() => setSettingsDialogOpen(true)}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}>
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-6xl mx-auto">
              {/* Success Message */}
              <div className="rounded-xl p-4 mb-8 flex items-center gap-3 border" style={{ 
                backgroundColor: "var(--color-accent)10", 
                borderColor: "var(--color-accent)33" 
              }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-accent)" }} />
                <div>
                  <p style={{ color: "var(--color-accent)" }}>
                    Cleaning complete! Review your data and export below.
                  </p>
                </div>
              </div>

              {/* Data Preview */}
              <div className="mb-8">
                <h3 className="mb-4" style={{ color: "var(--color-text)" }}>Data Preview</h3>
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent" style={{ borderColor: "var(--color-border)" }}>
                        <TableHead style={{ color: "var(--color-text-muted)" }}>ID</TableHead>
                        <TableHead style={{ color: "var(--color-text-muted)" }}>Name</TableHead>
                        <TableHead style={{ color: "var(--color-text-muted)" }}>Email</TableHead>
                        <TableHead style={{ color: "var(--color-text-muted)" }}>Age</TableHead>
                        <TableHead style={{ color: "var(--color-text-muted)" }}>City</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((row) => (
                        <TableRow key={row.id} style={{ borderColor: "var(--color-border)" }}>
                          <TableCell style={{ color: "var(--color-text-muted)" }}>{row.id}</TableCell>
                          <TableCell style={{ color: "var(--color-text-muted)" }}>{row.name}</TableCell>
                          <TableCell style={{ color: "var(--color-text-muted)" }}>{row.email}</TableCell>
                          <TableCell style={{ color: "var(--color-text-muted)" }}>{row.age}</TableCell>
                          <TableCell style={{ color: "var(--color-text-muted)" }}>{row.city}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Export Options */}
              <div>
                <h3 className="mb-4" style={{ color: "var(--color-text)" }}>Export Options</h3>
                <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="text-white"
                      style={{ backgroundColor: "var(--color-background)", borderColor: "var(--color-border)" }}
                      onClick={() => handleExport("csv")}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-accent)10";
                        e.currentTarget.style.borderColor = "var(--color-accent)";
                        e.currentTarget.style.color = "var(--color-accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-background)";
                        e.currentTarget.style.borderColor = "var(--color-border)";
                        e.currentTarget.style.color = "white";
                      }}
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="text-white"
                      style={{ backgroundColor: "var(--color-background)", borderColor: "var(--color-border)" }}
                      onClick={() => handleExport("xlsx")}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-accent)10";
                        e.currentTarget.style.borderColor = "var(--color-accent)";
                        e.currentTarget.style.color = "var(--color-accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-background)";
                        e.currentTarget.style.borderColor = "var(--color-border)";
                        e.currentTarget.style.color = "white";
                      }}
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Export as Excel
                    </Button>
                    <Button
                      variant="outline"
                      className="text-white"
                      style={{ backgroundColor: "var(--color-background)", borderColor: "var(--color-border)" }}
                      onClick={() => handleExport("json")}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-accent)10";
                        e.currentTarget.style.borderColor = "var(--color-accent)";
                        e.currentTarget.style.color = "var(--color-accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-background)";
                        e.currentTarget.style.borderColor = "var(--color-border)";
                        e.currentTarget.style.color = "white";
                      }}
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Export as JSON
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Dialog */}
        <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
          <DialogContent className="text-white glass-dialog border" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <DialogHeader>
              <DialogTitle className="text-white">Help & Documentation</DialogTitle>
              <DialogDescription style={{ color: "var(--color-text-muted)" }}>
                Learn how to use Dataset Cleaner effectively
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="glass-light rounded-xl p-4 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                <h4 className="text-white mb-2">Getting Started</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  Upload your dataset using the sidebar button. Supported formats include CSV, Excel, and JSON files.
                </p>
              </div>
              <div className="glass-light rounded-xl p-4 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                <h4 className="text-white mb-2">Cleaning Operations</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  Select the cleaning operations you want to apply to your dataset. You can choose multiple operations.
                </p>
              </div>
              <div className="glass-light rounded-xl p-4 border" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                <h4 className="text-white mb-2">Exporting Data</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  After cleaning, you can export your data in CSV, Excel, or JSON format.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
          <DialogContent className="text-white glass-dialog border" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <DialogHeader>
              <DialogTitle className="text-white">Settings</DialogTitle>
              <DialogDescription style={{ color: "var(--color-text-muted)" }}>
                Configure your Dataset Cleaner preferences
              </DialogDescription>
            </DialogHeader>
            <SettingsContent />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="bg-[#161b22] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Help & Documentation</DialogTitle>
            <DialogDescription className="text-gray-400">
              Learn how to use Dataset Cleaner effectively
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="text-white mb-2">Getting Started</h4>
              <p className="text-gray-400">
                Upload your dataset using the sidebar button. Supported formats include CSV, Excel, and JSON files.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-2">Cleaning Operations</h4>
              <p className="text-gray-400">
                Select the cleaning operations you want to apply to your dataset. You can choose multiple operations.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-2">Exporting Data</h4>
              <p className="text-gray-400">
                After cleaning, you can export your data in CSV, Excel, or JSON format.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="bg-[#161b22] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Settings</DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure your Dataset Cleaner preferences
            </DialogDescription>
          </DialogHeader>
          <SettingsContent />
        </DialogContent>
      </Dialog>
    </>
  );
}