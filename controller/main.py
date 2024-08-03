import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton
import requests

class App(QMainWindow):
    def __init__(self):
        super().__init__()
        self.title = 'ESP32 LED Controller'
        self.left = 100
        self.top = 100
        self.width = 300
        self.height = 200
        self.initUI()

    def initUI(self):
        self.setWindowTitle(self.title)
        self.setGeometry(self.left, self.top, self.width, self.height)

        button_busy = QPushButton('Zajęty', self)
        button_busy.setGeometry(50, 50, 200, 50)
        button_busy.clicked.connect(self.set_busy)

        button_free = QPushButton('Wolny', self)
        button_free.setGeometry(50, 120, 200, 50)
        button_free.clicked.connect(self.set_free)

        self.show()

    def set_busy(self):
        requests.get('http://your_esp32_ip/busy')

    def set_free(self):
        requests.get('http://your_esp32_ip/free')

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = App()
    sys.exit(app.exec_())
