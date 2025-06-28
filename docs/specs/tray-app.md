# Tray App Specification

Simple Electron app in system tray.

## Features

### Basic

- Shows current status in tray icon
- Status selector (Red/Orange/Yellow/Green/Blue)
- Receives & answers to "Ask to enter" from indicator
- Indicator low battery level notification
- Schedule-based status rules
- Indicator Pairing & Configuration

### Advanced

- Auto-sync with calendar(s)
- Detect microphone and camera usage status
- Various Steam Deck plugins
- Home Assistant integration
- Smart Mirror displays
- Multiple WFH Indicators support (different rooms/locations)

## Tech

- Electron + TypeScript
- Local WiFi for direct communication

## Interface

- Click tray icon → popup with status buttons
- Notification when phone sends "ask to enter"
- Response options to "Ask to Enter" requests:
  - 🔴 **NO** (not now)
  - 🟠 **IF_URGENT** (only if important)
  - 🟢 **YES** (come in)
- Turn off indicator option (disables door device light/display)
- Exit/Quit option in tray menu

### Settings

- Default status rules configuration:
  - Schedule-based status rules (e.g., Monday-Friday 10:00-12:00 → Yellow "Focused")
  - Custom time blocks for recurring activities
- Settings of WFH Indicator device
  - (Multi-)Device pairing
  - Battery level monitoring (reported every 5 minutes via WebSocket)
  - Remote device settings control
- Notification preferences
  - Silent mode during audio calls (microphone on or screen sharing)
  - Visual-only mode during screen sharing - tray icon flashing only
- Startup options (launch on system start)

## Security & Privacy

- Local-only communication (no cloud dependency)
- Authentication token system for secure device pairing
- Encrypted connection between tray app and indicator devices

## Network Configuration

- WebSocket server for indicator device communication
- Configurable port settings (to avoid conflicts with other applications)
- IP discovery mechanisms:
  - Broadcasting service (regularly announces app presence on network)
  - Response to polling requests from indicator devices

## Device Communication

The tray app communicates with devices using the same WebSocket protocol. Different device types display information according to their capabilities:

**WFH Indicators (door-mounted devices):**
- **[Mobile App](./mobile-app.md)**: Full status display with text, calendar integration, touch interactions
- **[LED Ring](./led-indicator.md)**: Color-only display, button interactions, battery reporting

**Status Display Plugins (smart home integrations):**
- **Home Assistant**: Status display on dashboards, automations
- **Smart Mirrors**: Read-only status display (no "Ask to Enter" support)
- **Mobile Widgets**: Remote status viewing anywhere in home

For detailed network communication strategy, see [Network Communication Strategy](./network-communication.md).

## Device Pairing

- Guided pairing wizard for new devices
- QR code generation for mobile app pairing
- USB/UART connection support for LED indicator pairing

End of spec.
