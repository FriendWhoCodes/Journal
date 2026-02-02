import { describe, it, expect } from "vitest";
import { GET } from "../app/api/health/route";

describe("Health Check API", () => {
  it("should return healthy status", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("healthy");
    expect(data.timestamp).toBeDefined();
    expect(data.uptime).toBeGreaterThanOrEqual(0);
    expect(data.checks).toBeInstanceOf(Array);
  });

  it("should include all required checks", async () => {
    const response = await GET();
    const data = await response.json();

    const checkNames = data.checks.map((c: { name: string }) => c.name);
    expect(checkNames).toContain("runtime");
    expect(checkNames).toContain("environment");
    expect(checkNames).toContain("memory");
  });

  it("should have valid timestamp format", async () => {
    const response = await GET();
    const data = await response.json();

    const timestamp = new Date(data.timestamp);
    expect(timestamp.toString()).not.toBe("Invalid Date");
  });
});
