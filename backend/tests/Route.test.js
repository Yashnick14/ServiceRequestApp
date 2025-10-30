import { jest } from "@jest/globals";

// ✅ Mock AuthMiddleware BEFORE importing app.js
jest.unstable_mockModule("../src/middleware/AuthMiddleware.js", () => ({
  default: (req, res, next) => next(), // bypass authentication
}));

// Now import app after mocking
const { default: app } = await import("../src/app.js");
import request from "supertest";

describe("GET /api/requests", () => {
  it("should return 200 and JSON", async () => {
    const res = await request(app).get("/api/requests");
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
