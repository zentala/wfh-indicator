# Aktualne Problemy i Status (lipiec 2024) - ZAKTUALIZOWANE

## 🟢 Co działa

- Aplikacja tray uruchamia się (`pnpm run dev`).
- Main i preload process budują się poprawnie (katalog `.vite/build` jest tworzony).
- Menu tray wyświetla się, można klikać opcje.
- Logi z main process (np. `ScheduleService`) działają poprawnie.

## 🔴 Co nie działa

- **Kluczowy problem: Renderer process w ogóle się nie buduje.**
  - Katalog `.vite/renderer/` **nie jest tworzony**.
  - W logach pojawia się błąd: `electron: Failed to load URL: file:///C:/code/wfh-indicator/tray-app/.vite/renderer/index.html?window=... with error: ERR_FILE_NOT_FOUND`.
- W rezultacie okna "Settings" i "Pairing" są puste (białe).
- Ikona w tray nie wyświetla się poprawnie, ponieważ nie jest ładowana dynamicznie i nie jest kopiowana do builda produkcyjnego.

## 🔍 Diagnoza

- **Główna przyczyna**: Plik `vite.renderer.config.ts` jest niekompletny. Brakuje w nim kluczowych dyrektyw:
  - `root`: nie wskazuje na `src/renderer`.
  - `build.outDir`: nie jest zdefiniowany, więc Vite nie wie, gdzie umieścić zbudowane pliki renderera.
  - `build.rollupOptions.input`: brak zdefiniowanych plików wejściowych (np. `index.html`), co jest niezbędne do zbudowania jakiejkolwiek strony.
  - `publicDir`: brak konfiguracji do kopiowania statycznych assetów (np. ikon).
- **Druga przyczyna**: Logika ładowania okien i ikon w main process nie rozróżnia trybu deweloperskiego (`dev`) od produkcyjnego (`prod`), co prowadzi do błędnych ścieżek po zbudowaniu aplikacji.

## ✅ Proponowana architektura i plan naprawczy

Ta sekcja została zaktualizowana o profesjonalny feedback, który dostarczyłeś. To jest **prawidłowy** sposób na rozwiązanie problemu.

### 1. Popraw `vite.renderer.config.ts`

Plik musi zawierać konfigurację dla `root`, `build` i `publicDir`. Jeśli chcesz mieć wiele okien (np. Settings, Pairing), musisz zdefiniować wiele wejść w `rollupOptions`.

```ts
// vite.renderer.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Wskazuje na katalog główny renderera
  root: path.resolve(__dirname, "src/renderer"),
  plugins: [react()],
  // Konfiguracja builda renderera
  build: {
    // Katalog wyjściowy dla plików renderera
    outDir: path.resolve(__dirname, "../../.vite/renderer"),
    emptyOutDir: true,
    // Definiuje pliki wejściowe (HTML) dla każdego okna
    rollupOptions: {
      input: {
        // Główne okno (jeśli istnieje)
        index: path.resolve(__dirname, "src/renderer/index.html"),
        // Okno ustawień
        settings: path.resolve(__dirname, "src/renderer/settings.html"),
        // Okno parowania
        pairing: path.resolve(__dirname, "src/renderer/pairing.html"),
      },
    },
  },
  // Wskazuje na katalog z publicznymi assetami (np. ikony), aby były dostępne
  publicDir: path.resolve(__dirname, "../public"),
});
```

**Akcja:** Musisz stworzyć pliki `settings.html` i `pairing.html` w `src/renderer/`, kopiując zawartość `index.html` i zmieniając `src` w skrypcie na odpowiedni plik TSX.

### 2. Popraw ładowanie okien w Main Process (np. `ipcHandlers.ts`)

Użyj `app.isPackaged` do dynamicznego wyboru ścieżki URL w zależności od trybu (dev/prod). Zawsze loguj ładowany URL.

