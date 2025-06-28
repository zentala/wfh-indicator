# WFH Mobile Indicator - Mobile App Architecture

## 📱 App Structure (React Native + Expo)

### Core Components

```tree
src/
├── components/
│   ├── StatusDisplay.tsx      # Main always-on status screen
│   ├── AskToEnterButton.tsx   # Interactive button for outsiders
│   ├── StatusSelector.tsx     # Quick status change (for user inside)
│   └── ConnectionStatus.tsx   # WiFi/connection indicator
├── screens/
│   ├── MainStatusScreen.tsx   # Always-on door display
│   ├── SetupScreen.tsx        # Initial pairing with tray app
│   └── SettingsScreen.tsx     # Customization options
├── services/
│   ├── NetworkService.ts      # WiFi discovery & communication
│   ├── StatusService.ts       # Status management & sync
│   └── NotificationService.ts # Local notifications
└── types/
    └── StatusTypes.ts         # TypeScript definitions
```

## 🎨 Interface Design Specifications

### Main Status Display (Always-On)

```tsx
// MainStatusScreen.tsx concept
interface StatusDisplayProps {
  status: WorkStatus;
  timeRemaining?: string;
  canAskToEnter: boolean;
}

enum WorkStatus {
  ON_CALL = 'on_call',
  VIDEO_CALL = 'video_call',
  FOCUSED = 'focused',
  AVAILABLE = 'available',
  AWAY = 'away'
}
```

### Screen States Design

#### 🔴 ON CALL State

```text
┌─────────────────────────────────┐
│             BLACK BG            │
│                                 │
│          🔴 📞                 │
│        ON A CALL                │
│       until 15:30               │
│                                 │
│    [  ASK TO ENTER  ]           │
│       (if urgent)               │
│                                 │
│  Last updated: 14:45            │
└─────────────────────────────────┘
```

#### 🟠 VIDEO CALL State

```text
┌─────────────────────────────────┐
│             BLACK BG            │
│                                 │
│          🟠 🎥                 │
│       VIDEO CALL                │
│      just listening             │
│                                 │
│    [  ASK TO ENTER  ]           │
│       (if urgent)               │
│                                 │
│  Last updated: 14:45            │
└─────────────────────────────────┘
```

#### 🟡 FOCUSED State

```text
┌─────────────────────────────────┐
│             BLACK BG            │
│                                 │
│          🟡 💻                 │
│      FOCUSED WORK               │
│     please be quiet             │
│                                 │
│    [  ASK TO ENTER  ]           │
│                                 │
│                                 │
│  Last updated: 14:45            │
└─────────────────────────────────┘
```

#### 🟢 AVAILABLE State

```text
┌─────────────────────────────────┐
│             BLACK BG            │
│                                 │
│          🟢 ✅                 │
│       AVAILABLE                 │
│      come on in!                │
│                                 │
│      [  ENTER  ]                │
│                                 │
│                                 │
│  Last updated: 14:45            │
└─────────────────────────────────┘
```

#### 🔵 AWAY State

```text
┌─────────────────────────────────┐
│             BLACK BG            │
│                                 │
│          🔵 🚶                 │
│         AWAY                    │
│      not at desk                │
│                                 │
│    [  LEAVE MESSAGE  ]          │
│                                 │
│                                 │
│  Last updated: 14:45            │
└─────────────────────────────────┘
```

## 🔄 Interaction Flow

### Setup Flow

```text
1. Download app on old phone
2. Open app → "Connect to your laptop"
3. Tray app displays QR code
4. Scan QR code with phone camera
5. Connection established!
6. Mount phone on door
7. Enable "Always On" display
```

### Daily Usage Flow

```text
YOU (at laptop):
[Change status in tray app]
    ↓
[Phone display updates automatically]

FLATMATE (at door):
[Sees red status: "ON A CALL"]
[Taps "ASK TO ENTER" if urgent]
    ↓
[Your laptop shows notification]
[You click: "5 more min" or "Come in"]
    ↓
[Phone shows your response]
```

