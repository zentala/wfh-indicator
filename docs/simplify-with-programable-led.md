# Programowalne LED jako sygnał "zajęty" – raport o praktykach

*Co ludzie naprawdę robią, co działa, co warto skopiować*

---

## 1. O co w ogóle chodzi

"Busy light" / "status light" / "do not disturb light" to fizyczna lampka komunikująca otoczeniu Twoją dostępność. Pierwotnie powstał na potrzeby **open space** – problem przerywania kolegom w słuchawkach, którzy "wyglądają na wolnych" – ale eksplodował podczas pandemii jako narzędzie do **home office**, gdzie domownicy nie wiedzą czy można wejść, zagadać, zawołać do obiadu.

Fundamentalna obserwacja: **statusy w aplikacjach nie działają poza ekranem**. Partner / dzieci / współlokatorzy nie sprawdzają Twojego statusu w Teams. Fizyczne światło widoczne kątem oka – sprawdza się.

Producent Luxafor opisuje genezę: założyciele *"pracowali w przestrzeni coworkingowej, praca była spowalniana przez nieefektywną komunikację – stale się sobie przerywali. Potrzebowali łatwego, nieinwazyjnego sposobu komunikowania dostępności – tak narodził się pomysł Luxafor Flag"*.

Plenom Busylight twierdzi że problem jest stary jak open space: ich firma "wynalazła Busylight w 2003, sprzedawany globalnie od 2006", zanim ktokolwiek myślał o pracy zdalnej.

---

## 2. Komercyjne produkty – kto co robi

### Tier 1: Dedykowane busy lights

**Luxafor**
- Łotewska firma, **najpopularniejsza w segmencie**.
- Modele: **Flag 2** (USB, ~50 EUR), **Cube** (z mocowaniem na biurko), **Orb** (kula), **Bluetooth Pro** (bezprzewodowy z baterią), **Switch Pro** (do drzwi pokojów spotkań).
- API i integracje: **MS Teams, Slack, Zoom, Cisco Jabber, Google Calendar, Apple Shortcuts, Webhook API, Zapier (1500+ apps)**, 3CX TAPI dla VoIP.
- Marketingowy claim: *"Luxafor devices are the only availability indicators in the market that can change light according to Microsoft Teams presence status and blink red during a call"*.

**Kuando Busylight (Plenom)**
- Duńska firma, **enterprise standard** – używany przez korporacje przy wdrożeniach Teams.
- Modele: **Omega**, **Alpha** – obie z głośniczkiem (sygnał audio przy połączeniu).
- Hasło marketingowe: *"🔴 Czerwony = Focus, 🟢 Zielony = Go, 🟡 Żółty = Be Right Back"*.
- Software **kuandoHUB** do customizacji, integracja natywna z Microsoft Lync/Skype/Teams.
- Charakterystyczne: rodzice nastolatków zgłaszają że **dzieci same używają Kuando** do oznaczania "nie wchodzić do pokoju".

**Embrava Blynclight**
- Drugi enterprise gracz obok Plenom. Częsty w korporacjach amerykańskich. Mniej "geek-friendly" niż Luxafor/BlinkStick (zamknięte API).

**BlinkStick** (Tulogic, Łotwa)
- **Otwarte hardware i firmware**, ulubieniec deweloperów.
- Modele: Nano, Flex, **Square** (8 LED), Strip, Strip Mini, Pro.
- Wszystko sterowane przez HID (bez sterowników), klient open-source obsługuje **Moodlight, Application, RAM, Battery, Disk space, HTTP remote control**.
- Społeczność robi z tego rzeczy daleko poza "busy light": notyfikacje 3CX, integracja z MQTT/Home Assistant, hygrometry, RPI-based postman detector.

### Tier 2: "On Air" znaki retro

