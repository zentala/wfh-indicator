import React, { useState } from "react";
import { DevicesTab } from "./DevicesTab";
import { AutoStatusTab } from "./AutoStatusTab";

type TabType = "devices" | "auto-status";

export const SettingsWindow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("devices");

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-base-content">Settings</h1>
          <p className="text-base-content/70">
            Manage your devices and automation rules
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === "devices" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("devices")}
          >
            📱 Devices
          </button>
          <button
            className={`tab ${activeTab === "auto-status" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("auto-status")}
          >
            ⏰ Auto Status
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-base-200 rounded-lg p-6">
          {activeTab === "devices" && <DevicesTab />}
          {activeTab === "auto-status" && <AutoStatusTab />}
        </div>
      </div>
    </div>
  );
};
