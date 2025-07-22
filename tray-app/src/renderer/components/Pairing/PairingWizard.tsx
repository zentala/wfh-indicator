import React, { useState, useEffect } from "react";
import { Wifi, CheckCircle, XCircle, ChevronRight, Loader } from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Spinner } from "../common/Spinner";
import { UsbDetectionStep } from "./UsbDetectionStep";
import { WifiConfigStep } from "./WifiConfigStep";
import { TransferTestStep } from "./TransferTestStep";
import { SuccessStep } from "./SuccessStep";

type PairingStep =
  | "detecting"
  | "transferring"
  | "testing"
  | "success"
  | "error";

const PairingWizard: React.FC = () => {
  const [step, setStep] = useState("idle");
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const handlePairingStatus = (data: {
      step: string;
      status: string;
      message: string;
    }) => {
      setStep(data.step);
      setStatus(data.status);
      if (data.status === "error") {
        setErrorMessage(data.message);
      }
    };

    const handleColorConfirmRequest = () => {
      setShowConfirmation(true);
    };

    window.api.onPairingStatus(handlePairingStatus);
    window.api.onConfirmColorRequest(handleColorConfirmRequest);

    return () => {
      // Preload script doesn't expose a specific remover for single listeners,
      // so we rely on the generic one.
      window.api.removeAllListeners("pairing-status");
      window.api.removeAllListeners("confirm-color-request");
    };
  }, []);

  const startPairing = () => {
    window.api.pairDevice(ssid, password);
  };

  const handleColorConfirmation = (confirmed: boolean) => {
    window.api.confirmColorResponse(confirmed);
    setShowConfirmation(false);
  };

  const renderContent = () => {
    if (step === "error") {
      return (
        <div>
          <h3 className="text-error">Pairing Failed</h3>
          <p>{errorMessage}</p>
          <Button onClick={() => setStep("idle")}>Try Again</Button>
        </div>
      );
    }

    if (step === "done") {
      return (
        <div>
          <h3 className="text-success">Device Paired Successfully!</h3>
          <Button onClick={() => window.api.closeWindow()}>Close</Button>
        </div>
      );
    }

    if (showConfirmation) {
      return (
        <div>
          <h3>Confirm Color Change</h3>
          <p>Do you see a green light on your device?</p>
          <Button
            onClick={() => handleColorConfirmation(true)}
            className="btn-success"
          >
            Yes
          </Button>
          <Button
            onClick={() => handleColorConfirmation(false)}
            className="btn-error"
          >
            No
          </Button>
        </div>
      );
    }

    const isLoading = status === "pending";

    return (
      <div>
        <h2>Pair New Device</h2>
        <Input
          label="WiFi SSID"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          disabled={isLoading}
        />
        <Input
          label="WiFi Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={startPairing} disabled={isLoading}>
          {isLoading ? <Spinner /> : "Start Pairing"}
        </Button>
        {isLoading && <p>Current step: {step}...</p>}
      </div>
    );
  };

  return <div className="p-4">{renderContent()}</div>;
};

export default PairingWizard;