- **OnAirWarning / MuteKit** – stylizowane na studio radiowe, automatycznie zapalają się gdy włączysz kamerę w Teams/Zoom/Meet. Kickstartertowy hit dla home office.
- **NPW On Air LED Retro Sign**, generic AliExpress – USB, plug & play, manualny włącznik. Dla streamerów, podcasterów, ale też zwykłe biuro domowe.
- **Patent: widoczne z drugiego końca pokoju** – większy znak, mniej skomplikowany.

### Tier 3: Smart bulbs jako busy light

- **Philips Hue** (z Bridge) + smart switch / Flic button.
- **Tapo, Tuya, generic Zigbee** – tańsza alternatywa.
- Działa: zmieniasz kolor żarówki w lampce stołowej lub przy drzwiach pokoju.
- **Plus**: można umieścić **poza pokojem** (korytarz, kuchnia, salon) – widzą wszyscy domownicy nawet jeśli nigdy nie wchodzą do Twojego gabinetu.
- **Minus**: opóźnienie 2-5 s przy sterowaniu Wi-Fi, smart bulby gubią połączenie, ktoś może wyłączyć fizycznym switchem.

---

## 3. Konwencje kolorów

Branża osiągnęła **względny konsensus**, choć detale się różnią:

| Kolor | Znaczenie kanoniczne | Wariacje |
|---|---|---|
| 🟢 **Zielony** | Wolny / Available / "Go" | "Spoko, wpadaj" |
| 🔴 **Czerwony** | Zajęty / Do not disturb / "Focus" | Trwa rozmowa, deep work |
| 🔴 **Czerwony mrugający** | Przychodzące połączenie | Tylko Luxafor + niektóre Kuando |
| 🟡 **Żółty** | Away / Be right back | Krótka przerwa |
| 🟣 **Fioletowy** | Out of office / focus | Mniej standardowe |
| 🔵 **Niebieski** | Praca, ale można podejść | Customowe; też używane jako "in a call" |
| ⚪ **Biały** | Idle / neutralny | Często "włączone ale bez statusu" |

**Częste customy z DIY community**:
- **Pomarańczowy** – "pracuję, ale można przerwać"
- **Fioletowy** – "gram / streaming / nie wchodzić"
- **Pulsujący czerwony** – "live na video"
- **Stały czerwony** – "tylko audio call"

Klasyczny "traffic light" 🟢🟡🔴 wygrywa intuicyjnością – wszyscy znają z drogi.

---

## 4. Co triggeruje zmianę stanu

To **najciekawszy obszar** – tu projekty się różnicują.

### A. Auto z presence Microsoft Teams

**Problem**: Microsoft historycznie nie dawał dostępu do statusu w Teams przez API, więc producenci kombinowali:

1. **Skype for Business bridge** – starsza metoda Luxafor: logowanie do S4B z tym samym kontem co Teams, presence przeciekał. Działało ale wymagało dziwnej konfiguracji.
2. **Microsoft Graph API** – obecnie poprawnie wspierane, wymaga Azure AD App registration z `Presence.Read` permission.
3. **Sniffing local app state** – odczyt logów Teams, plików stanu, procesów.

Elio Struyf (Microsoft MVP) opisuje: Stworzył stronę do synchronizacji presence Teams z Luxafor, bo natywnie działało tylko na Windows, nie na macOS. Plus narzekał że **wireless Luxafor gubił połączenie i bateria padała** – jego dzieci mówiły że "lampka zawsze zgaszona".

### B. Auto z webcam state (najbardziej eleganckie)

**Hans Scharler z Hackaday**: Sign zapala się gdy webcam jest włączona, presuming że jest się na meetingu. Python wykrywa stan webcam i wysyła do ThingSpeak, ESP32 w środku znaku odbiera sygnał i zapala LED-y.

**Komentator pod tym samym artykułem** ulepszył: Kod Python na hoście używa pomarańczowej kropki MacOS żeby wykryć stan – pomarańczowy gdy tylko mikrofon, zielony gdy kamera (kod kolorów z iOS).

