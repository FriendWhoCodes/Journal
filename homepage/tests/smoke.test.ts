import { describe, it, expect, beforeAll } from "vitest";

/**
 * Smoke Tests
 *
 * These tests run against a live deployment to verify critical functionality.
 * Set the BASE_URL environment variable to test against different environments:
 *
 * - Local: BASE_URL=http://localhost:3003 npm run test:smoke
 * - Production: BASE_URL=https://manofwisdom.co npm run test:smoke
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3003";

describe("Smoke Tests", () => {
  beforeAll(() => {
    console.log(`Running smoke tests against: ${BASE_URL}`);
  });

  describe("Homepage", () => {
    it("should return 200 for homepage", async () => {
      const response = await fetch(BASE_URL);
      expect(response.status).toBe(200);
    });

    it("should contain expected content", async () => {
      const response = await fetch(BASE_URL);
      const html = await response.text();

      expect(html).toContain("Man of Wisdom");
      expect(html).toContain("Ancient Wisdom");
    });

    it("should have correct content-type", async () => {
      const response = await fetch(BASE_URL);
      const contentType = response.headers.get("content-type");
      expect(contentType).toContain("text/html");
    });
  });

  describe("Music Page", () => {
    it("should return 200 for music page", async () => {
      const response = await fetch(`${BASE_URL}/music`);
      expect(response.status).toBe(200);
    });

    it("should contain music content", async () => {
      const response = await fetch(`${BASE_URL}/music`);
      const html = await response.text();

      expect(html).toContain("Wisdom Through");
      expect(html).toContain("Invictus Poem");
    });
  });

  describe("Health Check", () => {
    it("should return healthy status", async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.status).toBe("healthy");
    });

    it("should have all checks passing", async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      const data = await response.json();

      const failedChecks = data.checks.filter(
        (c: { status: string }) => c.status === "fail"
      );
      expect(failedChecks).toHaveLength(0);
    });
  });

  describe("404 Handling", () => {
    it("should return 404 for non-existent page", async () => {
      const response = await fetch(`${BASE_URL}/this-page-does-not-exist-12345`);
      expect(response.status).toBe(404);
    });
  });

  describe("Performance", () => {
    it("homepage should load within 3 seconds", async () => {
      const start = Date.now();
      await fetch(BASE_URL);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(3000);
    });

    it("health check should respond within 500ms", async () => {
      const start = Date.now();
      await fetch(`${BASE_URL}/api/health`);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(500);
    });
  });
});
