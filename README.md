<div align="center">

# 🚀 FlowForge
### Real-Time Collaborative Kanban Workspace

<p align="center">

<img src="./frontend/public/favicon.svg" width="120"/>

</p>

### Build • Collaborate • Organize • Deliver

A modern, production-grade Kanban platform engineered for teams that move fast.

Built with blazing-fast frontend tooling, scalable backend architecture, real-time synchronization, cloud media management, and enterprise-ready database infrastructure.

---

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socketdotio)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![Neon](https://img.shields.io/badge/NeonDB-00E599?style=for-the-badge)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary)
![Playwright](https://img.shields.io/badge/Playwright-45BA63?style=for-the-badge&logo=playwright)
![Vitest](https://img.shields.io/badge/Vitest-729B1B?style=for-the-badge&logo=vitest)

---

### ⭐ Production Ready
### ⚡ Real-Time Sync
### 📁 Cloud Attachments
### 🔐 Secure Authentication
### 📊 Analytics Dashboard

</div>

---

# 🌍 Overview

FlowForge is a next-generation collaborative project management platform inspired by modern productivity systems.

Designed for engineering teams, startups, agencies, creators, and distributed organizations, it enables seamless task management with instant synchronization, cloud-based attachments, visual analytics, and scalable infrastructure.

Users can create, organize, assign, update, and track tasks collaboratively while every change propagates instantly across connected clients.

---

# ✨ Features


## 📌 Kanban Workspace

- Drag & Drop Tasks
- Multiple Workflow Columns
- Live Status Updates
- Smooth Animations
- Responsive Design


---

## ⚡ Real-Time Collaboration

Powered by Socket.io


Features include:


✅ Instant task creation

✅ Live task movement

✅ Simultaneous updates

✅ Multi-user synchronization

✅ Online connection indicator


---

## 🔐 Authentication System


Secure user authentication with:


- JWT Tokens
- Password Hashing
- Protected APIs
- Session Validation
- User Isolation


---

## ☁️ Media Upload System


Integrated with Cloudinary.


Capabilities:


- Upload Images
- Upload Documents
- Cloud Storage
- Optimized Delivery
- Secure URLs
- Preview Attachments


Supported:


```text
PNG
JPG
JPEG
PDF
```


---

## 🗄 Database Infrastructure


Powered by Neon PostgreSQL.


Features:


- Serverless PostgreSQL
- Automatic Scaling
- Production Grade Reliability
- Prisma ORM Integration
- Type Safe Queries
- Fast Read Operations


---

## 📈 Analytics Dashboard


Interactive visualization built using Recharts.


Metrics include:


- Task Distribution
- Progress Tracking
- Priority Insights
- Completion Rate
- Productivity Overview


---

## 🎨 Modern UI Experience


Features:

Framer Motion Animations

Responsive Layout

Accessibility Friendly

Micro Interactions


---

# 🏗 Architecture



```


                ┌──────────────────┐
                │      Client      │
                │     React 19     │
                └────────┬─────────┘
                         │
                         │
                Socket.io │ HTTP
                         │
         ┌───────────────▼──────────────┐
         │         Express API          │
         │                              │
         │      Authentication          │
         │      Task Services           │
         │      Upload Services         │
         └───────────────┬──────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼

    Neon PostgreSQL              Cloudinary

    Prisma ORM                   File Storage


```

---

# 🛠 Tech Stack


| Layer | Technologies |
|-------|--------------|
| Frontend | React 19 |
| Bundler | Vite |
| Routing | React Router |
| State | Hooks |
| Drag Drop | Hello Pangea DnD |
| Realtime | Socket.io |
| Backend | Node.js |
| Framework | Express.js |
| ORM | Prisma |
| Database | Neon PostgreSQL |
| Media | Cloudinary |
| Authentication | JWT |
| Encryption | Bcrypt |
| Charts | Recharts |
| Animation | Framer Motion |
| Unit Testing | Vitest |
| E2E Testing | Playwright |


---

# 📂 Project Structure



```bash

FlowForge
│
├── frontend
│   │
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── services
│   │   ├── utils
│   │   └── tests
│
├── backend
│   │
│   ├── prisma
│   ├── routes
│   ├── socket
│   ├── utils
│   └── server.js
│
└── README.md


```



---

# 🚀 Installation


## Clone Repository


```bash
git clone https://github.com/dhairyadesai26/FlowForge.git

cd FlowForge
```



---

## Backend Setup


```bash

cd backend


npm install


```



Create:


```env
.env
```



```env

DATABASE_URL=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_UPLOAD_PRESET_NAME=


```



Generate Prisma


```bash

npx prisma generate


npx prisma db push


```



Run backend


```bash


npm run dev


```


---

## Frontend Setup
Create:


```env
.env
```

```env
VITE_API_URL=

VITE_SOCKET_URL=



```



```bash


cd frontend


npm install



npm run dev



```


---

# 🧪 Testing


### Unit Tests


```bash

npm run test


```



### E2E


```bash


npm run test:e2e


```



---

# 🔥 Performance Goals


| Metric | Target |
|--------|--------|
| First Load | <2s |
| Socket Latency | <100ms |
| API Response | <300ms |
| Upload Speed | Optimized |
| Lighthouse Score | 95+ |


---

# 🔮 Future Roadmap


### AI Features


Task Suggestions


AI Prioritization


Sprint Planning


Smart Labels


AI Assistant



---

### Enterprise


RBAC


Audit Logs


Notifications


Teams


Comments


Activity Timeline


Calendar


Integrations



---

# 🤝 Contributing


Fork repository


Create branch


```bash
git checkout -b feature/amazing-feature
```


Commit


```bash
git commit -m "Added amazing feature"
```



Push


```bash
git push origin feature/amazing-feature
```



Open Pull Request



---

# 📜 License


MIT License


---

<div align="center">


# ⭐ FlowForge

### Turning Ideas Into Organized Execution


*"Build Faster. Collaborate Better. Deliver Smarter."*


Made with ❤️ using React, Socket.io, Prisma, Neon & Cloudinary


</div>
