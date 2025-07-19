import React, { useState } from "react";

interface WifiConfigStepProps {
  onComplete: (credentials: { ssid?: string; password?: string }) => void;
}

const WifiConfigStep: React.FC<WifiConfigStepProps> = ({ onComplete }) => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (): void => {
    if (ssid) {
      onComplete({ ssid, password });
    }
  };

  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-xl font-bold mb-4">Configure WiFi Network</h2>
      <p className="mb-6">
        Enter the WiFi credentials that your device should use to connect to the
        network.
      </p>
      <div className="space-y-4">
        <div className="form-control w-full">
          <label className="label" htmlFor="ssid">
            <span className="label-text">WiFi SSID</span>
          </label>
          <input
            id="ssid"
            type="text"
            placeholder="YourNetworkName"
            className="input input-bordered w-full"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
          />
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="YourPassword"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="card-actions justify-end mt-6">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!ssid}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WifiConfigStep;
