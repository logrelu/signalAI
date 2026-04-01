import { useState, useMemo, useEffect } from "react";

// Real Menlo Ventures portfolio companies with simulated signal data
const portfolioData = [
  {
    id: 1,
    name: "Abnormal AI",
    sector: "Cybersecurity",
    stage: "Series D",
    founded: 2018,
    partnered: 2020,
    ceo: "Evan Reiser",
    valuation: "$5.1B",
    arrEstimate: "$210M",
    partner: "Venky Ganesan",
    website: "abnormal.ai",
    momentum: 94,
    momentumDelta: +3,
    trend: "accelerating",
    signals: {
      hiring: { score: 96, detail: "+47 roles posted (eng heavy)", trend: "up", sparkline: [70,74,78,82,88,91,94,96] },
      product: { score: 92, detail: "AI Security Mailbox GA, Cloud expansion", trend: "up", sparkline: [80,82,84,85,87,89,91,92] },
      webTraffic: { score: 91, detail: "3.2M monthly visits, +18% MoM", trend: "up", sparkline: [65,68,72,76,80,84,88,91] },
      socialSignal: { score: 88, detail: "Fortune Cyber 60, CNBC Disruptor 50", trend: "up", sparkline: [72,74,78,80,82,85,87,88] },
      devActivity: { score: 95, detail: "High commit velocity, 12 repos active", trend: "up", sparkline: [82,84,86,88,90,92,94,95] },
      talentRetention: { score: 90, detail: "1,500 employees, 70% growth YoY", trend: "stable", sparkline: [85,86,87,88,88,89,90,90] },
    },
    alerts: [],
    lastBoard: "Mar 12, 2026",
    nextBoard: "Jun 18, 2026",
  },
  {
    id: 2,
    name: "Pinecone",
    sector: "AI Infrastructure",
    stage: "Series B",
    founded: 2019,
    partnered: 2022,
    ceo: "Edo Liberty",
    valuation: "$750M",
    arrEstimate: "$85M",
    partner: "Tim Tully",
    website: "pinecone.io",
    momentum: 81,
    momentumDelta: -6,
    trend: "decelerating",
    signals: {
      hiring: { score: 62, detail: "-8 roles pulled last 30d", trend: "down", sparkline: [88,85,82,78,74,70,66,62] },
      product: { score: 85, detail: "Serverless 2.0 shipped, sparse vectors", trend: "stable", sparkline: [80,81,82,83,84,84,85,85] },
      webTraffic: { score: 78, detail: "1.1M monthly, -5% MoM", trend: "down", sparkline: [90,88,86,84,82,80,79,78] },
      socialSignal: { score: 80, detail: "Developer mindshare flat vs Weaviate/Qdrant", trend: "down", sparkline: [88,87,86,84,83,82,81,80] },
      devActivity: { score: 88, detail: "Steady OSS contributions, docs updates", trend: "stable", sparkline: [85,86,86,87,87,88,88,88] },
      talentRetention: { score: 72, detail: "3 senior eng departures on LinkedIn", trend: "down", sparkline: [90,88,85,82,79,76,74,72] },
    },
    alerts: [
      { severity: "warning", message: "3 senior engineers updated LinkedIn to 'open to work'", date: "Mar 22" },
      { severity: "warning", message: "8 job postings pulled in last 30 days (possible hiring freeze)", date: "Mar 15" },
    ],
    lastBoard: "Feb 28, 2026",
    nextBoard: "May 20, 2026",
  },
  {
    id: 3,
    name: "Harness",
    sector: "DevOps / SaaS",
    stage: "Series D",
    founded: 2016,
    partnered: 2017,
    ceo: "Jyoti Bansal",
    valuation: "$3.7B",
    arrEstimate: "$180M",
    partner: "Matt Murphy",
    website: "harness.io",
    momentum: 76,
    momentumDelta: -2,
    trend: "stable",
    signals: {
      hiring: { score: 74, detail: "22 roles open, mostly sales/GTM", trend: "stable", sparkline: [76,76,75,75,74,74,74,74] },
      product: { score: 80, detail: "AI DevOps assistant launch Q1", trend: "up", sparkline: [72,73,74,75,76,77,79,80] },
      webTraffic: { score: 72, detail: "890K monthly, flat", trend: "stable", sparkline: [73,73,72,72,72,72,72,72] },
      socialSignal: { score: 70, detail: "Moderate press coverage", trend: "stable", sparkline: [71,71,70,70,70,70,70,70] },
      devActivity: { score: 82, detail: "Consistent cadence, AI features active", trend: "up", sparkline: [74,75,76,77,78,79,80,82] },
      talentRetention: { score: 78, detail: "VP Sales transition in progress", trend: "down", sparkline: [84,83,82,81,80,79,79,78] },
    },
    alerts: [
      { severity: "info", message: "VP Sales departed — replacement search active", date: "Mar 5" },
    ],
    lastBoard: "Mar 1, 2026",
    nextBoard: "Jun 1, 2026",
  },
  {
    id: 4,
    name: "Carta",
    sector: "Fintech / SaaS",
    stage: "Series G",
    founded: 2012,
    partnered: 2017,
    ceo: "Henry Ward",
    valuation: "$7.4B",
    arrEstimate: "$350M",
    partner: "Matt Murphy",
    website: "carta.com",
    momentum: 70,
    momentumDelta: -8,
    trend: "decelerating",
    signals: {
      hiring: { score: 58, detail: "Net headcount -4% QoQ, RIF rumors", trend: "down", sparkline: [82,78,74,70,66,63,60,58] },
      product: { score: 72, detail: "Fund admin steady, new AI tools beta", trend: "stable", sparkline: [74,74,73,73,73,72,72,72] },
      webTraffic: { score: 75, detail: "2.8M monthly, -3% MoM", trend: "down", sparkline: [82,81,80,79,78,77,76,75] },
      socialSignal: { score: 55, detail: "Negative press re: data practices lingering", trend: "down", sparkline: [78,74,70,66,62,59,57,55] },
      devActivity: { score: 78, detail: "Stable product velocity", trend: "stable", sparkline: [79,79,79,78,78,78,78,78] },
      talentRetention: { score: 65, detail: "C-suite turnover elevated past 6mo", trend: "down", sparkline: [85,82,78,75,72,70,67,65] },
    },
    alerts: [
      { severity: "critical", message: "Social sentiment score dropped 30% — negative press cycle active", date: "Mar 28" },
      { severity: "warning", message: "Net headcount declining — possible restructuring", date: "Mar 18" },
      { severity: "warning", message: "2 C-suite departures in 6 months", date: "Feb 10" },
    ],
    lastBoard: "Feb 15, 2026",
    nextBoard: "May 15, 2026",
  },
  {
    id: 5,
    name: "Benchling",
    sector: "Life Sciences",
    stage: "Series D",
    founded: 2012,
    partnered: 2019,
    ceo: "Saji Wickramasekara",
    valuation: "$6.1B",
    arrEstimate: "$145M",
    partner: "Matt Murphy",
    website: "benchling.com",
    momentum: 83,
    momentumDelta: +1,
    trend: "stable",
    signals: {
      hiring: { score: 80, detail: "28 roles open, balanced", trend: "stable", sparkline: [78,78,79,79,80,80,80,80] },
      product: { score: 88, detail: "AI Notebook launch, GxP compliance", trend: "up", sparkline: [80,81,82,83,84,85,87,88] },
      webTraffic: { score: 82, detail: "1.4M monthly, +6% MoM", trend: "up", sparkline: [74,75,76,77,78,79,81,82] },
      socialSignal: { score: 78, detail: "Strong biotech conference presence", trend: "stable", sparkline: [76,76,77,77,78,78,78,78] },
      devActivity: { score: 86, detail: "Accelerating API & integration commits", trend: "up", sparkline: [78,79,80,81,82,83,85,86] },
      talentRetention: { score: 84, detail: "Low attrition, strong Glassdoor", trend: "stable", sparkline: [83,83,83,84,84,84,84,84] },
    },
    alerts: [],
    lastBoard: "Mar 20, 2026",
    nextBoard: "Jun 20, 2026",
  },
  {
    id: 6,
    name: "ShipBob",
    sector: "Supply Chain",
    stage: "Series E",
    founded: 2014,
    partnered: 2018,
    ceo: "Dhruv Saxena",
    valuation: "$1.0B",
    arrEstimate: "$120M",
    partner: "Shawn Carolan",
    website: "shipbob.com",
    momentum: 59,
    momentumDelta: -12,
    trend: "decelerating",
    signals: {
      hiring: { score: 45, detail: "Hiring freeze evident — 0 new posts in 3 wks", trend: "down", sparkline: [78,72,66,60,55,52,48,45] },
      product: { score: 65, detail: "No major releases in 60 days", trend: "down", sparkline: [78,76,74,72,70,68,66,65] },
      webTraffic: { score: 58, detail: "680K monthly, -14% MoM", trend: "down", sparkline: [82,78,74,70,66,63,60,58] },
      socialSignal: { score: 52, detail: "Competitor Flexport gaining share of voice", trend: "down", sparkline: [74,70,66,62,58,56,54,52] },
      devActivity: { score: 60, detail: "Commit volume down 40% vs 90d avg", trend: "down", sparkline: [85,80,76,72,68,65,62,60] },
      talentRetention: { score: 55, detail: "VP Eng + 2 directors left in Q1", trend: "down", sparkline: [80,76,72,68,64,61,58,55] },
    },
    alerts: [
      { severity: "critical", message: "VP Engineering departed — no backfill posted", date: "Mar 25" },
      { severity: "critical", message: "Dev commit volume dropped 40% — possible team reduction", date: "Mar 20" },
      { severity: "warning", message: "Complete hiring freeze — 0 new postings in 3 weeks", date: "Mar 15" },
      { severity: "warning", message: "Web traffic declining steadily for 4 consecutive months", date: "Mar 1" },
    ],
    lastBoard: "Jan 30, 2026",
    nextBoard: "Apr 30, 2026",
  },
  {
    id: 7,
    name: "Chime",
    sector: "Fintech",
    stage: "IPO (CHYM)",
    founded: 2012,
    partnered: 2018,
    ceo: "Chris Britt",
    valuation: "$8.97B (mkt cap)",
    arrEstimate: "$1.6B rev",
    partner: "Shawn Carolan",
    website: "chime.com",
    momentum: 85,
    momentumDelta: +5,
    trend: "accelerating",
    signals: {
      hiring: { score: 82, detail: "60+ roles, expanding product & eng", trend: "up", sparkline: [70,72,74,76,78,80,81,82] },
      product: { score: 88, detail: "Credit Builder 2.0, instant transfers", trend: "up", sparkline: [78,80,82,83,84,85,87,88] },
      webTraffic: { score: 90, detail: "8.2M monthly, +12% MoM post-IPO", trend: "up", sparkline: [72,75,78,80,83,86,88,90] },
      socialSignal: { score: 85, detail: "Strong IPO press, NASDAQ debut coverage", trend: "up", sparkline: [68,72,75,78,80,82,84,85] },
      devActivity: { score: 80, detail: "Stable engineering cadence", trend: "stable", sparkline: [78,78,79,79,80,80,80,80] },
      talentRetention: { score: 86, detail: "Post-IPO retention strong, lockup stable", trend: "stable", sparkline: [84,84,85,85,85,86,86,86] },
    },
    alerts: [],
    lastBoard: "Mar 8, 2026",
    nextBoard: "Jun 8, 2026",
  },
  {
    id: 8,
    name: "Grow Therapy",
    sector: "Healthcare",
    stage: "Series C",
    founded: 2020,
    partnered: 2024,
    ceo: "Jake Cooper",
    valuation: "$1.4B",
    arrEstimate: "$95M",
    partner: "Greg Yap",
    website: "growtherapy.com",
    momentum: 88,
    momentumDelta: +4,
    trend: "accelerating",
    signals: {
      hiring: { score: 90, detail: "52 roles — eng, clinical ops, growth", trend: "up", sparkline: [72,75,78,81,84,86,88,90] },
      product: { score: 86, detail: "AI-assisted matching, new payer integrations", trend: "up", sparkline: [74,76,78,80,82,83,85,86] },
      webTraffic: { score: 92, detail: "4.5M monthly, +22% MoM", trend: "up", sparkline: [64,68,72,76,80,84,88,92] },
      socialSignal: { score: 84, detail: "TikTok/IG organic growth, therapist community", trend: "up", sparkline: [70,73,75,77,79,81,83,84] },
      devActivity: { score: 85, detail: "Fast shipping cadence, bi-weekly releases", trend: "up", sparkline: [74,76,78,79,81,82,84,85] },
      talentRetention: { score: 88, detail: "Low attrition, strong founder-team alignment", trend: "stable", sparkline: [86,86,87,87,87,88,88,88] },
    },
    alerts: [],
    lastBoard: "Mar 15, 2026",
    nextBoard: "Jun 15, 2026",
  },
  {
    id: 9,
    name: "Neon",
    sector: "Infrastructure",
    stage: "Series C",
    founded: 2021,
    partnered: 2023,
    ceo: "Nikita Shamgunov",
    valuation: "$1.0B",
    arrEstimate: "$45M",
    partner: "Tim Tully",
    website: "neon.tech",
    momentum: 86,
    momentumDelta: +2,
    trend: "accelerating",
    signals: {
      hiring: { score: 84, detail: "18 roles, eng-heavy, Postgres specialists", trend: "up", sparkline: [74,76,78,79,80,81,83,84] },
      product: { score: 90, detail: "Autoscaling GA, branching 2.0", trend: "up", sparkline: [78,80,82,84,86,87,89,90] },
      webTraffic: { score: 88, detail: "2.1M monthly, +16% MoM", trend: "up", sparkline: [68,72,75,78,81,84,86,88] },
      socialSignal: { score: 82, detail: "Dev community growth, HN front page x2", trend: "up", sparkline: [70,72,74,76,78,79,81,82] },
      devActivity: { score: 92, detail: "1,200+ commits/mo, OSS contributions high", trend: "up", sparkline: [80,82,84,86,88,89,91,92] },
      talentRetention: { score: 80, detail: "Stable team, competitive in DB talent market", trend: "stable", sparkline: [78,78,79,79,80,80,80,80] },
    },
    alerts: [],
    lastBoard: "Mar 5, 2026",
    nextBoard: "Jun 5, 2026",
  },
  {
    id: 10,
    name: "Accordance AI",
    sector: "Fintech / AI",
    stage: "Series A",
    founded: 2023,
    partnered: 2024,
    ceo: "David Yue",
    valuation: "$85M",
    arrEstimate: "$4M",
    partner: "Croom Beatty",
    website: "accordance.com",
    momentum: 73,
    momentumDelta: -4,
    trend: "decelerating",
    signals: {
      hiring: { score: 68, detail: "5 roles, down from 12 last month", trend: "down", sparkline: [82,80,78,76,74,72,70,68] },
      product: { score: 78, detail: "Tax season feature push, but delays", trend: "stable", sparkline: [76,76,77,77,78,78,78,78] },
      webTraffic: { score: 65, detail: "45K monthly, flat", trend: "stable", sparkline: [64,64,64,65,65,65,65,65] },
      socialSignal: { score: 70, detail: "Moderate CPA community buzz", trend: "stable", sparkline: [68,68,69,69,70,70,70,70] },
      devActivity: { score: 80, detail: "Active but narrowing scope", trend: "down", sparkline: [88,86,85,84,83,82,81,80] },
      talentRetention: { score: 75, detail: "Early-stage — 1 co-founder role shift", trend: "down", sparkline: [82,80,79,78,77,76,75,75] },
    },
    alerts: [
      { severity: "info", message: "Job postings reduced from 12 to 5 — possible runway conservation", date: "Mar 10" },
    ],
    lastBoard: "Feb 20, 2026",
    nextBoard: "May 20, 2026",
  },
];

