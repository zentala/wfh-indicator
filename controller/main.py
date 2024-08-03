import sys
from PyQt5.QtWidgets import QApplication, QSystemTrayIcon, QMenu, QAction, QInputDialog, QMessageBox
from PyQt5.QtGui import QIcon
from PyQt5.QtCore import QSettings
import requests
import signal

class SystemTrayApp(QSystemTrayIcon):
    def __init__(self):
        super().__init__()
        print("Initializing SystemTrayApp")
        icon_path = 'controller/icon.png'  # Zaktualizowana ścieżka
        print(f"Loading icon from: {icon_path}")
        self.setIcon(QIcon(icon_path))
        self.settings = QSettings('YourCompany', 'WFH Indicator')
        self.esp32_ip = self.settings.value('esp32_ip', 'http://your_esp32_ip')
        print(f"ESP32 IP set to: {self.esp32_ip}")
        self.initUI()

    def initUI(self):
        print("Initializing UI")
        menu = QMenu()
        
        busy_action = QAction('Set Busy', self)
        busy_action.triggered.connect(self.set_busy)
        menu.addAction(busy_action)

        free_action = QAction('Set Free', self)
        free_action.triggered.connect(self.set_free)
        menu.addAction(free_action)

        menu.addSeparator()

        settings_action = QAction('Settings', self)
        settings_action.triggered.connect(self.open_settings)
        menu.addAction(settings_action)

        exit_action = QAction('Exit', self)
        exit_action.triggered.connect(self.quit_app)
        menu.addAction(exit_action)

        self.setContextMenu(menu)
        print("UI initialized")

    def set_busy(self):
        print("Setting status to busy")
        try:
            requests.get(f'{self.esp32_ip}/busy')
            self.showMessage('Status Changed', 'Set to Busy')
        except requests.RequestException as e:
            print(f"Error setting busy status: {e}")
            self.showMessage('Error', f'Failed to set status: {str(e)}')

    def set_free(self):
        print("Setting status to free")
        try:
            requests.get(f'{self.esp32_ip}/free')
            self.showMessage('Status Changed', 'Set to Free')
        except requests.RequestException as e:
            print(f"Error setting free status: {e}")
            self.showMessage('Error', f'Failed to set status: {str(e)}')

    def open_settings(self):
        print("Opening settings")
        ip, ok = QInputDialog.getText(None, 'Settings', 'Enter ESP32 IP:', text=self.esp32_ip)
        if ok and ip:
            self.esp32_ip = ip
            self.settings.setValue('esp32_ip', ip)
            print(f"Updated ESP32 IP to: {ip}")
            self.showMessage('Settings Updated', f'ESP32 IP set to {ip}')

    def quit_app(self):
        print("Quitting application")
        QApplication.instance().quit()

if __name__ == '__main__':
    print("Starting application")
    app = QApplication(sys.argv)
    
    if not QSystemTrayIcon.isSystemTrayAvailable():
        print("System tray is not available")
        QMessageBox.critical(None, "System Tray", "I couldn't detect any system tray on this system.")
        sys.exit(1)

    signal.signal(signal.SIGINT, signal.SIG_DFL)
    
    tray_app = SystemTrayApp()
    tray_app.show()
    print("Application running")
    sys.exit(app.exec_())