import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Database, Upload, User, Palette, LogOut, ChevronDown, Download, RefreshCw, CheckCircle, Info, FileText, Clock, ChevronRight, PanelLeftClose, PanelLeft, BarChart3, Layers, HardDrive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ThemeSelector } from "./ThemeSelector";
import { useSettings } from "./SettingsContext";
import { useUpdate } from "./UpdateContext";
import { DanerLogo } from "./DanerLogo";

interface SidebarProps {
  onUpload: (file: File) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  uploadedFile?: File | null;
}

export function Sidebar({ onUpload, onLogout, isCollapsed, onToggleCollapse, uploadedFile }: SidebarProps) {
  const { settings } = useSettings();
  const { 
    updateAvailable, 
    updateDownloaded, 
    checking, 
    downloading, 
    currentVersion, 
    newVersion, 
    downloadProgress,
    checkForUpdates, 
    installUpdate 
  } = useUpdate();
  
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileStats, setFileStats] = useState<{ rows: number; columns: number } | null>(null);

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Helper function to format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Parse uploaded file to get row and column counts
  useEffect(() => {
    if (!uploadedFile) {
      setFileStats(null);
      return;
    }

    const parseFile = async () => {
      const reader = new FileReader();
      const fileExtension = uploadedFile.name.toLowerCase().split('.').pop();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          
          if (!content) {
            setFileStats(null);
            return;
          }

          if (fileExtension === 'csv') {
            // Parse CSV
            const lines = content.trim().split('\n').filter(line => line.length > 0);
            if (lines.length === 0) {
              setFileStats({ rows: 0, columns: 0 });
              return;
            }
            const rows = Math.max(0, lines.length - 1); // Subtract header row
            const firstLine = lines[0];
            // Count columns by splitting on comma (basic CSV parsing)
            const columns = firstLine.split(',').length;
            setFileStats({ rows, columns });
          } else if (fileExtension === 'json') {
            // Parse JSON
            try {
              const data = JSON.parse(content);
              if (Array.isArray(data)) {
                const rows = data.length;
                const columns = data.length > 0 ? Object.keys(data[0]).length : 0;
                setFileStats({ rows, columns });
              } else if (typeof data === 'object' && data !== null) {
                // If it's an object, treat it as 1 row
                const columns = Object.keys(data).length;
                setFileStats({ rows: 1, columns });
              } else {
                setFileStats(null);
              }
            } catch (jsonError) {
              // Invalid JSON - silently set stats to null
              setFileStats(null);
            }
          } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            // For Excel files, we'll need a library to parse properly
            // For now, show placeholder values
            setFileStats({ rows: 0, columns: 0 });
          } else {
            // Unsupported file type
            setFileStats(null);
          }
        } catch (error) {
          // General error - silently handle it
          setFileStats(null);
        }
      };

      reader.onerror = () => {
        // File reading error - silently handle it
        setFileStats(null);
      };

      reader.readAsText(uploadedFile);
    };

    parseFile();
  }, [uploadedFile]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      // Reset the input value so the same file can be uploaded again
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Check if file type is supported
      const validTypes = ['.csv', '.xlsx', '.xls', '.json'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (validTypes.includes(fileExtension)) {
        onUpload(file);
      }
    }
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

  const handleAccountClick = () => {
    // Open external account management page
    window.open('https://example.com/account', '_blank');
  };

  const handleLogout = () => {
    // Clear session data if setting is enabled
    if (settings.clearDataOnLogout) {
      // Clear any session storage or local data here
      console.log("Clearing session data on logout...");
    }
    onLogout();
  };

  return (
    <TooltipProvider>
      <div 
        className={`border-r glass-strong flex flex-col h-screen ${isCollapsed ? 'w-20' : 'w-[400px]'}`}
        style={{ 
          borderColor: "rgba(255, 255, 255, 0.1)",
          transition: "width 600ms cubic-bezier(0.4, 0.0, 0.2, 1)"
        }}
      >
        {/* Logo Section */}
        <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <DanerLogo size={48} />
                </div>
                <div>
                  <h1 className="text-xl" style={{ color: "var(--color-text)" }}>Daner</h1>
                </div>
              </div>
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded-lg transition-all"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <PanelLeftClose className="w-5 h-5" style={{ color: "var(--color-text-muted)" }} />
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <DanerLogo size={40} />
              </div>
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded-lg transition-all"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <PanelLeft className="w-5 h-5" style={{ color: "var(--color-text-muted)" }} />
              </button>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className={`flex-1 ${isCollapsed ? 'p-3' : 'p-6'} space-y-4 overflow-hidden`}>
          {!isCollapsed ? (
            <>
              <div>
                <label htmlFor="file-upload">
                  <div
                    className="w-full p-5 rounded-2xl cursor-pointer transition-all relative overflow-hidden group"
                    style={{ 
                      background: isDragging 
                        ? "linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)"
                        : "linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                      border: isDragging 
                        ? "2px dashed rgba(20, 184, 166, 0.6)"
                        : "1px solid rgba(20, 184, 166, 0.3)",
                      transform: isDragging ? "scale(1.02)" : "scale(1)"
                    }}
                    onMouseEnter={(e) => {
                      if (!isDragging) {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 32px rgba(20, 184, 166, 0.25)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDragging) {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-0 opacity-50 blur-xl transition-opacity group-hover:opacity-70"
                      style={{ 
                        background: "radial-gradient(circle at center, rgba(20, 184, 166, 0.3) 0%, transparent 70%)",
                        opacity: isDragging ? 0.9 : 0.5
                      }}
                    />
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-light shadow-lg">
                        <Upload className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "var(--color-accent)" }}>
                          {isDragging ? "Drop file here" : "Upload Dataset"}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                          {isDragging ? "Release to upload" : "CSV, Excel, JSON"}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Dataset Overview Section - Only show when file is uploaded */}
              {uploadedFile && (
                <div 
                  className="rounded-xl border p-4 relative overflow-hidden"
                  style={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    borderColor: "rgba(20, 184, 166, 0.15)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "0 0 24px rgba(20, 184, 166, 0.08), 0 0 48px rgba(20, 184, 166, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                  }}
                >
                  {/* Subtle glow overlay */}
                  <div 
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{ 
                      background: "radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.1) 0%, transparent 60%)"
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ 
                          backgroundColor: "rgba(20, 184, 166, 0.1)",
                          boxShadow: "0 0 12px rgba(20, 184, 166, 0.2)"
                        }}
                      >
                        <BarChart3 className="w-4 h-4" style={{ color: "rgba(20, 184, 166, 0.8)" }} />
                      </div>
                      <span className="text-sm" style={{ color: "var(--color-text)" }}>Dataset Overview</span>
                    </div>

                    {/* Dataset Stats */}
                    <div className="space-y-3">
                      {/* File Name Row */}
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" 
                          style={{ backgroundColor: "rgba(20, 184, 166, 0.05)" }}
                        >
                          <FileText className="w-4 h-4" style={{ color: "rgba(20, 184, 166, 0.4)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs mb-0.5" style={{ color: "rgba(255, 255, 255, 0.35)" }}>File</p>
                          <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{uploadedFile.name}</p>
                        </div>
                      </div>

                      {/* Rows & Columns Row */}
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" 
                          style={{ backgroundColor: "rgba(20, 184, 166, 0.05)" }}
                        >
                          <Layers className="w-4 h-4" style={{ color: "rgba(20, 184, 166, 0.4)" }} />
                        </div>
                        <div className="flex-1 flex justify-between">
                          <div>
                            <p className="text-xs mb-0.5" style={{ color: "rgba(255, 255, 255, 0.35)" }}>Rows</p>
                            <p className="text-sm" style={{ color: "var(--color-text)" }}>{fileStats ? formatNumber(fileStats.rows) : '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs mb-0.5" style={{ color: "rgba(255, 255, 255, 0.35)" }}>Columns</p>
                            <p className="text-sm" style={{ color: "var(--color-text)" }}>{fileStats ? formatNumber(fileStats.columns) : '-'}</p>
                          </div>
                        </div>
                      </div>

                      {/* File Size Row */}
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" 
                          style={{ backgroundColor: "rgba(20, 184, 166, 0.05)" }}
                        >
                          <HardDrive className="w-4 h-4" style={{ color: "rgba(20, 184, 166, 0.4)" }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs mb-0.5" style={{ color: "rgba(255, 255, 255, 0.35)" }}>File Size</p>
                          <p className="text-sm" style={{ color: "var(--color-text)" }}>{formatFileSize(uploadedFile.size)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="file-upload-collapsed">
                    <div
                      className="w-14 h-14 rounded-xl cursor-pointer transition-all relative overflow-hidden group flex items-center justify-center"
                      style={{ 
                        background: "linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                        border: "1px solid rgba(20, 184, 166, 0.3)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 32px rgba(20, 184, 166, 0.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Upload className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
                    </div>
                  </label>
                </TooltipTrigger>
                <TooltipContent side="right" className="glass-dialog border" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                  <p style={{ color: "var(--color-text)" }}>Upload Dataset</p>
                </TooltipContent>
              </Tooltip>
              <input
                id="file-upload-collapsed"
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-t`} style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
          {!isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all" 
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Avatar className="w-10 h-10 ring-1 ring-white/10">
                    <AvatarFallback 
                      className="text-sm"
                      style={{ 
                        background: "rgba(20, 184, 166, 0.15)",
                        color: "var(--color-accent)" 
                      }}
                    >
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm" style={{ color: "var(--color-text)" }}>John Doe</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Pro Plan</p>
                  </div>
                  <ChevronDown className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 glass-dialog border"
                style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <DropdownMenuItem 
                  onClick={handleAccountClick}
                  className="cursor-pointer transition-all text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.color = "var(--color-text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--color-text-muted)";
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setThemeDialogOpen(true)}
                  className="cursor-pointer transition-all text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.color = "var(--color-text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--color-text-muted)";
                  }}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Theme
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setUpdateDialogOpen(true);
                    if (!checking && !updateAvailable) {
                      checkForUpdates();
                    }
                  }}
                  className="cursor-pointer transition-all text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.color = "var(--color-text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--color-text-muted)";
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Updates
                    </div>
                    {updateDownloaded && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] glass-light" style={{ color: "var(--color-accent)" }}>
                        Ready
                      </span>
                    )}
                    {updateAvailable && !updateDownloaded && !downloading && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] glass-light" style={{ color: "var(--color-accent)" }}>
                        New
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer transition-all text-sm"
                  style={{ color: "#ef4444" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-0 rounded-xl transition-all" style={{ backgroundColor: "transparent" }}>
                    <Avatar className="w-12 h-12 ring-1 ring-white/10 transition-transform hover:scale-105">
                      <AvatarFallback 
                        className="text-sm"
                        style={{ 
                          background: "rgba(20, 184, 166, 0.15)",
                          color: "var(--color-accent)" 
                        }}
                      >
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="right"
                  className="w-56 glass-dialog border"
                  style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <DropdownMenuItem 
                    onClick={handleAccountClick}
                    className="cursor-pointer transition-all text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.color = "var(--color-text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--color-text-muted)";
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setThemeDialogOpen(true)}
                    className="cursor-pointer transition-all text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.color = "var(--color-text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--color-text-muted)";
                    }}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Theme
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setUpdateDialogOpen(true);
                      if (!checking && !updateAvailable) {
                        checkForUpdates();
                      }
                    }}
                    className="cursor-pointer transition-all text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.color = "var(--color-text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--color-text-muted)";
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Updates
                      </div>
                      {updateDownloaded && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] glass-light" style={{ color: "var(--color-accent)" }}>
                          Ready
                        </span>
                      )}
                      {updateAvailable && !updateDownloaded && !downloading && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] glass-light" style={{ color: "var(--color-accent)" }}>
                          New
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer transition-all text-sm"
                    style={{ color: "#ef4444" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <ThemeSelector open={themeDialogOpen} onOpenChange={setThemeDialogOpen} />

        {/* Update Dialog */}
        <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[500px] text-white glass-dialog" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <DialogHeader>
              <DialogTitle className="text-white">
                {checking && "Checking for Updates"}
                {!checking && !updateAvailable && "You're up to date"}
                {updateAvailable && downloading && "Downloading Update"}
                {updateAvailable && !downloading && updateDownloaded && "Update Ready to Install"}
                {updateAvailable && !downloading && !updateDownloaded && "Update Available"}
              </DialogTitle>
              <DialogDescription style={{ color: "var(--color-text-muted)" }}>
                {checking && "Please wait while we check for updates..."}
                {!checking && !updateAvailable && `You're running the latest version (${currentVersion}).`}
                {updateAvailable && !downloading && !updateDownloaded && `Version ${newVersion} is available for download.`}
                {downloading && `Downloading version ${newVersion}...`}
                {updateDownloaded && `Version ${newVersion} is ready to install. Click Install to update now.`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Version Info */}
              {updateAvailable && (
                <div className="flex items-center justify-between p-3 rounded-lg glass-light">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Current: {currentVersion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                    <p className="text-sm" style={{ color: "var(--color-accent)" }}>New: {newVersion}</p>
                  </div>
                </div>
              )}
              
              {/* Progress Bar */}
              {downloading && (
                <div className="space-y-2">
                  <Progress value={downloadProgress} className="h-2" />
                  <p className="text-sm text-center" style={{ color: "var(--color-text-muted)" }}>
                    {Math.round(downloadProgress)}% complete
                  </p>
                </div>
              )}
              
              {/* Checking Animation */}
              {checking && (
                <div className="flex justify-center py-4">
                  <RefreshCw className="w-8 h-8 animate-spin" style={{ color: "var(--color-accent)" }} />
                </div>
              )}
            </div>

            <DialogFooter>
              {!checking && !updateAvailable && (
                <div className="w-full">
                  <Button
                    onClick={() => {
                      setUpdateDialogOpen(false);
                      checkForUpdates();
                    }}
                    className="w-full text-white"
                    style={{ background: "rgba(20, 184, 166, 0.2)", color: "var(--color-accent)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(20, 184, 166, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(20, 184, 166, 0.2)";
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Again
                  </Button>
                </div>
              )}
              
              {updateDownloaded && (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setUpdateDialogOpen(false)}
                    className="flex-1"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)", color: "white" }}
                  >
                    Later
                  </Button>
                  <Button
                    onClick={() => {
                      installUpdate();
                      setUpdateDialogOpen(false);
                    }}
                    className="flex-1"
                    style={{ background: "rgba(20, 184, 166, 0.2)", color: "var(--color-accent)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(20, 184, 166, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(20, 184, 166, 0.2)";
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Install Now
                  </Button>
                </div>
              )}
              
              {!downloading && !updateDownloaded && !checking && updateAvailable && (
                <div className="w-full">
                  <Button
                    variant="outline"
                    onClick={() => setUpdateDialogOpen(false)}
                    className="w-full"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)", color: "white" }}
                  >
                    Close
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}