const signalLabels = {
  hiring: "Hiring Velocity",
  product: "Product Cadence",
  webTraffic: "Web Traffic",
  socialSignal: "Social Signal",
  devActivity: "Dev Activity",
  talentRetention: "Talent Retention",
};

const signalIcons = {
  hiring: "👥",
  product: "🚀",
  webTraffic: "🌐",
  socialSignal: "📡",
  devActivity: "⚙️",
  talentRetention: "🔒",
};

function Sparkline({ data, color, width = 80, height = 24 }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={parseFloat(points.split(" ").pop().split(",")[0])} cy={parseFloat(points.split(" ").pop().split(",")[1])} r="2.5" fill={color} />
    </svg>
  );
}

function MomentumRing({ score, size = 64, strokeWidth = 5 }) {
  const r = (size - strokeWidth) / 2;
  const c = Math.PI * 2 * r;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fill="#e2e8f0" fontSize={size*0.28} fontWeight="700" style={{ transform: "rotate(90deg)", transformOrigin: "center" }}>{score}</text>
    </svg>
  );
}

function DeltaBadge({ delta }) {
  const color = delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#94a3b8";
  const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "—";
  return (
    <span style={{
      color, fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3,
      background: delta > 0 ? "rgba(34,197,94,0.1)" : delta < 0 ? "rgba(239,68,68,0.1)" : "rgba(148,163,184,0.1)",
      padding: "2px 8px", borderRadius: 6,
    }}>
      {arrow} {Math.abs(delta)}pts
    </span>
  );
}

