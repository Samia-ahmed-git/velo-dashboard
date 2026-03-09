import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const velocityData = [
  { week: "W1", completed: 12, planned: 15 },
  { week: "W2", completed: 18, planned: 20 },
  { week: "W3", completed: 9,  planned: 18 },
  { week: "W4", completed: 22, planned: 22 },
  { week: "W5", completed: 16, planned: 17 },
  { week: "W6", completed: 25, planned: 24 },
  { week: "W7", completed: 19, planned: 21 },
  { week: "W8", completed: 28, planned: 26 },
];
const burndownData = [
  { day: "Mon", remaining: 80 }, { day: "Tue", remaining: 68 },
  { day: "Wed", remaining: 55 }, { day: "Thu", remaining: 47 },
  { day: "Fri", remaining: 38 }, { day: "Sat", remaining: 30 },
  { day: "Sun", remaining: 22 },
];
const pieData = [
  { name: "Done", value: 42, color: "#A3E635" },
  { name: "In Progress", value: 28, color: "#38BDF8" },
  { name: "Blocked", value: 8,  color: "#F87171" },
  { name: "Todo", value: 22, color: "#94A3B8" },
];
const projects = [
  { id: 1, name: "Horizon UI Redesign", progress: 72, status: "active", due: "Mar 20", team: ["AL","BK","CS"], priority: "high" },
  { id: 2, name: "API Gateway v3",      progress: 44, status: "active", due: "Apr 2",  team: ["DM","EF"],     priority: "medium" },
  { id: 3, name: "Mobile App Beta",     progress: 91, status: "review", due: "Mar 15", team: ["GH","IJ","KL","MN"], priority: "high" },
  { id: 4, name: "Data Pipeline",       progress: 18, status: "blocked",due: "Apr 18", team: ["OP"],          priority: "low" },
];
const columns = {
  backlog:     { label: "Backlog",     color: "#94A3B8", tasks: [
    { id: 1, title: "Design token audit",         assignee: "AL", tag: "Design", priority: "low" },
    { id: 2, title: "Auth flow diagrams",          assignee: "BK", tag: "UX",     priority: "medium" },
  ]},
  todo:        { label: "To Do",       color: "#38BDF8", tasks: [
    { id: 3, title: "Implement OAuth 2.0",         assignee: "CS", tag: "Eng",    priority: "high" },
    { id: 4, title: "Write API docs",              assignee: "DM", tag: "Docs",   priority: "medium" },
    { id: 5, title: "Performance benchmarks",      assignee: "EF", tag: "QA",     priority: "low" },
  ]},
  inprogress:  { label: "In Progress", color: "#FBBF24", tasks: [
    { id: 6, title: "Dashboard analytics module",  assignee: "GH", tag: "Eng",    priority: "high" },
    { id: 7, title: "Dark mode toggle",            assignee: "IJ", tag: "Design", priority: "medium" },
  ]},
  review:      { label: "Review",      color: "#A78BFA", tasks: [
    { id: 8, title: "Push notification service",   assignee: "KL", tag: "Eng",    priority: "high" },
  ]},
  done:        { label: "Done",        color: "#A3E635", tasks: [
    { id: 9,  title: "Database schema v2",         assignee: "MN", tag: "Eng",    priority: "medium" },
    { id: 10, title: "CI/CD pipeline setup",       assignee: "OP", tag: "DevOps", priority: "high" },
  ]},
};
const teamMembers = [
  { name: "Alex L.",   role: "Lead Dev",    tasks: 8,  avatar: "AL", online: true  },
  { name: "Blake K.",  role: "Designer",    tasks: 5,  avatar: "BK", online: true  },
  { name: "Casey S.",  role: "Backend Eng", tasks: 11, avatar: "CS", online: false },
  { name: "Dana M.",   role: "QA Engineer", tasks: 4,  avatar: "DM", online: true  },
  { name: "Evan F.",   role: "DevOps",      tasks: 7,  avatar: "EF", online: false },
];
const notifications = [
  { text: "Mobile App Beta moved to Review", time: "2m ago",  type: "move" },
  { text: "Alex L. commented on #6",          time: "14m ago", type: "comment" },
  { text: "Data Pipeline is blocked",         time: "1h ago",  type: "block" },
  { text: "Sprint 8 planning meeting in 30m", time: "27m ago", type: "meeting" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const Avatar = ({ initials, size = 28, online, color }) => {
  const colors = { AL:"#38BDF8",BK:"#A78BFA",CS:"#F472B6",DM:"#FBBF24",EF:"#34D399",GH:"#F87171",IJ:"#60A5FA",KL:"#A3E635",MN:"#FB923C",OP:"#E879F9" };
  const bg = color || colors[initials] || "#64748B";
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", width:size, height:size, borderRadius:"50%", background:bg, fontSize:size*0.35, fontWeight:700, color:"#0F172A", fontFamily:"'DM Mono', monospace", flexShrink:0, border:"2px solid #1E293B" }}>
      {initials}
      {online !== undefined && (
        <span style={{ position:"absolute", bottom:0, right:0, width:size*0.28, height:size*0.28, borderRadius:"50%", background: online ? "#A3E635" : "#475569", border:"2px solid #0F172A" }} />
      )}
    </div>
  );
};

const StatCard = ({ label, value, delta, color, icon }) => (
  <div style={{ background:"#1E293B", borderRadius:16, padding:"20px 24px", border:"1px solid #334155", display:"flex", flexDirection:"column", gap:8, position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:-20, right:-10, fontSize:80, opacity:0.05, lineHeight:1 }}>{icon}</div>
    <span style={{ fontSize:12, color:"#64748B", fontFamily:"'DM Mono', monospace", letterSpacing:"0.1em", textTransform:"uppercase" }}>{label}</span>
    <span style={{ fontSize:32, fontWeight:800, color:"#F8FAFC", fontFamily:"'Syne', sans-serif", lineHeight:1 }}>{value}</span>
    <span style={{ fontSize:12, color: delta > 0 ? "#A3E635" : "#F87171", fontFamily:"'DM Mono', monospace" }}>
      {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}% vs last sprint
    </span>
    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${color}, transparent)` }} />
  </div>
);

const PriorityBadge = ({ p }) => {
  const map = { high: ["#F87171","#450A0A"], medium: ["#FBBF24","#431A00"], low: ["#94A3B8","#1E293B"] };
  const [fg, bg] = map[p] || map.low;
  return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:99, background:bg, color:fg, fontFamily:"'DM Mono', monospace", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{p}</span>;
};

const KanbanCard = ({ task, colColor }) => (
  <div style={{ background:"#0F172A", border:"1px solid #334155", borderRadius:10, padding:"12px 14px", display:"flex", flexDirection:"column", gap:8, cursor:"grab", transition:"transform 0.15s, border-color 0.15s" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = colColor; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.transform = "none"; }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
      <span style={{ fontSize:13, color:"#E2E8F0", fontFamily:"'Syne', sans-serif", lineHeight:1.4 }}>{task.title}</span>
      <PriorityBadge p={task.priority} />
    </div>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontSize:11, padding:"2px 8px", borderRadius:6, background:"#1E293B", color:"#94A3B8", fontFamily:"'DM Mono', monospace" }}>{task.tag}</span>
      <Avatar initials={task.assignee} size={22} />
    </div>
  </div>
);

// ─── Auth Screen ──────────────────────────────────────────────────────────────
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [name,  setName]  = useState("");

  return (
    <div style={{ minHeight:"100vh", background:"#0A0F1E", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne', sans-serif", position:"relative", overflow:"hidden" }}>
      {/* Background grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)", backgroundSize:"40px 40px" }} />
      {/* Glow blobs */}
      <div style={{ position:"absolute", top:"10%", left:"20%", width:400, height:400, background:"radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"15%", right:"15%", width:500, height:500, background:"radial-gradient(circle, rgba(163,230,53,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ position:"relative", width:420, background:"rgba(30,41,59,0.9)", borderRadius:20, border:"1px solid #334155", padding:"48px 40px", backdropFilter:"blur(20px)", boxShadow:"0 25px 80px rgba(0,0,0,0.5)" }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:36 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg, #38BDF8, #A3E635)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#0F172A" }}>◈</div>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"#F8FAFC", letterSpacing:"-0.02em" }}>Velo</div>
            <div style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace", marginTop:-2 }}>Project Intelligence</div>
          </div>
        </div>

        <h2 style={{ fontSize:26, fontWeight:800, color:"#F8FAFC", margin:"0 0 6px", letterSpacing:"-0.02em" }}>
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p style={{ fontSize:14, color:"#64748B", margin:"0 0 28px", fontFamily:"'DM Mono', monospace" }}>
          {isLogin ? "Sign in to your workspace" : "Start managing your projects"}
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize:11, color:"#94A3B8", fontFamily:"'DM Mono', monospace", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.1em" }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={{ width:"100%", background:"#0F172A", border:"1px solid #334155", borderRadius:10, padding:"10px 14px", color:"#F8FAFC", fontSize:14, fontFamily:"'DM Mono', monospace", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor="#38BDF8"} onBlur={e => e.target.style.borderColor="#334155"} />
            </div>
          )}
          <div>
            <label style={{ fontSize:11, color:"#94A3B8", fontFamily:"'DM Mono', monospace", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.1em" }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" type="email" style={{ width:"100%", background:"#0F172A", border:"1px solid #334155", borderRadius:10, padding:"10px 14px", color:"#F8FAFC", fontSize:14, fontFamily:"'DM Mono', monospace", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor="#38BDF8"} onBlur={e => e.target.style.borderColor="#334155"} />
          </div>
          <div>
            <label style={{ fontSize:11, color:"#94A3B8", fontFamily:"'DM Mono', monospace", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.1em" }}>Password</label>
            <input value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" type="password" style={{ width:"100%", background:"#0F172A", border:"1px solid #334155", borderRadius:10, padding:"10px 14px", color:"#F8FAFC", fontSize:14, fontFamily:"'DM Mono', monospace", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor="#38BDF8"} onBlur={e => e.target.style.borderColor="#334155"} />
          </div>
          <button onClick={onLogin} style={{ marginTop:6, background:"linear-gradient(135deg, #38BDF8, #0EA5E9)", border:"none", borderRadius:10, padding:"12px", color:"#0F172A", fontSize:14, fontWeight:800, fontFamily:"'Syne', sans-serif", cursor:"pointer", letterSpacing:"0.02em", transition:"opacity 0.2s, transform 0.1s" }}
            onMouseEnter={e => e.target.style.opacity="0.9"} onMouseLeave={e => e.target.style.opacity="1"}>
            {isLogin ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <div style={{ marginTop:24, textAlign:"center", fontSize:13, color:"#64748B", fontFamily:"'DM Mono', monospace" }}>
          {isLogin ? "No account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color:"#38BDF8", cursor:"pointer" }}>
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [kanbanCols, setKanbanCols] = useState(columns);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");

  if (!authed) return <AuthScreen onLogin={() => setAuthed(true)} />;

  const navItems = [
    { id:"dashboard", icon:"◈", label:"Overview" },
    { id:"kanban",    icon:"⊞", label:"Kanban Board" },
    { id:"projects",  icon:"◑", label:"Projects" },
    { id:"analytics", icon:"▦", label:"Analytics" },
    { id:"team",      icon:"◎", label:"Team" },
    { id:"settings",  icon:"⊕", label:"Settings" },
  ];

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = { id: Date.now(), title: newTaskTitle, assignee: "AL", tag: "New", priority: "medium" };
    setKanbanCols(prev => ({ ...prev, backlog: { ...prev.backlog, tasks: [...prev.backlog.tasks, newTask] } }));
    setNewTaskTitle("");
    setNewTaskModal(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0F1E; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        .nav-item { transition: all 0.15s; cursor: pointer; }
        .nav-item:hover { background: rgba(56,189,248,0.08) !important; color: #38BDF8 !important; }
        .card-hover { transition: border-color 0.2s, transform 0.15s; }
        .card-hover:hover { border-color: #38BDF8 !important; transform: translateY(-1px); }
      `}</style>

      <div style={{ display:"flex", height:"100vh", background:"#0A0F1E", fontFamily:"'Syne', sans-serif", color:"#F8FAFC", overflow:"hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: sidebarOpen ? 220 : 64, background:"#0F172A", borderRight:"1px solid #1E293B", display:"flex", flexDirection:"column", transition:"width 0.25s", overflow:"hidden", flexShrink:0 }}>
          {/* Logo */}
          <div style={{ padding:"20px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid #1E293B", minHeight:64 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg, #38BDF8, #A3E635)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#0F172A", flexShrink:0 }}>◈</div>
            {sidebarOpen && <span style={{ fontSize:17, fontWeight:800, letterSpacing:"-0.02em", whiteSpace:"nowrap" }}>Velo</span>}
          </div>

          {/* Nav */}
          <nav style={{ flex:1, padding:"16px 8px", display:"flex", flexDirection:"column", gap:4 }}>
            {navItems.map(n => (
              <div key={n.id} className="nav-item" onClick={() => setView(n.id)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 10px", borderRadius:10, color: view===n.id ? "#38BDF8" : "#64748B", background: view===n.id ? "rgba(56,189,248,0.1)" : "transparent", borderLeft: view===n.id ? "2px solid #38BDF8" : "2px solid transparent" }}>
                <span style={{ fontSize:16, width:20, textAlign:"center", flexShrink:0 }}>{n.icon}</span>
                {sidebarOpen && <span style={{ fontSize:13, fontWeight:600, whiteSpace:"nowrap" }}>{n.label}</span>}
              </div>
            ))}
          </nav>

          {/* User */}
          <div style={{ padding:"16px 12px", borderTop:"1px solid #1E293B", display:"flex", alignItems:"center", gap:10 }}>
            <Avatar initials="AL" size={32} online={true} />
            {sidebarOpen && (
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#E2E8F0", truncate:true }}>Alex L.</div>
                <div style={{ fontSize:10, color:"#64748B", fontFamily:"'DM Mono', monospace" }}>{selectedRole}</div>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Top bar */}
          <header style={{ height:64, background:"#0F172A", borderBottom:"1px solid #1E293B", display:"flex", alignItems:"center", padding:"0 24px", gap:16, flexShrink:0 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background:"none", border:"none", color:"#64748B", fontSize:18, cursor:"pointer", padding:4 }}>☰</button>
            <div style={{ flex:1 }} />

            {/* Search */}
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"#1E293B", border:"1px solid #334155", borderRadius:10, padding:"6px 14px", width:220 }}>
              <span style={{ color:"#475569", fontSize:13 }}>⌕</span>
              <input placeholder="Search…" style={{ background:"none", border:"none", outline:"none", color:"#94A3B8", fontSize:13, fontFamily:"'DM Mono', monospace", width:"100%" }} />
            </div>

            {/* Notif */}
            <div style={{ position:"relative" }}>
              <button onClick={() => setNotifOpen(!notifOpen)} style={{ background:"#1E293B", border:"1px solid #334155", borderRadius:10, width:38, height:38, cursor:"pointer", color:"#94A3B8", fontSize:15, position:"relative" }}>
                🔔
                <span style={{ position:"absolute", top:6, right:6, width:8, height:8, borderRadius:"50%", background:"#F87171", border:"2px solid #0F172A" }} />
              </button>
              {notifOpen && (
                <div style={{ position:"absolute", top:46, right:0, width:300, background:"#1E293B", border:"1px solid #334155", borderRadius:14, boxShadow:"0 20px 50px rgba(0,0,0,0.5)", zIndex:100, overflow:"hidden" }}>
                  <div style={{ padding:"14px 16px", borderBottom:"1px solid #334155", fontSize:13, fontWeight:700, color:"#F8FAFC" }}>Notifications</div>
                  {notifications.map((n,i) => (
                    <div key={i} style={{ padding:"12px 16px", borderBottom:"1px solid #1E293B", display:"flex", gap:12, alignItems:"flex-start", cursor:"pointer", transition:"background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background="#0F172A"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <span style={{ fontSize:16 }}>{n.type==="block"?"🔴":n.type==="comment"?"💬":n.type==="meeting"?"📅":"🔀"}</span>
                      <div>
                        <div style={{ fontSize:12, color:"#E2E8F0", fontFamily:"'DM Mono', monospace", lineHeight:1.4 }}>{n.text}</div>
                        <div style={{ fontSize:11, color:"#475569", fontFamily:"'DM Mono', monospace", marginTop:3 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Avatar initials="AL" size={36} online={true} />
          </header>

          {/* Content */}
          <main style={{ flex:1, overflow:"auto", padding:28 }}>

            {/* ── DASHBOARD ── */}
            {view === "dashboard" && (
              <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:"-0.02em", color:"#F8FAFC" }}>Good morning, Alex 👋</h1>
                    <p style={{ fontSize:13, color:"#64748B", fontFamily:"'DM Mono', monospace", marginTop:4 }}>Sprint 8 · Mar 9 – Mar 22, 2026</p>
                  </div>
                  <button onClick={() => setView("kanban")} style={{ background:"linear-gradient(135deg, #38BDF8, #0EA5E9)", border:"none", borderRadius:10, padding:"10px 20px", color:"#0F172A", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Syne', sans-serif" }}>
                    + New Task
                  </button>
                </div>

                {/* Stat cards */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }}>
                  <StatCard label="Tasks Completed" value="42" delta={18} color="#A3E635" icon="✓" />
                  <StatCard label="In Progress" value="28" delta={-4} color="#38BDF8" icon="⟳" />
                  <StatCard label="Team Velocity" value="25.3" delta={12} color="#A78BFA" icon="⚡" />
                  <StatCard label="Blocked" value="8" delta={-22} color="#F87171" icon="✕" />
                </div>

                {/* Charts row */}
                <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
                  {/* Velocity chart */}
                  <div style={{ background:"#1E293B", borderRadius:16, padding:24, border:"1px solid #334155" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Sprint Velocity</div>
                        <div style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace", marginTop:2 }}>Completed vs Planned</div>
                      </div>
                      <div style={{ display:"flex", gap:16, fontSize:11, fontFamily:"'DM Mono', monospace", color:"#64748B" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:"#38BDF8", display:"inline-block" }} />Completed</span>
                        <span style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:"#334155", display:"inline-block" }} />Planned</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={velocityData}>
                        <defs>
                          <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="week" tick={{ fill:"#64748B", fontSize:11, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill:"#64748B", fontSize:11, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #334155", borderRadius:8, fontFamily:"DM Mono", fontSize:12 }} />
                        <Area type="monotone" dataKey="planned" stroke="#334155" fill="none" strokeDasharray="4 4" />
                        <Area type="monotone" dataKey="completed" stroke="#38BDF8" fill="url(#gc)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie */}
                  <div style={{ background:"#1E293B", borderRadius:16, padding:24, border:"1px solid #334155" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:6 }}>Task Distribution</div>
                    <div style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace", marginBottom:16 }}>Total: 100 tasks</div>
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #334155", borderRadius:8, fontFamily:"DM Mono", fontSize:12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
                      {pieData.map(d => (
                        <div key={d.name} style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"space-between" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ width:8, height:8, borderRadius:2, background:d.color, flexShrink:0 }} />
                            <span style={{ fontSize:11, color:"#94A3B8", fontFamily:"'DM Mono', monospace" }}>{d.name}</span>
                          </div>
                          <span style={{ fontSize:11, color:"#F8FAFC", fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projects table */}
                <div style={{ background:"#1E293B", borderRadius:16, border:"1px solid #334155", overflow:"hidden" }}>
                  <div style={{ padding:"20px 24px", borderBottom:"1px solid #334155", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Active Projects</span>
                    <span onClick={() => setView("projects")} style={{ fontSize:12, color:"#38BDF8", cursor:"pointer", fontFamily:"'DM Mono', monospace" }}>View all →</span>
                  </div>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ borderBottom:"1px solid #334155" }}>
                        {["Project","Progress","Team","Due","Status","Priority"].map(h => (
                          <th key={h} style={{ padding:"10px 24px", textAlign:"left", fontSize:11, color:"#475569", fontFamily:"'DM Mono', monospace", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id} style={{ borderBottom:"1px solid #1E293B", cursor:"pointer", transition:"background 0.1s" }}
                          onMouseEnter={e => e.currentTarget.style.background="#0F172A"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                          <td style={{ padding:"14px 24px", fontSize:13, fontWeight:600, color:"#E2E8F0" }}>{p.name}</td>
                          <td style={{ padding:"14px 24px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div style={{ flex:1, height:4, background:"#0F172A", borderRadius:2, overflow:"hidden" }}>
                                <div style={{ height:"100%", width:`${p.progress}%`, background: p.progress>80?"#A3E635":p.progress>50?"#38BDF8":"#FBBF24", borderRadius:2, transition:"width 0.3s" }} />
                              </div>
                              <span style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace", width:32, textAlign:"right" }}>{p.progress}%</span>
                            </div>
                          </td>
                          <td style={{ padding:"14px 24px" }}>
                            <div style={{ display:"flex", gap:-4 }}>
                              {p.team.map((t,i) => <div key={i} style={{ marginLeft: i>0?-6:0, position:"relative", zIndex:p.team.length-i }}><Avatar initials={t} size={26} /></div>)}
                            </div>
                          </td>
                          <td style={{ padding:"14px 24px", fontSize:12, color:"#64748B", fontFamily:"'DM Mono', monospace" }}>{p.due}</td>
                          <td style={{ padding:"14px 24px" }}>
                            <span style={{ fontSize:11, padding:"3px 10px", borderRadius:99, fontFamily:"'DM Mono', monospace", fontWeight:600,
                              background: p.status==="active"?"rgba(56,189,248,0.12)":p.status==="review"?"rgba(167,139,250,0.12)":"rgba(248,113,113,0.12)",
                              color: p.status==="active"?"#38BDF8":p.status==="review"?"#A78BFA":"#F87171" }}>
                              {p.status}
                            </span>
                          </td>
                          <td style={{ padding:"14px 24px" }}><PriorityBadge p={p.priority} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Burndown + Team */}
                <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:16 }}>
                  <div style={{ background:"#1E293B", borderRadius:16, padding:24, border:"1px solid #334155" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:4 }}>Sprint Burndown</div>
                    <div style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace", marginBottom:16 }}>Remaining story points this week</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={burndownData}>
                        <defs>
                          <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#A3E635" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#A3E635" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="day" tick={{ fill:"#64748B", fontSize:11, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill:"#64748B", fontSize:11, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #334155", borderRadius:8, fontFamily:"DM Mono", fontSize:12 }} />
                        <Area type="monotone" dataKey="remaining" stroke="#A3E635" fill="url(#gb)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ background:"#1E293B", borderRadius:16, padding:24, border:"1px solid #334155" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Team Activity</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      {teamMembers.map(m => (
                        <div key={m.name} style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <Avatar initials={m.avatar} size={36} online={m.online} />
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:700, color:"#E2E8F0" }}>{m.name}</div>
                            <div style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace" }}>{m.role}</div>
                          </div>
                          <span style={{ fontSize:11, background:"#0F172A", borderRadius:6, padding:"3px 8px", color:"#94A3B8", fontFamily:"'DM Mono', monospace" }}>{m.tasks} tasks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── KANBAN ── */}
            {view === "kanban" && (
              <div style={{ display:"flex", flexDirection:"column", gap:20, height:"100%" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <h1 style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.02em" }}>Kanban Board</h1>
                    <p style={{ fontSize:12, color:"#64748B", fontFamily:"'DM Mono', monospace", marginTop:3 }}>Sprint 8 · Horizon UI Redesign</p>
                  </div>
                  <button onClick={() => setNewTaskModal(true)} style={{ background:"linear-gradient(135deg, #38BDF8, #0EA5E9)", border:"none", borderRadius:10, padding:"10px 20px", color:"#0F172A", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Syne', sans-serif" }}>
                    + Add Task
                  </button>
                </div>

                {/* Board */}
                <div style={{ display:"flex", gap:14, overflowX:"auto", paddingBottom:12 }}>
                  {Object.entries(kanbanCols).map(([colId, col]) => (
                    <div key={colId} style={{ minWidth:240, maxWidth:260, display:"flex", flexDirection:"column", gap:10 }}>
                      {/* Column header */}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", background:"#1E293B", borderRadius:10, border:`1px solid ${col.color}22` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ width:8, height:8, borderRadius:"50%", background:col.color, flexShrink:0 }} />
                          <span style={{ fontSize:12, fontWeight:700, color:"#E2E8F0" }}>{col.label}</span>
                        </div>
                        <span style={{ fontSize:11, background:"#0F172A", borderRadius:6, padding:"2px 8px", color:"#64748B", fontFamily:"'DM Mono', monospace" }}>{col.tasks.length}</span>
                      </div>
                      {/* Cards */}
                      <div style={{ display:"flex", flexDirection:"column", gap:8, minHeight:80 }}>
                        {col.tasks.map(t => <KanbanCard key={t.id} task={t} colColor={col.color} />)}
                      </div>
                      {/* Add card */}
                      <button onClick={() => setNewTaskModal(true)} style={{ background:"none", border:"1px dashed #334155", borderRadius:10, padding:"8px", color:"#475569", fontSize:12, cursor:"pointer", fontFamily:"'DM Mono', monospace", transition:"border-color 0.2s, color 0.2s" }}
                        onMouseEnter={e => { e.target.style.borderColor=col.color; e.target.style.color=col.color; }} onMouseLeave={e => { e.target.style.borderColor="#334155"; e.target.style.color="#475569"; }}>
                        + Add card
                      </button>
                    </div>
                  ))}
                </div>

                {/* Modal */}
                {newTaskModal && (
                  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }} onClick={() => setNewTaskModal(false)}>
                    <div style={{ background:"#1E293B", borderRadius:16, padding:28, width:380, border:"1px solid #334155" }} onClick={e => e.stopPropagation()}>
                      <div style={{ fontSize:16, fontWeight:800, marginBottom:20 }}>New Task</div>
                      <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Task title…" style={{ width:"100%", background:"#0F172A", border:"1px solid #334155", borderRadius:10, padding:"10px 14px", color:"#F8FAFC", fontSize:14, fontFamily:"'DM Mono', monospace", outline:"none", boxSizing:"border-box", marginBottom:16 }}
                        onFocus={e => e.target.style.borderColor="#38BDF8"} onBlur={e => e.target.style.borderColor="#334155"} autoFocus />
                      <div style={{ display:"flex", gap:10 }}>
                        <button onClick={() => setNewTaskModal(false)} style={{ flex:1, background:"#0F172A", border:"1px solid #334155", borderRadius:10, padding:"10px", color:"#94A3B8", cursor:"pointer", fontSize:13, fontFamily:"'Syne', sans-serif" }}>Cancel</button>
                        <button onClick={addTask} style={{ flex:1, background:"linear-gradient(135deg, #38BDF8, #0EA5E9)", border:"none", borderRadius:10, padding:"10px", color:"#0F172A", fontWeight:800, cursor:"pointer", fontSize:13, fontFamily:"'Syne', sans-serif" }}>Create</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── PROJECTS ── */}
            {view === "projects" && (
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <h1 style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.02em" }}>Projects</h1>
                  <button style={{ background:"linear-gradient(135deg, #38BDF8, #0EA5E9)", border:"none", borderRadius:10, padding:"10px 20px", color:"#0F172A", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Syne', sans-serif" }}>+ New Project</button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
                  {projects.map(p => (
                    <div key={p.id} className="card-hover" style={{ background:"#1E293B", borderRadius:16, padding:24, border:"1px solid #334155" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                        <div>
                          <div style={{ fontSize:15, fontWeight:800, color:"#F8FAFC", marginBottom:4 }}>{p.name}</div>
                          <PriorityBadge p={p.priority} />
                        </div>
                        <span style={{ fontSize:11, padding:"4px 12px", borderRadius:99, fontFamily:"'DM Mono', monospace", fontWeight:600,
                          background: p.status==="active"?"rgba(56,189,248,0.12)":p.status==="review"?"rgba(167,139,250,0.12)":"rgba(248,113,113,0.12)",
                          color: p.status==="active"?"#38BDF8":p.status==="review"?"#A78BFA":"#F87171" }}>{p.status}</span>
                      </div>
                      <div style={{ marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <span style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace" }}>Progress</span>
                          <span style={{ fontSize:11, color:"#F8FAFC", fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{p.progress}%</span>
                        </div>
                        <div style={{ height:6, background:"#0F172A", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${p.progress}%`, background: p.progress>80?"#A3E635":p.progress>50?"#38BDF8":"#FBBF24", borderRadius:3 }} />
                        </div>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ display:"flex" }}>
                          {p.team.map((t,i) => <div key={i} style={{ marginLeft: i>0?-6:0, zIndex:p.team.length-i, position:"relative" }}><Avatar initials={t} size={28} /></div>)}
                        </div>
                        <span style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace" }}>Due {p.due}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ANALYTICS ── */}
            {view === "analytics" && (
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <h1 style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.02em" }}>Analytics</h1>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
                  <StatCard label="Total Tasks" value="100" delta={15} color="#38BDF8" icon="◎" />
                  <StatCard label="Avg Cycle Time" value="3.2d" delta={-8} color="#A3E635" icon="⏱" />
                  <StatCard label="Throughput" value="25/wk" delta={12} color="#A78BFA" icon="⚡" />
                  <StatCard label="Bug Rate" value="4.2%" delta={-18} color="#F87171" icon="🐞" />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <div style={{ background:"#1E293B", borderRadius:16, padding:24, border:"1px solid #334155" }}>
                    <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>8-Week Velocity</div>
                    <div style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace", marginBottom:16 }}>Story points per sprint</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={velocityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="week" tick={{ fill:"#64748B", fontSize:11, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill:"#64748B", fontSize:11, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #334155", borderRadius:8, fontFamily:"DM Mono", fontSize:12 }} />
                        <Bar dataKey="planned" fill="#334155" radius={[4,4,0,0]} />
                        <Bar dataKey="completed" fill="#38BDF8" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ background:"#1E293B", borderRadius:16, padding:24, border:"1px solid #334155" }}>
                    <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>Task Distribution</div>
                    <div style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace", marginBottom:16 }}>By status</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke:"#334155" }}>
                          {pieData.map((entry,i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                        </Pie>
                        <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #334155", borderRadius:8, fontFamily:"DM Mono", fontSize:12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* ── TEAM ── */}
            {view === "team" && (
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <h1 style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.02em" }}>Team</h1>
                  <div style={{ display:"flex", gap:10 }}>
                    <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} style={{ background:"#1E293B", border:"1px solid #334155", borderRadius:10, padding:"8px 14px", color:"#94A3B8", fontSize:12, fontFamily:"'DM Mono', monospace", cursor:"pointer", outline:"none" }}>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button style={{ background:"linear-gradient(135deg, #38BDF8, #0EA5E9)", border:"none", borderRadius:10, padding:"8px 18px", color:"#0F172A", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Syne', sans-serif" }}>+ Invite</button>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                  {teamMembers.map(m => (
                    <div key={m.name} className="card-hover" style={{ background:"#1E293B", borderRadius:16, padding:24, border:"1px solid #334155", display:"flex", flexDirection:"column", alignItems:"center", gap:12, textAlign:"center" }}>
                      <Avatar initials={m.avatar} size={52} online={m.online} />
                      <div>
                        <div style={{ fontSize:15, fontWeight:800, color:"#F8FAFC" }}>{m.name}</div>
                        <div style={{ fontSize:12, color:"#64748B", fontFamily:"'DM Mono', monospace", marginTop:3 }}>{m.role}</div>
                      </div>
                      <div style={{ display:"flex", gap:12, width:"100%" }}>
                        <div style={{ flex:1, background:"#0F172A", borderRadius:10, padding:"10px", textAlign:"center" }}>
                          <div style={{ fontSize:18, fontWeight:800, color:"#38BDF8" }}>{m.tasks}</div>
                          <div style={{ fontSize:10, color:"#475569", fontFamily:"'DM Mono', monospace", marginTop:2 }}>Tasks</div>
                        </div>
                        <div style={{ flex:1, background:"#0F172A", borderRadius:10, padding:"10px", textAlign:"center" }}>
                          <div style={{ fontSize:18, fontWeight:800, color: m.online?"#A3E635":"#475569" }}>{m.online?"Online":"Offline"}</div>
                          <div style={{ fontSize:10, color:"#475569", fontFamily:"'DM Mono', monospace", marginTop:2 }}>Status</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {view === "settings" && (
              <div style={{ display:"flex", flexDirection:"column", gap:20, maxWidth:560 }}>
                <h1 style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.02em" }}>Settings</h1>
                {[
                  { label:"Profile", fields:[{name:"Full Name",val:"Alex Lee"},{name:"Email",val:"alex@company.com"}] },
                  { label:"Workspace", fields:[{name:"Workspace Name",val:"Velo Workspace"},{name:"Timezone",val:"UTC-5 Eastern"}] },
                ].map(section => (
                  <div key={section.label} style={{ background:"#1E293B", borderRadius:16, border:"1px solid #334155", overflow:"hidden" }}>
                    <div style={{ padding:"16px 24px", borderBottom:"1px solid #334155", fontSize:14, fontWeight:700, color:"#F8FAFC" }}>{section.label}</div>
                    <div style={{ padding:24, display:"flex", flexDirection:"column", gap:14 }}>
                      {section.fields.map(f => (
                        <div key={f.name}>
                          <label style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{f.name}</label>
                          <input defaultValue={f.val} style={{ width:"100%", background:"#0F172A", border:"1px solid #334155", borderRadius:10, padding:"10px 14px", color:"#F8FAFC", fontSize:13, fontFamily:"'DM Mono', monospace", outline:"none", boxSizing:"border-box" }}
                            onFocus={e => e.target.style.borderColor="#38BDF8"} onBlur={e => e.target.style.borderColor="#334155"} />
                        </div>
                      ))}
                      <button style={{ alignSelf:"flex-end", background:"linear-gradient(135deg, #38BDF8, #0EA5E9)", border:"none", borderRadius:10, padding:"9px 20px", color:"#0F172A", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Syne', sans-serif" }}>Save Changes</button>
                    </div>
                  </div>
                ))}
                <div style={{ background:"#1E293B", borderRadius:16, border:"1px solid #334155", overflow:"hidden" }}>
                  <div style={{ padding:"16px 24px", borderBottom:"1px solid #334155", fontSize:14, fontWeight:700 }}>User Roles</div>
                  <div style={{ padding:24, display:"flex", flexDirection:"column", gap:12 }}>
                    {["Admin","Editor","Viewer"].map(role => (
                      <div key={role} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"#0F172A", borderRadius:10 }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#E2E8F0" }}>{role}</div>
                          <div style={{ fontSize:11, color:"#64748B", fontFamily:"'DM Mono', monospace", marginTop:2 }}>
                            {role==="Admin"?"Full access":role==="Editor"?"Can edit tasks":"View only"}
                          </div>
                        </div>
                        <span style={{ fontSize:11, padding:"3px 10px", borderRadius:99, background: role==="Admin"?"rgba(248,113,113,0.12)":role==="Editor"?"rgba(56,189,248,0.12)":"rgba(148,163,184,0.12)", color: role==="Admin"?"#F87171":role==="Editor"?"#38BDF8":"#94A3B8", fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
