# WFH Indicator

This project allows displaying a busy status on an LED ring using ESP32, controlled by an Electron.js application with TypeScript.

## Project Structure

```
wfh-indicator/
│
├── esp32/
│ ├── src/
│ │ └── main.cpp
│ ├── include/
│ ├── lib/
│ └── platformio.ini
│
├── controller/
│ └── (Electron.js files)
│
└── README.md
```

## System Requirements

- Windows with WSL (Windows Subsystem for Linux) installed
- Node.js and npm
- Git

## Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/zentala/wfh-indicator.git
   cd wfh-indicator
   ```

2. Install Node.js v20.16 and npm (if not already installed)

3. Navigate to the controller directory and install dependencies:
   ```bash
   cd controller
   npm install
   ```

## Running the Application

1. Ensure you're in the controller directory:

   ```bash
   cd ~/path/to/wfh-indicator/controller
   ```

2. Run the application:
   ```bash
   npm start
   ```

## ESP32 Configuration

1. Navigate to the `esp32` directory.
2. Configure the `platformio.ini` file with appropriate Wi-Fi settings.
3. Use PlatformIO to upload the code to ESP32:
   ```bash
   platformio run --target upload
   ```

## Features

- GUI application with "Busy" and "Free" buttons.
- Sends status updates to ESP32.
- ESP32 controls LED ring to display status (red for busy, green for free).

# WFH Indicator

This project allows displaying a busy status on an LED ring using ESP32, controlled by an Electron.js application with TypeScript.

## Project Structure

```
wfh-indicator/
│
├── esp32/
│ ├── src/
│ │ └── main.cpp
│ ├── include/
│ ├── lib/
│ └── platformio.ini
│
├── controller/
│ └── (Electron.js files)
│
└── README.md
```

## System Requirements

- Windows with WSL (Windows Subsystem for Linux) installed
- Node.js and npm (we recommend using nvm for installation)
- Git

## Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/zentala/wfh-indicator.git
   cd wfh-indicator
   ```

2. For Node.js and npm installation, we recommend using nvm. Detailed instructions for setting up the controller can be found in the controller's directory.

3. Navigate to the controller directory and install dependencies:
   ```bash
   cd controller
   npm install
   ```

## Running the Application

1. Ensure you're in the controller directory:

   ```bash
   cd ~/path/to/wfh-indicator/controller
   ```

2. Run the application:
   ```bash
   npm start
   ```

## ESP32 Configuration

1. Navigate to the `esp32` directory.
2. Configure the `platformio.ini` file with appropriate Wi-Fi settings.
3. Use PlatformIO to upload the code to ESP32:
   ```bash
   platformio run --target upload
   ```

## Features

- GUI application with "Busy" and "Free" buttons.
- Sends status updates to ESP32.
- ESP32 controls LED ring to display status (red for busy, green for free).

## Hardware

### Components

1.  **ESP8266** - Microcontroller for controlling the LED ring.
2.  **ESP-01S RGB LED Adapter** - Interface for connecting the ESP8266 to the LED ring.
3.  **WS2812B LED Ring** - Individually addressable RGB LEDs.
4.  **5V Power Supply**

### Connections

**Wiring Diagram:**

```
ESP-01S RGB LED Adapter  LED Ring
---------------------------------
Red (VCC)           ----> 5V
Black (GND)         ----> GND
Yellow (Data)       ----> DI
```
