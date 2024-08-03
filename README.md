# WFH Indicator

This project allows displaying busy status on an LED ring using ESP32.

## Project Structure

    \```
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
    │ ├── main.py
    │ └── requirements.txt
    │
    └── README.md
    \```

## ESP32

### Configuration

1. Configure the `platformio.ini` file with appropriate Wi-Fi settings.
2. Use PlatformIO to upload the code to ESP32.

### Compilation and Upload

1. Open a terminal and navigate to the `esp32` directory.
2. Execute the command:

   \```bash
   platformio run --target upload
   \```

## Control Application

### Configuration

1. Navigate to the `controller` directory.
2. Install required libraries:

   \```bash
   pip install -r requirements.txt
   \```

### Running

1. Launch the application:

   \```bash
   python main.py
   \```

## Features

- Clicking the "Busy" button will send a signal to ESP32 to set the LED ring to red.
- Clicking the "Free" button will send a signal to ESP32 to set the LED ring to green.