```ts
// src/main/ipcHandlers.ts (lub tam, gdzie tworzysz okna)
import { app, BrowserWindow } from "electron";
import path from "path";

function createWindow(name: "settings" | "pairing") {
  const win = new BrowserWindow({
    /* ... opcje okna ... */
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Dynamiczne tworzenie URL
  const url = app.isPackaged
    ? // Wersja produkcyjna: ładuj z systemu plików
      `file://${path.join(__dirname, `../renderer/main_window/${name}.html`)}`
    : // Wersja deweloperska: ładuj z serwera deweloperskiego Vite
      `${process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL}/${name}.html`;

  // Kluczowy krok: logowanie ścieżki!
  console.log(`└─> Loading ${name} window from:`, url);
  win.loadURL(url);
}
```

**Uwaga:** Powyższy kod zakłada, że w `forge.config.ts` renderer ma `name: 'main_window'`.

### 3. Popraw ładowanie ikon w Tray (np. `tray.ts`)

Podobnie jak z oknami, użyj `app.isPackaged` do znalezienia poprawnej ścieżki do ikon.

```ts
// src/main/tray.ts
import { app, Tray, nativeImage } from "electron";
import path from "path";

function getIconPath(status: string): string {
  // Wersja deweloperska: ścieżka względna do katalogu public
  let iconPath = path.join(
    __dirname,
    `../../public/icons/circle-${status}.png`
  );

  // Wersja produkcyjna: ikony są w katalogu `resources`
  if (app.isPackaged) {
    iconPath = path.join(process.resourcesPath, `icons/circle-${status}.png`);
  }
  return iconPath;
}

// Przy tworzeniu lub aktualizacji tacki:
const icon = nativeImage.createFromPath(getIconPath("available")); // lub inny status
tray.setImage(icon);
```

**Uwaga:** Aby to zadziałało w wersji produkcyjnej, musisz upewnić się, że ikony są kopiowane do builda. Możesz to zrobić dodając `publicDir` w `vite.renderer.config.ts` (jak w kroku 1).

## 🚀 Kolejne kroki (Checklist)

1.  [ ] **Zaktualizuj `vite.renderer.config.ts`** zgodnie z przykładem powyżej.
2.  [ ] **Stwórz w `src/renderer/` pliki `settings.html` i `pairing.html`**. Mogą być na razie kopiami `index.html`, ważne, by istniały. Każdy powinien wskazywać na odpowiedni plik wejściowy `.tsx`.
3.  [ ] **Zaktualizuj logikę tworzenia okien** w `src/main/ipcHandlers.ts` (lub podobnym pliku), aby używała `app.isPackaged` i logowała URL.
4.  [ ] **Zaktualizuj logikę ładowania ikon** w `src/main/tray.ts`, aby używała `app.isPackaged`.
5.  [ ] **Uruchom `pnpm run dev`**.
    - Sprawdź, czy w logach widać poprawne URL-e (`http://localhost...`).
    - Sprawdź, czy okna "Settings" i "Pairing" otwierają się i wyświetlają zawartość.
    - Sprawdź, czy katalog `.vite/renderer/` jest tworzony (nawet w trybie dev).
6.  [ ] **Zbuduj aplikację (`pnpm run make`)** i uruchom ją.
    - Sprawdź, czy okna nadal działają.
    - Sprawdź, czy ikona w tray jest widoczna.
7.  [ ] Po potwierdzeniu, że UI działa, przywróć ewentualne zakomentowane funkcjonalności (np. `serialport`).

---

**Podsumowanie:** Proponowane zmiany są zgodne z najlepszymi praktykami dla Electron + Vite i powinny w pełni rozwiązać obecne problemy. Kluczem jest poprawna konfiguracja builda renderera i dynamiczne zarządzanie ścieżkami.

---

## 🛠️ Historia Prób Naprawy (stan na 21.07.2024)

### Problem: Powtarzający się błąd natywnych zależności

Po wdrożeniu poprawnej architektury dla renderera, aplikacja wciąż nie uruchamia się, a w konsoli pojawia się błąd:

```
App threw an error during load
Error: Could not resolve "bufferutil" imported by "ws". Is it installed?
```

Jest to błąd wskazujący, że natywna, opcjonalna zależność biblioteki `ws` (używanej do WebSocketów) nie została poprawnie zbudowana dla środowiska Electron.

### Podjęte działania i ich efekty

1.  **Wyłączenie `serialport`**:

    - **Akcja**: Zakomentowano wszystkie odwołania do biblioteki `serialport` w `deviceManager.ts`.
    - **Efekt**: Błąd związany z `serialport` zniknął, co potwierdziło, że problem dotyczy natywnych modułów. Pojawił się jednak nowy błąd, tym razem z `bufferutil`.

