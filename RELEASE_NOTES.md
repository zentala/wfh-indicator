# WFH Indicator v1.0.0 Release Notes

This release marks the first stable version of the WFH Indicator tray app. The core functionality is complete, and the app is ready for daily use.

## ✨ New Features

*   **Automatic Status Changes:** The app can now automatically change your work status based on a schedule you configure.
*   **"Ask to Enter" Notifications:** Receive interactive notifications when someone wants to enter your workspace.
*   **Responsive UI:** The settings window has been redesigned to be more responsive and visually appealing.
*   **Automatic Updates:** The app will now automatically check for and install updates.

## 🚀 Improvements

*   **Performance:** Implemented caching for devices and schedule rules to reduce resource usage.
*   **UI/UX:** Improved the design of the device and auto-status tabs.
*   **Developer Documentation:** Updated `CONTRIBUTING.md` with a development guide.
*   **User Documentation:** Updated `README.md` with a "Getting Started" guide.

## 🐞 Bug Fixes

*   Fixed several unit test failures related to mocking.

## ⚠️ Known Issues

*   **E2E Tests:** The Playwright E2E tests are currently blocked due to an issue with the test runner environment. This will be addressed in a future release.

## 릴 Manual Release Steps

1.  **Ensure all tests pass.** (Unit tests should be passing, E2E tests are blocked).
2.  **Bump the version** in `package.json` to `1.0.0`.
3.  **Create a new git tag** for the release: `git tag -a v1.0.0 -m "Version 1.0.0"`
4.  **Push the tag** to GitHub: `git push origin v1.0.0`
5.  **Build the application** for all platforms: `npm run build` (or a platform-specific build command).
6.  **Create a new release** on the GitHub Releases page.
7.  **Upload the installers** (`.exe`, `.dmg`, `.AppImage`) to the GitHub release.
8.  **Publish the release.**
