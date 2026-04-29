const request = require("supertest");

// Mock environment variables before requiring server
process.env.OPENAI_API_KEY = "test-key";
process.env.TMDB_API_KEY = "test-tmdb-key";
process.env.ALLOWED_ORIGIN = "http://localhost:3000";

const app = require("../index");

describe("Server", () => {
  it("should return health check", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("should return 400 for GPT search without query", async () => {
    const res = await request(app)
      .post("/api/gpt/search")
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 for GPT search with empty query", async () => {
    const res = await request(app)
      .post("/api/gpt/search")
      .send({ query: "   " });
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 for GPT search with too long query", async () => {
    const res = await request(app)
      .post("/api/gpt/search")
      .send({ query: "a".repeat(501) });
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 for invalid movie ID", async () => {
    const res = await request(app).get("/api/tmdb/movie/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 for TMDB search without query", async () => {
    const res = await request(app).get("/api/tmdb/search");
    expect(res.statusCode).toBe(400);
  });
});
