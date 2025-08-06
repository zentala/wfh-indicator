i had to install Visual Studio Build Tool

```pwsh
winget install Microsoft.VisualStudio.2022.BuildTools
```

## E2E Testing with Emulator

This project uses Playwright for End-to-End (E2E) testing, with a device emulator to simulate hardware interactions.

### How to run the tests:

1.  **Navigate to the monorepo root directory.**

2.  **Run the E2E test command:**

    ```bash
    pnpm test:e2e
    ```

This command will automatically:

- Start the device emulator.
- Launch the `tray-app`.
- Run all Playwright E2E tests.
- Shut down the emulator and the app after the tests are complete.
