import { useState } from "react";
import { Login } from "./components/Login";
import { Registration } from "./components/Registration";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ThemeProvider } from "./components/ThemeContext";
import { SettingsProvider } from "./components/SettingsContext";
import { UpdateProvider } from "./components/UpdateContext";

type AppView = "login" | "register" | "app";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("login");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadTimestamp, setUploadTimestamp] = useState<number>(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogin = () => {
    setCurrentView("app");
  };

  const handleRegister = () => {
    // After registration, redirect to login
    setCurrentView("login");
  };

  const handleLogout = () => {
    setCurrentView("login");
    setUploadedFile(null);
    setUploadTimestamp(0);
  };

  const handleFileUpload = (file: File) => {
    // Clear previous session when new file is uploaded
    setUploadedFile(file);
    setUploadTimestamp(Date.now());
  };

  const handleCancelSession = () => {
    // Clear the uploaded file and reset to initial state
    setUploadedFile(null);
    setUploadTimestamp(0);
  };

  return (
    <ThemeProvider>
      <SettingsProvider>
        <UpdateProvider>
          {/* Show login page */}
          {currentView === "login" && (
            <Login
              onLogin={handleLogin}
              onNavigateToRegister={() => setCurrentView("register")}
            />
          )}

          {/* Show registration page */}
          {currentView === "register" && (
            <Registration
              onRegister={handleRegister}
              onNavigateToLogin={() => setCurrentView("login")}
            />
          )}

          {/* Show main application */}
          {currentView === "app" && (
            <div className="flex h-screen" style={{ backgroundColor: "var(--color-background)" }}>
              <Sidebar 
                onUpload={handleFileUpload} 
                onLogout={handleLogout}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                uploadedFile={uploadedFile}
              />
              <Dashboard uploadedFile={uploadedFile} isSidebarCollapsed={isSidebarCollapsed} onUpload={handleFileUpload} onCancel={handleCancelSession} uploadTimestamp={uploadTimestamp} />
            </div>
          )}
        </UpdateProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}