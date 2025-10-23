import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UpdateContextType {
  updateAvailable: boolean;
  updateDownloaded: boolean;
  checking: boolean;
  downloading: boolean;
  currentVersion: string;
  newVersion: string;
  downloadProgress: number;
  checkForUpdates: () => void;
  installUpdate: () => void;
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export function UpdateProvider({ children }: { children: ReactNode }) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentVersion] = useState("1.0.0");
  const [newVersion, setNewVersion] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);

  // Automatic check on mount if connected to network
  useEffect(() => {
    // Check if online
    if (navigator.onLine) {
      // Auto-check on mount (after 2 seconds)
      const timer = setTimeout(() => {
        checkForUpdates();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      // Auto-check when coming back online
      const timeSinceLastCheck = Date.now() - lastCheckTime;
      // Only auto-check if last check was more than 5 minutes ago
      if (timeSinceLastCheck > 5 * 60 * 1000) {
        setTimeout(() => {
          checkForUpdates();
        }, 1000);
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [lastCheckTime]);

  const checkForUpdates = async () => {
    if (!navigator.onLine) {
      console.log("Cannot check for updates: No internet connection");
      return;
    }

    setChecking(true);
    setLastCheckTime(Date.now());

    // Simulate API call to check for updates
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock: 30% chance of update being available
    const hasUpdate = Math.random() > 0.7;

    if (hasUpdate) {
      setNewVersion("1.1.0");
      setUpdateAvailable(true);
      
      // Automatically start downloading
      downloadUpdate();
    } else {
      setUpdateAvailable(false);
      setUpdateDownloaded(false);
    }

    setChecking(false);
  };

  const downloadUpdate = async () => {
    setDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const totalSteps = 20;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setDownloadProgress((i / totalSteps) * 100);
    }

    setDownloading(false);
    setUpdateDownloaded(true);
  };

  const installUpdate = () => {
    // In a real desktop app, this would:
    // 1. Quit the application
    // 2. Run the installer
    // 3. Restart the app with the new version
    
    // For this mock, we'll show a restart simulation
    console.log("Installing update and restarting...");
    
    // Mock restart
    setTimeout(() => {
      alert("App would restart here with version " + newVersion);
      // Reset update state after "install"
      setUpdateAvailable(false);
      setUpdateDownloaded(false);
      setDownloadProgress(0);
    }, 1000);
  };

  return (
    <UpdateContext.Provider
      value={{
        updateAvailable,
        updateDownloaded,
        checking,
        downloading,
        currentVersion,
        newVersion,
        downloadProgress,
        checkForUpdates,
        installUpdate,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
}

export function useUpdate() {
  const context = useContext(UpdateContext);
  if (context === undefined) {
    throw new Error("useUpdate must be used within an UpdateProvider");
  }
  return context;
}