**MuteKit / OnAirWarning** robi to komercyjnie: 3 niezależne światła: mikrofon, kamera, "meeting active" – nawet jak okno meetingu jest schowane za innymi, środkowe światło pokazuje że masz aktywne spotkanie.

To **lepsze niż presence Teams**, bo:
- Działa z każdą aplikacją (Teams, Zoom, Meet, Discord)
- Nie wymaga API ani autoryzacji
- Stan kamery = rzeczywisty "live broadcast"

### C. Auto z mute state (MuteDeck)

Projekt **igox/busylight** na GitHub:

> *busy mode (Red color) when entering a meeting with Mic ON and camera ON*  
> *away mode (Yellow color) when entering a meeting with Mic OFF and camera ON*  
> *away mode (Yellow color) if the mic is muted during a meeting*  
> *available mode (Green color) when exiting/closing a meeting*

**MuteDeck** to płatne narzędzie ($19/rok), wysyła webhooki do dowolnego urządzenia – mostek między "stan meetingu" a hardware'em.

### D. Auto z kalendarza

Reguła: "jeśli w Google Calendar mam meeting NOW, lampka czerwona". Działa nawet jak zapomniałeś dołączyć / spóźniłeś się / nie odpaliłeś Teams. Luxafor i Kuando mają to natywnie, DIY-owcy robią przez Google Calendar API + cron.

### E. Manualnie – button / app / Stream Deck

**Sara Fennah** (Microsoft Certified Trainer) ma świetne argumenty za manualnym sterowaniem: "Pracuję z 5 różnymi loginami do Teams w 11 organizacjach – który automatyzować? W domu jest wiele osób które muszą sygnalizować DND, nie wszystko triggerowane przez Teams".

Jej rozwiązanie: **Flic button + Philips Hue**. Każdy domownik ma swój Flic, każda osoba ma swoją lampkę przy strefie pracy. Klikasz – kolor się zmienia.

Jej protokół rodzinny: Zamknięte drzwi + czerwone światło = nie wchodź, napisz SMS jeśli pilne. Zamknięte drzwi + zielone światło = busy, ale możesz wejść. Otwarte drzwi (niezależnie od światła) = chętnie cię widzę.

**Stream Deck** to drugi popularny kontroler – jeden klawisz = "zaczynam meeting, lampka czerwona + przyciemnij streaming lights + wycisz powiadomienia". Ona ma osobne profile dla "delivery" (jasna lampka studio + czerwona DND) i "attendee" (przyciemnione światła + żółta DND).

### F. Hybryda – cron / heurystyki

- "Praca od 9 do 17 = lampka aktywna, poza – wyłącz"
- "Jak laptop jest podłączony do monitora w gabinecie = work mode"
- "Detekcja head-pose z webcam: jeśli patrzę w ekran > 5 min, focus mode"

---

## 5. DIY – jak ludzie to budują

### Architektura A: ESP + WS2812 + WiFi (najpopularniejsza)

**Grigorii Merkushev** (Medium): "Zaprojektowałem PCB w KiCAD: jeden ESP32, jeden stabilizator AMS1117, 12 adresowalnych LED WS2812b. Lutowanie SMD ręcznie było koszmarem". Integracja z **Home Assistant**, 4 kolory:

> *Red — busy on a call or shooting a video*  
> *Orange — working, accept interruptions*  
> *Purple — gaming*  
> *Green — free*

Stwierdził pod koniec: "Teraz buduję 2 kolejne dla mojej żony, żebym jej nie przeszkadzał gdy jest zajęta". **Powielanie urządzenia per osoba w domu** to ważny wzorzec.

**Instructables (Work From Home Status Indicator)**: ESP8266 + WS2812B + 330 Ω resistor + dyfuzor z butelki po mleku. ESP łączy się z WiFi, czeka na komendę. Kolory: czerwony = "daddy busy, nie hałasujcie", zielony = "daddy available", niebieski = "praca, ale można w razie czego". Build za < 50 zł.