2.  **Konfiguracja `vite.main.config.ts`**:

    - **Akcja**: Dodano `ws`, `bufferutil` oraz `utf-8-validate` do listy `external` w `rollupOptions`.
    - **Efekt**: **Brak zmiany.** Mimo poprawnej konfiguracji, proces budowania zdawał się ignorować te zmiany.

3.  **"Brutalny reset" cache'u i zależności**:
    - **Akcja**: Usunięto katalogi `.vite` i `node_modules` oraz plik `pnpm-lock.yaml`, a następnie wykonano czystą instalację za pomocą `pnpm install`.
    - **Efekt**: **Brak zmiany.** Problem z `bufferutil` nadal występuje, co sugeruje, że domyślny proces instalacji `pnpm` nie buduje poprawnie natywnych zależności dla Electrona.

### Pomysły na przyszłość i kolejne kroki

Problem leży w niepoprawnym procesie budowania natywnych modułów dla Electrona.

1.  **Użycie `electron-rebuild` (Następny krok)**:

    - **Plan**: Zainstalować `electron-rebuild` i uruchomić go, aby ręcznie wymusić przebudowanie wszystkich natywnych zależności (`ws`, `serialport`) pod kątem aktualnej wersji Electrona. To najbardziej precyzyjne rozwiązanie problemu.

2.  **Zmiana biblioteki WebSocket**:
    - **Plan B**: W ostateczności, jeśli `ws` nadal będzie sprawiać problemy nawet po przebudowaniu, można go zamienić na bibliotekę bez natywnych zależności (np. `isomorphic-ws`), co całkowicie wyeliminuje tę klasę problemów.

---

### 🚨 Historia Prób Naprawy (Aktualizacja 22.07.2024)

#### Próba 1: Wymiana `ws` na `isomorphic-ws` i błędy importu

- **Akcja**:
  1.  W `tray-app` i `emulator` odinstalowano `ws` i zainstalowano `isomorphic-ws`.
  2.  Zmieniono import w `websocketManager.ts` i `wifiManager.ts`, aby używać nowej biblioteki.
  3.  Podjęto próbę uruchomienia aplikacji.
- **Efekt**: **Niepowodzenie.** Aplikacja wciąż się nie uruchamiała, a kompilator TypeScript zgłaszał błędy dotyczące niekompatybilności modułów (`esModuleInterop`). Próby poprawy składni importu (`import * as WebSocket ...` czy `import WebSocket = require(...)`) nie rozwiązały problemu w sposób satysfakcjonujący i prowadziły do kolejnych błędów lintera.

#### Próba 2: Włączenie `esModuleInterop` w `tsconfig.json`

- **Akcja**:
  1.  W pliku `tray-app/tsconfig.json` dodano flagę `"esModuleInterop": true`.
- **Efekt**: **Niepowodzenie.** Mimo że jest to standardowa praktyka, w tym przypadku nie rozwiązało to problemu z ładowaniem modułu `isomorphic-ws` przez Electrona w trakcie uruchamiania aplikacji.

### 🎯 OSTATECZNA DIAGNOZA I NOWY PLAN

**Diagnoza:** Problem jest głębszy niż tylko składnia importu. Konfiguracja Vite, Electron Forge i TypeScript w tym projekcie jest na tyle skomplikowana, że proste obejścia zawodzą. Najczystszym, najbardziej definitywnym i gwarantującym sukces rozwiązaniem jest pozbycie się źródła problemu.

**Nowy, ostateczny plan:**

1.  **Definitywne usunięcie `ws` i `@types/ws`**: Upewnić się, że pakiety `ws` oraz jego typy (`@types/ws`) zostały całkowicie usunięte z zależności `dependencies` i `devDependencies` w plikach `package.json` obu projektów (`tray-app` i `emulator`). To kluczowy krok, który został przeoczony.
2.  **Instalacja `isomorphic-ws`**: Dodać `isomorphic-ws` jako zależność w obu projektach.
3.  **Poprawny import**: Zastosować poprawną składnię importu dla `isomorphic-ws` w plikach `websocketManager.ts` i `wifiManager.ts`, zgodnie z dokumentacją i wskazówkami lintera, które pojawią się po czystej instalacji.
4.  **Uruchomienie**: Ponownie uruchomić aplikację deweloperską.

Ten plan jest ostateczny. Jeśli po tym aplikacja się nie uruchomi, będzie to oznaczało fundamentalny problem z konfiguracją projektu, a nie z biblioteką WebSocket.
