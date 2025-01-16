// __tests__/server.test.js
import request from "supertest";
import { app, server } from "../server"; // Make sure you're importing both app and server

beforeAll(() => {
  // Server starts when required in server.js, no need to start again here.
  // Any additional setup if needed.
});

afterAll(() => {
  // Ensure the server is closed after tests to avoid asynchronous operations
  server.close();
});

test("GET / should return Hello, World!", async () => {
  const response = await request(app).get("/"); // Make sure you're using the app instance here
  expect(response.text).toBe("Hello, World!");
});
