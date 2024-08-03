#include <WiFi.h>
#include <Adafruit_NeoPixel.h>

#define PIN        6
#define NUMPIXELS 16
#define SSID "your_SSID"
#define PASSWORD "your_PASSWORD"

WiFiServer server(80);
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(115200);
  pixels.begin();
  pixels.show(); // Initialize all pixels to 'off'
  
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  server.begin();
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    Serial.println("New Client.");
    String currentLine = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        if (c == '\n') {
          if (currentLine.length() == 0) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();
            client.println("<!DOCTYPE html><html>");
            client.println("<body><h1>ESP32 LED Controller</h1>");
            client.println("</body></html>");
            client.println();
            break;
          } else {
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }
        
        if (currentLine.endsWith("GET /busy")) {
          setLEDs(true);
        } else if (currentLine.endsWith("GET /free")) {
          setLEDs(false);
        }
      }
    }
    client.stop();
    Serial.println("Client Disconnected.");
  }
}

void setLEDs(bool busy) {
  for(int i=0; i<NUMPIXELS; i++) {
    pixels.setPixelColor(i, busy ? pixels.Color(255, 0, 0) : pixels.Color(0, 255, 0));
  }
  pixels.show();
}
