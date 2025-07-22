import React, { useState, useEffect } from "react";
import { WorkStatus } from "@wfh-indicator/domain";

export const AutoStatusTab: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [defaultStatus, setDefaultStatus] = useState<WorkStatus>(
    WorkStatus.AVAILABLE
  );

  useEffect(() => {
    // Load schedules and default status
    const loadData = async () => {
      const savedSchedules = await window.api.getScheduleRules();
      const savedDefaultStatus = await window.api.getDefaultStatus();
      setSchedules(savedSchedules);
      setDefaultStatus(savedDefaultStatus as WorkStatus);
    };
    loadData();
  }, []);

  const handleDefaultStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as WorkStatus;
    setDefaultStatus(newStatus);
    window.api.setDefaultStatus(newStatus);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Default Startup Status</h3>
        <p className="text-sm text-base-content/70 mb-3">
          Choose the status that will be set automatically when the application
          starts.
        </p>
        <select
          className="select select-bordered w-full max-w-xs"
          value={defaultStatus}
          onChange={handleDefaultStatusChange}
        >
          {Object.values(WorkStatus).map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="divider"></div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Scheduled Status Rules</h3>
        <button className="btn btn-primary btn-sm">Add New Rule</button>
      </div>
      {/* Schedule rules list will be rendered here */}
    </div>
  );
};
