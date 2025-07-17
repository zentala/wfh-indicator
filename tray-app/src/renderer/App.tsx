import React, { useEffect, useState } from "react";
import { PairingWizard } from "./components/Pairing/PairingWizard";

/**
 * The main application component. It determines which window to render
 * based on URL query parameters.
 * @returns {JSX.Element} The root component of the renderer process.
 */
const App: React.FC = () => {
  const [windowType, setWindowType] = useState<
    "pairing" | "settings" | "main" | null
  >(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("window");
    setWindowType(type as any); // Simple type casting for now
  }, []);

  switch (windowType) {
    case "pairing":
      return <PairingWizard />;
    case "settings":
      // return <SettingsWindow />;
      return <div>Settings Window</div>;
    default:
      // This could be a main dashboard or just a blank page for the main process
      return <div>Main Window</div>;
  }
};

export default App;
