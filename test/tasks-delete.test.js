const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app, resetTasks } = require("../src/app");

test.beforeEach(() => {
  resetTasks([
    { id: 1, title: "first", completed: false },
    { id: 2, title: "second", completed: true }
  ]);
});

test("DELETE /tasks/:id deletes an existing task and returns 204", async () => {
  const response = await request(app).delete("/tasks/1");
  assert.equal(response.status, 204);
});

test("a deleted task is removed from the list", async () => {
  await request(app).delete("/tasks/1");
  const response = await request(app).get("/tasks");
  assert.deepEqual(response.body.map((t) => t.id), [2]);
});

test("a deleted task cannot be deleted twice", async () => {
  await request(app).delete("/tasks/1");
  const response = await request(app).delete("/tasks/1");
  assert.equal(response.status, 404);
});

test("DELETE /tasks/:id returns 404 for an unknown task", async () => {
  const response = await request(app).delete("/tasks/999");
  assert.equal(response.status, 404);
});

test("a task created with POST can be deleted", async () => {
  const created = await request(app).post("/tasks").send({ title: "temporary" });
  const response = await request(app).delete(`/tasks/${created.body.id}`);
  assert.equal(response.status, 204);
});