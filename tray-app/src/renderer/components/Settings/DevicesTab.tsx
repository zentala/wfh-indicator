import React, { useState, useEffect } from "react";
import { DeviceInfo } from "../../../shared/types";

export const DevicesTab: React.FC = () => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const deviceList = await (window as any).api.getDevices();
      setDevices(deviceList);
    } catch (error) {
      console.error("Failed to load devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      await (window as any).api.removeDevice(deviceId);
      await loadDevices(); // Reload the list
    } catch (error) {
      console.error("Failed to remove device:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Paired Devices</h2>
        <button className="btn btn-primary btn-sm">Pair New Device</button>
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-lg font-medium mb-2">No devices paired</h3>
          <p className="text-base-content/70 mb-4">
            Pair your first WFH Indicator device to get started
          </p>
          <button className="btn btn-primary">Pair Device</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div
              key={device.id}
              className="card bg-base-100 shadow-md border hover:border-primary transition-all duration-300"
            >
              <div className="card-body p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        device.connected ? "bg-success" : "bg-error"
                      }`}
                    ></div>
                    <div>
                      <h3 className="font-bold text-lg">{device.name}</h3>
                      <p className="text-sm text-base-content/70">
                        {device.connected ? "Connected" : "Disconnected"}
                      </p>
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => handleRemoveDevice(device.id)}
                    data-testid={`remove-device-${device.id}`}
                    aria-label={`Remove ${device.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <div className="text-sm text-base-content/70">
                      Battery Level
                    </div>
                    <div className="text-xl font-bold">{device.battery}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
