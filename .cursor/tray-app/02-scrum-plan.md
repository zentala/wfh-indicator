# WFH Indicator Tray App - Plan Implementacji Scrum

Na podstawie naszej dyskusji projektowej (`01-init.md`), oto szczegółowy plan wdrożenia aplikacji TRAY przy użyciu metodyki Scrum. Implementacja odbędzie się w folderze `tray-app`.

---

## 🚀 Cel Produktu (Product Goal)

Stworzenie stabilnej i intuicyjnej aplikacji na system Windows, która działa w zasobniku systemowym (tray). Aplikacja ma pełnić rolę centralnego punktu do zarządzania statusem pracy (np. "On Call", "Focused") i komunikacji z fizycznymi wskaźnikami LED (WFH Indicators). Główne funkcje obejmują ręczną zmianę statusu, parowanie urządzeń przez USB w celu konfiguracji Wi-Fi oraz automatyczną zmianę statusu na podstawie harmonogramu.

---

## ✅ Definicja Ukończenia (Definition of Done - DoD)

Każde zadanie (Task/User Story) musi spełniać poniższe kryteria, aby zostać uznane za **ukończone**:

1.  **Kod napisany:** Implementacja jest zgodna z przyjętą architekturą (Electron, TypeScript, React, TailwindCSS).
2.  **Kod udokumentowany:** Wszystkie kluczowe funkcje, klasy i typy posiadają dokumentację JSDoc.
3.  **Testy jednostkowe:** Nowa logika biznesowa ma pokrycie w testach jednostkowych.
4.  **Testy E2E:** Kluczowe ścieżki użytkownika są pokryte testami end-to-end.
5.  **UI zgodne z projektem:** Interfejs użytkownika jest zgodny z makietą opartą na DaisyUI.
6.  **Code Review:** Kod został sprawdzony i zatwierdzony.
7.  **Działa na środowisku docelowym:** Aplikacja buduje się i działa poprawnie na systemie Windows.
8.  **Logowanie:** Kluczowe zdarzenia (błędy, ważne akcje użytkownika) są logowane przy użyciu `electron-log`.
9.  **Obsługa Stanów Pośrednich:** Interfejs użytkownika poprawnie obsługuje stany ładowania (loading), błędu (error) i braku danych (empty).

---

## 🗓️ Plan Sprintów

Proponowany cykl to **1-tygodniowe sprinty**.

### Sprint 1: Fundamenty i szkielet aplikacji

**Cel Sprintu:** Stworzenie podstawowej struktury projektu, skonfigurowanie narzędzi i wdrożenie minimalnego, nieinteraktywnego szkieletu aplikacji.

*   **Epik:** Core Application Shell
*   **User Stories / Tasks:**
    - [x] **Task 1.1:** Inicjalizacja projektu Electron za pomocą `electron-forge` z szablonem dla TypeScript + React.
        *   *Komentarz: Użyto szablonu `vite`. Wsparcie dla Reacta i TSX zostało dodane ręcznie, ponieważ dedykowany szablon nie zadziałał.*
    - [x] **Task 1.2:** Stworzenie struktury folderów zgodnie z projektem (`src/main`, `src/renderer`, `src/shared`, `public/icons`).
        *   *Komentarz: Struktura folderów została utworzona zgodnie z architekturą. Pliki z szablonu zostały przeniesione do odpowiednich katalogów.*
    - [x] **Task 1.3:** Konfiguracja Tailwind CSS oraz DaisyUI w projekcie dla procesów renderera.
        *   *Komentarz: Polecenie `npx tailwindcss init` nie zadziałało. Pliki `tailwind.config.js` i `postcss.config.js` zostały utworzone i skonfigurowane ręcznie.*
    - [x] **Task 1.4:** Implementacja podstawowego punktu wejścia aplikacji w `src/main/index.ts`.
        *   *Komentarz: Utworzono plik. Wymagało to również stworzenia plików `tsconfig.json` i `tsconfig.node.json`, aby zapewnić poprawne działanie typów TypeScript.*
    - [x] **Task 1.5:** Implementacja statycznej ikony w tray'u i prostego, nieklikalnego menu kontekstowego w `src/main/tray.ts`.
        *   *Komentarz: Utworzono moduł `tray.ts`. Użyto tymczasowej ikony SVG w `public/icons/circle-gray.svg`.*
    - [x] **Task 1.6:** Utworzenie podstawowego komponentu `App.tsx` w `src/renderer`, który renderuje pustą stronę.
        *   *Komentarz: Stworzono pliki `App.tsx`, `index.tsx` i `index.css` w `src/renderer`.*
    - [x] **Task 1.7:** Konfiguracja frameworka do testów jednostkowych (np. Vitest) i E2E (np. Playwright).
        *   *Komentarz: Skonfigurowano `vitest` z `jsdom` oraz `playwright`. Dodano skrypty `test` i `test:e2e` w `package.json`.*
    - [x] **Task 1.8 (Test):** Napisanie przykładowego testu jednostkowego i E2E, aby upewnić się, że pipeline testowy działa.
        *   *Komentarz: Naprawiono problemy z budowaniem (`pnpm make`) przez edycję `forge.config.js` (makers) i `package.json` (main entry point).*
    - [x] **Task 1.9 (Nowe):** Inicjalizacja i konfiguracja biblioteki `electron-log` do zapisywania logów w procesie głównym.
        *   *Komentarz: Biblioteka `electron-log` została zainstalowana i skonfigurowana w `src/main/index.ts`.*

