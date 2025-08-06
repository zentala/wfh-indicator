# Architektura Migracji do Fluent UI v9

## 1. Wprowadzenie

Ten dokument opisuje architekturę i proces migracji interfejsu użytkownika aplikacji `tray-app` do biblioteki **Fluent UI v9** (`@fluentui/react-components`). Celem jest ujednolicenie wyglądu aplikacji, wprowadzenie nowoczesnego designu zgodnego z systemem Microsoftu, a także ułatwienie dalszego rozwoju poprzez wykorzystanie gotowych, reużywalnych komponentów.

Dokument jest przeznaczony dla deweloperów, w szczególności juniorów, którzy będą odpowiedzialni za wdrożenie zmian.

## 2. Główne Założenia (Princypia Projektowe)

- **Spójność z Fluent Design:** Wszystkie nowe komponenty i widoki muszą być zgodne z zasadami Fluent Design.
- **Komponenty z `@fluentui/react-components`:** Będziemy korzystać z najnowszej, stabilnej wersji biblioteki Fluent UI dla React.
- **Wsparcie dla Motywów (Jasny/Ciemny):** Aplikacja musi automatycznie dostosowywać się do motywu systemu operacyjnego (jasny/ciemny).
- **Platforma:** Design musi wyglądać dobrze zarówno na systemie Windows, jak i macOS. Fluent UI v9 zapewnia wsparcie dla obu platform.
- **Stylizacja za pomocą Griffel:** Porzucamy czysty CSS na rzecz **Griffel**, biblioteki CSS-in-JS stworzonej przez Microsoft na potrzeby Fluent UI. Umożliwia ona pisanie stylów bezpośrednio w plikach komponentów w sposób wydajny i zoptymalizowany.
- **SCSS jako uzupełnienie:** SCSS będzie używany tylko do globalnych stylów, resetowania CSS lub tam, gdzie użycie Griffel jest niemożliwe.

## 3. Biblioteki i Zależności

Do pliku `package.json` w `tray-app` należy dodać następujące zależności:

```json
"dependencies": {
  // ...istniejące zależności
  "@fluentui/react-components": "^9.0.0",
  "@fluentui/react-icons": "^2.0.0",
  "@griffel/react": "^1.5.0"
},
"devDependencies": {
    // ...istniejące zależności
    "sass": "^1.50.0"
}
```

Po dodaniu zależności, należy uruchomić `pnpm install` w głównym katalogu projektu.

## 4. Struktura Projektu

Proponujemy następującą strukturę plików związaną ze stylami i komponentami:

```
tray-app/
└── src/
    └── renderer/
        ├── assets/
        │   └── styles/
        │       └── _variables.scss   // Zmienne globalne SCSS (kolory, czcionki)
        │       └── global.scss         // Style globalne
        ├── components/
        │   ├── common/                 // Reużywalne komponenty Fluent (np. Button, Input)
        │   │   ├── FluentButton.tsx
        │   │   └── FluentInput.tsx
        │   ├── Pairing/                // Komponenty kreatora parowania
        │   └── Settings/               // Komponenty okna ustawień
        ├── hooks/
        │   └── useSystemTheme.ts       // Hook do wykrywania motywu systemowego
        └── App.tsx                     // Główny komponent aplikacji
```

## 5. Implementacja Motywów (Theming)

Obsługa motywów jasnego i ciemnego będzie realizowana za pomocą `FluentProvider` oraz dedykowanego hooka `useSystemTheme`.

### 5.1. Hook `useSystemTheme`

Należy stworzyć plik `src/renderer/hooks/useSystemTheme.ts`:

```typescript
import { useState, useEffect } from "react";

export const useSystemTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setTheme(mediaQuery.matches ? "dark" : "light");

    handleChange(); // Ustawienie motywu przy pierwszym renderowaniu
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return theme;
};
```

### 5.2. `FluentProvider` w `App.tsx`

Główny komponent aplikacji `src/renderer/App.tsx` musi zostać "opakowany" w `FluentProvider`.

```tsx
import React from "react";
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import { useSystemTheme } from "./hooks/useSystemTheme";
// ... inne importy

const App: React.FC = () => {
  const systemTheme = useSystemTheme();
  const theme = systemTheme === "dark" ? webDarkTheme : webLightTheme;

  return (
    <FluentProvider theme={theme}>{/* Reszta aplikacji */}</FluentProvider>
  );
};

export default App;
```

## 6. Migracja Komponentów

Poniżej znajduje się mapa istniejących komponentów i ich proponowane odpowiedniki w Fluent UI. Należy tworzyć nowe komponenty (np. `FluentButton.tsx`) opakowujące komponenty z Fluent UI, aby w przyszłości łatwiej było zarządzać ich stylami i logiką.

