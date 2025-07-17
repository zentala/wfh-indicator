import React, { useState } from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

interface WifiConfigStepProps {
  onComplete: (ssid: string, pass: string) => void;
}

/**
 * The second step in the pairing wizard: configuring the device's WiFi credentials.
 * @param {WifiConfigStepProps} props The props for the component.
 * @returns {JSX.Element} The UI for the WiFi configuration step.
 */
export const WifiConfigStep: React.FC<WifiConfigStepProps> = ({
  onComplete,
}) => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    // Basic validation
    if (!ssid) {
      alert("WiFi SSID cannot be empty.");
      return;
    }
    onComplete(ssid, password);
  };

  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-xl font-bold mb-4">Configure WiFi Network</h2>
      <p className="mb-6">
        Enter the WiFi credentials that your device should use to connect to the
        network.
      </p>
      <div className="space-y-4">
        <Input
          label="WiFi SSID"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          placeholder="YourNetworkName"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="YourPassword"
        />
      </div>
      <div className="card-actions justify-end mt-6">
        <Button onClick={handleSubmit}>Next</Button>
      </div>
    </div>
  );
};