**igox/busylight** na GitHub: ESP32 + 2 pierścienie LED 12-bit + power bank (Anker 5000mAh) + obudowa 3D-printed. **Web UI na porcie 80**, REST API, integracja z MuteDeck przez webhook. Pełna autonomia – nie potrzebuje hosta. Można nosić ze sobą.

### Architektura B: Adafruit MatrixPortal (CircuitPython)

**Max McKinney**: Adafruit MatrixPortal M4 (ESP32 + 64×32 RGB matrix) + CircuitPython + **Adafruit IO** jako broker MQTT. Wyświetla **tekst i kolor** – nie tylko sygnał, ale też powód ("In meeting until 3pm", "Recording"). Dla osób które chcą bogatszą informację, nie tylko 4 kolory.

### Architektura C: M5Stack ATOM Matrix

**doubleSlash Blog**: M5Stack ATOM Matrix (ESP32-PICO + 5×5 RGB matrix + push button pod akrylem), firmware w C++ Arduino, sterowanie z aplikacji JavaFX na desktopie. Gotowy form-factor, nie trzeba lutować PCB. **Best pick dla "chcę DIY ale nie chcę projektować obudowy"**.

### Architektura D: Smart bulb + przycisk Flic

Najbardziej low-tech, najszybciej do uruchomienia:
- 1× Philips Hue White & Color bulb (~50 EUR)
- 1× Hue Bridge (~50 EUR, jednorazowo dla wielu lampek)
- 1× Flic button (~25 EUR per osoba) **lub** Hue Tap (~40 EUR)
- Albo Flic Hub jako brama jeśli nie chcesz polegać na telefonie

Konfigurujesz w app Flic: krótkie naciśnięcie = czerwony, długie = zielony, double = pomarańczowy. **0 kodu, 30 minut setupu**.

### Architektura E: Komercyjna lampka + custom soft

Bierzesz **BlinkStick Square** (~50 EUR) i piszesz własny daemon w Pythonie/Node.js. Plusy: solidny hardware, działa od razu, masz pełną kontrolę nad softem. Minusy: drożej niż DIY, mniej "fun".

---

## 6. Form factor i umiejscowienie

### Na biurku Twoim
- **Sygnał głównie dla Ciebie samego**: pomodoro, focus timer, ambient feedback ze stanu systemu.
- Małe LED-y wystarczą (BlinkStick Nano, jeden NeoPixel).

### Na monitorze / nad monitorem
- **Widoczne na video call**: koledzy widzą Twój stan w okienku Zoom (meta-feedback "ktoś mnie zauważa").
- Form factor: clip-on, Luxafor Flag z magnesem.

### Na biurku Twoim, **widoczne od strony pokoju**
- Sygnał dla osób wchodzących. Wystarczająca jasność by widzieć z dystansu.
- Form factor: kula, kostka, "On Air" znak.

### **Przy drzwiach pokoju, na zewnątrz**
- **Najskuteczniejsze dla rodziny** – nie trzeba wchodzić by sprawdzić.
- Smart bulb w lampce nad drzwiami, LED strip dookoła futryny, znak "On Air" na drzwiach.
- Klasyk: **"On Air" sign w stylu radia / studia** – nawet dzieci łapią.

### W oknie (rzadkie, ale działa)
- Sara Fennah: "Pracuję na parterze, każdy idący do drzwi przechodzi obok mojego okna i próbuje zagadać albo zapuka. Nie mogę wstać w środku szkolenia. Postawiłam tam busy light".

### Mobile / przenośne
- **Luxafor Bluetooth Pro**: z baterią, bierzesz do biura.
- **igox/busylight**: ESP32 + powerbank, używa się jak normalny gadżet do plecaka.
- Use case: hot-desking, coworking, kawiarnia.

---

## 7. Co działa, co nie – lessons learned