| Komponent Istniejący (`common`) | Odpowiednik Fluent UI v9 | Nazwa Nowego Komponentu | Uwagi                                                                   |
| ------------------------------- | ------------------------ | ----------------------- | ----------------------------------------------------------------------- |
| `Button.tsx`                    | `Button`                 | `FluentButton.tsx`      | Używać `appearance` (`primary`, `subtle`, `transparent`) do stylizacji. |
| `Input.tsx`                     | `Input`                  | `FluentInput.tsx`       | Fluent UI dostarcza gotowe style dla stanu walidacji.                   |
| `ProgressBar.tsx`               | `ProgressBar`            | `FluentProgressBar.tsx` |                                                                         |
| `Spinner.tsx`                   | `Spinner`                | `FluentSpinner.tsx`     |                                                                         |
| `Tooltip.tsx`                   | `Tooltip`                | `FluentTooltip.tsx`     |                                                                         |

### Przykład: `FluentButton.tsx` z użyciem Griffel

```tsx
import React from "react";
import { Button, ButtonProps } from "@fluentui/react-components";
import { makeStyles } from "@griffel/react";

// Przykładowe style Griffel
const useStyles = makeStyles({
  customButton: {
    // Twoje customowe style, jeśli potrzebne
    // np. ':hover': { backgroundColor: 'red' }
  },
});

export const FluentButton: React.FC<ButtonProps> = (props) => {
  const styles = useStyles();
  return <Button {...props} className={styles.customButton} />;
};
```

## 7. Plan Działania dla Deweloperów

1.  **Setup Środowiska:**

    - Dodaj nowe zależności do `package.json`.
    - Uruchom `pnpm install`.
    - Skonfiguruj `vite.config.ts` do obsługi SCSS, jeśli to konieczne.

2.  **Implementacja Motywów:**

    - Stwórz hook `useSystemTheme.ts`.
    - Zintegruj `FluentProvider` w `App.tsx`.

3.  **Migracja Komponentów `common`:**

    - Dla każdego komponentu w `src/renderer/components/common` stwórz jego odpowiednik oparty na Fluent UI (np. `FluentButton.tsx`).
    - Zastąp użycie starych komponentów nowymi w całej aplikacji.

4.  **Refaktoryzacja Widoków:**

    - **`PairingWizard.tsx`:** Przebuduj kreator parowania używając komponentów `Card`, `Steps`, `Label` z Fluent UI.
    - **`SettingsWindow.tsx`:** Użyj `TabList` i `Tab` do stworzenia zakładek (`General`, `Devices`, `Auto-Status`).
    - W każdej zakładce użyj `Field`, `Input`, `Switch`, `Slider` do budowy formularzy.

5.  **Stylizacja i Finalizacja:**
    - Użyj `makeStyles` z Griffel do dodawania specyficznych stylów tam, gdzie jest to potrzebne.
    - Utwórz pliki `global.scss` do globalnych stylów (np. wygląd paska przewijania).
    - Przetestuj aplikację na Windows i macOS w obu motywach (jasnym i ciemnym).

## 8. Inspiracja

