import React from "react";
import { Button } from "../common/Button";

interface UsbDetectionStepProps {
  onComplete: () => void;
}

/**
 * The first step in the pairing wizard: instructing the user
 * to connect their device via USB.
 * @param {UsbDetectionStepProps} props The props for the component.
 * @returns {JSX.Element} The UI for the USB detection step.
 */
export const UsbDetectionStep: React.FC<UsbDetectionStepProps> = ({
  onComplete,
}) => {
  const handleDetection = () => {
    // In Sprint 3, this is just a UI mock.
    // The actual detection logic will be added in Sprint 4.
    console.log("Simulating USB device detection...");
    onComplete();
  };

  return (
    <div className="card bg-base-200 p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Connect Your Device</h2>
      <p className="mb-6">
        Please connect your WFH Indicator device to your computer using a USB
        cable.
      </p>
      <Button onClick={handleDetection} className="btn-wide">
        Detect Device
      </Button>
    </div>
  );
};
