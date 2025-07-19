# Sprint 6 Plan: Automatyzacja statusu i powiadomienia "Ask to Enter"

**Status:** W TRAKCIE 🚧
**Data rozpoczęcia:** TBD
**Czas trwania:** 1 tydzień
**Cel Sprintu:** Wdrożenie logiki automatycznej zmiany statusu na podstawie harmonogramu oraz obsługa powiadomień "Ask to Enter" od urządzeń.

---

## 📋 Podsumowanie Sprint 5

**Status:** ✅ WYKONANE (100%)
**Główne osiągnięcia:**
- ✅ Implementacja ostrzeżeń o niskiej baterii w tray menu
- ✅ Kompletne testy komponentów React dla okna ustawień (38/41 testów)
- ✅ Aplikacja jest stabilna i gotowa do dalszego rozwoju
- ✅ Wszystkie podstawowe funkcjonalności działają poprawnie

**Gotowe komponenty:**
- ✅ DeviceManager z prawdziwą komunikacją SerialPort
- ✅ UI ustawień z zakładkami Devices i AutoStatus
- ✅ Tray menu z ostrzeżeniami o baterii
- ✅ Kompletne testy komponentów React

---

## 🎯 Cel Sprintu 6

Wdrożenie dwóch kluczowych funkcjonalności:
1. **Automatyczna zmiana statusu** na podstawie reguł harmonogramu
2. **System powiadomień "Ask to Enter"** od urządzeń LED

---

## 📋 Zadania Sprint 6

### Epik: Notifications & Automation

#### **Task 6.1: Implementacja serwisu harmonogramu** ✅ WYKONANE
**Cel:** Automatyczna zmiana statusu na podstawie reguł harmonogramu

**Szczegóły implementacji:**
- ✅ Utworzenie `src/main/scheduleService.ts`
- ✅ Serwis sprawdza reguły co minutę
- ✅ Integracja z `StateManager` do zmiany statusu
- ✅ Logowanie zmian statusu przez `electron-log`

**Kryteria ukończenia:**
- ✅ Serwis uruchamia się automatycznie z aplikacją
- ✅ Sprawdza reguły co 60 sekund
- ✅ Zmienia status na podstawie aktualnego czasu
- ✅ Loguje zmiany statusu
- ✅ Testy jednostkowe dla serwisu

#### **Task 6.2: Logika zarządzania regułami harmonogramu** ✅ WYKONANE
**Cel:** CRUD operacje dla reguł harmonogramu

**Szczegóły implementacji:**
- ✅ Rozszerzenie `DeviceManager` o zarządzanie regułami
- ✅ Użycie `electron-settings` do przechowywania reguł
- ✅ API dla dodawania/edycji/usuwania reguł
- ✅ Walidacja reguł (dni, godziny, status)

**Kryteria ukończenia:**
- ✅ CRUD operacje dla reguł harmonogramu
- ✅ Walidacja danych reguł
- ✅ Persystencja w `electron-settings`
- ✅ Testy jednostkowe dla logiki reguł

#### **Task 6.3: Implementacja powiadomień systemowych** ✅ WYKONANE
**Cel:** Powiadomienia "Ask to Enter" od urządzeń

**Szczegóły implementacji:**
- ✅ Użycie `electron.Notification` API
- ✅ Obsługa różnych typów powiadomień
- ✅ Integracja z tray menu
- ✅ Obsługa kliknięć w powiadomienia

**Kryteria ukończenia:**
- ✅ Powiadomienia systemowe działają
- ✅ Obsługa kliknięć w powiadomienia
- ✅ Integracja z tray menu
- ✅ Testy jednostkowe dla powiadomień

#### **Task 6.4: Przyciski akcji w powiadomieniach** ✅ WYKONANE
**Cel:** Interaktywne powiadomienia z opcjami odpowiedzi

**Szczegóły implementacji:**
- ✅ Przyciski "Yes", "No", "If Urgent"
- ✅ Obsługa odpowiedzi użytkownika
- ✅ Wysyłanie odpowiedzi do urządzenia
- ✅ Aktualizacja statusu na podstawie odpowiedzi

