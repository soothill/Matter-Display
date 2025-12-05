const request = require("supertest");
const app = require("../server");

describe("Matter Display API", () => {
  it("should return a list of devices", async () => {
    const res = await request(app).get("/devices");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return 404 for a non-existent device", async () => {
    const res = await request(app).get("/devices/nonexistent");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