### Sprint 2: Zarządzanie statusem i interakcje w Tray'u

**Cel Sprintu:** Ożywienie interakcji z ikoną w tray'u, umożliwiając dynamiczną zmianę statusu i wizualną reprezentację tego statusu.

*   **Epik:** Status Management
*   **User Stories / Tasks:**
    - [x] **Task 2.1:** Zdefiniowanie typów `WorkStatus` i `DeviceInfo` w `src/shared/types.ts`.
    - [x] **Task 2.2:** Stworzenie pliku `src/renderer/utils/statusColors.ts` z mapowaniem statusów na kolory, emoji i tooltipy.
    - [x] **Task 2.3:** Implementacja logiki dynamicznej zmiany ikony w tray'u (`tray.setImage`) w zależności od aktualnego statusu.
    - [x] **Task 2.4:** Implementacja centralnego zarządzania stanem w procesie `main` (przechowywanie aktualnego statusu).
    - [x] **Task 2.5:** Utworzenie i obsługa kanału IPC (`setStatus`) do zmiany statusu z menu.
    - [x] **Task 2.6:** Ożywienie menu kontekstowego – kliknięcie na status powinno wysyłać event IPC i aktualizować stan aplikacji.
    - [x] **Task 2.7 (Test):** Testy jednostkowe dla logiki zarządzania statusem.
    - [x] **Task 2.8 (Test):** Test E2E sprawdzający, czy zmiana statusu w menu poprawnie zmienia ikonę w tray'u.

### Sprint 3: Parowanie urządzeń (Kreator UI)

**Cel Sprintu:** Zbudowanie interfejsu użytkownika dla procesu parowania nowego urządzenia LED, bez implementacji logiki po stronie `main`.

*   **Epik:** Device Management
*   **User Stories / Tasks:**
    - [ ] **Task 3.1:** Stworzenie generycznych, reużywalnych komponentów UI w `src/renderer/components/common` (Button, Input, Spinner, ProgressBar, Tooltip).
    - [ ] **Task 3.2:** Implementacja okna modalnego dla parowania (`PairingWindow`) i kreatora (`PairingWizard.tsx`).
    - [ ] **Task 3.3:** Zbudowanie komponentu kroku 1: `UsbDetectionStep.tsx` (instrukcje i przycisk "Detect").
    - [ ] **Task 3.4:** Zbudowanie komponentu kroku 2: `WifiConfigStep.tsx` (formularz SSID i hasła).
    - [ ] **Task 3.5:** Zbudowanie komponentu kroku 3: `TransferTestStep.tsx` (opis procesu i przycisk "Transfer").
    - [ ] **Task 3.6:** Zbudowanie komponentu kroku 4: `SuccessStep.tsx` (komunikat o sukcesie).
    - [ ] **Task 3.7:** Implementacja logiki otwierania okna parowania po kliknięciu w menu tray'a.
    - [ ] **Task 3.8 (Test):** Testy komponentów React (np. Storybook lub Vitest) dla każdego kroku kreatora parowania.

### Sprint 4: Logika parowania i komunikacja z urządzeniem

**Cel Sprintu:** Wdrożenie pełnej logiki parowania po stronie procesu `main`, włączając w to komunikację przez USB i testowanie połączenia Wi-Fi.

