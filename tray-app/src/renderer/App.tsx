import React, { useEffect, useState } from "react";
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import { useSystemTheme } from "./hooks/useSystemTheme";
import PairingWizard from "./components/Pairing/PairingWizard";
import { SettingsWindow } from "./components/Settings/SettingsWindow";

/**
 * The main application component. It determines which window to render
 * based on URL query parameters and applies the system theme.
 * @returns {JSX.Element} The root component of the renderer process.
 */
const App: React.FC = () => {
  const [windowType, setWindowType] = useState<
    "pairing" | "settings" | "main" | null
  >(null);

  const systemTheme = useSystemTheme();
  const theme = systemTheme === "dark" ? webDarkTheme : webLightTheme;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("window");
    setWindowType(type as any); // Simple type casting for now
  }, []);

  const renderContent = () => {
    switch (windowType) {
      case "pairing":
        return <PairingWizard />;
      case "settings":
        return <SettingsWindow />;
      default:
        // This could be a main dashboard or just a blank page for the main process
        return <div>Main Window</div>;
    }
  };

  return <FluentProvider theme={theme}>{renderContent()}</FluentProvider>;
};

export default App;