## 🛠 Technical Architecture

### State Management

```typescript
interface AppState {
  currentStatus: WorkStatus;
  endTime?: Date;
  connectionStatus: 'connected' | 'offline' | 'searching';
  trayAppAddress?: string;
  authToken?: string;
  lastUpdated: Date;
}

interface StatusChangeRequest {
  newStatus: WorkStatus;
  duration?: number; // minutes
  message?: string;
}

interface AskToEnterRequest {
  timestamp: Date;
  urgency: 'normal' | 'urgent';
}
```

### Network Communication

```typescript
// NetworkService.ts
class NetworkService {
  connectViaScanQR(): Promise<string> {
    // Scan QR code displayed on tray app
    // QR contains IP address and auth token
    // Returns connection info for tray app
  }

  sendStatusChange(status: WorkStatus): Promise<void> {
    // HTTP POST to tray app
  }

  sendAskToEnter(request: AskToEnterRequest): Promise<void> {
    // Send "knock" request to tray app
  }

  listenForStatusUpdates(): WebSocket {
    // WebSocket connection for real-time updates
  }
}
```

> **Note:** For detailed information about network communication strategy, IP discovery methods, and reconnection logic, see [Network Communication Strategy](./network-communication.md).

### Always-On Display Management

```typescript
// Keep screen on and dim
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { Brightness } from 'expo-brightness';

// On app start
activateKeepAwake();
Brightness.setBrightnessAsync(0.3); // Dim but visible

// Battery optimization
const isNightMode = new Date().getHours() > 22 || new Date().getHours() < 6;
Brightness.setBrightnessAsync(isNightMode ? 0.1 : 0.3);
```

## 📋 ADR (Architecture Decision Records)

### ADR-001: React Native + Expo Choice

**Context**: Need cross-platform mobile app for old phones
**Decision**: Use React Native with Expo

- Easy deployment to old Android phones
- No App Store approval needed
- Can create APK for direct install
- Built-in keep-awake functionality

### ADR-002: Local WiFi Communication

**Context**: Phone needs to communicate with laptop tray app
**Decision**: Primary: Local WiFi with QR code pairing, Fallback: Cloud service
**Reasoning**:

- Privacy (no data leaves home)
- Low latency
- Works without internet
- Fallback ensures reliability
- QR code pairing works across all platforms (Windows, Mac, Linux)

### ADR-003: Always-On Display Design

**Context**: Phone will be mounted on door for hours
**Decision**: Black background, minimal UI, key info only
**Reasoning**:

- Battery preservation
- OLED screen efficiency
- Clear visibility from hallway
- Reduces burn-in risk

### ADR-004: Status Update Method

**Context**: How to change status from laptop
**Decision**: Tray app as primary controller, phone as display
**Reasoning**:

- Natural workflow (status changes while working)
- Phone acts as "dumb terminal"
- Easier to implement

## 🔧 Development Phases

### Phase 1: MVP (2-3 days)

- Basic status display (red/green)
- Manual status toggle on phone
- Simple UI mockup
- No networking yet

### Phase 2: Connection (1 week)

- QR code network pairing
- Basic tray app communication
- Status sync between devices

### Phase 3: Polish (1 week)

- Always-on optimization
- "Ask to enter" functionality
- Better UI/UX
- Error handling

### Phase 4: Advanced (future)

- Calendar integration
- Multiple devices support
- Home Assistant integration
- Settings customization

## 📱 Expo Configuration

### Required Expo Modules

```json
{
  "expo-keep-awake": "Screen always on",
  "expo-brightness": "Dim display for battery",
  "expo-network": "Network connectivity checks",
  "expo-barcode-scanner": "QR code scanning for pairing",
  "expo-notifications": "Status change alerts",
  "expo-screen-orientation": "Lock to portrait"
}
```

### Build Configuration

```json
// app.json
{
  "expo": {
    "name": "WFH Indicator",
    "slug": "wfh-indicator",
    "platforms": ["android"],
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "backgroundColor": "#000000"
  }
}
```
