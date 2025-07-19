# Architektura Aplikacji: WFH Indicator Tray App

Ten dokument opisuje architekturę techniczną i kluczowe decyzje projektowe dla aplikacji `wfh-indicator/tray-app`, bazując na ustaleniach z plików `01-init.md` (wizja produktu) i `02-scrum-plan.md` (plan wdrożenia).

## 1. Wprowadzenie i Filozofia

Aplikacja jest budowana w oparciu o Electron. Kluczowe założenia architektoniczne to:

*   **Modularność i Reużywalność:** Dzielenie kodu na małe, reużywalne komponenty (React) i moduły (TypeScript).
*   **Separacja Kontekstów:** Rygorystyczne oddzielenie logiki **procesu głównego** (`main`) od logiki **procesu renderera** (`renderer`). Komunikacja odbywa się wyłącznie przez bezpieczne kanały IPC.
*   **Skalowalność:** Struktura zaprojektowana z myślą o łatwym dodawaniu nowych funkcji.
*   **Testowalność:** Architektura uwzględniająca łatwość pisania testów jednostkowych i E2E.

## 2. Stos Technologiczny (Tech Stack)

| Kategoria                 | Wybrana technologia        | Uzasadnienie                                                                                                                                                 |
| ------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Framework Aplikacji**   | **Electron**               | Standard do budowy aplikacji desktopowych z użyciem JS/TS, HTML, CSS.                                                                                        |
| **Język programowania**   | **TypeScript**             | Zapewnia bezpieczeństwo typów, lepszą jakość kodu i łatwiejszą refaktoryzację.                                                                               |
| **Framework UI**          | **React**                  | Popularny, wydajny i oparty na komponentach framework do budowy interfejsów użytkownika.                                                                     |
| **Styling**               | **Tailwind CSS + DaisyUI** | Tailwind (utility-first) do precyzyjnego stylowania, DaisyUI do gotowych komponentów (przyciski, taby).                                                      |
| **Menedżer Pakietów**     | **PNPM**                   | Szybki i wydajny pod względem zużycia miejsca na dysku.                                                                                                      |
| **Przechowywanie Danych** | **`electron-settings`**    | Nowoczesna i kompatybilna biblioteka do zarządzania trwałym stanem aplikacji w pliku JSON. Zastąpiła `electron-store` z powodu problemów z kompatybilnością. |
| **Logowanie**             | **`electron-log`**         | Niezawodne logowanie zdarzeń aplikacji do plików, kluczowe dla diagnostyki i debugowania.                                                                    |
| **Aktualizacje**          | **`electron-updater`**     | Zapewnia mechanizm automatycznych aktualizacji aplikacji.                                                                                                    |
| **Komunikacja Hardware**  | **`node-serialport`**      | Biblioteka do komunikacji z urządzeniami przez port szeregowy (USB). Zastąpiła `serialport` w celu uniknięcia konfliktów modułów.                            |

## 3. Struktura Projektu (Folder Structure)

Struktura folderów jest zaprojektowana w celu utrzymania porządku i jasnego podziału odpowiedzialności.

```text
wfh-indicator/
└── tray-app/
    ├── src/
    │   ├── main/
    │   ├── renderer/
    │   └── shared/
    │       └── types.ts           // Definicje kluczowych interfejsów i typów
    ├── e2e/
    ├── public/
    ├── electron.vite.config.ts
    ├── package.json
    ├── tsconfig.json
    └── pnpm-lock.yaml
```

## 4. Proces Budowania i Uruchamiania

*   **Narzędzie do budowania (Build Tool):** `electron-vite` dla nowoczesnego i szybkiego developmentu z HMR.
*   **Narzędzie do pakowania (Packager):** **Electron Forge** do tworzenia instalatorów (`.exe` dla Windows). To standardowe i najłatwiejsze rozwiązanie.
*   **Uruchamianie:** `pnpm dev` (tryb deweloperski), `pnpm make` (budowanie paczki produkcyjnej).

## 5. Strategia Testowania

### Testy Jednostkowe (Unit Tests)

