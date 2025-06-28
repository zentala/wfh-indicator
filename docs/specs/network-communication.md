# Network Communication Strategy

## 🌐 Challenge: Dynamic IP Addresses

In local networks, devices often receive dynamic IP addresses from DHCP servers. This presents a challenge for maintaining stable connections between:

1. **LED Ring** and **Tray App** on laptop
2. **Mobile App** and **Tray App** on laptop

When the laptop's IP address changes (after restart, reconnection, etc.), the door devices lose connection to the tray app.

## 💡 Solution Approaches

### 1. Periodic IP Discovery

- **Polling mechanism**: Door devices periodically check for tray app by sending requests to the network asking "Are you there?" (active approach where the door device initiates communication)
- **Broadcast packets**: Tray app regularly broadcasts its presence on local network by sending "I'm here at IP X.X.X.X" messages that all devices can hear (passive approach where door devices just listen)
- **Reconnection logic**: Automatic reconnection when connection is lost using both methods above

These two mechanisms work together:

- Door device listens for broadcast messages from the tray app (passive)
- Door device also actively sends requests looking for the tray app (active polling)
- This combination ensures reliable discovery even if one method fails

### 2. Static IP Assignment

- **Router configuration**: Assign static DHCP lease to laptop
- **Manual setup**: Document process for users to set static IP
- **MAC address binding**: Link IP to laptop's network card MAC address

### 3. Connection Broker

- **Local broker service**: Small service running on network (e.g., Raspberry Pi)
- **Fixed reference point**: Acts as intermediary with stable IP
- **Registration system**: Both devices register with broker

### 4. Cloud Fallback (optional)

- **Privacy-focused relay**: Simple cloud service to reconnect devices
- **No status data transmission**: Only connection reestablishment
- **Opt-in feature**: Disabled by default for privacy

## 🔄 Implementation Details

### LED Ring Implementation

```cpp
// Pseudocode for reconnection logic
void maintainConnection() {
  if (!isConnected()) {
    // Try last known IP first
    if (connectToLastKnownIP()) {
      return;
    }

    // Try broadcast discovery
    if (discoverTrayAppViaUDP()) {
      return;
    }

    // Try connection broker if configured
    if (brokerEnabled && connectViaBroker()) {
      return;
    }

    // Set status to "disconnected"
    setConnectionStatus(DISCONNECTED);
  }
}
```

### Mobile App Implementation

```typescript
// NetworkService.ts
class NetworkService {
  // Store multiple connection methods
  private connectionMethods = [
    this.connectDirectIP,
    this.connectViaBroadcast,
    this.connectViaBroker
  ];

  async maintainConnection() {
    if (!this.isConnected) {
      // Try all methods in sequence
      for (const method of this.connectionMethods) {
        if (await method()) {
          this.isConnected = true;
          return;
        }
      }

      // Update UI to show disconnected status
      this.updateConnectionStatus('disconnected');
    }
  }
}
```

## 📊 Method Comparison

| Method             | Pros                     | Cons                     | Implementation Difficulty |
| ------------------ | ------------------------ | ------------------------ | ------------------------- |
| Periodic Discovery | Simple, no configuration | Network traffic, latency | Easy                      |
| Static IP          | Reliable, zero latency   | Requires router access   | Medium                    |
| Connection Broker  | Reliable, flexible       | Extra hardware           | Medium                    |
| Cloud Fallback     | Works across networks    | Privacy concerns         | Complex                   |

## 🔒 Security Considerations

- **Initial pairing**: Generate shared secret during first connection
- **Authentication**: Use token-based authentication for all communications
- **Encryption**: Encrypt all status data, even on local network
- **No open ports**: Door devices initiate connections, not the other way around

## 🚀 Recommended Approach

A hybrid approach is recommended:

1. **Primary**: Static IP assignment for reliability (default approach)
2. **Secondary**: Periodic IP discovery as fallback when static IP isn't possible
3. **Future**: Connection broker for multi-device setups and advanced scenarios

This provides maximum reliability with static IP while maintaining flexibility with discovery mechanisms.

## 📝 References

- [Mobile App Specs](./mobile-app.md) - Similar approach for phone implementation
- [LED Ring Specs](./led-ring.md) - Hardware communication requirements
