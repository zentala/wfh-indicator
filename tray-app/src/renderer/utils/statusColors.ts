import { WorkStatus } from "../../shared/types";

interface StatusDisplay {
  color: "red" | "orange" | "yellow" | "green" | "blue" | "gray";
  emoji: string;
  tooltip: string;
}

export const statusColors: Record<WorkStatus, StatusDisplay> = {
  ON_CALL: { color: "red", emoji: "🔴", tooltip: "On Call - Do not disturb" },
  VIDEO_CALL: {
    color: "orange",
    emoji: "🟠",
    tooltip: "Video Call - Do not enter",
  },
  FOCUSED: { color: "yellow", emoji: "🟡", tooltip: "Focused - Urgent only" },
  AVAILABLE: { color: "green", emoji: "🟢", tooltip: "Available - Come in" },
  AWAY: { color: "blue", emoji: "🔵", tooltip: "Away - Not at desk" },
  OFFLINE: { color: "gray", emoji: "⚫", tooltip: "Disconnected" },
};
