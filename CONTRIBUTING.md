# Want to Help Build WFH Indicator?

This project needs community contributors to bring the concept to life. Here's how you can get involved:

## 🚀 Priority Software Projects

### 📱 Mobile App (React Native + Expo)

**Status**: Needs implementation
**Skills**: React Native, TypeScript, WebSocket communication
**Time estimate**: 2-3 weeks for MVP

Build the phone-based status display that turns old smartphones into door indicators.

- [Full Mobile App Specifications](./docs/specs/mobile-app.md)
- Always-on display with battery optimization
- QR code pairing with tray app
- Touch-based "Ask to Enter" functionality

### 💻 Tray App (Electron + TypeScript)

**Status**: Needs implementation
**Skills**: Electron, Node.js, TypeScript, WebSocket communication
**Time estimate**: 2-3 weeks for MVP

Create the desktop control center that manages status and device communication.

- [Full Tray App Specifications](./docs/specs/tray-app.md)
- Status control interface
- WebSocket server for device communication
- Response handling for entry requests

## 🔧 Hardware Projects

### 🔴 LED Ring Indicator (ESP32 + Hardware)

**Status**: Research/experimental phase
**Skills**: ESP32 programming, 3D printing, PCB design
**Time estimate**: 1-2 months for prototype

Custom hardware solution for permanent door installation.

- [Full LED Indicator Specifications](./docs/specs/led-indicator.md)
- ESP32 firmware development
- 3D printed case design
- PCB layout and assembly

### ⚡ PCB Design & Electronics

**Status**: Research phase
**Skills**: Circuit design, PCB layout, electronics prototyping
**Time estimate**: 1-2 months for working prototype

Design professional circuit boards for LED Indicator variants:

- PCB layout for different form factors (ring, square, linear)
- Power management circuit optimization
- Component selection and sourcing
- Assembly documentation

## 🎨 Design & UX

### Interface Design

- Mobile app UI/UX improvements
- Tray app interface design
- Status display patterns and animations
- User journey optimization

### Product Testing

- Test concept with your family/flatmates
- Document real-world usage scenarios
- Provide feedback on color schemes and interactions

## 📚 Documentation & Community

### Technical Writing

- API documentation
- Setup and installation guides
- Troubleshooting documentation

### Community Building

- Share on maker communities (Reddit, HackerNews)
- Create demo videos and tutorials
- Translation to other languages

## 🔗 Integration Projects

### Smart Home Integration

- Home Assistant plugin development
- Smart mirror display integration
- IoT ecosystem compatibility

### Calendar & Automation

- Google Calendar integration
- Microsoft Teams status sync
- Automatic status detection (microphone/camera usage)

## 💡 Research & Exploration

### Network Communication

See [Network Communication Strategy](./docs/specs/network-communication.md) for technical details on device discovery and connectivity.

### Domain Architecture

Review [Domain-Driven Design documentation](./.cursor/rules/ddd.mdc) for shared vocabulary and system design patterns.

---

## 💻 Development Setup

To get started with the development of the WFH Indicator tray app, you'll need to have Node.js and npm installed.

1.  **Fork and Clone the Repository**

    ```bash
    git clone https://github.com/your-github-username/wfh-indicator.git
    cd wfh-indicator/tray-app
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Run the App in Development Mode**

    ```bash
    npm run dev
    ```

    This will start the Electron app with hot-reloading enabled.

4.  **Run Tests**

    To run the unit tests:

    ```bash
    npm test
    ```

    To run the E2E tests (once the environment issue is resolved):

    ```bash
    npm run test:e2e
    ```

## 🤝 How to Contribute

1.  **Choose a project** from the list above that matches your skills.
2.  **Read the specifications** in `/docs/specs/` for technical details.
3.  **Open an issue** to discuss your planned contribution.
4.  **Fork the repository** and create a feature branch (`git checkout -b feature/your-feature-name`).
5.  **Make your changes** and ensure all tests pass.
6.  **Submit a pull request** to the `main` branch.

### Pull Request Process

1.  Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2.  Update the `README.md` with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations, and container parameters.
3.  Increase the version numbers in any examples and the `package.json` to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4.  You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## 📬 Get in Touch

- **Email**: [zentala@gmail.com](mailto:zentala@gmail.com)
- **Discord**: `zentala` - Join me to discuss ideas and coordination
- **GitHub Issues**: Use for technical discussions and feature planning

---

*This is a community-driven project. The goal is collaborative development, not solo implementation. Every contribution helps validate the concept and build something useful for remote workers everywhere.*