*   **Epik:** Device Management
*   **User Stories / Tasks:**
    - [ ] **Task 4.1:** Dodanie zależności `serialport` do projektu.
    - [ ] **Task 4.2:** Implementacja `DeviceManager.ts` w procesie `main` do zarządzania logiką urządzeń.
    - [ ] **Task 4.3:** Implementacja funkcji `detectUSBDevice` (wykrywanie urządzenia po podłączeniu).
    - [ ] **Task 4.4:** Implementacja logiki transferu danych (SSID/hasło) przez port szeregowy do urządzenia.
    - [ ] **Task 4.5:** Implementacja logiki testowania połączenia – `DeviceManager` próbuje połączyć się z urządzeniem przez Wi-Fi po transferze.
    - [ ] **Task 4.6:** Implementacja kroku "potwierdzenia zielonego koloru" przez użytkownika (dialog w rendererze).
    - [ ] **Task 4.7:** Podłączenie logiki z `DeviceManager` do kreatora parowania za pomocą kanałów IPC.
    - [ ] **Task 4.8 (Test):** Testy jednostkowe dla `DeviceManager` z mockowaniem `serialport`.
    - [ ] **Task 4.9 (Test):** Test E2E dla całego procesu parowania (z mockowanym urządzeniem wirtualnym).

### Sprint 5: Ustawienia i zarządzanie urządzeniami

**Cel Sprintu:** Zbudowanie okna ustawień, w którym użytkownik może zarządzać sparowanymi urządzeniami i konfigurować reguły harmonogramu.

*   **Epik:** UI & Settings
*   **User Stories / Tasks:**
    - [ ] **Task 5.1:** Zbudowanie szkieletu okna ustawień (`SettingsWindow.tsx`) z nawigacją tabów (DaisyUI).
    - [ ] **Task 5.2:** Implementacja zakładki `DevicesTab.tsx`, która wyświetla listę sparowanych urządzeń.
    - [ ] **Task 5.3:** Implementacja kanału IPC `getDevices` do pobierania listy urządzeń z `DeviceManager`.
    - [ ] **Task 5.4:** Wyświetlanie statusu połączenia i poziomu baterii urządzeń (na razie mockowane dane). Dodanie `⚠️ Low` w menu tray'a.
    - [ ] **Task 5.5:** Implementacja UI dla zakładki `AutoStatusTab.tsx` z listą reguł harmonogramu.
    - [ ] **Task 5.6:** Implementacja UI do dodawania nowej reguły (modal z wyborem dni, godzin i statusu).
    - [ ] **Task 5.7:** Dodanie wyłączonych (mockowanych) przełączników dla integracji z kalendarzem i detekcji Mic/Cam.
    - [ ] **Task 5.8 (Test):** Testy komponentów React dla okna ustawień i jego zakładek.

### Sprint 6: Automatyzacja statusu i powiadomienia

**Cel Sprintu:** Wdrożenie logiki automatycznej zmiany statusu na podstawie harmonogramu oraz obsługa powiadomień "Ask to Enter".

*   **Epik:** Notifications & Automation
*   **User Stories / Tasks:**
    - [ ] **Task 6.1:** Implementacja serwisu w procesie `main`, który co minutę sprawdza reguły harmonogramu i aktualizuje status.
    - [ ] **Task 6.2:** Logika zapisywania i odczytywania reguł harmonogramu (np. z pliku JSON).
    - [ ] **Task 6.3:** Implementacja powiadomienia systemowego Electron (`Notification`) dla "Ask to Enter".
    - [ ] **Task 6.4:** Dodanie przycisków akcji do powiadomienia ("Yes", "No", "If Urgent").
    - [ ] **Task 6.5:** Implementacja kanału IPC do odbierania żądania "Ask to Enter" od urządzenia i wysyłania odpowiedzi użytkownika.
    - [ ] **Task 6.6 (Test):** Testy jednostkowe dla serwisu harmonogramu.
    - [ ] **Task 6.7 (Test):** Test E2E symulujący przyjście żądania "Ask to Enter" i weryfikujący wyświetlenie powiadomienia.

### Sprint 7: Dopracowanie, poprawki i przygotowanie do wydania

**Cel Sprintu:** Finalne szlify, naprawa błędów, optymalizacja i przygotowanie aplikacji do dystrybucji.

*   **Epik:** Refinement & Release
*   **User Stories / Tasks:**
    - [ ] **Task 7.1:** Pełny przegląd kodu (refaktoryzacja, poprawa czytelności).
    - [ ] **Task 7.2:** Uzupełnienie brakujących testów w celu osiągnięcia docelowego pokrycia.
    - [ ] **Task 7.3:** Testowanie aplikacji na czystym systemie Windows.
    - [ ] **Task 7.4:** Konfiguracja skryptów `electron-forge` do budowania instalatora (`.exe`).
    - [ ] **Task 7.5:** Ostateczny przegląd i uzupełnienie dokumentacji JSDoc.
    - [ ] **Task 7.6:** Poprawa obsługi błędów i skrajnych przypadków (np. utrata połączenia z urządzeniem, błędy parowania).
    - [ ] **Task 7.7 (Nowe):** Konfiguracja mechanizmu automatycznych aktualizacji (`electron-updater`) ze wskazaniem na `wfh.zentala.io` jako dostawcę.
