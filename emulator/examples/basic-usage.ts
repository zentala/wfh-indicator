/**
 * Basic Usage Example for WFH Indicator Emulator
 */

import { DeviceMock } from "../src/main/deviceMock";

async function runExample() {
  console.log("🎯 WFH Indicator Emulator - Basic Usage Example");
  console.log("================================================");

  // Create device mock
  const mock = new DeviceMock({
    port: 8080,
    testMode: true,
    debug: true,
  });

  try {
    // Start the emulator
    console.log("🚀 Starting emulator...");
    await mock.start();
    console.log("✅ Emulator started");

    // Get initial status
    const status = mock.getStatus();
    console.log("📊 Initial status:", {
      deviceId: status.deviceId,
      connected: status.connected,
      batteryLevel: status.batteryLevel + "%",
      charging: status.charging,
    });

    // Test LED functionality
    console.log("\n🎨 Testing LED functionality...");
    const ledController = mock.getLEDController();

    // Set different colors
    const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];
    for (const color of colors) {
      console.log(`Setting LED color to ${color}`);
      ledController.setColor(color);

      const ledStatus = ledController.getStatus();
      console.log(
        `LED Status: ${ledStatus.color}, Brightness: ${ledStatus.brightness}%`,
      );

      // Wait a bit between color changes
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Test brightness control
    console.log("\n💡 Testing brightness control...");
    for (let brightness = 100; brightness >= 20; brightness -= 20) {
      ledController.setBrightness(brightness);
      console.log(`Brightness set to ${brightness}%`);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Test button functionality (if in test mode)
    console.log("\n🔘 Testing button functionality...");
    const testController = mock.getTestController();
    if (testController) {
      console.log("Simulating single button press...");
      await testController.pressButton("single");

      console.log("Simulating double button press...");
      await testController.pressButton("double");

      console.log("Simulating long button press...");
      await testController.pressButton("long");
    }

    // Test WiFi communication
    console.log("\n📡 Testing WiFi communication...");
    const wifiManager = mock.getWiFiManager();
    console.log(`Connected clients: ${wifiManager.getConnectedClientsCount()}`);
    console.log(`Server running: ${wifiManager.isServerRunning()}`);

    // Test ask to enter functionality
    if (testController) {
      console.log("\n🚪 Testing ask to enter functionality...");
      await testController.sendAskToEnterRequest("normal");
      console.log("Ask to enter request sent");

      const response = await testController.getLastResponse();
      console.log("Last response:", response);
    }

    // Show final status
    console.log("\n📊 Final status:");
    const finalStatus = mock.getStatus();
    console.log({
      deviceId: finalStatus.deviceId,
      connected: finalStatus.connected,
      batteryLevel: finalStatus.batteryLevel + "%",
      charging: finalStatus.charging,
    });

    console.log("\n✅ Example completed successfully!");
  } catch (error) {
    console.error("❌ Example failed:", error);
  } finally {
    // Stop the emulator
    console.log("\n🛑 Stopping emulator...");
    await mock.stop();
    console.log("✅ Emulator stopped");
  }
}

// Run the example
runExample().catch(console.error);
