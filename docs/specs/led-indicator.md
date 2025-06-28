# 🔴 WFH LED Indicator Concept

A custom hardware research project for electronics enthusiasts who want to create a permanent, elegant door status indicator.

**Current Status**:

- Concept and initial specifications complete.
- Looking for community members to help bring this vision to life.

**Next Steps**: Firmware development → PCB design → 3D case modeling → Community testing

---

## 🎯 Why LED Ring Version?

While the phone version solves the immediate problem, the LED ring represents a **research and development exploration** for:

- **Permanent installation**: Once mounted, it's always there
- **Elegant form factor**: Designed specifically for door mounting
- **Community hardware project**: Open source design for makers
- **Lower power consumption**: More efficient than phone displays
- **Custom aesthetics**: Can be designed to match home decor
- **Learning opportunity**: Great project for electronics hobbyists

**Positioning**: This is an **experimental maker project**, not necessarily more practical than the phone version.

---

## 🧱 Hardware Architecture

### Core Components

- **ESP32 microcontroller** - WiFi connectivity and control
- **WS2812B LED ring** - Individually addressable RGB LEDs (16-24 LEDs)
- **Momentary button** - "Ask to Enter" functionality for outsiders
- **Power system** - batteries or micro-USB connection
- **3D printed case** - Custom mounting solution for doors

### Optional Enhancements

- **PIR motion sensor** - Detect movement in hallway, brighten display to save energy
- **Ambient light sensor** - Auto-adjust brightness based on time of day

---

## 🔧 Technical Specifications

### ⚡ Power Management

- **Voltage requirements**:
  - ESP32: 3.3V operating voltage (dev boards typically have onboard regulators accepting 5-12V input)
  - ESP8266: 3.3V operating voltage (maximum 3.6V)
  - WS2812B LEDs: Works with voltages between 3.3V and 5V (5V recommended for best brightness and reliability)
- **Voltage regulation**:
  - Onboard voltage regulator required for battery power
  - Level shifter may be needed between ESP (3.3V) and 5V LED data lines
- **Battery options**:
  - **2x AA/AAA**: ~3V
  - **3x AA/AAA**: ~4.5V
  - **Flat LiPo battery** (recommended): 3.7V, 500-2000+ mAh, compact and thin form factor similar to smartphone batteries
  - **USB power**: Direct connection for stationary installations
- **Battery capacity reference**:
  - Alkaline AAA: 850-1200 mAh
  - NiMH AAA rechargeable: 350-1000 mAh
  - Alkaline AA: 1700-2850 mAh
  - NiMH AA rechargeable: 1200-2800 mAh
  - LiPo flat: 500-2000+ mAh depending on size

- **Power consumption** (estimated):
  - **Full brightness**: ~100-150mA
  - **Energy-saving mode**: ~20-30mA
  - **Sleep mode**: ~5-10mA
  - **Runtime**: 10-40 hours depending on battery and usage pattern
- **Power features**:
  - **Low battery indicator**: LEDs dim when battery <20%
  - **Battery status reporting**: Sends notifications to tray app when battery is low
  - **Optional power**: Device designed for both battery and USB power options
  - **Easy battery access**: Enclosure designed for simple battery replacement/charging
  - **Charging**: Optional USB-C charging circuit for rechargeable options

#### Power Management Challenges

- **Long-term operation**: Current estimates (10-40 hours) fall short of ideal weekly charging cycle
- **User experience**: Device should require minimal maintenance to encourage adoption
- **Research needed**: Further optimization of power consumption required
- **Adaptive brightness**: Automatic adjustment based on ambient light conditions
- **Detachable design**: Easy removal for charging without disrupting mounting
- **Power states**: Intelligent sleep modes when no movement detected

### 🛜 Communication

#### Initial Setup & Pairing

- **BLE pairing** (recommended):
  - Device enters BLE pairing mode when button is held during startup
  - Tray app discovers device via Bluetooth
  - Securely transfers WiFi credentials and tray app IP address
  - Once paired, switches to WiFi for normal operation
- **USB pairing**:
  - Connect device directly to computer via USB
  - Tray app communicates through UART/Serial
  - Uploads WiFi credentials and communication settings
  - Device tests connection and confirms success
  - Simple and reliable method for initial setup
- **Simple admin panel**:
  - ESP32 hosts configuration web server in AP mode
  - Connect directly to device's WiFi network for setup
  - Configure WiFi credentials and communication settings
  - Once configured, device joins home WiFi network

#### Normal Operation

