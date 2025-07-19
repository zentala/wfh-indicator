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
        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="card bg-base-100 shadow-sm border">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        device.connected ? "bg-success" : "bg-error"
                      }`}
                    ></div>
                    <div>
                      <h3 className="font-medium">{device.name}</h3>
                      <p className="text-sm text-base-content/70">
                        {device.connected ? "Connected" : "Disconnected"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-base-content/70">
                        Battery
                      </div>
                      <div className="text-sm font-medium">
                        {device.battery}%
                      </div>
                    </div>

                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleRemoveDevice(device.id)}
                    >
                      Remove
                    </button>
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