### Co działa
- ✅ **Lampka na zewnątrz pokoju**. Domownicy widzą bez wchodzenia.
- ✅ **Konwencja 🟢🟡🔴**. Intuicyjne, bez tłumaczenia.
- ✅ **Sygnał z webcam state**. Niezawodny, działa cross-app.
- ✅ **Powielenie urządzeń per osoba**. Każdy w domu ma swoje światło.
- ✅ **Połączenie z fizyczną akcją "zamykania drzwi"**. Drzwi + lampka razem dają jasny sygnał.
- ✅ **Manualne sterowanie 1 przyciskiem**. Najprostsze nawet jeśli mniej "cool".

### Co nie działa
- ❌ **Bluetooth/WiFi wireless lampki**. Gubią połączenie, baterie padają. Elio Struyf po kilku dniach z bezprzewodowym Luxafor: "Dzieci powiedziały że lampka jest zawsze zgaszona. Często traciła połączenie, bateria umierała". **USB-wired wins**.
- ❌ **Zbyt wiele kolorów / znaczeń**. Ludzie zapominają. Maksymalnie 3-4 stany.
- ❌ **Tylko statusy aplikacji**. Co jak masz 5 kont Teams w różnych organizacjach? Co jak nie używasz Teams w ogóle? Manualny override musi istnieć.
- ❌ **Lampka na biurku Twoim, niewidoczna od drzwi**. Sygnał dla nikogo.
- ❌ **Zbyt subtelna jasność**. Light trzeba widzieć w słońcu. Sub-1W LED-ki giną w dziennym świetle.
- ❌ **Małe dzieci** – wymienione w wielu źródłach. Recenzje OnAirWarning: "Maluch wprawdzie zauważa że światło się świeci, ale czy to coś zmienia w jego zachowaniu – inna sprawa".

### Częste pułapki
- Smart bulb wyłączony fizycznym switchem przestaje być smart, dopóki nie włączysz manualnie.
- WiFi przeładowany w 2.4 GHz = pakiety do lampki gubione = stan się nie aktualizuje.
- Trigger z presence Teams nie obejmuje przypadków "podcast nagrywam", "klient na video bez Teams", "głośna muzyka headphony" – **stan nie musi pokrywać się z Teams**.

---

## 8. Praktyczne best practices

### 1. **Najpierw zdefiniuj kto ma widzieć**
- Tylko Ty (ambient feedback) → mały LED na biurku
- Domownicy → smart bulb w korytarzu / lampa przy drzwiach
- Goście w open space → znak "On Air" widoczny z 5 metrów

### 2. **Jeden źródłowy stan, wiele wyświetlaczy**
Architektura która się sprawdza: **centralny daemon trzyma stan, peryferia tylko renderują**.

```
[Twój komp]
   │
   ▼
[busy-state daemon] ← inputs: Teams, kalendarz, webcam, button, kron
   │
   ├──→ LED na biurku (USB)
   ├──→ Hue bulb przy drzwiach (Hue API)
   ├──→ Stream Deck visual feedback
   └──→ Discord/Slack status update
```

Zaleta: zmieniasz logikę raz, wszystkie outputs się aktualizują.

### 3. **Prioritetowy state machine**
Nie pokazuj średniej z 10 sygnałów. Pokazuj **najwyższy priorytet aktywny**:

```
PRIO 1: Webcam ON (live meeting) → czerwony stały
PRIO 2: Mikrofon ON (audio call) → czerwony przyciemniony
PRIO 3: Manualnie wymuszony DND → fioletowy
PRIO 4: Kalendarz mówi "meeting now" → czerwony pulsujący
PRIO 5: Idle / nic → zielony (lub off)
```

### 4. **Manualny override musi być**
Cokolwiek auto-triggerujesz, **dodaj przycisk fizyczny do nadpisania**. Stream Deck, Flic, klucz GPIO – nieważne. Use case: "muszę się skupić, ale nie odpalam Teams w tym momencie".