function AlertPill({ severity }) {
  const colors = { critical: "#ef4444", warning: "#f59e0b", info: "#3b82f6" };
  return (
    <span style={{
      background: colors[severity] || "#3b82f6",
      color: "#fff",
      fontSize: 10,
      fontWeight: 700,
      textTransform: "uppercase",
      padding: "2px 6px",
      borderRadius: 4,
      letterSpacing: 0.5,
    }}>{severity}</span>
  );
}

export default function MenloSignalDecay() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [sortBy, setSortBy] = useState("momentum");
  const [filterSector, setFilterSector] = useState("All");
  const [filterTrend, setFilterTrend] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const sectors = ["All", ...new Set(portfolioData.map(c => c.sector))];
  const trends = ["All", "accelerating", "stable", "decelerating"];

  const sortedCompanies = useMemo(() => {
    let filtered = portfolioData.filter(c => {
      if (filterSector !== "All" && c.sector !== filterSector) return false;
      if (filterTrend !== "All" && c.trend !== filterTrend) return false;
      if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
    if (sortBy === "momentum") filtered.sort((a, b) => b.momentum - a.momentum);
    else if (sortBy === "decay") filtered.sort((a, b) => a.momentumDelta - b.momentumDelta);
    else if (sortBy === "alerts") filtered.sort((a, b) => b.alerts.length - a.alerts.length);
    return filtered;
  }, [sortBy, filterSector, filterTrend, searchTerm]);

  const totalAlerts = portfolioData.reduce((s, c) => s + c.alerts.length, 0);
  const criticalCount = portfolioData.reduce((s, c) => s + c.alerts.filter(a => a.severity === "critical").length, 0);
  const decelerating = portfolioData.filter(c => c.trend === "decelerating").length;
  const avgMomentum = Math.round(portfolioData.reduce((s, c) => s + c.momentum, 0) / portfolioData.length);

  const detail = selectedCompany;

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      background: "#0a0e17",
      color: "#c8d6e5",
      minHeight: "100vh",
      padding: 0,
      margin: 0,
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d1320 0%, #111827 50%, #0f172a 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 32px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: criticalCount > 0 ? "#ef4444" : "#22c55e",
                boxShadow: criticalCount > 0 ? "0 0 12px rgba(239,68,68,0.6)" : "0 0 12px rgba(34,197,94,0.5)",
                animation: criticalCount > 0 ? "pulse 2s infinite" : "none",
              }} />
              <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 2 }}>Menlo Ventures · Signal Decay Tracker</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: -1 }}>
              Founder Momentum Intelligence
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#475569" }}>
              Passive signals aggregated across 10 active portfolio companies · Updated Apr 1, 2026
            </p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Avg Momentum", value: avgMomentum, color: avgMomentum >= 75 ? "#22c55e" : "#f59e0b" },
              { label: "Decelerating", value: decelerating, color: decelerating > 2 ? "#ef4444" : "#f59e0b" },
              { label: "Active Alerts", value: totalAlerts, color: criticalCount > 0 ? "#ef4444" : "#3b82f6" },
              { label: "Critical", value: criticalCount, color: criticalCount > 0 ? "#ef4444" : "#22c55e" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 140px)" }}>
        {/* Left panel — company list */}
        <div style={{
          width: detail ? 420 : "100%",
          transition: "width 0.3s",
          borderRight: detail ? "1px solid rgba(255,255,255,0.06)" : "none",
          overflow: "auto",
          maxHeight: "calc(100vh - 140px)",
        }}>
          {/* Filters */}
          <div style={{
            padding: "16px 20px",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: "rgba(255,255,255,0.01)",
          }}>
            <input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6, padding: "6px 12px", color: "#e2e8f0", fontSize: 12,
                outline: "none", width: 160, fontFamily: "inherit",
              }}
            />
            {[
              { label: "Sort", value: sortBy, setter: setSortBy, options: [["momentum","Momentum ↓"],["decay","Decay ↓"],["alerts","Alerts ↓"]] },
              { label: "Sector", value: filterSector, setter: setFilterSector, options: sectors.map(s => [s,s]) },
              { label: "Trend", value: filterTrend, setter: setFilterTrend, options: trends.map(t => [t, t === "All" ? "All" : t.charAt(0).toUpperCase()+t.slice(1)]) },
            ].map((f, fi) => (
              <select
                key={fi}
                value={f.value}
                onChange={e => f.setter(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6, padding: "6px 10px", color: "#e2e8f0", fontSize: 12,
                  outline: "none", fontFamily: "inherit", cursor: "pointer",
                }}
              >
                {f.options.map(([v, l]) => <option key={v} value={v}>{f.label}: {l}</option>)}
              </select>
            ))}
          </div>

          {/* Company rows */}
          {sortedCompanies.map(company => {
            const trendColor = company.trend === "accelerating" ? "#22c55e" : company.trend === "decelerating" ? "#ef4444" : "#f59e0b";
            const isSelected = detail?.id === company.id;
            return (
              <div
                key={company.id}
                onClick={() => setSelectedCompany(isSelected ? null : company)}
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  cursor: "pointer",
                  background: isSelected ? "rgba(59,130,246,0.08)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <MomentumRing score={company.momentum} size={52} strokeWidth={4} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{company.name}</span>
                      <DeltaBadge delta={company.momentumDelta} />
                      {company.alerts.filter(a => a.severity === "critical").length > 0 && (
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%", background: "#ef4444",
                          boxShadow: "0 0 8px rgba(239,68,68,0.6)",
                          animation: "pulse 2s infinite",
                        }} />
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span>{company.sector}</span>
                      <span>·</span>
                      <span>{company.stage}</span>
                      <span>·</span>
                      <span style={{ color: trendColor }}>{company.trend}</span>
                      {company.alerts.length > 0 && (
                        <>
                          <span>·</span>
                          <span style={{ color: "#ef4444" }}>{company.alerts.length} alert{company.alerts.length > 1 ? "s" : ""}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {!detail && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {Object.entries(company.signals).map(([key, sig]) => (
                        <Sparkline
                          key={key}
                          data={sig.sparkline}
                          color={sig.score >= 80 ? "#22c55e" : sig.score >= 60 ? "#f59e0b" : "#ef4444"}
                          width={48}
                          height={20}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right panel — detail */}
        {detail && (
          <div style={{
            flex: 1,
            overflow: "auto",
            maxHeight: "calc(100vh - 140px)",
            padding: "24px 28px",
          }}>
            {/* Company header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#f1f5f9" }}>{detail.name}</h2>
                  <DeltaBadge delta={detail.momentumDelta} />
                </div>
                <div style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 16 }}>
                  <span>CEO: {detail.ceo}</span>
                  <span>Partner: {detail.partner}</span>
                  <span>Founded: {detail.founded}</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 16, marginTop: 4 }}>
                  <span>Valuation: {detail.valuation}</span>
                  <span>ARR: {detail.arrEstimate}</span>
                  <span>Stage: {detail.stage}</span>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <MomentumRing score={detail.momentum} size={80} strokeWidth={6} />
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Composite</div>
              </div>
            </div>

            {/* Board dates */}
            <div style={{
              display: "flex", gap: 16, marginBottom: 24,
            }}>
              {[
                { label: "Last Board", value: detail.lastBoard },
                { label: "Next Board", value: detail.nextBoard },
              ].map((b, i) => (
                <div key={i} style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  padding: "12px 16px",
                }}>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{b.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{b.value}</div>
                </div>
              ))}
            </div>

            {/* Signal breakdown */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                Signal Breakdown
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {Object.entries(detail.signals).map(([key, sig]) => {
                  const barColor = sig.score >= 80 ? "#22c55e" : sig.score >= 60 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={key} style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10,
                      padding: "14px 16px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#cbd5e1" }}>
                          {signalIcons[key]} {signalLabels[key]}
                        </span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: barColor }}>{sig.score}</span>
                      </div>
                      <div style={{
                        height: 4, borderRadius: 2,
                        background: "rgba(255,255,255,0.06)",
                        marginBottom: 8,
                      }}>
                        <div style={{
                          height: "100%", borderRadius: 2,
                          width: `${sig.score}%`,
                          background: barColor,
                          transition: "width 0.5s",
                        }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#64748b", maxWidth: "70%" }}>{sig.detail}</span>
                        <Sparkline data={sig.sparkline} color={barColor} width={60} height={18} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alerts */}
            {detail.alerts.length > 0 && (
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                  Active Alerts ({detail.alerts.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {detail.alerts.map((alert, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      background: alert.severity === "critical" ? "rgba(239,68,68,0.06)" : alert.severity === "warning" ? "rgba(245,158,11,0.05)" : "rgba(59,130,246,0.05)",
                      border: `1px solid ${alert.severity === "critical" ? "rgba(239,68,68,0.2)" : alert.severity === "warning" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)"}`,
                      borderRadius: 8,
                      padding: "10px 14px",
                    }}>
                      <AlertPill severity={alert.severity} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.4 }}>{alert.message}</div>
                        <div style={{ fontSize: 10, color: "#64748b", marginTop: 3 }}>{alert.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested action */}
            {detail.trend === "decelerating" && (
              <div style={{
                marginTop: 24,
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 10,
                padding: "16px 20px",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                  ⚡ Recommended Action
                </div>
                <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.6 }}>
                  {detail.momentum < 65
                    ? `Schedule an off-cycle check-in with ${detail.ceo} before ${detail.nextBoard}. Multiple signals are degrading simultaneously — this pattern historically precedes a "we need to talk" conversation by 8-12 weeks. Consider proactively discussing bridge options and introducing operating support.`
                    : `Flag for discussion at next partner meeting. ${detail.name} shows early deceleration across ${Object.values(detail.signals).filter(s => s.trend === "down").length} signals. A casual founder check-in from ${detail.partner} in the next 2 weeks could surface issues before they compound.`
                  }
                </div>
              </div>
            )}

            {detail.trend === "accelerating" && (
              <div style={{
                marginTop: 24,
                background: "rgba(34,197,94,0.05)",
                border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: 10,
                padding: "16px 20px",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                  ✦ Opportunity Signal
                </div>
                <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.6 }}>
                  {detail.name} is accelerating across multiple dimensions. Consider proactive follow-on discussion with {detail.ceo} — strong momentum windows are optimal for deployment of additional capital or strategic introductions.
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedCompany(null)}
              style={{
                marginTop: 24,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "10px 20px",
                color: "#94a3b8",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Back to portfolio view
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        select option { background: #1e293b; color: #e2e8f0; }
      `}</style>
    </div>
  );
}
