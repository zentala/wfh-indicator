import React, { useState, useEffect } from "react";
import { Button } from "../common/Button";
import { Spinner } from "../common/Spinner";

interface TransferTestStepProps {
  onComplete: () => void;
}

/**
 * The third step in the pairing wizard: transferring settings and testing the connection.
 * @param {TransferTestStepProps} props The props for the component.
 * @returns {JSX.Element} The UI for the transfer and test step.
 */
export const TransferTestStep: React.FC<TransferTestStepProps> = ({
  onComplete,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState("Transferring settings...");

  useEffect(() => {
    // Simulate the multi-stage connection process
    setTimeout(() => {
      setStatusText("Device connecting to network...");
    }, 1500);

    setTimeout(() => {
      setStatusText("Testing connection...");
    }, 3000);

    setTimeout(() => {
      setStatusText("Connection successful! Finalizing...");
      setIsLoading(false);
    }, 4500);
  }, []);

  return (
    <div className="card bg-base-200 p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Pairing in Progress</h2>
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p>{statusText}</p>
        </div>
      ) : (
        <div>
          <p className="mb-6 text-success">Device paired successfully!</p>
          <Button onClick={onComplete} className="btn-wide">
            Finish
          </Button>
        </div>
      )}
    </div>
  );
};
