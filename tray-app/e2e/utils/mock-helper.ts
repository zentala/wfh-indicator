import WebSocket from "isomorphic-ws";
import { TestController } from "../../../emulator/src/components/testController";

export class MockHelper {
  private ws: WebSocket;
  private static instance: MockHelper;

  private constructor() {
    this.ws = new WebSocket("ws://localhost:8080");
  }

  public static getInstance(): MockHelper {
    if (!MockHelper.instance) {
      MockHelper.instance = new MockHelper();
    }
    return MockHelper.instance;
  }

  async connect(): Promise<void> {
    return new Promise((resolve) => {
      this.ws.onopen = () => {
        console.log("Connected to mock device");
        resolve();
      };
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      this.ws.onclose = () => {
        console.log("Disconnected from mock device");
        resolve();
      };
      this.ws.close();
    });
  }

  async send(message: unknown): Promise<void> {
    this.ws.send(JSON.stringify(message));
  }

  async pressButton(type: "single" | "long" | "double"): Promise<void> {
    const message = {
      type: "test_command",
      command: "pressButton",
      payload: type,
    };
    await this.send(message);
  }

  async getLEDStatus(): Promise<{ color: string; brightness: number }> {
    const message = {
      type: "test_command",
      command: "getLEDStatus",
    };
    await this.send(message);

    return new Promise((resolve) => {
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data as string);
        if (data.type === "test_response" && data.command === "getLEDStatus") {
          resolve(data.payload);
        }
      };
    });
  }
}
