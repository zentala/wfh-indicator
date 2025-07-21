# Przewodnik Deweloperski

Witamy w projekcie WFH Indicator! Ten dokument pomoże Ci skonfigurować środowisko i zacząć pracę nad aplikacją.

## Architektura Projektu

Projekt jest zorganizowany jako monorepo przy użyciu `pnpm` workspaces. Główne komponenty to:

- `domain/`: Współdzielona biblioteka zawierająca kluczowe typy, interfejsy i logikę biznesową. Jest napisana w TypeScript.
- `tray-app/`: Główna aplikacja desktopowa (Electron + React) widoczna dla użytkownika.
- `emulator/`: Symulator urządzenia (np. pierścienia LED) do celów deweloperskich i testowych.

## Wymagania Wstępne

Upewnij się, że masz zainstalowane następujące narzędzia:

- [Node.js](https://nodejs.org/) (wersja 18 lub nowsza)
- [pnpm](https://pnpm.io/installation) (wersja 8 lub nowsza)

## Konfiguracja Środowiska

Proces konfiguracji jest bardzo prosty. Wszystkie komendy należy wykonywać z **głównego katalogu projektu**.

1.  **Sklonuj repozytorium**:

    ```bash
    git clone https://github.com/your-username/wfh-indicator.git
    cd wfh-indicator
    ```

2.  **Zainstaluj zależności**:
    Ta jedna komenda zainstaluje wszystkie zależności dla wszystkich pakietów w monorepo.
    ```bash
    pnpm install
    ```

## Uruchamianie Aplikacji

Aby uruchomić główną aplikację `tray-app` w trybie deweloperskim, użyj następującej komendy z głównego katalogu:

```bash
pnpm dev
```

**Co robi ta komenda?**
Dzięki konfiguracji `pnpm workspaces`, ta komenda automatycznie:

1.  Skompiluje pakiet `domain` (jeśli zaszły w nim zmiany).
2.  Uruchomi aplikację `tray-app` z hot-reloadingiem.

## Dostępne Skrypty

Wszystkie skrypty należy uruchamiać z **głównego katalogu projektu**.

- `pnpm dev`: Uruchamia `tray-app` w trybie deweloperskim.
- `pnpm lint`: Sprawdza jakość kodu we wszystkich pakietach.
- `pnpm test`: Uruchamia testy jednostkowe we wszystkich pakietach.
- `pnpm build`: Buduje wszystkie pakiety (np. kompiluje `domain`).
- `pnpm make:tray-app`: Tworzy plik wykonywalny dla `tray-app`. Najpierw automatycznie buduje wszystkie jej zależności.

## Jak to działa?

Używamy `pnpm` do zarządzania zależnościami i skryptami w całym monorepo. W głównym pliku `package.json` zdefiniowane są skrypty, które używają flagi `--filter`, aby inteligentnie zarządzać kolejnością wykonywania zadań. Na przykład, `--filter tray-app...` zapewnia, że wszystkie zależności `tray-app` (jak `domain`) są budowane jako pierwsze.

Dzięki temu proces deweloperski jest prosty i zautomatyzowany.
