const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const User = require("../models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear users collection before each test
  await User.deleteMany({});
});

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("username", "testuser");
      expect(res.body.user).toHaveProperty("email", "test@example.com");
    });

    it("should not register a user with an existing email", async () => {
      // Create a user first
      await User.create({
        username: "existinguser",
        email: "existing@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/register").send({
        username: "newuser",
        email: "existing@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "User Mail already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login an existing user", async () => {
      // Create a user first
      await request(app).post("/api/auth/register").send({
        username: "loginuser",
        email: "login@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email", "login@example.com");
    });

    it("should not login with invalid credentials", async () => {
      // Create a user first
      await request(app).post("/api/auth/register").send({
        username: "invaliduser",
        email: "invalid@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "invalid@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should get current user profile", async () => {
      // Register a user and get token
      const registerRes = await request(app).post("/api/auth/register").send({
        username: "meuser",
        email: "me@example.com",
        password: "password123",
      });

      const token = registerRes.body.token;

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("username", "meuser");
      expect(res.body.data).toHaveProperty("email", "me@example.com");
    });

    it("should not access profile without auth token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty(
        "message",
        "Not authorized to access this route"
      );
    });
  });
});
