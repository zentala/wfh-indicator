*   **Epik:** Device Management
*   **User Stories / Tasks:**
    - [x] **Task 4.1:** Dodanie zależności `serialport` do projektu.
        *   *Komentarz: Zależność została dodana do `tray-app/package.json`.*
    - [x] **Task 4.2:** Implementacja `DeviceManager.ts` w procesie `main` do zarządzania logiką urządzeń.
        *   *Komentarz: Plik został utworzony, ale jego implementacja wymagała rozwiązania poważnego problemu z integracją `electron-store`. Problem został rozwiązany poprzez dodanie wtyczki `@rollup/plugin-commonjs` do konfiguracji `electron-vite`, co pozwoliło na poprawne przetwarzanie modułów CommonJS. Dodano również `electron-store` jako zależność.*
    - [ ] **Task 4.3:** Implementacja funkcji `detectUSBDevice` (wykrywanie urządzenia po podłączeniu).
    - [ ] **Task 4.4:** Implementacja logiki transferu danych (SSID/hasło) przez port szeregowy do urządzenia.
    - [ ] **Task 4.5:** Implementacja logiki testowania połączenia – `DeviceManager` próbuje połączyć się z urządzeniem przez Wi-Fi po transferze.
