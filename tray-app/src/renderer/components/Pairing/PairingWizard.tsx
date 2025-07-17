import React, { useState, useCallback } from "react";
import { UsbDetectionStep } from "./UsbDetectionStep";
import { WifiConfigStep } from "./WifiConfigStep";
import { TransferTestStep } from "./TransferTestStep";
import { SuccessStep } from "./SuccessStep";

declare global {
  interface Window {
    ipc: {
      closeWindow: () => void;
    };
  }
}

/**
 * A wizard component that orchestrates the steps of pairing a new device.
 * It manages the current step and renders the appropriate component.
 * @returns {JSX.Element} The pairing wizard UI.
 */
export const PairingWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [wifiCreds, setWifiCreds] = useState({ ssid: "", pass: "" });

  const handleClose = useCallback(() => {
    // This will be connected to an IPC call to close the window
    window.ipc?.closeWindow();
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <UsbDetectionStep onComplete={() => setStep(2)} />;
      case 2:
        return (
          <WifiConfigStep
            onComplete={(ssid, pass) => {
              setWifiCreds({ ssid, pass });
              setStep(3);
            }}
          />
        );
      case 3:
        return <TransferTestStep onComplete={() => setStep(4)} />;
      case 4:
        return <SuccessStep onComplete={handleClose} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="p-4 bg-base-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Pair New Device</h1>
      {renderStep()}
    </div>
  );
};
