const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const { prisma } = require("./utils/prisma");

/*
|──────────────────────────────────────────────────
| Setup
|──────────────────────────────────────────────────
*/
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

/*
|──────────────────────────────────────────────────
| REST fallback — GET /api/tasks
|──────────────────────────────────────────────────
*/

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.json(tasks);
  } catch (err) {
    console.error("[GET /api/tasks]", err.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

/*
|──────────────────────────────────────────────────
| Socket.IO — Real-time Events
|──────────────────────────────────────────────────
*/

io.on("connection", async (socket) => {
  console.log(`✅ Connected: ${socket.id}`);

  /* ── sync:tasks — send all tasks to newly connected client ── */
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "asc" },
    });
    socket.emit("tasks:sync", tasks);
  } catch (err) {
    console.error("[tasks:sync]", err.message);
    socket.emit("tasks:sync", []);
  }

  /* ── task:create ── */
  socket.on("task:create", async (taskData) => {
    try {
      const task = await prisma.task.create({
        data: {
          title:       taskData.title?.trim() || "Untitled",
          description: taskData.description || "",
          status:      "todo",
          priority:    taskData.priority  || "Medium",
          category:    taskData.category  || "Feature",
          attachment:  taskData.attachment || "",
          userId:      taskData.userId    || null,
        },
      });
      io.emit("task:created", task);
    } catch (err) {
      console.error("[task:create]", err.message);
      socket.emit("task:error", { message: "Failed to create task." });
    }
  });

  /* ── task:update ── */
  socket.on("task:update", async (updatedTask) => {
    try {
      const task = await prisma.task.update({
        where: { id: updatedTask.id },
        data: {
          title:       updatedTask.title,
          description: updatedTask.description,
          priority:    updatedTask.priority,
          category:    updatedTask.category,
          attachment:  updatedTask.attachment,
          updatedAt:   new Date(),
        },
      });
      io.emit("task:updated", task);
    } catch (err) {
      console.error("[task:update]", err.message);
      socket.emit("task:error", { message: "Failed to update task." });
    }
  });

  /* ── task:move ── */
  socket.on("task:move", async ({ taskId, destination }) => {
    try {
      await prisma.task.update({
        where: { id: taskId },
        data:  { status: destination, updatedAt: new Date() },
      });
      io.emit("task:moved", { taskId, destination });
    } catch (err) {
      console.error("[task:move]", err.message);
      socket.emit("task:error", { message: "Failed to move task." });
    }
  });

  /* ── task:delete ── */
  socket.on("task:delete", async (taskId) => {
    try {
      await prisma.task.delete({ where: { id: taskId } });
      io.emit("task:deleted", taskId);
    } catch (err) {
      console.error("[task:delete]", err.message);
      socket.emit("task:error", { message: "Failed to delete task." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
  });
});

/*
|──────────────────────────────────────────────────
| Start Server
|──────────────────────────────────────────────────
*/

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Kanban Pro server on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});