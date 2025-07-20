# WFH Indicator - Product Roadmap

This document provides a high-level overview of the development roadmap, aligning the work on the Tray App and the Emulator.

## Q3 2024: Core Functionality & Testing

| Feature / Goal             | Tray App                                             | Emulator                                 | Status              |
| :------------------------- | :--------------------------------------------------- | :--------------------------------------- | :------------------ |
| **Core Status Management** | Implement full status logic                          | Implement LED simulation                 | ✅ Done              |
| **Device Pairing via USB** | Implement full pairing logic                         | Simulate serial communication            | ✅ Done              |
| **"Ask to Enter" Flow**    | Implement notification & response                    | Simulate button press & receive response | ✅ Done              |
| **Automated E2E Tests**    | **Implement E2E tests for Pairing & "Ask to Enter"** | Provide stable API for tests             | ⚠️ **High Priority** |

## Q4 2024: Enhancements & Resilience

| Feature / Goal            | Tray App                                             | Emulator                                  | Status    |
| :------------------------ | :--------------------------------------------------- | :---------------------------------------- | :-------- |
| **Emulator UI**           | N/A                                                  | **Implement web-based UI**                | ⏳ Planned |
| **Error Simulation**      | N/A                                                  | **Implement error simulation API**        | ⏳ Planned |
| **App Resilience**        | Test against emulated errors (disconnects, timeouts) | Use new error simulation API in E2E tests | ⏳ Planned |
| **Schedule-based Status** | Implement full scheduling logic                      | N/A                                       | ✅ Done    |

## Future: Expansion

| Feature / Goal         | Tray App                   | Emulator                       | Status |
| :--------------------- | :------------------------- | :----------------------------- | :----- |
| **Mobile App Support** | Add pairing via QR code    | Simulate mobile app connection | 💡 Idea |
| **API Version 2.0**    | Implement new API features | Add support for API v2.0       | 💡 Idea |
