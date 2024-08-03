# WFH Indicator

This project allows displaying a busy status on an LED ring using ESP32, controlled by a Python application with a PyQt5 graphical interface.

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
│ ├── main.py
│ └── requirements.txt
│
├── .venv/
├── .python-version
├── setup.sh
└── README.md
```

## System Requirements

- Windows with WSL (Windows Subsystem for Linux) installed
- Python 3.11.9 (installed via pyenv)
- Git

## Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/zentala/wfh-indicator.git
   cd wfh-indicator
   ```

2. Install required system packages:

   ```bash
   sudo apt-get update
   sudo apt-get install -y make build-essential libssl-dev zlib1g-dev \
   libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev \
   libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python-openssl \
   python3-dev portaudio19-dev
   ```

3. Install pyenv (if not already installed):

   ```bash
   curl https://pyenv.run | bash
   ```

   Add pyenv to your shell configuration file (e.g., `.bashrc` or `.zshrc`).

4. Install Python 3.11.9 and set it as the local version:

   ```bash
   pyenv install 3.11.9
   pyenv local 3.11.9
   ```

5. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

6. Install project dependencies:
   ```bash
   pip install -r controller/requirements.txt
   ```

## Running the Application

1. Ensure you're in the project directory and the virtual environment is activated:

   ```bash
   cd ~/path/to/wfh-indicator
   source .venv/bin/activate
   ```

2. Run the application:
   ```bash
   python controller/main.py
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

## Troubleshooting

If you encounter any issues with PyQt5 or other dependencies, ensure that all system packages are installed and that you're using the virtual environment.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
