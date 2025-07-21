import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
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
    const handlePairingStatus = (
      _,
      { step: currentStep, status: currentStatus, message }
    ) => {
      setStep(currentStep);
      setStatus(currentStatus);
      if (currentStatus === "error") {
        setErrorMessage(message);
      }
    };

    const handleColorConfirmRequest = () => {
      setShowConfirmation(true);
    };

    ipcRenderer.on("pairing-status", handlePairingStatus);
    ipcRenderer.on("confirm-color-request", handleColorConfirmRequest);

    return () => {
      ipcRenderer.removeListener("pairing-status", handlePairingStatus);
      ipcRenderer.removeListener(
        "confirm-color-request",
        handleColorConfirmRequest
      );
    };
  }, []);

  const startPairing = () => {
    ipcRenderer.invoke("pair-device", { ssid, password });
  };

  const handleColorConfirmation = (confirmed: boolean) => {
    ipcRenderer.send("confirm-color-response", confirmed);
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
          <Button onClick={() => ipcRenderer.send("close-window")}>
            Close
          </Button>
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