- **WiFi connection** to home network
- **WebSocket protocol** for status updates
- **Direct IP communication** between tray app and device
- **Local network only** (no internet dependency)
- **Configuration updates** via JSON over HTTP from tray app

#### Communication settings config

- **Tray app connection**: IP address and port number
- **WiFi credentials**: SSID, password, security type (WPA/WPA2/WPA3)
- **Authentication**: Shared secret token generated during pairing
- **Update server**: Optional remote update source
- **Example config**:

```json
{
  "network": {
    "wifi": {
      "ssid": "HomeNetwork",
      "password": "********",
      "security": "WPA2"
    },
    "tray_app": {
      "ip": "192.168.1.100",
      "port": 8080,
      "auth_token": "a1b2c3d4e5f6g7h8i9j0"
    }
  },
  "device": {
    "name": "office-door",
    "brightness": 70,
    "motion_detection": true,
    "sleep_timeout": 300
  }
}
```

#### Network Challenges

Dynamic IP addresses in local networks present a challenge for maintaining stable connections. For detailed solutions to this challenge, see [Network Communication Strategy](./network-communication.md) document.

### 🔆 LED Patterns

#### Display Modes

- **Energy-saving mode**: Reduced brightness with minimal LEDs active to extend battery life
- **Active mode**: Full brightness when motion detected or interaction required
- **Notification mode**: Special patterns to communicate with people outside the room

#### Status Colors

- **Red**: On call (audio) / Do not disturb
- **Orange**: Video call / Do not enter
- **Yellow**: Focused / Only urgent interruptions
- **Green**: Available / Come in
- **Blue**: Away / Not at desk

#### Animation Patterns

- **Slow rotation**: Few LEDs moving in circular pattern (energy-saving default)
- **Solid color**: All LEDs lit at full brightness (motion-activated)
- **Transition effect**: Gradual change in color proportion showing upcoming status change
  - Example: Increasing red LEDs among green ones = approaching meeting time
  - Example: Increasing green LEDs among red ones = meeting ending soon
- **Blinking patterns** (15-30 seconds duration):
  - Fast green blinking: "Yes" response to "Ask to Enter"
  - Fast yellow blinking: "Enter only if important" response
  - Fast red blinking: "No" response or "Please be quiet" signal
- **Connectivity issues**: Cycling through all colors to indicate connection problems

#### Customization Note

This is a UI concept only. Animation patterns would be part of practical research based on community feedback, allowing for individual customization to match personal preferences and specific use cases.

---

## 🔧 Implementation Phases

### Phase 1: Basic Prototype

- ESP32 + LED strip in ring formation
- Basic WiFi communication with tray app
- Simple button input
- Breadboard proof of concept

### Phase 2: PCB Design

- Custom circuit board for compact form factor
- Integrated power management
- Professional component layout
- Easier assembly for community builders

### Phase 3: Enclosure Design

- 3D printable case optimized for door mounting
- Multiple mounting options (magnetic, adhesive, screw)
- Cable management for USB power
- Weather-resistant outdoor version

### Phase 4: Advanced Features

- Motion detection integration
- Home Assistant compatibility
- Multiple ring support (different rooms)
- Wireless charging base station

---

## 🛠 DIY Build Guide (Future)

### Required Skills

- Basic electronics (soldering, breadboard assembly)
- 3D printing access or service
- Arduino/ESP32 programming experience
- WiFi network configuration

### Estimated Costs

- **Components**: $15-25 (ESP32, LEDs, button, resistors)
- **Case materials**: $5-10 (3D printing filament)
- **Tools needed**: Soldering iron, multimeter, computer for programming

### Build Time

- **Experienced maker**: 4-6 hours
- **Beginner with guidance**: 8-12 hours
- **PCB assembly**: 2-3 hours

---

## 🎨 Design Variations

### Ring Sizes

- **Compact**: 60mm diameter (12 LEDs) - minimalist
- **Standard**: 80mm diameter (16 LEDs) - balanced visibility
- **Large**: 100mm diameter (24 LEDs) - maximum visibility

### Form Factors

- **LED Ring**: Classic circular display
- **Rounded Square**: Modern aesthetic alternative
- **LED Strip**: Linear display that can be mounted on door frames

### Power Options

- **Battery pack**: Portable, requires charging or replacements
- **USB cable**: Permanent power, requires cable routing
- **Integrated charging circuit**: Recharge without disassembly

### Prototype Variants Needed

