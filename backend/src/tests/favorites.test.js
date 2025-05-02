const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const User = require("../models/User");

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test user and get token for authenticated requests
  const registerRes = await request(app).post("/api/auth/register").send({
    username: "favtestuser",
    email: "favtest@example.com",
    password: "password123",
  });

  token = registerRes.body.token;
  userId = registerRes.body.user.id;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 30000);

beforeEach(async () => {
  // Reset user's favorites before each test
  await User.findByIdAndUpdate(userId, { favorites: [] });
});

describe("Favorites API", () => {
  describe("POST /api/favorites", () => {
    it("should add a country to favorites", async () => {
      const res = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${token}`)
        .send({ countryCode: "USA" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toContain("USA");
    });

    it("should not add duplicate favorites", async () => {
      // Add a favorite first
      await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${token}`)
        .send({ countryCode: "CAN" });

      // Try to add the same country again
      const res = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${token}`)
        .send({ countryCode: "CAN" });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty(
        "message",
        "Country already in favorites"
      );
    });

    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/favorites")
        .send({ countryCode: "FRA" });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/favorites", () => {
    it("should get user favorites", async () => {
      // Add some favorites first
      await User.findByIdAndUpdate(userId, { favorites: ["GBR", "JPN"] });

      const res = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toContain("GBR");
      expect(res.body.data).toContain("JPN");
    });

    it("should require authentication", async () => {
      const res = await request(app).get("/api/favorites");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("DELETE /api/favorites/:countryCode", () => {
    it("should remove a country from favorites", async () => {
      // Add favorites first
      await User.findByIdAndUpdate(userId, { favorites: ["DEU", "ITA"] });

      const res = await request(app)
        .delete("/api/favorites/DEU")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).not.toContain("DEU");
      expect(res.body.data).toContain("ITA");
    });

    it("should handle removing non-existent favorites", async () => {
      const res = await request(app)
        .delete("/api/favorites/XXX")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Country not in favorites");
    });

    it("should require authentication", async () => {
      const res = await request(app).delete("/api/favorites/AUS");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });
});
