/**
 * Test Setup for WFH Indicator Emulator
 */

// Mock environment variables for tests
process.env.MOCK_PORT = "8081";
process.env.MOCK_TEST_MODE = "true";
process.env.MOCK_DEBUG = "false";
process.env.MOCK_BATTERY_LEVEL = "100";
process.env.MOCK_CHARGING = "false";

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
beforeAll(() => {
  console.log = jest.fn();
  console.debug = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.debug = originalConsole.debug;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});
