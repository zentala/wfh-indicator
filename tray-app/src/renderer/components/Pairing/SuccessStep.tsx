import React from "react";
import { Button } from "../common/Button";

interface SuccessStepProps {
  onComplete: () => void;
}

/**
 * The final step in the pairing wizard, confirming success.
 * @param {SuccessStepProps} props The props for the component.
 * @returns {JSX.Element} The UI for the success step.
 */
export const SuccessStep: React.FC<SuccessStepProps> = ({ onComplete }) => {
  return (
    <div className="card bg-base-200 p-6 text-center">
      <h2 className="text-2xl font-bold mb-4 text-success">Success!</h2>
      <p className="mb-6">Your device has been paired and is ready to use.</p>
      <Button onClick={onComplete} className="btn-wide">
        Close
      </Button>
    </div>
  );
};
