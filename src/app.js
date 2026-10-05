const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

// In-memory tasks database
let tasks = [
  { id: 1, title: "Learn GitHub Actions", completed: false },
  { id: 2, title: "Setup Terraform", completed: true }
];

// Used by the tests to start from a known state
function resetTasks(seed = []) {
  tasks = seed.map((task) => ({ ...task }));
}

function calculateTotal(items) {
  // INTENTIONAL DEFECT: students must diagnose this using the tests.
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

app.get("/", (_req, res) => {
  res.json({
    service: "devops-platform-challenge",
    status: "ok"
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "healthy" });
});

app.get("/total", (_req, res) => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];

  res.json({ total: calculateTotal(items) });
});

app.get("/tasks", (_req, res) => {
  res.json(tasks);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "task not found" });
  }

  tasks.splice(index, 1);
  return res.status(204).send();
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
  });
}

module.exports = { app, calculateTotal, resetTasks };