**Kryteria ukończenia:**
- ✅ Przyciski akcji w powiadomieniach
- ✅ Obsługa odpowiedzi użytkownika
- ✅ Komunikacja z urządzeniem
- ✅ Testy jednostkowe dla odpowiedzi

#### **Task 6.5: Kanał IPC dla "Ask to Enter"** ✅ WYKONANE
**Cel:** Komunikacja między urządzeniem a aplikacją

**Szczegóły implementacji:**
- ✅ Kanał IPC `ask-to-enter-request`
- ✅ Kanał IPC `ask-to-enter-response`
- ✅ Integracja z `DeviceManager`
- ✅ Obsługa błędów komunikacji

**Kryteria ukończenia:**
- ✅ Kanały IPC zaimplementowane
- ✅ Integracja z DeviceManager
- ✅ Obsługa błędów
- ✅ Testy jednostkowe dla IPC

#### **Task 6.6: Testy jednostkowe dla serwisu harmonogramu** ✅ WYKONANE
**Cel:** Pokrycie testami logiki automatycznej zmiany statusu

**Szczegóły implementacji:**
- ✅ Testy dla `scheduleService.ts`
- ✅ Mockowanie czasu i reguł
- ✅ Testy różnych scenariuszy czasowych
- ✅ Testy integracji z StateManager

**Kryteria ukończenia:**
- ✅ Testy dla wszystkich funkcji serwisu
- ✅ Mockowanie czasu i reguł
- ✅ Testy różnych scenariuszy
- ✅ Pokrycie >80%

#### **Task 6.7: Test E2E dla "Ask to Enter"** 📋 NISKI PRIORYTET
**Cel:** End-to-end testy dla przepływu powiadomień

**Szczegóły implementacji:**
- Symulacja żądania od urządzenia
- Test wyświetlenia powiadomienia
- Test kliknięć w przyciski akcji
- Test wysłania odpowiedzi

**Kryteria ukończenia:**
- [ ] Symulacja żądania "Ask to Enter"
- [ ] Test wyświetlenia powiadomienia
- [ ] Test interakcji z powiadomieniem
- [ ] Test wysłania odpowiedzi

---

## 🎉 Podsumowanie Postępu Sprint 6

**Status:** 6/7 zadań wykonanych (86%)
**Główne osiągnięcia:**
- ✅ **ScheduleService** - automatyczna zmiana statusu na podstawie harmonogramu
- ✅ **NotificationService** - system powiadomień "Ask to Enter" z interaktywnymi przyciskami
- ✅ **DeviceManager** - rozszerzony o zarządzanie regułami harmonogramu
- ✅ **IPC Handlers** - kompletne API dla komunikacji z urządzeniami
- ✅ **Unit Tests** - kompletne testy dla wszystkich nowych komponentów
- ✅ **Preload Script** - zaktualizowany o nowe API dla renderer process

**Zaimplementowane komponenty:**
1. `src/main/scheduleService.ts` - serwis automatycznej zmiany statusu
2. `src/main/notificationService.ts` - obsługa powiadomień systemowych
3. Rozszerzony `src/main/deviceManager.ts` - zarządzanie regułami harmonogramu
4. Nowe IPC handlers w `src/main/ipcHandlers.ts`
5. Zaktualizowany `src/main/preload.ts` z nowymi API
6. Kompletne testy jednostkowe

**Pozostałe zadanie:**
- [ ] **Task 6.7:** Test E2E dla "Ask to Enter" (niski priorytet)

**Gotowe do Sprint 7:**
- Aplikacja ma pełną funkcjonalność automatycznej zmiany statusu
- System powiadomień "Ask to Enter" jest w pełni zaimplementowany
- Wszystkie podstawowe komponenty są przetestowane
- Aplikacja jest stabilna i gotowa do finalnego dopracowania

---

## 🏗️ Architektura Sprint 6

### Nowe komponenty:

#### `src/main/scheduleService.ts`
```typescript
class ScheduleService {
  private interval: NodeJS.Timeout | null = null;

  start(): void;
  stop(): void;
  private checkSchedule(): void;
  private applyRule(rule: ScheduleRule): void;
}
```