*   **Framework:** **Vitest**.
*   **Uzasadnienie:** Szybki, nowoczesny, kompatybilny z API Jest. Łatwy w użyciu, dobrze integruje się z Vite.
*   **Co testujemy:** Logikę w `main` (np. `deviceManager.ts` z mockowaniem `serialport`), komponenty React i funkcje pomocnicze w `renderer`.

### Testy End-to-End (E2E)

*   **Framework:** **Playwright**.
*   **Uzasadnienie:** Nowoczesne narzędzie od Microsoftu z doskonałym wsparciem dla Electron. Najlepsze i zalecane rozwiązanie.
*   **Co testujemy:** Pełne ścieżki użytkownika, takie jak zmiana statusu, parowanie urządzenia, dodawanie reguły harmonogramu.

## 6. Przechowywanie Danych (Data Persistence)

Aplikacja musi przechowywać dane konfiguracyjne między uruchomieniami. Do tego celu użyjemy biblioteki **`electron-store`**.

*   **Dlaczego `electron-store`?**
    *   Jest to standard branżowy, prosty w użyciu i niezawodny.
    *   Automatycznie zarządza tworzeniem i odczytem pliku konfiguracyjnego w odpowiednim dla systemu operacyjnego miejscu (np. `AppData` na Windows).
    *   Zapewnia bezpieczeństwo operacji zapisu (atomowość), co chroni przed uszkodzeniem pliku konfiguracyjnego.
*   **Jakie dane będą przechowywane?**
    *   **Sparowane urządzenia:** Lista identyfikatorów i nazw urządzeń.
    *   **Reguły harmonogramu:** Wszystkie utworzone przez użytkownika reguły automatycznej zmiany statusu.
    *   **Ustawienia użytkownika:** Wszelkie inne ustawienia, które mogą pojawić się w przyszłości (np. wybór języka, preferencje powiadomień).

## 7. Model Danych i Współdzielone Typy (Data Model & Shared Types)

Aby zapewnić spójność i bezpieczeństwo typów między procesem głównym a rendererem, wszystkie kluczowe struktury danych będą zdefiniowane w pliku `src/shared/types.ts`.

```typescript
// src/shared/types.ts

/**
 * Definiuje możliwe statusy pracy użytkownika.
 */
export type WorkStatus = 'ON_CALL' | 'VIDEO_CALL' | 'FOCUSED' | 'AVAILABLE' | 'AWAY' | 'OFFLINE';

/**
 * Reprezentuje pojedyncze sparowane urządzenie wskaźnikowe.
 */
export interface DeviceInfo {
  id: string;          // Unikalny identyfikator urządzenia (np. numer seryjny)
  name: string;        // Nazwa nadana przez użytkownika (np. "Drzwi do biura")
  connected: boolean;  // Status połączenia (online/offline)
  battery: number;     // Poziom naładowania baterii w procentach (0-100)
}

/**
 * Definiuje strukturę pojedynczej reguły harmonogramu.
 */
export interface ScheduleRule {
  id: string;                   // Unikalny identyfikator reguły
  days: (1 | 2 | 3 | 4 | 5 | 6 | 7)[]; // Dni tygodnia (1=Poniedziałek, 7=Niedziela)
  startTime: string;            // Czas rozpoczęcia w formacie "HH:mm"
  endTime: string;              // Czas zakończenia w formacie "HH:mm"
  status: WorkStatus;           // Status do ustawienia
  enabled: boolean;             // Czy reguła jest aktywna
}
```

## 8. Bezpieczeństwo i Komunikacja Międzyprocesowa (IPC)

Kluczowym aspektem bezpieczeństwa w aplikacjach Electron jest ścisłe oddzielenie procesu głównego (`main`) od procesów renderera (UI). Proces renderera nigdy nie może mieć bezpośredniego dostępu do modułów Node.js. Komunikacja odbywa się przez bezpieczny most (`contextBridge`) tworzony w skrypcie `preload.js`.