### 5. **Default OFF, nie default ON**
Jak system się gubi, lampka powinna gasnąć (= "nie wiem", = "wpadaj jak chcesz"), nie zostawać na czerwono (= rodzina nie wchodzi cały dzień).

### 6. **Dziel role: dom vs praca**
- W domu: 🟢🔴 wystarczy, dla rodziny.
- W biurze: rozszerzony zestaw kolorów dla różnych statusów dla siebie.
- Te dwa zbiory mogą być na różnych urządzeniach.

### 7. **Rytuał włączania**
Najlepsze busy lighty są częścią **rytuału wejścia w pracę**: usiadłem → włączyłem komp → kliknąłem przycisk "start work". To samo z wychodzeniem: domykasz dzień, lampka gaśnie. Bez tego ludzie zapominają zmieniać status.

---

## 9. Co warto skopiować – ranking pomysłów do "zwinięcia"

### Łatwe (1 dzień pracy)

1. **Philips Hue + Flic button + drzwi pokoju.** Bez kodu, działa godzinę po rozpakowaniu. Sara Fennah model. ~120-150 EUR setup dla 1 osoby.

2. **BlinkStick Square + skrypt Node.js z webhookami**. Pasuje do Twojego stacka. ~50 EUR + 1 dzień kodu.

3. **Smart bulb + Home Assistant + automatyzacje z webcam state**. Jeśli już masz HA, dopisujesz binary_sensor dla kamery, automatyzacja zmienia kolor. ~30 EUR za bulb.

### Średnie (weekend pracy)

4. **DIY ESP32 + WS2812 ring + WiFi MQTT**. Cały hardware ~80 zł, software w MicroPython albo ESPHome. Pasuje do twojego klimatu IoT.

5. **MuteDeck + igox/busylight**. Gotowy projekt na GitHub, działa cross-platform, REST API. Klonujesz, drukujesz obudowę 3D, lutujesz.

6. **"On Air" znak z ESP32 + Python script + ThingSpeak**. Replikacja projektu Hansa Scharlera. Bardziej "wow" wizualnie.

### Ambitne (projekt długoterminowy)

7. **Multi-source busy daemon** (Twój styl). Node.js/TypeScript daemon agregujący: webcam state, kalendarz, Teams presence, Flic button, czas pracy. Wystawia REST + MQTT + WebSocket. Wszystkie peryferia (LED, Hue, Stream Deck) konsumują z jednego źródła. Otwiera drogę do "LifeOps" rozszerzeń.

8. **Custom hardware z PCB**. KiCAD design, JLCPCB production, własna obudowa, ewentualnie do sprzedaży jako mini-produkt. Niche ale jest popyt – Luxafor, BlinkStick, Plenom dowodzą.

---

## 10. Komunikaty – co wysyłać

To trochę zaniedbany temat – większość projektów ma tylko "busy/free", ale głębsza komunikacja działa lepiej:

### Stany dla siebie samego (feedback)
- Pomodoro: praca / break / długi break
- Energia: focused / low energy / wymaga przerwy
- Build status: passing / failing / in progress
- Headphony: założone / zdjęte (z auto-detekcji)

### Stany dla domowników
- "Można wejść"
- "Można wejść, ale cicho"
- "Pukajcie najpierw"
- "Tylko emergency"
- "Wracam za 5 min" (z timerem)

### Stany dla open space / biura
- "Available"
- "In a call"
- "Deep work, NIE pytaj"
- "Be right back"

### Notyfikacje "burst" (krótkie zapalenia)
- Nowy mail z określonego źródła
- Push do main branch
- Alert Uptime Kuma
- Deploy zakończony
- Telefon dzwoni (cichy gabinet)

Reguła: **persistent state** (busy/free) na jednym LED, **transient events** (notyfikacje) na drugim albo na efektach (mrugnięcie 3× i wraca do stanu).

---

## 11. Integracje z konkretnym softem – ściągawka

