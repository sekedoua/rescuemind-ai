// __tests__/sample.test.ts
import { mockClient } from "aws-sdk-client-mock";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

describe("Sanity check", () => {
  it("adds numbers correctly", () => {
    const sum = 2 + 3;
    expect(sum).toBe(5);
  });

  it("works with async code", async () => {
    const mockApi = () =>
      new Promise<string>((resolve) => setTimeout(() => resolve("ok"), 100));
    await expect(mockApi()).resolves.toBe("ok");
  });
});