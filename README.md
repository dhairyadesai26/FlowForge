# ⚡ FlowForge — Kanban Pro

> **Real-time, full-stack Kanban board** powered by WebSockets, React 19, Express, Prisma ORM, and PostgreSQL (Neon) — with cloud file attachments, JWT auth, interactive analytics, and a comprehensive test suite (Vitest + Playwright).

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Live Demo & Screenshots](#-live-demo--screenshots)
3. [Feature Highlights](#-feature-highlights)
4. [Tech Stack](#-tech-stack)
5. [Architecture](#-architecture)
6. [Project Structure](#-project-structure)
7. [Database Schema](#-database-schema)
8. [API Reference](#-api-reference)
9. [WebSocket Events](#-websocket-events)
10. [Getting Started](#-getting-started)
11. [Environment Variables](#-environment-variables)
12. [Running the Tests](#-running-the-tests)
13. [Component Reference](#-component-reference)
14. [Custom Hooks](#-custom-hooks)
15. [File Upload (Cloudinary)](#-file-upload-cloudinary)
16. [Authentication Flow](#-authentication-flow)
17. [Analytics Dashboard](#-analytics-dashboard)
18. [Scripts Reference](#-scripts-reference)
19. [Contributing](#-contributing)

---

## 🌟 Overview

**FlowForge** (branded in-app as **Kanban Pro**) is a production-quality, real-time task management platform. Any action performed by one user — creating a task, moving a card between columns, updating a title, deleting a task — propagates **instantly** to every other connected client over a persistent WebSocket connection, with **zero page refresh required**.

The application is a full monorepo with a clean separation between the **`/backend`** (Node + Express + Socket.IO + Prisma) and **`/frontend`** (React 19 + Vite + @hello-pangea/dnd) directories.

---

## ✨ Feature Highlights

| Feature | Details |
|---|---|
| 🔴 **Real-Time Sync** | Socket.IO WebSocket — every mutation is broadcast to all connected clients immediately |
| 🃏 **Drag & Drop** | `@hello-pangea/dnd` — smooth, accessible drag-and-drop across To Do → In Progress → Done |
| 🔐 **JWT Auth** | Sign Up / Sign In with bcrypt password hashing; 7-day tokens; protected routes |
| 📎 **Cloud Attachments** | Upload images (PNG, JPG, GIF, WEBP) and PDFs directly to Cloudinary; preview inline |
| 📊 **Analytics Dashboard** | Live Pie & Bar charts (Recharts) — task completion %, priority distribution |
| 🔍 **Search & Filter** | Instant client-side search by title/description; filter by priority and category |
| 🎨 **Premium Landing Page** | Animated hero, mock board preview, features section — built with Framer Motion |
| 🧪 **Full Test Coverage** | Unit (Vitest), Integration (Vitest + socket mocks), E2E (Playwright) |
| 🌙 **Dark-Mode Design** | Deep dark UI with glassmorphism cards, indigo accent palette, smooth micro-animations |
| 🏷️ **Priority & Category Badges** | High / Medium / Low priority badges; Feature / Bug / Enhancement category tags |
| ⏱️ **Relative Timestamps** | Task cards show human-readable "just now / 5m ago / 2h ago / 3d ago" |
| 🔌 **Connection Status** | Live indicator in the navbar shows WebSocket connection health |
| 🏥 **Health Endpoint** | `GET /health` for uptime monitoring and deployment checks |
| 🔒 **PDF Proxy** | Backend proxy endpoint serves Cloudinary PDFs inline, bypassing CORS restrictions |

---

## 🧰 Tech Stack

### Frontend

| Library | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI framework |
| **Vite** | 6.x | Dev server & build tool |
| **React Router DOM** | 7.x | Client-side routing |
| **Socket.IO Client** | 4.8.x | Real-time WebSocket client |
| **@hello-pangea/dnd** | 18.x | Accessible drag-and-drop |
| **Recharts** | 3.x | SVG-based analytics charts |
| **Framer Motion** | 12.x | Page animations & transitions |
| **Lucide React** | latest | Icon library |

### Backend

| Library | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 4.x | HTTP server & REST API |
| **Socket.IO** | 4.8.x | WebSocket server |
| **Prisma ORM** | 7.x | Type-safe database client |
| **PostgreSQL (Neon)** | — | Managed serverless Postgres |
| **bcryptjs** | 3.x | Password hashing |
| **jsonwebtoken** | 9.x | JWT generation & verification |
| **dotenv** | 17.x | Environment variable loading |
| **nodemon** | 3.x | Hot-reload in development |

### Testing

| Tool | Purpose |
|---|---|
| **Vitest** | Unit & integration testing |
| **@testing-library/react** | Component rendering & assertions |
| **jsdom** | DOM environment for tests |
| **Playwright** | End-to-end browser automation |

### Cloud Services

| Service | Purpose |
|---|---|
| **Cloudinary** | File storage for images and PDFs |
| **Neon** | Serverless PostgreSQL database |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (React 19)                   │
│                                                             │
│  LandingPage  ──► AuthModal (sign-in / sign-up)             │
│       │                    │ JWT token                      │
│       └────────────────────▼                                │
│                    KanbanBoard (protected)                  │
│                    ├── Navbar (search / filter / auth)      │
│                    ├── Column × 3 (Todo, InProgress, Done)  │
│                    │     └── TaskCard (edit / delete)       │
│                    ├── TaskModal + TaskForm (create)        │
│                    └── Dashboard (ProgressChart, PriorityChart)
│                                                             │
│              useTasks hook ◄──► socket.io-client           │
└─────────────────────────────────┬───────────────────────────┘
                WebSocket (ws://)  │  REST (HTTP)
┌─────────────────────────────────▼───────────────────────────┐
│                     Express Server (port 5000)              │
│                                                             │
│  REST:  GET /api/tasks          (fallback fetch)            │
│         POST/GET /api/auth/*    (signup / signin / me)      │
│         GET /api/proxy-pdf      (Cloudinary PDF proxy)      │
│         GET /health             (uptime check)              │
│                                                             │
│  Socket.IO events:                                          │
│    ← tasks:sync      (on connect: send all tasks)           │
│    ← task:create     ─► persist ─► broadcast task:created  │
│    ← task:update     ─► persist ─► broadcast task:updated  │
│    ← task:move       ─► persist ─► broadcast task:moved    │
│    ← task:delete     ─► persist ─► broadcast task:deleted  │
└─────────────────────────────────┬───────────────────────────┘
                                  │ Prisma ORM
┌─────────────────────────────────▼───────────────────────────┐
│           Neon PostgreSQL (serverless, SSL)                  │
│           Tables: tasks, users                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
websocket-kanban-vitest-playwright-2026-main/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma data models (Task, User)
│   ├── routes/
│   │   └── auth.js               # POST /signup, POST /signin, GET /me
│   ├── socket/                   # (socket utilities, if extended)
│   ├── utils/
│   │   └── prisma.js             # Singleton Prisma client
│   ├── data/                     # Local data (if used in dev)
│   ├── server.js                 # Entry point — Express + Socket.IO
│   ├── prisma.config.ts          # Prisma config overrides
│   ├── .env                      # Backend environment variables
│   └── package.json
│
└── frontend/
    ├── public/                   # Static assets
    ├── src/
    │   ├── assets/               # Images, icons
    │   ├── components/
    │   │   ├── analystics/       # (sic) Analytics components
    │   │   │   ├── Dashboard.jsx       # Analytics section wrapper
    │   │   │   ├── ProgressChart.jsx   # Pie chart — completion %
    │   │   │   └── PriorityChart.jsx   # Bar chart — tasks by priority
    │   │   ├── board/
    │   │   │   ├── KanbanBoard.jsx     # Root board, DnD context, filters
    │   │   │   ├── Column.jsx          # Droppable column
    │   │   │   └── TaskCard.jsx        # Draggable task card
    │   │   ├── common/
    │   │   │   ├── ConnectionStatus.jsx  # Live WebSocket status badge
    │   │   │   ├── Loader.jsx            # Full-screen loading spinner
    │   │   │   └── Navbar.jsx            # Search, filters, user, new task
    │   │   ├── landing/
    │   │   │   ├── LandingPage.jsx     # Hero, features, CTA, auth modal
    │   │   │   └── LandingPage.css     # Landing-specific styles
    │   │   └── task/
    │   │       ├── TaskForm.jsx        # Create task modal form
    │   │       ├── EditTaskForm.jsx    # Edit task modal form
    │   │       ├── TaskModal.jsx       # Generic modal wrapper
    │   │       └── FileUploader.jsx    # Drag-and-drop Cloudinary uploader
    │   ├── hooks/
    │   │   ├── useTasks.js       # Socket event subscriptions + task state
    │   │   ├── useSocket.js      # Connection status tracking
    │   │   └── useTheme.js       # Theme (dark/light) toggle
    │   ├── services/
    │   │   └── socket.js         # Socket.IO client singleton
    │   ├── tests/
    │   │   ├── unit/
    │   │   │   ├── KanbanBoard.test.jsx    # Board rendering & interactions
    │   │   │   ├── TaskForm.test.jsx       # Form validation & submission
    │   │   │   ├── FileUploader.test.jsx   # Upload UI states & errors
    │   │   │   └── useTasks.test.jsx       # Hook socket event handling
    │   │   ├── integration/
    │   │   │   └── WebSocketIntegration.test.jsx  # Full event cycle tests
    │   │   └── e2e/
    │   │       └── KanbanBoard.e2e.test.js # Playwright end-to-end tests
    │   ├── utils/
    │   │   └── constants.js      # Shared constants
    │   ├── App.jsx               # Router + AuthContext + AuthProvider
    │   ├── index.css             # Global design system & component styles
    │   ├── main.jsx              # React root mount
    │   └── setupTests.js         # Vitest + @testing-library setup
    ├── index.html
    ├── vite.config.js            # Vite + Vitest config + API proxy
    ├── playwright.config.js      # Playwright E2E config
    └── package.json
```

---

## 🗄️ Database Schema

```prisma
model Task {
  id          String   @id @default(uuid())
  title       String
  description String   @default("")
  status      String   @default("todo")      // "todo" | "inprogress" | "done"
  priority    String   @default("Medium")    // "High" | "Medium" | "Low"
  category    String   @default("Feature")   // "Feature" | "Bug" | "Enhancement"
  attachment  String   @default("")          // Cloudinary URL
  userId      String?                        // Optional user association
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("tasks")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String                           // bcrypt hash
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

---

## 📡 API Reference

### Authentication Routes

#### `POST /api/auth/signup`
Register a new user account.

**Request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response `201`:**
```json
{
  "message": "User created successfully",
  "token": "<JWT>",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "initials": "JA" }
}
```

---

#### `POST /api/auth/signin`
Authenticate an existing user.

**Request body:**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response `200`:**
```json
{
  "message": "Signed in successfully",
  "token": "<JWT>",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "initials": "JA" }
}
```

---

#### `GET /api/auth/me`
Return the current authenticated user (requires `Authorization: Bearer <token>` header).

**Response `200`:**
```json
{ "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "initials": "JA" } }
```

---

### Task Routes

#### `GET /api/tasks`
REST fallback — returns all tasks ordered by creation date. (Normally tasks are delivered via WebSocket on connect.)

---

### Utility Routes

#### `GET /health`
```json
{ "status": "ok" }
```

#### `GET /api/proxy-pdf?url=<cloudinary-url>`
Fetches a Cloudinary-hosted PDF and serves it inline, resolving browser CORS issues. Only accepts `https://res.cloudinary.com/` URLs.

---

## 🔌 WebSocket Events

All real-time communication is handled via **Socket.IO**. The frontend connects through Vite's WebSocket proxy (`/socket.io` → `localhost:5000`).

### Client → Server (emitted by the frontend)

| Event | Payload | Description |
|---|---|---|
| `task:create` | `{ title, description, priority, category, attachment, userId }` | Create a new task |
| `task:update` | `{ id, title, description, priority, category, attachment }` | Update task fields |
| `task:move` | `{ taskId, destination }` | Move task to a new column |
| `task:delete` | `taskId` (string) | Delete a task by ID |

### Server → Client (emitted to all connected clients)

| Event | Payload | Description |
|---|---|---|
| `tasks:sync` | `Task[]` | Full task list sent on initial connection |
| `task:created` | `Task` | Broadcast when a new task is created |
| `task:updated` | `Task` | Broadcast when a task is updated |
| `task:moved` | `{ taskId, destination }` | Broadcast when a task column changes |
| `task:deleted` | `taskId` (string) | Broadcast when a task is deleted |
| `task:error` | `{ message }` | Emitted to the originating socket on failure |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Neon** (or other PostgreSQL) database
- A **Cloudinary** account (free tier is sufficient)

### 1 — Clone the repository

```bash
git clone https://github.com/dhairyadesai26/FlowForge.git
cd FlowForge
```

### 2 — Backend setup

```bash
cd backend
npm install
```

Copy `.env.example` (or edit `.env`) and fill in your values (see [Environment Variables](#-environment-variables)).

Apply the database migrations:

```bash
npx prisma migrate dev --name init
# or, to push schema without migrations:
npx prisma db push
```

Start the backend:

```bash
npm run dev          # nodemon — hot-reload
# or
npm start            # plain node
```

The server starts on **http://localhost:5000**.

### 3 — Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server starts on **http://localhost:3000** and automatically proxies all `/api` and `/socket.io` requests to the backend on port 5000.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Full PostgreSQL connection string (Neon or local) |
| `PORT` | ❌ | HTTP port (default: `5000`) |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs (use a long random string in production) |
| `FRONTEND_URL` | ❌ | Frontend origin to allow in CORS (e.g., `https://yourapp.com`) |
| `STACK_JWKS_URL` | ❌ | Neon Auth JWKS URL (if using Neon Auth) |
| `STACK_AUTH_URL` | ❌ | Neon Auth base URL (if using Neon Auth) |

**Example:**
```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
PORT=5000
JWT_SECRET="your-super-secret-jwt-key-here"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ❌ | Backend base URL (empty string in dev — Vite proxy handles it) |

**Example (production):**
```env
VITE_API_URL="https://your-backend.onrender.com"
```

---

## 🧪 Running the Tests

### Unit & Integration Tests (Vitest)

```bash
cd frontend
npm test
# or to watch:
npx vitest
```

**Test files:**

| File | What it covers |
|---|---|
| `unit/KanbanBoard.test.jsx` | Board renders all 3 columns, task counts, modal open/close, analytics section |
| `unit/TaskForm.test.jsx` | Form validation, required title, priority & category dropdowns |
| `unit/FileUploader.test.jsx` | File drop zone, valid/invalid MIME types, uploading state, preview rendering |
| `unit/useTasks.test.jsx` | `useTasks` hook — event listeners, state updates on each socket event |
| `integration/WebSocketIntegration.test.jsx` | Full event lifecycle: `tasks:sync`, `task:created`, `task:updated`, `task:moved`, `task:deleted`, search filter, priority filter |

### End-to-End Tests (Playwright)

> Requires **both** the backend (port 5000) and the Vite dev server (port 3000) to be running.

```bash
# Start backend first (in another terminal)
cd backend && npm run dev

# Then run E2E tests
cd frontend
npm run test:e2e
```

**E2E scenarios covered:**

| Test | Scenario |
|---|---|
| Board renders | Title visible, all 3 columns present, connection shows "Live" |
| Create task | Fill form → submit → card appears in To Do column |
| Delete task | Create → find card → click Delete → card disappears |
| Priority selection | High / Low dropdown values persist correctly |
| Category badge | Create with "Bug" → category badge shows "Bug" on the card |
| Edit task | Open edit modal → change title → save → updated title visible |
| Form validation | Submit empty title → error message shown |
| Dashboard renders | Progress chart + Priority chart both visible |
| Graph updates | Adding a task updates the stats row |
| Search filter | Two tasks → search "Alpha" → only matching task visible |
| File upload — valid PNG | PNG file picked → file name shown, no error |
| File upload — valid JPEG | JPEG file picked → file name shown, no error |
| File upload — invalid `.sh` | Shell script → error "Invalid" shown |
| File upload — invalid `.txt` | Text file → error message shown |

**Playwright config:** headless Chromium, 1440×900 viewport, screenshots & video on failure, 1 retry per test.

---

## 🧩 Component Reference

### `<KanbanBoard />`
Root board component. Orchestrates drag-and-drop (`DragDropContext`), manages search/priority/category filter state, and renders the three `<Column>` components + `<Dashboard>`.

### `<Column columnId="todo|inprogress|done" tasks={[]} />`
`Droppable` column. Displays the column header with task count and renders a `<TaskCard>` for each task.

### `<TaskCard task={} updateTask={} deleteTask={} />`
`Draggable` card. Shows title, description, priority & category badges, a relative timestamp, an attachment button (if present), and Edit / Delete action buttons. Opens `<EditTaskForm>` in a modal.

### `<TaskForm onClose={} createTask={} />`
Create task modal form. Fields: title (required), description, priority select, category select, `<FileUploader>`. Emits `task:create` via the socket.

### `<EditTaskForm task={} onClose={} updateTask={} />`
Edit task modal. Mirrors `TaskForm` but pre-fills existing values. Emits `task:update` via the socket.

### `<FileUploader setAttachment={} currentUrl={} />`
Drag-and-drop + click-to-browse file uploader. Validates MIME types (PNG, JPG, GIF, WEBP, PDF). Uploads to Cloudinary and returns a permanent `secure_url`. Shows an inline image preview or a styled PDF badge.

### `<Dashboard tasks={[]} />`
Analytics section wrapper. Renders `<ProgressChart>` and `<PriorityChart>` side by side.

### `<ProgressChart tasks={[]} />`
Pie chart (Recharts) showing Done / In Progress / To Do breakdown, plus a completion percentage pill and a progress bar.

### `<PriorityChart tasks={[]} />`
Bar chart (Recharts) with colour-coded bars — High (red), Medium (amber), Low (green).

### `<Navbar />`
Sticky top bar with the brand logo, search input, priority & category filter selects, `<ConnectionStatus>`, the **+ New Task** button, and the authenticated user's avatar + sign-out button.

### `<ConnectionStatus />`
Small badge that reads **🟢 Live** or **🔴 Offline** based on the Socket.IO connection state from `useSocket()`.

### `<LandingPage />`
Animated marketing page with a hero section (Framer Motion), a mock Kanban preview, a 4-feature grid, and a CTA section. Contains the inline `<AuthModal>` for sign-in / sign-up.

---

## 🪝 Custom Hooks

### `useTasks()`
```js
const { tasks, loading, createTask, updateTask, moveTask, deleteTask } = useTasks();
```
Registers all Socket.IO event listeners before connecting so no `tasks:sync` event is missed. Has an 8-second timeout fallback to unblock the UI if the server is unreachable. Returns imperative helpers that wrap `socket.emit`.

### `useSocket()`
```js
const { connected, error } = useSocket();
```
Tracks `connect`, `disconnect`, and `connect_error` events to expose live connection status to the UI.

### `useTheme()`
Provides a theme toggle (dark / light) persisted to `localStorage`.

---

## 📎 File Upload (Cloudinary)

Files are uploaded **directly from the browser** to Cloudinary using an unsigned upload preset. No file data ever touches the Express backend.

**Upload flow:**

```
User selects file
       │
       ▼
FileUploader validates MIME type
       │
       ▼
Browser POSTs FormData to Cloudinary API
  • Images → /image/upload  (PNG, JPG, GIF, WEBP)
  • PDFs   → /raw/upload    (returns a raw asset URL)
       │
       ▼
Cloudinary returns { secure_url }
       │
       ▼
URL stored in task.attachment field (Postgres via Socket.IO)
```

**Cloudinary config (hardcoded in `FileUploader.jsx`):**

| Key | Value |
|---|---|
| Cloud name | `dl7xjotfc` |
| Upload preset | `FlowForge` |

To use your own Cloudinary account, replace these values and ensure your upload preset is set to **unsigned** and allows both `image` and `raw` resource types.

**PDF serving:** PDFs hosted on Cloudinary cannot be embedded in `<iframe>` due to CORS. The backend exposes `GET /api/proxy-pdf?url=<url>` which fetches the PDF server-side and serves it with the correct `Content-Type: application/pdf` header.

---

## 🔐 Authentication Flow

```
Landing Page
    │
    ├── [Sign Up] → POST /api/auth/signup
    │                    ├── validate email + password
    │                    ├── bcrypt.hash(password, 10)
    │                    ├── prisma.user.create()
    │                    └── jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' })
    │                         └──► { token, user } stored in localStorage
    │
    └── [Sign In] → POST /api/auth/signin
                         ├── prisma.user.findUnique({ email })
                         ├── bcrypt.compare(password, hash)
                         └── jwt.sign(…) → { token, user }

On reload → GET /api/auth/me (Authorization: Bearer <token>)
    ├── jwt.verify(token, JWT_SECRET)
    ├── prisma.user.findUnique({ id: decoded.userId })
    └── returns user object → AuthContext.user restored

Protected route /app → <ProtectedRoute> checks AuthContext.user
    └── if null → Navigate to "/"
```

Tokens are stored in `localStorage` under the key `kanban_token`.

---

## 📊 Analytics Dashboard

The dashboard section lives below the board grid and updates in real-time as tasks are created, moved, or deleted.

### Progress Chart (Pie)
- Slices: **Done** (green `#22c55e`), **In Progress** (indigo `#6366f1`), **To Do** (amber `#f59e0b`)
- Completion percentage pill: `done / total × 100`
- Progress bar fills to match completion %
- Empty state when no tasks exist

### Priority Chart (Bar)
- Bars for **High** (red `#ef4444`), **Medium** (amber `#f59e0b`), **Low** (green `#22c55e`)
- Each bar height represents the count of tasks at that priority level
- Rounded bar tops, custom dark tooltip

---

## 📜 Scripts Reference

### Backend

| Script | Command | Description |
|---|---|---|
| `dev` | `nodemon server.js` | Start with hot-reload |
| `start` | `node server.js` | Start in production |
| `postinstall` | `npx prisma generate` | Auto-generate Prisma client after install |

### Frontend

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start Vite dev server on port 3000 |
| `build` | `vite build` | Production bundle |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Lint the source |
| `test` | `vitest run` | Run all unit + integration tests once |
| `test:e2e` | `npx playwright test` | Run Playwright E2E tests |

---

## 🤝 Contributing

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a **Pull Request**

### Code style

- Follow the existing ESLint config (`eslint.config.js`)
- Components use `.jsx`, hooks/services use `.js`
- All interactive elements should have `data-testid` attributes for testability
- Keep socket event names consistent with the existing scheme (`task:verb`)

### Adding new socket events

1. Add the `socket.on(...)` handler in `backend/server.js`
2. Add the corresponding `socket.emit(...)` helper in `frontend/src/hooks/useTasks.js`
3. Update the integration test in `WebSocketIntegration.test.jsx`
4. (Optional) Add a Playwright E2E scenario

---

## 📄 License

ISC © 2026 FlowForge

---

<div align="center">
  <strong>Built with ⚡ Socket.IO · ⚛️ React 19 · 🐦 Prisma · 🎭 Playwright</strong>
</div>