### Microsoft Teams
- **Natywnie**: tylko Luxafor i Kuando na Windows. Reszta przez Graph API + Azure AD app registration.
- **DIY**: Tworzysz Azure AD App, dodajesz `Presence.Read`, włączasz device code flow, pobierasz access token, pollujesz `/me/presence`.
- **Hack**: detekcja procesu Teams + parsing log files (kruchy ale działa).
- **Lepiej**: detekcja stanu webcam zamiast presence – cross-aplikacyjne, niezawodne.

### Slack
- **API**: `users.getPresence`, `users.profile.set` (custom status).
- **Webhooki**: Slack może POSTować do Twojego daemona przy zmianie statusu.
- **Zapier**: leniwe ale działa.

### Zoom
- **Brak natywnego presence API** dla konta osobistego. Najlepiej: detekcja stanu kamery/mikrofonu lokalnie.

### Google Meet
- Brak presence API. Detekcja URL aktywnej karty Chrome (`meet.google.com`) + stan kamery.

### Google Calendar
- API `events.list` z `timeMin=now, timeMax=now+1min`. Daemon pollu raz na minutę, jak coś jest = lampka czerwona.

### Cross-platform "kamera włączona" detection
- **macOS**: pomarańczowa kropka w status barze (od macOS 12). Można czytać też przez `log stream | grep` na procesach VDC.
- **Windows**: rejestr `HKCU\Software\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\webcam` + `NonPackaged` keys.
- **Linux**: `/dev/video*` device busy check, `lsof | grep video`.

---

## 12. Mój top 3 rekomendacji dla osoby DIY (TL;DR)

Patrząc na Twój profil (Node/TS, homelab, Home Assistant, lubisz architektury):

### Wersja minimum viable (weekend)
**Philips Hue White & Color** (jeśli już masz Hue Bridge, inaczej zacznij od BlinkStick Square) + **prosty Node.js daemon** z 3 inputami:
1. Webcam state detection
2. Google Calendar lookup
3. Manual override przez HTTP endpoint

Daemon trzyma `currentState`, raz na 5s push do Hue / BlinkStick. Manual override z systemd timer wygasa po godzinie (żebyś nie zostawił na zawsze).

### Wersja "porządna" (2-3 weekendy)
Powyższe + ESPHome device z WS2812 ring przy drzwiach pokoju + integracja z Twoim Home Assistant + Stream Deck profile dla manualnych zmian.

### Wersja "side project z potencjałem komercjalizacji"
Multi-tenant busy-state-as-a-service: TypeScript backend, MQTT broker, klient mobilny do manualnych override'ów, prosty ESP32 reference design z PCB. Open source plus opcjonalny hosted plan. Niche, ale Luxafor i Kuando są od dekady na tym rynku – jest popyt na lepsze open-source rozwiązanie.

---

## Źródła i dalsza lektura

- Luxafor – komercyjny producent, dobre case studies: luxafor.com
- Plenom Kuando Busylight – plenom.com
- BlinkStick (open hardware) – blinkstick.com, github.com/arvydas
- Elio Struyf – DIY Teams + Luxafor: eliostruyf.com
- igox/busylight (ESP32 + REST) – github.com/igox/busylight
- brushknight/tiny-led-esp32 (DIY z PCB) – Medium artykuł Grigorii Merkushev
- Sara Fennah – manualny model z Flic + Hue: m365train.co.uk
- Hans Scharler – "On Air" sign z ESP32 + webcam state: hackaday.com
- Max McKinney – Adafruit MatrixPortal: maxmckinney.medium.com
- doubleSlash Blog – M5Stack ATOM Matrix: blog.doubleslash.de
- WLED firmware (do WS2812 nad ESP) – kno.wled.ge
- MuteDeck (webhooki dla stanu meeting) – mutedeck.com

---

*Dokument przygotowany 2026-05, na podstawie research społeczności DIY i komercyjnych vendorów. Stan rynku ewoluuje – Microsoft regularnie zmienia API Teams, więc szczegóły integracji warto weryfikować.*