Warto zapoznać się z repozytorium [oliverschwendener/electron-fluent-ui](https://github.com/oliverschwendener/electron-fluent-ui) w celu zaczerpnięcia inspiracji dotyczącej struktury projektu i sposobów integracji Fluent UI w aplikacjach Electron. Pamiętaj jednak, że nasze rozwiązanie bazuje na nowszej wersji **Fluent UI v9** i **Griffel**.

---

## 9. Analiza Problemów i Debugowanie (Wnioski z procesu migracji)

Podczas procesu integracji z Fluent UI napotkaliśmy na serię krytycznych błędów, które uniemożliwiały budowanie i uruchomienie aplikacji. Ta sekcja dokumentuje te problemy, ich przyczyny oraz ostateczne rozwiązanie, aby uniknąć podobnych pomyłek w przyszłości.

### 9.1. Oś Czasu Problemów

1.  **Początkowy Błąd: `Could not resolve "@fluentui/..."`**

    - **Objaw:** Po dodaniu podstawowych zależności (`@fluentui/react-components`, `@griffel/react`) i zintegrowaniu `FluentProvider`, proces budowania Vite zgłaszał błędy, że nie może odnaleźć wewnętrznych pakietów Fluent UI (np. `@fluentui/react-provider`).
    - **Pierwotna (błędna) diagnoza:** Brakujące zależności "peer dependencies".
    - **Podjęte (błędne) działania:** Ręczne dodawanie kolejnych pakietów `@fluentui/*` do `package.json`. To prowadziło do błędnego koła – naprawienie jednego błędu powodowało pojawienie się kolejnych, w tym błędów o nieistniejących wersjach pakietów (`ERR_PNPM_NO_MATCHING_VERSION`).

2.  **Drugi Błąd: `Cannot find module '@electron-forge/cli/...'`**

    - **Objaw:** Po próbie globalnej zmiany strategii linkowania `pnpm` (przez plik `.npmrc` w głównym katalogu), aplikacja przestała się uruchamiać, zgłaszając błąd, że skrypty `electron-forge` nie mogą odnaleźć swoich modułów.
    - **Przyczyna:** Globalna zmiana `shamefully-hoist=true` zepsuła strukturę `node_modules` dla narzędzi deweloperskich, które oczekiwały standardowego zachowania `pnpm`.

3.  **Trzeci Błąd: `Cannot find module '@wfh-indicator/domain/dist/index.js'`**
    - **Objaw:** Po jednej z wielu prób czyszczenia `node_modules` i reinstalacji, aplikacja nie mogła odnaleźć skompilowanych plików lokalnego pakietu `domain`.
    - **Przyczyna:** Proces czyszczenia usunął zbudowane wcześniej pliki `dist`, a my nie uruchomiliśmy komendy budującej dla tego pakietu.

### 9.2. Główna Przyczyna Problemów: Konflikt `pnpm` + `Vite` w Monorepo

Ostateczna diagnoza wskazuje na fundamentalny problem w interakcji pomiędzy trzema technologiami w naszym stacku:

- **`pnpm` Workspaces:** Domyślnie `pnpm` nie "wynosi" (hoist) wszystkich pod-zależności do głównego katalogu `node_modules`, aby oszczędzać miejsce i unikać konfliktów. Pakiety są linkowane symbolicznie.
- **`Vite` / `esbuild`:** Narzędzia budujące w Vite oczekują, że będą w stanie łatwo odnaleźć wszystkie zależności w strukturze `node_modules`. Domyślna strategia `pnpm` jest dla nich nieczytelna, co powoduje błędy `Could not resolve`.
- **`Electron Forge`:** Z kolei narzędzia Electrona oczekują standardowej struktury `node_modules`, którą psuła nasza próba globalnego włączenia hoistingu.

**Byliśmy w potrzasku:** domyślna konfiguracja psuła Vite, a próba naprawy Vite psuła Electron Forge.

### 9.3. Ostateczne, Prawidłowe Rozwiązanie

Kluczem do rozwiązania problemu było znalezienie sposobu, aby **tylko w obrębie pakietu `tray-app`** zmusić `pnpm` do innego zachowania, nie ruszając reszty workspace.

1.  **Lokalna Konfiguracja `pnpm`:** W katalogu `tray-app` istnieje (lub powinien istnieć) plik `.npmrc` z zawartością:

    ```
    node-linker=hoisted
    ```

    Ta dyrektywa mówi `pnpm`, aby **tylko dla tego konkretnego pakietu** (`tray-app`) instalował zależności w "płaskiej" strukturze, tak jak robi to `npm` lub `yarn`. To rozwiązuje problem dla Vite, nie psując niczego globalnie.

2.  **Minimalny `package.json`:** Dzięki powyższej konfiguracji, plik `package.json` w `tray-app` nie potrzebuje dziesiątek pakietów `@fluentui/*`. Wystarczą tylko te główne, których bezpośrednio używamy:

    ```json
    "dependencies": {
      "@fluentui/react-components": "^9.54.3",
      "@fluentui/react-icons": "^2.0.242",
      "@griffel/react": "^1.5.7",
      // ...pozostałe zależności aplikacji
    }
    ```

3.  **Budowanie Lokalnych Zależności:** Zawsze przed uruchomieniem `tray-app` należy upewnić się, że wszystkie jego lokalne zależności z workspace (jak `@wfh-indicator/domain`) są zbudowane. Można to zautomatyzować, dodając skrypt w głównym `package.json`.

### 9.4. Wnioski z Analizy Repozytorium `electron-fluent-ui`

Repozytorium [oliverschwendener/electron-fluent-ui](https://github.com/oliverschwendener/electron-fluent-ui) **nie jest monorepem (`pnpm workspace`)**. Jest to pojedyncza aplikacja, która używa `npm` jako menedżera pakietów. Dlatego nie napotyka na problemy z linkowaniem symbolicznym i resolwowaniem zależności, z którymi my się mierzyliśmy. Kluczowa różnica architektoniczna (monorepo vs pojedyncza aplikacja) sprawiła, że proste przeniesienie ich struktury nie było możliwe i było źródłem naszych problemów.

---

## 10. Ostateczny Plan Naprawczy

Po dogłębnej analizie i serii nieudanych prób, poniżej przedstawiamy ostateczny, dwuetapowy plan działania. Pierwszy etap to metodyczna próba naprawy konfiguracji `pnpm`. Jeśli zakończy się niepowodzeniem, przechodzimy do drugiego etapu: migracji na `Yarn`.

### Etap 1: Ostateczna próba naprawy `pnpm`

Ten etap bazuje na kluczowym odkryciu: lokalnym pliku `.npmrc` w `tray-app`, który precyzyjnie rozwiązuje problem z resolwowaniem zależności przez Vite, nie psując jednocześnie globalnej konfiguracji monorepo.

#### Krok 1.1: Weryfikacja i Przywrócenie Konfiguracji

1.  **Plik `tray-app/.npmrc`**: Upewniamy się, że ten plik istnieje i zawiera **tylko i wyłącznie** jedną linię:

    ```
    node-linker=hoisted
    ```

    Ta komenda instruuje `pnpm`, aby dla pakietu `tray-app` instalował zależności w sposób "płaski", co jest zrozumiałe dla Vite.

2.  **Plik `package.json`**: Weryfikujemy, że plik `tray-app/package.json` ma "czystą" sekcję zależności, bez zbędnych pakietów `@fluentui/*`. Prawidłowy stan to:
    ```json
    "dependencies": {
      "@fluentui/react-components": "^9.54.3",
      "@fluentui/react-icons": "^2.0.242",
      "@griffel/react": "^1.5.7",
      // ...reszta zależności aplikacji
    }
    ```

#### Krok 1.2: Czysta Instalacja i Budowanie

1.  **Czyszczenie Środowiska**: Uruchamiamy skrypt `clean` z głównego katalogu projektu, aby usunąć wszystkie `node_modules` i pliki `lock`.
    ```bash
    pnpm clean
    ```
2.  **Instalacja Zależności**: Uruchamiamy `pnpm install` z głównego katalogu. Dzięki plikowi `tray-app/.npmrc`, zależności dla `tray-app` zostaną zainstalowane inaczej niż dla reszty projektu.
    ```bash
    pnpm install
    ```
3.  **Budowanie Pakietu `domain`**: Budujemy lokalną zależność, aby uniknąć błędu `Cannot find module`.
    ```bash
    pnpm --filter @wfh-indicator/domain build
    ```

#### Krok 1.3: Uruchomienie Aplikacji

1.  **Start Aplikacji**: Przechodzimy do katalogu `tray-app` i uruchamiamy aplikację w trybie deweloperskim.
    ```bash
    cd tray-app
    pnpm dev
    ```

**Oczekiwany Rezultat**: Aplikacja powinna się uruchomić bez błędów resolwowania zależności. Jeśli ten etap zawiedzie, przechodzimy do Etapu 2.

### Etap 2: Plan Awaryjny - Migracja na `Yarn`

Jeśli powyższe kroki nie rozwiążą problemu, oznacza to, że konflikt między `pnpm`, `Vite` i `Electron Forge` w naszym konkretnym przypadku jest zbyt głęboki. Zmiana menedżera pakietów na `Yarn` (który również cachuje moduły) jest najbardziej pragmatycznym rozwiązaniem.

#### Krok 2.1: Czyszczenie po `pnpm`

1.  Usuwamy wszystkie pliki konfiguracyjne `pnpm` z całego projektu: `pnpm-lock.yaml`, `pnpm-workspace.yaml` oraz wszystkie pliki `.npmrc`.
2.  Uruchamiamy skrypt `pnpm clean` po raz ostatni, aby usunąć `node_modules`.

#### Krok 2.2: Inicjalizacja i Konfiguracja `Yarn`

1.  **Ustawienie wersji Yarn**: W głównym katalogu uruchamiamy `corepack enable`, a następnie `yarn set version stable`, aby używać najnowszej, stabilnej wersji Yarn.
2.  **Konfiguracja Workspaces**: W głównym pliku `package.json` definiujemy nasze workspace.
3.  **Konfiguracja `node-linker`**: Tworzymy plik `.yarnrc.yml` i ustawiamy `nodeLinker: node-modules`, aby zapewnić maksymalną kompatybilność z Electronem.

#### Krok 2.3: Instalacja i Uruchomienie

1.  **Instalacja**: Uruchamiamy `yarn install` w głównym katalogu.
2.  **Budowanie `domain`**: Uruchamiamy `yarn workspace @wfh-indicator/domain build`.
3.  **Start Aplikacji**: Uruchamiamy `yarn workspace tray-app dev`.