- **Ring variant**: Circular LED arrangement for door mounting
- **Rounded Square variant**: Square with rounded corners for modern aesthetic
- **Line variant**: Linear LED strip for door frame installation

### Mounting Options for Each Form Factor

**Detachable mount principle**: All mounting solutions should allow for easy removal of the device for charging and maintenance, while leaving the mounting hardware in place.

#### By Location

- **Door mount**: Attached directly to door surface
- **Frame mount**: Attached to door frame
- **Shelf/desk mount**: Free-standing with base for flat surface placement
- **Wall mount**: Attached to wall near entrance

#### By Attachment Method

- **Magnetic**: For metal door frames and surfaces (naturally detachable)
- **Over-door hanger**: Hangs over the top of door (easily removable)
- **Adhesive**: Uses strong tape or glue for permanent mount base with detachable device
- **Screws**: Permanent base with slide-in/slide-out device holder
- **Free-standing**: With weighted base for stability (inherently portable)

#### Detachable Design Examples

- **Magnetic connector**: Device snaps onto magnetic base that remains attached
- **Slide mount**: Device slides into wall/door-mounted bracket
- **Twist-lock mechanism**: Simple quarter-turn to attach/detach
- **Quick-release clip**: Press-to-release mechanism for fast removal

### Common Components Across Variants

- **Firmware**: Core ESP32 code works across all variants
- **Power management**: Same battery saving and charging solutions adaptable to all designs
- **Communication**: Same network protocols and pairing methods
- **Button interface**: Tactile button with same interaction patterns

### Variant-Specific Components

- **PCB design**: Custom layout for each form factor
- **3D printed case**: Specific design for each variant and mounting option
- **LED arrangement**: Different patterns and quantities based on form factor
- **Assembly instructions**: Tailored to each variant's unique requirements

---

## 🤝 Community Collaboration

### Looking for Contributors

- **PCB designers** - Create professional circuit layouts
- **3D modelers** - Design mounting cases and enclosures
- **Firmware developers** - ESP32 programming and optimization
- **Industrial designers** - Improve aesthetics and usability
- **Beta testers** - Build prototypes and provide feedback

### Open Source Approach

- **Hardware designs**: Creative Commons license
- **Firmware code**: MIT license
- **Documentation**: Freely shareable build guides
- **Community support**: Discord/forum for builders

### Why Not Ready Yet

- **No working firmware** - ESP32 code needs to be tested and its development finished
- **No case designs** - Multiple 3D models designs needed for different variants
- **No PCB layouts** - Different PCB boards designs needed for each form factor
- **Assembly complexity** - Currently requires PCB design, 3D modelling and printing skills

### Development Roadmap

1. **Initial research phase** (current)
   - Concept validation and specifications
   - Community feedback gathering

2. **Prototype development**
   - Design at least 2 initial variants (ring and line)
   - Create PCB layouts for each variant
   - Develop 3D printable cases with mounting options
   - Document assembly process

3. **Community expansion**
   - Release designs on GitHub
   - Encourage community-contributed variants
   - Build documentation repository with multiple options
   - Create gallery of successful implementations

## 🔮 Future Vision

- **Kit sales** - Pre-assembled components for easier building

### Honest Assessment

This is a **research project** that requires community involvement to develop multiple viable solutions. The goal is to create a diverse set of implementation options to suit different user needs.

---

## 📊 Success Metrics

### Community Engagement

- Number of successful builds documented
- GitHub contributions (issues, PRs, documentation)
- Community forum activity and support
- YouTube build videos and tutorials

### Technical Milestones

Multiple prototype designs completed (at least 2-3 variants):

- Working firmware with all basic features
- Stable 3D printable cases designs
- Different PCB layouts for different form factors ready for manufacturing
- Comprehensive build documentation for each variant
- Mounting solutions documented
- Different form factors implemented (ring, line, etc.)

---

## 📚 References & Similar Projects

### Inspirational Projects

- [LED Ring Around The ESP8266](https://hackaday.com/2015/09/12/led-ring-around-the-esp8266/) - Similar concept using ESP8266 without button integration
- [MicroPython WS2812B Addressable RGB LEDs with ESP32/ESP8266](https://randomnerdtutorials.com/micropython-ws2812b-addressable-rgb-leds-neopixel-esp32-esp8266/) - Tutorial on controlling WS2812B LEDs with MicroPython
- [ESP-01 with WLED](https://www.youtube.com/watch?v=4pxLlIhOmeI) - Compact implementation using ESP-01 module

---

[← Back to main project](../README.md) | [View mobile app specs](../specs/mobile-app.md)
