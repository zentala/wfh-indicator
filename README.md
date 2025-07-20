# 📦 WFH Indicator – Smart Status Light for Remote Work

A product concept for people working from home with others in the same space (flatmates, family, etc.)
— to make communication easier, interruptions less likely, and relationships less strained.

---

## 🚀 Getting Started

### Installation

1.  **Download the latest release** from the [GitHub Releases](https://github.com/your-github-username/wfh-indicator/releases) page.
2.  Install the application:
    *   **Windows:** Run the `.exe` installer.
    *   **macOS:** Open the `.dmg` file and drag the app to your Applications folder.
    *   **Linux:** Make the `.AppImage` file executable and run it.

### Features

*   **Status Control:** Quickly change your work status from the system tray menu.
*   **Automatic Status Changes:** Set up a schedule to automatically change your status based on your work hours.
*   **"Ask to Enter" Notifications:** Receive notifications when someone wants to enter your workspace.
*   **Device Management:** Pair and manage your WFH Indicator devices.

![Screenshot of the tray app menu](docs/screenshots/tray-menu.png)

---

## 🎯 Problem

When you're working from home and sharing your space, it's hard for others to know:

* when you're on a call,
* when you're focused,
* or when you're free to talk.

This leads to:

* interruptions during calls,
* tension in relationships,
* shame when noises come from behind the door during important meetings,
* guilt from your family when you tell them that they disturb you,
* family avoiding contact completely ("not sure if he's busy, better not knock"),
* unnecessary withdrawal from loud activities on their side (always being quiet).

### Personal context

> Sometimes my family came in during important meetings. I was annoyed.
> They felt guilty. Later they avoided me completely, and that too felt wrong.
> Sometimes they talked loudly behind the door during calls, but
> I couldn't signal them to be quiet without interrupting my meeting.
> I needed a solution that would help both sides: communicate status without words,
> reduce the mental load, and make everyone's life easier.

---

## 💡 Solution: WFH Indicator

A visual status system that shows your work availability using intuitive color
signals on your door, combined with two-way communication capabilities.

### Core features

* **Visual status display**: Show your current work state using colors
* **Two-way communication**: Others can ask "can I come in?" and you can respond
* **Desktop integration**: Control status from your laptop via tray app

### Status colors

* 🔴 **Red** – On a call (audio) - do not disturb
* 🟠 **Orange** – Video call - do not enter
* 🟡 **Yellow** – Focused work - interrupt only if urgent
* 🟢 **Green** – Available - come on in
* 🔵 **Blue** – Away - not at desk

I've designed two ways to implement this solution:

---

## 📱 Implementation Option 1: Phone Version (Recommended)

Transform any old smartphone into a smart door status display:

**What you need:**

* Old Android phone or tablet
* Car phone holder with suction cup ($5-10)
* Mobile app (React Native)

**How it works:**

* Always-on display shows your current status with colors and text
* Touchable "Ask to Enter" button for family/flatmates
* Connects to your laptop via WiFi for real-time status updates
* Battery efficient with black background and minimal UI

**Advantages:**

* Ready in minutes
* Zero custom hardware needed
* Works immediately for testing the concept
* Can repurpose devices you already own

[→ See mobile app technical specifications](docs/specs/mobile-app.md)

---

## 🔴 Implementation Option 2: LED Ring Version (For Makers)

Custom hardware solution for electronics enthusiasts who want a permanent, elegant installation:

**What it includes:**

* ESP32 microcontroller with WiFi
* Programmable RGB LED ring / strip
* Physical momentary "Ask to Enter" button
* 3D printed detachable case with holder
* Optional: PIR motion & ambient light sensors
* Battery or USB power supply

**Advantages:**

* Permanent installation
* Custom form factor designed for doors
* Lower power consumption than phone display
* Fun electronics project for makers
* Completely open source hardware design

[→ See LED indicator concept documentation](docs/concepts/led-indicator.md)

---

## 💻 Desktop Integration: Tray App

Both implementations connect to a desktop tray application that runs on your computer:

**Features:**

* Quick status changes via tray icon click
* Receives "Ask to Enter" notifications from door device
* Shows current status in system tray
* Potential future integrations (calendar, camera/mic usage detection)

**Technology:** Electron app with local WiFi communication

[→ See tray app specifications](docs/specs/tray-app.md)

---

## 🔧 Current Status (June 2025)

### ✅ Completed

* Concept, interaction design and color coding
* [LED Indicator device design specification](./docs/specs/led-indicator.md)
* Network communication & device pairing architecture
* [Mobile app architecture & UI specification](./docs/specs/mobile-app.md)

### ⚠️ In Progress

* Electron tray application UI design

### ❌ Needed

* [Mobile WFH indicator app](./docs/specs/mobile-app.md) development
* [Electron tray application](./docs/specs/tray-app.md) development
* User testing and UX refinement

### 🧪 Optionally

[LED Indicator](./docs/specs/led-indicator.md) development:

* Working ESP32 firmware (device not flashed yet)
* PCB design with 3D printed case and mounting system

---

## 📈 Why This Matters

It's general communication and productivity tool for modern remote life.

This project solves a very normal, real-world problem: **digital work is full of invisible states**. Others don't know when you're on a call, focused, or free. The result? Awkward interruptions, unnecessary stress, shame, withdrawal, and lost flow.

For some — especially neurodivergent individuals like myself with ADHD — managing these boundaries can be especially challenging, but really, it may helps everyone.

### 💼 Office parallels

Similar solutions already exist in office settings:

* **Meeting room panels** showing who booked the space and for how long
* **Status indicators** on monitors (Busylights, LED notifications)
* **Physical boundaries** like desk dividers and privacy screens
* **Phone booths and call pods** for private calls in open spaces
* **Visual signals** such as status cards and flags on desks
* **Quiet zone signs** designating no-phone-call areas
* **Noise-canceling headphones** as universal "do not disturb" signals

WFH Indicator brings the same clarity and respect for boundaries into the home:

* 🔴 "On a call" is just as real in a bedroom as in in meeting pod
* 🟡 "Need focus" deserves just as much respect at a dining table workspace as in a corporate quiet zone
* 🟢 "Now's a good time to talk" should be easy to signal without verbal coordination

The phone-based version acts like a simplified meeting room display: visible, dynamic, helping people know when not to disturb — and when it's okay to knock.

**The bigger picture**: this is about protecting cognitive resources and creating better communication at home. Just as construction workers secure physical space around a building site, knowledge workers need to secure mental space around their thinking. Just as offices provide quiet zones and meeting pods, remote workers need tools to manage boundaries in their work environment. This tool helps maintain flow state, reduces cognitive load, and creates clear boundaries in shared spaces. Everyone peace of mind, and smoother shared living.

## 🤝 Want to Build It With Me?

I can't finish this alone — but I'm happy to share the idea, code skeleton, and vision. The goal is to turn this into a collaborative, open-source community-driven tool for everyday life.

**→ [See detailed contribution opportunities](./CONTRIBUTING.md)**

### Currently Looking For

* **📱 React Native developers** for mobile app (priority #1)
* **💻 Electron developers** for tray application (priority #2)
* **🔧 ESP32 hardware enthusiasts** for LED Indicator development
* **⚡ PCB designers and makers** for circuit board design
* **🎨 UX designers** for user flows and interface improvements
* **📝 Anyone who wants to test** the concept with their family

### Integration Opportunities

* **Home Assistant** plugin development
* **Smart Mirror** display integration
* **Calendar services** synchronization (Google, Outlook)
* **Video conferencing** status detection (Teams, Zoom, etc.)

### Great for students

This project offers excellent opportunities for academic work:

* **Computer Science students**: Implement parts of the system as your semester project
* **Electronics students**: Design the PCB and hardware components
* **Design students**: Create 3D models for cases and mounts
* **UX/UI students**: Design and test the user interface

You'll get:

* A real-world project with complete specifications
* Valuable open-source contributions for your portfolio
* Practical experience with modern technologies
* Potential thesis or capstone project material

If you're looking for a project with clear requirements and real-world impact, this could be perfect for your coursework!

---

## 🌐 Project Links

* 🔗 **GitHub Repository**: [github.com/zentala/wfh-indicator](https://github.com/zentala/wfh-indicator)
* 🌍 **Project Homepage**: `wfh.zentala.io` (planned)
* 📬 **Contact**: [zentala@gmail.com](mailto:zentala@gmail.com)
* 💬 **Discord**: Join me at `zentala` to discuss this and other project ideas

---

## 🚀 Next Steps

1. **Complete firmware specification** for ESP32 implementation
2. **Prototype phone app** for immediate testing
3. **User testing** with real households
4. **3D print first case design** or test car phone holder compatibility
5. **Community building** through Reddit, HackerNews, and maker communities

---

*Let's build something valuable — even if it's only 80% complete. The other 20% is what brings people in to collaborate.*
