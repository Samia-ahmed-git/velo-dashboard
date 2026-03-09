# Velo — Project Management SaaS Dashboard

A full-featured, production-style Project Management SaaS Dashboard built with React, Vite, and Recharts. Designed as a portfolio-grade application showcasing modern UI/UX patterns, data visualization, and multi-view navigation.

https://velo-dashboard.vercel.app/

![Velo Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-4-646CFF?logo=vite) ![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF)

---

## ✨ Features

### 🔐 Authentication
- Login & Sign Up screens with form validation UI
- Workspace-based onboarding flow

### 📊 Overview Dashboard
- Sprint velocity area chart (completed vs planned)
- Task distribution donut chart
- Sprint burndown chart
- Active projects table with progress bars, team avatars, status & priority badges
- Team activity feed with online/offline presence
- Key metric stat cards with sprint-over-sprint delta indicators

### ⊞ Kanban Board
- 5-column board: Backlog → To Do → In Progress → Review → Done
- Task cards with assignee avatars, tags, and priority badges
- Add new task modal with instant Backlog insertion
- Hover animations and column color theming

### ◑ Projects
- Project cards with progress bars, team stacks, due dates
- Status and priority indicators

### ▦ Analytics
- 8-week velocity bar chart
- Task distribution pie chart with labels
- Sprint metrics: Avg Cycle Time, Throughput, Bug Rate

### ◎ Team
- Member cards with online/offline status
- Task count per member
- Role management (Admin / Editor / Viewer)
- Invite flow UI

### ⊕ Settings
- Profile and workspace settings forms
- User roles panel with permission descriptions

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite 4** | Build tool & dev server |
| **Recharts** | Charts & data visualization |
| **Google Fonts** | Syne (display) + DM Mono (data) |
| CSS-in-JS (inline styles) | Component-scoped styling |

> **Planned / Extension-ready:** Next.js, TypeScript, Tailwind CSS, Supabase auth & database, React Query for data fetching

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+** (v20+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/velo-dashboard.git
cd velo-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
velo-dashboard/
├── public/
├── src/
│   ├── App.jsx          # Main application (all views & components)
│   ├── main.jsx         # React entry point
│   └── index.css        # Global reset & base styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🗺 Roadmap

- [ ] Migrate to **Next.js 14** (App Router)
- [ ] Add **TypeScript** throughout
- [ ] Integrate **Supabase** for auth & real-time data
- [ ] Add **Tailwind CSS** for utility-first styling
- [ ] Drag-and-drop Kanban with **@dnd-kit**
- [ ] Real-time collaboration presence indicators
- [ ] AI task suggestions via **OpenAI API**
- [ ] Dark/light theme toggle
- [ ] Mobile responsive layout
- [ ] Unit tests with **Vitest** + React Testing Library

---

## 📸 Screenshots

| Overview | Kanban | Analytics |
|---|---|---|
| Sprint velocity, burndown, projects table | 5-column board with task cards | Bar charts, pie charts, metrics |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)

---

> Built with ❤️ as a portfolio project. Designed to demonstrate full-stack SaaS UI patterns.
