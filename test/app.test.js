const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app, calculateTotal } = require("../src/app");

test("calculates the total for several items", () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];

  assert.equal(calculateTotal(items), 35);
});

test("returns zero for an empty basket", () => {
  assert.equal(calculateTotal([]), 0);
});

test("does not mutate the input items", () => {
  const items = [{ price: 4, quantity: 2 }];
  const copy = JSON.parse(JSON.stringify(items));

  calculateTotal(items);

  assert.deepEqual(items, copy);
});

test("GET /tasks returns a list of tasks", async () => {
  const response = await request(app).get("/tasks");
  
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body), "Response should be an array");
  
  // Verify array contents
  assert.ok(response.body.length > 0, "Tasks array should not be empty");
  
  // Check the structure of the first task
  const task = response.body[0];
  assert.ok("id" in task, "Task should have an id");
  assert.ok("title" in task, "Task should have a title");
  assert.ok("completed" in task, "Task should have a completed status");
});

test("POST /tasks creates a new task", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({ title: "Faire le challenge DevOps" });

  assert.equal(response.status, 201);
  assert.ok("id" in response.body, "The new task should have an id");
  assert.equal(response.body.title, "Faire le challenge DevOps");
  assert.equal(response.body.completed, false);
});

test("POST /tasks returns 400 for empty title", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({ title: "   " });

  assert.equal(response.status, 400);
});

test("POST /tasks returns 400 for missing title", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({});

  assert.equal(response.status, 400);
});
test("PATCH /tasks/:id updates an existing task", async () => {
  const response = await request(app)
    .patch("/tasks/1")
    .send({ completed: true });

  assert.equal(response.status, 200);
  assert.equal(response.body.id, 1);
  assert.equal(response.body.completed, true);
});

test("PATCH /tasks/:id returns 404 for unknown task", async () => {
  const response = await request(app)
    .patch("/tasks/999")
    .send({ completed: true });

  assert.equal(response.status, 404);
});

test("PATCH /tasks/:id returns 400 for invalid input", async () => {
  const response = await request(app)
    .patch("/tasks/1")
    .send({ completed: "invalid" });

  assert.equal(response.status, 400);
});

test("GET / returns service status", async () => {
  const response = await request(app).get("/");
  assert.equal(response.status, 200);
  assert.equal(response.body.service, "devops-platform-challenge");
  assert.equal(response.body.status, "ok");
});

test("GET /health returns healthy status", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "healthy");
});

test("GET /total returns calculated total", async () => {
  const response = await request(app).get("/total");
  assert.equal(response.status, 200);
  assert.equal(response.body.total, 35);
});
