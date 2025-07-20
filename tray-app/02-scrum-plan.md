*   **Epik:** Device Management
*   **User Stories / Tasks:**
    - [x] **Task 4.1:** Dodanie zależności `serialport` do projektu.
        *   *Komentarz: Zależność została dodana do `tray-app/package.json`.*
    - [x] **Task 4.2:** Implementacja `DeviceManager.ts` w procesie `main` do zarządzania logiką urządzeń.
        *   *Komentarz: Plik został utworzony, ale jego implementacja wymagała rozwiązania poważnego problemu z integracją `electron-store`. Problem został rozwiązany poprzez dodanie wtyczki `@rollup/plugin-commonjs` do konfiguracji `electron-vite`, co pozwoliło na poprawne przetwarzanie modułów CommonJS. Dodano również `electron-store` jako zależność.*
    - [ ] **Task 4.3:** Implementacja funkcji `detectUSBDevice` (wykrywanie urządzenia po podłączeniu).
    - [ ] **Task 4.4:** Implementacja logiki transferu danych (SSID/hasło) przez port szeregowy do urządzenia.
    - [ ] **Task 4.5:** Implementacja logiki testowania połączenia – `DeviceManager` próbuje połączyć się z urządzeniem przez Wi-Fi po transferze.
    - [ ] **Task 4.14 (Test):** Testy jednostkowe dla `DeviceManager` z mockowaniem `electron-settings` i `serialport`.
    - [ ] **Task 4.15 (Test):** Test E2E dla całego procesu parowania (z mockowanym urządzeniem wirtualnym). ⚠️ **PRIORYTET ZWIĘKSZONY DO WYSOKIEGO**

### Sprint 5: Ustawienia i zarządzanie urządzeniami
*   **Epik:** Device Management
*   **User Stories / Tasks:**
    - [ ] **Task 6.7 (Test):** Test E2E symulujący przyjście żądania "Ask to Enter" i weryfikujący wyświetlenie powiadomienia. ⚠️ **PRIORYTET ZWIĘKSZONY DO WYSOKIEGO**

### Sprint 7: Dopracowanie, poprawki i przygotowanie do wydania