**Przepływ komunikacji:**
1.  **`main/ipcHandlers.ts`**: Definiuje logikę, która ma być wykonana (np. odczyt pliku, parowanie urządzenia).
2.  **`preload.js`**: Rejestruje bezpieczne funkcje i wystawia je procesowi renderera w obiekcie `window.api`. Używa `contextBridge`, aby uniknąć wycieku API do globalnego obiektu `window`.
3.  **`renderer/components/*.tsx`**: Komponenty React wywołują funkcje z `window.api` (np. `window.api.getDevices()`), aby bezpiecznie komunikować się z procesem głównym.

**Przykład (`preload.js`):**
```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Bezpieczne wywołanie funkcji, która zwraca wartość (invoke/handle)
  getDevices: () => ipcRenderer.invoke('get-devices'),
  // Bezpieczne wysłanie jednokierunkowego komunikatu (send)
  setStatus: (status) => ipcRenderer.send('set-status', status),
});
```

## 9. Zarządzanie Stanem Globalnym UI

Dla uniknięcia nadmiernej złożoności związanej z bibliotekami takimi jak Redux, stan globalny UI (np. lista urządzeń, aktualny status) będzie zarządzany przy użyciu wbudowanego w React mechanizmu **Context API**.

*   Zostanie stworzony jeden główny `AppContext`.
*   Dostawca (`AppContext.Provider`) obejmie całą aplikację w `renderer/App.tsx`.
*   Komponenty, które potrzebują dostępu do stanu globalnego, użyją hooka `useContext(AppContext)`.

To podejście jest wystarczająco wydajne dla naszej aplikacji i znacząco upraszcza logikę przepływu danych wewnątrz UI.

## 10. Automatyczne Aktualizacje

Aplikacja będzie wyposażona w mechanizm cichych aktualizacji w tle.

*   **Narzędzie:** `electron-updater` (część ekosystemu `electron-builder`, który jest używany przez `electron-forge`).
*   **Dostawca:** Aktualizacje będą publikowane na serwerze WWW. Konfiguracja wskaże na adres URL oparty o Twoją domenę.
*   **Konfiguracja `package.json` (przykład):**
    ```json
    "build": {
      "publish": {
        "provider": "generic",
        "url": "https://wfh.zentala.io/updates"
      }
    }
    ```
*   **Proces:** Aplikacja po uruchomieniu będzie sprawdzać w tle, czy na serwerze znajduje się nowsza wersja. Jeśli tak, pobierze ją i zainstaluje przy następnym restarcie.

## 11. Kluczowe Decyzje Architektoniczne - Podsumowanie

| Kategoria                 | Decyzja                                          | Uzasadnienie                                                                                        |
| ------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Menedżer pakietów**     | `pnpm`                                           | Szybkość i efektywne zarządzanie miejscem na dysku.                                                 |
| **Build & Dev Tool**      | `electron-vite`                                  | Nowoczesne, szybkie środowisko deweloperskie z HMR.                                                 |
| **Pakowanie aplikacji**   | `electron-forge`                                 | Oficjalny standard, kompleksowe narzędzie do tworzenia instalatorów.                                |
| **Testy jednostkowe**     | `Vitest`                                         | Szybki, nowoczesny, łatwy w użyciu i dobrze zintegrowany ze stosem.                                 |
| **Testy E2E**             | `Playwright`                                     | Najlepsze w swojej klasie narzędzie do E2E dla Electron, potężne i niezawodne.                      |
| **Trwałość danych**       | `electron-settings`                              | Proste i bezpieczne zarządzanie plikami konfiguracyjnymi. Rozwiązanie problemów z `electron-store`. |
| **Logowanie**             | `electron-log`                                   | Niezawodne logowanie zdarzeń aplikacji do plików, kluczowe dla diagnostyki i debugowania.           |
| **Aktualizacje**          | `electron-updater`                               | Zapewnia mechanizm automatycznych aktualizacji aplikacji.                                           |
| **Komunikacja Procesów**  | Bezpieczne IPC z `contextBridge`                 | Standardowa, bezpieczna metoda komunikacji między `main` a `renderer`.                              |
| **Zarządzanie stanem UI** | Wbudowane hooki React (`useState`, `useContext`) | Wystarczające dla prostoty obecnych okien, unikanie nadmiarowych zależności.                        |
