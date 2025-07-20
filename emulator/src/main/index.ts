#!/usr/bin/env node

/**
 * WFH Indicator Emulator - Entry Point
 */

import { DeviceMock } from "./deviceMock";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("🚀 Starting WFH Indicator Emulator...");

  // Create device mock
  const mock = new DeviceMock({
    port: parseInt(process.env.MOCK_PORT || "8080"),
    testMode: process.env.MOCK_TEST_MODE === "true",
    debug: process.env.MOCK_DEBUG === "true",
    batteryLevel: parseInt(process.env.MOCK_BATTERY_LEVEL || "100"),
    charging: process.env.MOCK_CHARGING === "true",
  });

  try {
    // Start the emulator
    await mock.start();
    console.log("✅ Emulator started successfully");
    console.log(
      "📡 WebSocket server running on port",
      process.env.MOCK_PORT || "8080",
    );
    console.log("🎯 Device ID:", mock.getStatus().deviceId);
    console.log("🔋 Battery Level:", mock.getStatus().batteryLevel + "%");

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\n🛑 Shutting down emulator...");
      await mock.stop();
      console.log("✅ Emulator stopped");
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\n🛑 Shutting down emulator...");
      await mock.stop();
      console.log("✅ Emulator stopped");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Failed to start emulator:", error);
    process.exit(1);
  }
}

// Run the emulator
main().catch(console.error);
