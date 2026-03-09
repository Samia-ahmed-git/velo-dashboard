# Velo — Project Management SaaS Dashboard

A full-featured, production-style Project Management SaaS Dashboard built with React, Vite, Recharts, and Supabase. Designed as a portfolio-grade application showcasing modern UI/UX patterns, real authentication, data visualization, and multi-view navigation.

🔗 **Live Demo:** [velo-dashboard.vercel.app](https://velo-dashboard.vercel.app)

![Velo Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-4-646CFF?logo=vite) ![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF) ![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?logo=supabase)

---

## ✨ Features

### 🔐 Authentication (Supabase)
- Real email/password login and sign up via Supabase Auth
- Guest login — try the app instantly with one click
- Session persistence across page refreshes
- Sign out from the sidebar
- Disable email confirmation for instant access (configurable)

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
| **Supabase** | Authentication & user management |
| **Recharts** | Charts & data visualization |
| **Google Fonts** | Syne (display) + DM Mono (data) |
| **CSS-in-JS** | Component-scoped inline styles |
| **Vercel** | Deployment & hosting |

> **Roadmap:** Next.js App Router · TypeScript · Tailwind CSS · Real-time data with Supabase · Drag-and-drop Kanban

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+** (v20+ recommended)
- npm or yarn
- A [Supabase](https://supabase.com) project (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/samia-ahmed-git/velo-dashboard.git
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

## 🔑 Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Authentication → Providers → Email** and disable "Confirm email" for instant signups
3. Create the guest user: **Authentication → Users → Add user**
   - Email: `guest@velo.com`
   - Password: `guest123`
4. Replace the Supabase URL and anon key in `src/App.jsx`:

```js
const supabase = createClient(
  "[https://your-project.supabase.co](https://odmezsczxtcjjwhoygvi.supabase.co)",
  "sb_publishable_8wB5UQ-xU6M2ypYixWbIew_TEFkBGfb"
);
```

---

## 📁 Project Structure

```
velo-dashboard/
├── public/
├── src/
│   ├── App.jsx          # Main application (all views, components & auth)
│   ├── main.jsx         # React entry point
│   └── index.css        # Global reset & base styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🗺 Roadmap

- [x] Supabase authentication (login, signup, guest, signout)
- [ ] Migrate to **Next.js 14** (App Router)
- [ ] Add **TypeScript** throughout
- [ ] Persist tasks & projects to **Supabase database**
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
