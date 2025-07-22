import React from "react";
import { Button } from "../common/Button";

export const GeneralTab: React.FC = () => {
  const handlePinIcon = () => {
    window.api.showPinHint();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">General Settings</h2>
      <div className="space-y-4">
        <div className="p-4 border border-base-300 rounded-lg">
          <h3 className="font-semibold">Pin Icon to Taskbar</h3>
          <p className="text-sm text-base-content/70 mb-2">
            To make the app icon always visible, drag it from the hidden icons
            area to your taskbar. Click the button below for a visual hint.
          </p>
          <Button onClick={handlePinIcon} className="btn-primary">
            Show Hint
          </Button>
        </div>
      </div>
    </div>
  );
};
