import React, { useState } from "react";
import { WorkStatus } from "../../../shared/types";

export const AutoStatusTab: React.FC = () => {
  const [rules, setRules] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const statusOptions: { value: WorkStatus; label: string; emoji: string }[] = [
    { value: "ON_CALL", label: "On Call", emoji: "🔴" },
    { value: "VIDEO_CALL", label: "Video Call", emoji: "🟠" },
    { value: "FOCUSED", label: "Focused", emoji: "🟡" },
    { value: "AVAILABLE", label: "Available", emoji: "🟢" },
    { value: "AWAY", label: "Away", emoji: "🔵" },
  ];

  const dayOptions = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 7, label: "Sunday" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Auto Status Rules</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          Add Rule
        </button>
      </div>

      {/* Integration Switches */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Integrations</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
            <div>
              <div className="font-medium">Calendar Integration</div>
              <div className="text-sm text-base-content/70">
                Automatically set status based on calendar events
              </div>
            </div>
            <input type="checkbox" className="toggle toggle-primary" disabled />
          </div>

          <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
            <div>
              <div className="font-medium">Microphone/Camera Detection</div>
              <div className="text-sm text-base-content/70">
                Detect when mic or camera is in use
              </div>
            </div>
            <input type="checkbox" className="toggle toggle-primary" disabled />
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div>
        <h3 className="text-lg font-medium mb-3">Schedule Rules</h3>

        {rules.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-lg font-medium mb-2">No rules configured</h3>
            <p className="text-base-content/70 mb-4">
              Create rules to automatically change your status based on schedule
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              Add First Rule
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div key={index} className="card bg-base-100 shadow-sm border">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{rule.emoji}</span>
                        <span className="font-medium">{rule.status}</span>
                      </div>
                      <div className="text-sm text-base-content/70">
                        {rule.days.join(", ")} • {rule.startTime} -{" "}
                        {rule.endTime}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-sm toggle-primary"
                        checked={rule.enabled}
                        readOnly
                      />
                      <button className="btn btn-error btn-sm">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add Schedule Rule</h3>

            <div className="space-y-4">
              {/* Status Selection */}
              <div>
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select className="select select-bordered w-full">
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Days Selection */}
              <div>
                <label className="label">
                  <span className="label-text">Days</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {dayOptions.map((day) => (
                    <label key={day.value} className="label cursor-pointer">
                      <span className="label-text">{day.label}</span>
                      <input type="checkbox" className="checkbox checkbox-sm" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Start Time</span>
                  </label>
                  <input type="time" className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">End Time</span>
                  </label>
                  <input type="time" className="input input-bordered w-full" />
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary">Add Rule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
