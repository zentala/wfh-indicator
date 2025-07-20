# WFH Indicator Emulator

Device emulator for WFH Indicator project - simulates ESP32 + WS2812B LED ring behavior for testing and development.

## 🎯 Overview

The emulator provides a complete simulation of the WFH Indicator LED device, including:

- **LED Ring Simulation**: Color changes, brightness control, animations
- **Button Interaction**: Single, double, and long press handling
- **WiFi Communication**: WebSocket server for tray app communication
- **Battery Monitoring**: Simulated battery level and charging states
- **Test Mode**: Programmatic control for automated testing

## 🏗️ Architecture

```
emulator/
├── src/
│   ├── main/
│   │   └── deviceMock.ts      # Main device mock controller
│   ├── components/
│   │   ├── ledController.ts    # LED ring simulation
│   │   ├── wifiManager.ts      # WebSocket communication
│   │   ├── buttonHandler.ts    # Button interaction
│   │   └── testController.ts   # Test mode interface
│   └── utils/
│       └── logger.ts          # Logging utility
├── tests/                     # Test files
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Start in development mode
pnpm dev

# Start in test mode
pnpm test:mock
```

### Configuration

Copy the environment example and configure:

```bash
cp env.example .env.local
```

Key configuration options:

```bash
# Device Configuration
MOCK_PORT=8080                    # WebSocket server port
MOCK_TEST_MODE=false              # Enable test mode
MOCK_DEBUG=false                  # Enable debug logging
MOCK_BATTERY_LEVEL=100           # Initial battery level
MOCK_CHARGING=false               # Charging state

# LED Configuration
MOCK_LED_DEFAULT_BRIGHTNESS=80   # Default LED brightness
MOCK_LED_ANIMATION_SPEED=1000    # Animation speed in ms

# Button Configuration
MOCK_BUTTON_DEBOUNCE_TIME=200    # Button debounce time
MOCK_BUTTON_LONG_PRESS_TIME=2000 # Long press threshold
MOCK_BUTTON_DOUBLE_PRESS_TIME=500 # Double press window
```

## 🔧 Usage

### Basic Usage

```typescript
import { DeviceMock } from './src/main/deviceMock';

// Create device mock
const mock = new DeviceMock({
  port: 8080,
  testMode: true,
  debug: true
});

// Start the emulator
await mock.start();

// Get device status
const status = mock.getStatus();
console.log('Device status:', status);

// Stop the emulator
await mock.stop();
```

### Test Mode Usage

```typescript
// Create device mock in test mode
const mock = new DeviceMock({
  testMode: true,
  debug: true
});

await mock.start();

// Get test controller
const testController = mock.getTestController();

if (testController) {
  // Simulate button press
  await testController.pressButton('single');

  // Get LED status
  const ledStatus = await testController.getLEDStatus();
  console.log('LED status:', ledStatus);

  // Send ask to enter request
  await testController.sendAskToEnterRequest('normal');

  // Get last response
  const response = await testController.getLastResponse();
  console.log('Last response:', response);
}
```

### LED Control

```typescript
const ledController = mock.getLEDController();

// Set LED color
ledController.setColor('#FF0000'); // Red

// Set brightness
ledController.setBrightness(80);

// Set animation pattern
ledController.setPattern({
  type: 'breathing',
  color: '#00FF00',
  brightness: 80,
  speed: 2000
});
```

### WiFi Communication

```typescript
const wifiManager = mock.getWiFiManager();

// Send message to tray app
wifiManager.sendMessage({
  type: 'ask_to_enter',
  deviceId: 'mock-device-1',
  urgency: 'normal',
  timestamp: Date.now()
});

// Listen for messages
wifiManager.onMessage((message) => {
  console.log('Received message:', message);
});
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Integration Tests

```bash
# Run integration tests
pnpm test:integration
```

### E2E Tests

```bash
# Run end-to-end tests with tray app
pnpm test:e2e
```

## 📡 WebSocket API

The emulator implements the WFH Indicator WebSocket API:

### Message Types

- `handshake`: Device identification and capabilities
- `status_update`: Work status updates from tray app
- `ask_to_enter`: Entry requests from device
- `ask_to_enter_response`: Responses to entry requests
- `battery_report`: Battery status reports
- `heartbeat`: Connection monitoring

### Example Messages

```typescript
// Status update from tray app
{
  type: 'status_update',
  status: 'AVAILABLE',
  timestamp: Date.now()
}

// Ask to enter request from device
{
  type: 'ask_to_enter',
  deviceId: 'mock-device-1',
  urgency: 'normal',
  timestamp: Date.now()
}

// Battery report from device
{
  type: 'battery_report',
  deviceId: 'mock-device-1',
  level: 85,
  charging: false,
  timestamp: Date.now()
}
```

## 🎨 LED Patterns

The emulator supports various LED patterns:

- **Solid**: Static color display
- **Breathing**: Smooth brightness fade in/out
- **Pulse**: Quick on/off pulsing
- **Blink**: Slow on/off blinking
- **Fade**: Smooth color transition

## 🔘 Button Interactions

- **Single Press**: Send "Ask to Enter" request
- **Double Press**: Toggle LED brightness
- **Long Press**: Reset device (simulate restart)

## 🔋 Battery Simulation

The emulator simulates battery behavior:

- Gradual battery drain when not charging
- Battery level reports every 5 minutes
- Charging state simulation
- Low battery warnings

## 🐛 Debugging

Enable debug mode for detailed logging:

```bash
MOCK_DEBUG=true pnpm dev
```

Debug information includes:
- WebSocket message traffic
- LED state changes
- Button press events
- Battery level updates
- Error conditions

## 📊 Monitoring

The emulator provides status monitoring:

```typescript
// Get device status
const status = mock.getStatus();
console.log('Connected:', status.connected);
console.log('Battery:', status.batteryLevel);
console.log('LED Color:', status.ledColor);

// Get LED status
const ledStatus = ledController.getStatus();
console.log('LED Pattern:', ledStatus.pattern);
console.log('Animated:', ledStatus.animated);

// Get WiFi status
const clientCount = wifiManager.getConnectedClientsCount();
console.log('Connected clients:', clientCount);
```

## 🔧 Development

### Project Structure

```
src/
├── main/
│   └── deviceMock.ts          # Main controller
├── components/
│   ├── ledController.ts        # LED simulation
│   ├── wifiManager.ts          # WebSocket handling
│   ├── buttonHandler.ts        # Button logic
│   └── testController.ts       # Test interface
└── utils/
    └── logger.ts              # Logging utility
```

### Adding New Features

1. **New LED Pattern**: Add to `LEDPatternType` enum and implement in `LEDController`
2. **New Message Type**: Add to domain types and implement in `WiFiManager`
3. **New Button Action**: Add to `ButtonHandler` and wire up in `DeviceMock`

### Testing New Features

1. Add unit tests in `tests/unit/`
2. Add integration tests in `tests/integration/`
3. Update test controller if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Projects

- **Domain Package**: Shared types and interfaces (`../domain`)
- **Tray App**: Desktop application (`../tray-app`)
- **Mobile App**: React Native application (planned)
- **Hardware**: ESP32 + WS2812B implementation (planned)