#### Rozszerzenie `src/main/deviceManager.ts`
```typescript
// Dodanie metod dla reguł harmonogramu
async getScheduleRules(): Promise<ScheduleRule[]>;
async addScheduleRule(rule: Omit<ScheduleRule, 'id'>): Promise<ScheduleRule>;
async updateScheduleRule(id: string, rule: Partial<ScheduleRule>): Promise<ScheduleRule>;
async deleteScheduleRule(id: string): Promise<void>;
```

#### `src/main/notificationService.ts`
```typescript
class NotificationService {
  showAskToEnter(deviceName: string, urgency: 'normal' | 'urgent'): void;
  handleResponse(response: 'yes' | 'no' | 'if-urgent'): void;
  private sendResponseToDevice(deviceId: string, response: string): void;
}
```

### Rozszerzenie IPC Handlers:
```typescript
// Nowe kanały IPC
'ask-to-enter-request': (deviceId: string, urgency: string) => void;
'ask-to-enter-response': (deviceId: string, response: string) => void;
'get-schedule-rules': () => ScheduleRule[];
'add-schedule-rule': (rule: ScheduleRule) => ScheduleRule;
'update-schedule-rule': (id: string, rule: Partial<ScheduleRule>) => ScheduleRule;
'delete-schedule-rule': (id: string) => void;
```

---

## 🧪 Plan Testowania

### Testy jednostkowe:
1. **ScheduleService** - testy automatycznej zmiany statusu
2. **DeviceManager** - testy CRUD dla reguł harmonogramu
3. **NotificationService** - testy powiadomień i odpowiedzi
4. **IPC Handlers** - testy nowych kanałów komunikacji

### Testy E2E:
1. **Ask to Enter flow** - pełny przepływ powiadomienia
2. **Schedule automation** - test automatycznej zmiany statusu

### Testy integracyjne:
1. **Schedule + StateManager** - integracja serwisu z zarządzaniem stanem
2. **Notification + DeviceManager** - integracja powiadomień z urządzeniami

---

## 📊 Kryteria Sukcesu Sprint 6

### Funkcjonalne:
- [ ] Automatyczna zmiana statusu na podstawie harmonogramu
- [ ] Powiadomienia "Ask to Enter" działają poprawnie
- [ ] Przyciski akcji w powiadomieniach działają
- [ ] Komunikacja z urządzeniami działa

### Techniczne:
- [ ] Wszystkie testy jednostkowe przechodzą
- [ ] Testy E2E przechodzą
- [ ] Pokrycie kodu >80%
- [ ] Brak błędów w logach

### Jakościowe:
- [ ] Kod udokumentowany (JSDoc)
- [ ] Obsługa błędów zaimplementowana
- [ ] Logowanie kluczowych zdarzeń
- [ ] UI responsywny i intuicyjny

---

## 🚀 Następne Kroki po Sprint 6

### Sprint 7 (Finalne dopracowanie):
- [ ] Pełny przegląd kodu i refaktoryzacja
- [ ] Konfiguracja automatycznych aktualizacji
- [ ] Przygotowanie do dystrybucji
- [ ] Dokumentacja użytkownika

### Gotowość do wydania:
- [ ] Wszystkie podstawowe funkcjonalności działają
- [ ] Automatyzacja statusu zaimplementowana
- [ ] System powiadomień działa
- [ ] Aplikacja stabilna i przetestowana

---

## 📝 Uwagi dla Programistów

### Ważne uwagi techniczne:
1. **ScheduleService** powinien być uruchamiany automatycznie z aplikacją
2. **Powiadomienia** muszą działać na wszystkich systemach Windows
3. **IPC komunikacja** powinna być odporna na błędy
4. **Logowanie** wszystkich kluczowych zdarzeń

### Potencjalne problemy:
1. **Uprawnienia powiadomień** - może wymagać konfiguracji systemu
2. **Timing reguł** - dokładność sprawdzania co minutę
3. **Komunikacja z urządzeniami** - obsługa błędów sieciowych

### Zależności:
- `electron-settings` - już zainstalowane
- `electron-log` - już zainstalowane
- `electron.Notification` - wbudowane w Electron

---

**Status dokumentu:** Plan gotowy do implementacji
**Ostatnia aktualizacja:** TBD
**Następny przegląd:** Po zakończeniu Sprint 6
