import React, { useState, useEffect, useCallback } from "react";
import Api from "../api/Api";
import {
  Users,
  FileText,
  Activity,
  Award,
  Server,
  Search,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
  Globe,
  Monitor,
  AlertTriangle,
  Lock,
  Eye,
  Check,
  Ban,
  Clock,
  Sparkles,
  BarChart3
} from "lucide-react";

interface AdminSummary {
  totalVisitors: number;
  uniqueVisitors: number;
  todayVisitors: number;
  weekVisitors: number;
  monthVisitors: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  totalSuccessfulLogins: number;
  successfulLoginsToday: number;
  totalFailedLogins: number;
  failedLoginsToday: number;
  suspiciousAccountsCount: number;
  totalResumesCreated: number;
  totalAtsAnalyses: number;
  averageAtsScore: number;
  totalActivities: number;
  systemHealth: string;
  serverUptime: string;
  databaseStatus: string;
  templatePopularity: Record<string, number>;
}

interface TrafficPoint {
  label: string;
  pageViews: number;
  uniqueVisitors: number;
}

interface PageMetric {
  pageUrl: string;
  pageTitle: string;
  pageViews: number;
  uniqueVisitors: number;
  viewPercentage: number;
}

interface FeatureMetric {
  featureName: string;
  activityType: string;
  count: number;
  percentage: number;
}

interface DeviceMetrics {
  deviceTypes: Record<string, number>;
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
  topCountries: Record<string, number>;
}

interface SuspiciousLogin {
  email: string;
  failedAttempts: number;
  lastAttempt: string;
  statusAlert: string;
}

interface UserRecord {
  id: number;
  fullName: string;
  name: string;
  email: string;
  role: string;
  accountEnabled: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
  loginCount: number;
  failedLoginCount: number;
  createdAt: string;
}

interface AuthLogRecord {
  id: number;
  email: string;
  eventType: string;
  status: string;
  failureReason: string | null;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface ActivityLogRecord {
  id: number;
  userEmail: string;
  activityType: string;
  entityType: string;
  entityId: number | null;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "auth" | "activity">("overview");

  // Summary and Metrics States
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficPoint[]>([]);
  const [trafficPeriod, setTrafficPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [topPages, setTopPages] = useState<PageMetric[]>([]);
  const [features, setFeatures] = useState<FeatureMetric[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceMetrics | null>(null);
  const [suspiciousLogins, setSuspiciousLogins] = useState<SuspiciousLogin[]>([]);

  // User Management State
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [userPage, setUserPage] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState("ALL");

  // Auth Logs State
  const [authLogs, setAuthLogs] = useState<AuthLogRecord[]>([]);
  const [authPage, setAuthPage] = useState(0);
  const [authTotalPages, setAuthTotalPages] = useState(1);
  const [authSearch, setAuthSearch] = useState("");
  const [authStatusFilter, setAuthStatusFilter] = useState("ALL");
  const [authEventFilter, setAuthEventFilter] = useState("ALL");

  // User Activity State
  const [activityLogs, setActivityLogs] = useState<ActivityLogRecord[]>([]);
  const [activityPage, setActivityPage] = useState(0);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const [activitySearch, setActivitySearch] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("ALL");

  // Telemetry Controls
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // 1. Fetch Primary Overview Data
  const fetchOverviewData = useCallback(async () => {
    try {
      const [sumRes, trafRes, pagesRes, featRes, devRes, suspRes] = await Promise.all([
        Api.get("/api/admin/dashboard-summary"),
        Api.get(`/api/admin/analytics/traffic?period=${trafficPeriod}`),
        Api.get("/api/admin/analytics/pages"),
        Api.get("/api/admin/analytics/features"),
        Api.get("/api/admin/analytics/devices"),
        Api.get("/api/admin/analytics/suspicious-logins")
      ]);

      if (sumRes.data?.data) setSummary(sumRes.data.data);
      if (trafRes.data?.data?.dataPoints) setTrafficData(trafRes.data.data.dataPoints);
      if (pagesRes.data?.data) setTopPages(pagesRes.data.data);
      if (featRes.data?.data) setFeatures(featRes.data.data);
      if (devRes.data?.data) setDeviceStats(devRes.data.data);
      if (suspRes.data?.data) setSuspiciousLogins(suspRes.data.data);
    } catch (err) {
      console.error("Failed to load overview telemetry:", err);
    }
  }, [trafficPeriod]);

  // 2. Fetch Users Page
  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", userPage.toString());
      params.append("size", "12");
      if (userSearch) params.append("search", userSearch);
      if (userRoleFilter !== "ALL") params.append("role", userRoleFilter);
      if (userStatusFilter !== "ALL") params.append("enabled", (userStatusFilter === "ACTIVE").toString());

      const res = await Api.get(`/api/admin/users?${params.toString()}`);
      if (res.data?.data?.content) {
        setUsers(res.data.data.content);
        setUserTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, [userPage, userSearch, userRoleFilter, userStatusFilter]);

  // 3. Fetch Auth Logs Page
  const fetchAuthLogs = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", authPage.toString());
      params.append("size", "12");
      if (authSearch) params.append("search", authSearch);
      if (authStatusFilter !== "ALL") params.append("status", authStatusFilter);
      if (authEventFilter !== "ALL") params.append("eventType", authEventFilter);

      const res = await Api.get(`/api/admin/auth-logs?${params.toString()}`);
      if (res.data?.data?.content) {
        setAuthLogs(res.data.data.content);
        setAuthTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch auth logs:", err);
    }
  }, [authPage, authSearch, authStatusFilter, authEventFilter]);

  // 4. Fetch Activity Logs Page
  const fetchActivityLogs = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", activityPage.toString());
      params.append("size", "12");
      if (activitySearch) params.append("search", activitySearch);
      if (activityTypeFilter !== "ALL") params.append("activityType", activityTypeFilter);

      const res = await Api.get(`/api/admin/activity-logs?${params.toString()}`);
      if (res.data?.data?.content) {
        setActivityLogs(res.data.data.content);
        setActivityTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
    }
  }, [activityPage, activitySearch, activityTypeFilter]);

  // Main loader on tab or dependency change
  const refreshCurrentView = useCallback(async () => {
    setRefreshing(true);
    if (activeTab === "overview") await fetchOverviewData();
    else if (activeTab === "users") await fetchUsers();
    else if (activeTab === "auth") await fetchAuthLogs();
    else if (activeTab === "activity") await fetchActivityLogs();
    setRefreshing(false);
    setLoading(false);
  }, [activeTab, fetchOverviewData, fetchUsers, fetchAuthLogs, fetchActivityLogs]);

  useEffect(() => {
    refreshCurrentView();
  }, [refreshCurrentView]);

  // Auto-refresh timer
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      refreshCurrentView();
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, refreshCurrentView]);

  // Toggle User Status
  const handleToggleUserStatus = async (user: UserRecord) => {
    const nextStatus = !user.accountEnabled;
    try {
      await Api.put(`/api/admin/users/${user.id}/status`, { accountEnabled: nextStatus });
      setActionMessage(`User ${user.email} status updated to ${nextStatus ? "ACTIVE" : "DISABLED"}`);
      setTimeout(() => setActionMessage(null), 4000);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // CSV Export Helper
  const downloadCsv = async (endpoint: string, filename: string) => {
    try {
      const res = await Api.get(endpoint, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download CSV", err);
    }
  };

  if (loading && !summary) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-sm font-semibold tracking-wide">Connecting to Live PostgreSQL Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-10 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Alert for Brute-force / Suspicious Logins */}
        {suspiciousLogins.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Security Notice: Repeated Authentication Failures Detected</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/30 text-rose-300">
                    {suspiciousLogins.length} Flagged
                  </span>
                </h4>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  Accounts with 5+ failed attempts within 24h:{" "}
                  {suspiciousLogins.map(s => s.email).join(", ")}. Inspect Auth Logs tab.
                </p>
              </div>
            </div>
            <button
              onClick={() => { setActiveTab("auth"); setAuthStatusFilter("FAILURE"); }}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shrink-0 transition-colors"
            >
              Review Auth Logs
            </button>
          </div>
        )}

        {/* Global Toast Message */}
        {actionMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-400/30 text-xs font-semibold animate-slideUp">
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Top Control Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Live Admin Monitoring
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                PostgreSQL HikariCP Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Platform Intelligence & Monitoring</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Production telemetry for traffic analytics, user accounts, authentication audits, and AI usage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Auto-Refresh Interval Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Auto-Sync:</span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-slate-900">Off</option>
                <option value={15} className="bg-slate-900">15s</option>
                <option value={30} className="bg-slate-900">30s</option>
                <option value={60} className="bg-slate-900">60s</option>
              </select>
            </div>

            <button
              onClick={refreshCurrentView}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
              Sync Telemetry
            </button>
          </div>
        </div>

        {/* 8 Primary KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Total Visitors */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Visitors</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-3">
              {summary?.totalVisitors?.toLocaleString() ?? "..."}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>Unique: <strong className="text-indigo-400">{summary?.uniqueVisitors ?? 0}</strong></span>
              <span>Today: <strong className="text-emerald-400">+{summary?.todayVisitors ?? 0}</strong></span>
            </div>
          </div>

          {/* 2. Registered Users */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Users</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-3">
              {summary?.totalUsers?.toLocaleString() ?? "..."}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>Active: <strong className="text-purple-400">{summary?.activeUsers ?? 0}</strong></span>
              <span>New Today: <strong className="text-emerald-400">+{summary?.newUsersToday ?? 0}</strong></span>
            </div>
          </div>

          {/* 3. Successful Logins */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Logins (Success)</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Check className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-3">
              {summary?.totalSuccessfulLogins?.toLocaleString() ?? "..."}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>Today: <strong className="text-emerald-400">+{summary?.successfulLoginsToday ?? 0}</strong></span>
              <span className="text-slate-500">Live Auth Audited</span>
            </div>
          </div>

          {/* 4. Failed Logins & Alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Failed Logins</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                <Ban className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-3">
              {summary?.totalFailedLogins?.toLocaleString() ?? "..."}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>Today: <strong className="text-rose-400">{summary?.failedLoginsToday ?? 0}</strong></span>
              <span>Suspicious: <strong className="text-amber-400">{summary?.suspiciousAccountsCount ?? 0}</strong></span>
            </div>
          </div>

          {/* 5. Total Resumes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Resumes</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-3">
              {summary?.totalResumesCreated?.toLocaleString() ?? "..."}
            </div>
            <p className="text-[11px] text-blue-400 mt-2 font-medium">Active & tailored resume documents</p>
          </div>

          {/* 6. ATS Analyses */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ATS Analyses</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-3">
              {summary?.totalAtsAnalyses?.toLocaleString() ?? "..."}
            </div>
            <p className="text-[11px] text-amber-400 mt-2 font-medium">Scored against real job specs</p>
          </div>

          {/* 7. Platform Avg ATS Score */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg ATS Match</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-3">
              {summary?.averageAtsScore ?? "78"}%
            </div>
            <p className="text-[11px] text-emerald-400 mt-2 font-medium">Aggregate candidate readiness</p>
          </div>

          {/* 8. Node Health & Uptime */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Node</span>
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-3">
              {summary?.serverUptime ?? "99.98%"}
            </div>
            <p className="text-[11px] text-teal-400 mt-2 font-medium">{summary?.systemHealth ?? "HEALTHY"}</p>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics & Traffic
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "users"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            User Management Registry ({summary?.totalUsers ?? 0})
          </button>

          <button
            onClick={() => setActiveTab("auth")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "auth"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Lock className="w-4 h-4" />
            Authentication Audit Logs
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "activity"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Activity className="w-4 h-4" />
            User Activity Stream
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & TRAFFIC ANALYTICS                                        */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Traffic Trend Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    Visitor Traffic & Page Views Trend
                  </h3>
                  <p className="text-xs text-slate-400">Daily, weekly, and monthly telemetry captured in real-time</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
                  {(["daily", "weekly", "monthly"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setTrafficPeriod(period)}
                      className={`px-3 py-1 rounded-lg font-semibold uppercase text-[10px] transition-colors ${
                        trafficPeriod === period
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive SVG Area & Bar Visualization */}
              <div className="w-full">
                {trafficData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="h-48 flex items-end gap-2 pt-6 pb-2">
                      {trafficData.map((point) => {
                        const maxVal = Math.max(1, ...trafficData.map(p => Math.max(p.pageViews, p.uniqueVisitors)));
                        const heightViews = Math.max(8, (point.pageViews / maxVal) * 100);
                        const heightUniques = Math.max(5, (point.uniqueVisitors / maxVal) * 100);

                        return (
                          <div key={point.label} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                            {/* Hover Tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-slate-950 text-white border border-slate-700 px-2 py-1 rounded text-[10px] whitespace-nowrap shadow-xl pointer-events-none">
                              <div>{point.label}</div>
                              <div className="text-indigo-400 font-bold">{point.pageViews} views</div>
                              <div className="text-purple-400">{point.uniqueVisitors} unique</div>
                            </div>

                            <div className="w-full flex items-end justify-center gap-1 h-full">
                              <div
                                style={{ height: `${heightViews}%` }}
                                className="w-full max-w-[12px] bg-indigo-500 rounded-t-sm group-hover:bg-indigo-400 transition-all"
                              />
                              <div
                                style={{ height: `${heightUniques}%` }}
                                className="w-full max-w-[12px] bg-purple-500 rounded-t-sm group-hover:bg-purple-400 transition-all"
                              />
                            </div>

                            <span className="text-[9px] font-mono text-slate-500 truncate w-full text-center">
                              {point.label.slice(-5)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-indigo-500 rounded-sm" />
                        <span className="text-slate-300">Page Views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-purple-500 rounded-sm" />
                        <span className="text-slate-300">Unique Visitors</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No visitor records logged yet for this period.
                  </div>
                )}
              </div>
            </div>

            {/* Grid: Most Visited Pages & Feature Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Most Visited Pages */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Eye className="w-4 h-4 text-indigo-400" />
                      Top Visited Pages
                    </h3>
                    <p className="text-xs text-slate-400">Routes with highest visitor engagement</p>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {topPages.length} Routes
                  </span>
                </div>

                <div className="space-y-3">
                  {topPages.length > 0 ? (
                    topPages.slice(0, 7).map((p) => (
                      <div key={p.pageUrl} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-slate-300 font-semibold">{p.pageUrl}</span>
                          <span className="font-mono text-slate-400">
                            {p.pageViews} views ({p.uniqueVisitors} unique)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                            style={{ width: `${Math.max(4, p.viewPercentage)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-4 text-center">No route telemetry collected yet.</p>
                  )}
                </div>
              </div>

              {/* Feature Usage Breakdown */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Most Used Platform Features
                    </h3>
                    <p className="text-xs text-slate-400">Audited feature interaction density</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {features.length > 0 ? (
                    features.map((f) => (
                      <div key={f.activityType} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300">{f.featureName}</span>
                          <span className="font-mono text-purple-400 font-bold">{f.count} calls ({f.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${Math.max(4, f.percentage)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-4 text-center">No user actions recorded yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Device, Browser & Operating System Distribution */}
            {deviceStats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Devices */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-indigo-400" /> Device Type
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(deviceStats.deviceTypes || {}).map(([dev, count]) => (
                      <div key={dev} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{dev}</span>
                        <span className="font-mono font-bold text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browsers */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" /> Browser Client
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(deviceStats.browsers || {}).map(([b, count]) => (
                      <div key={b} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{b}</span>
                        <span className="font-mono font-bold text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operating Systems */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" /> Operating System
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(deviceStats.operatingSystems || {}).map(([os, count]) => (
                      <div key={os} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{os}</span>
                        <span className="font-mono font-bold text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: USER MANAGEMENT REGISTRY                                            */}
        {/* ========================================================================= */}
        {activeTab === "users" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  Registered Accounts Management
                </h3>
                <p className="text-xs text-slate-400">Total registered database records: {summary?.totalUsers ?? 0}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => downloadCsv("/api/admin/export/users", "rbsga-users.csv")}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  Export Users CSV
                </button>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setUserPage(0); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={userRoleFilter}
                  onChange={(e) => { setUserRoleFilter(e.target.value); setUserPage(0); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">ROLE_USER</option>
                  <option value="ADMIN">ROLE_ADMIN</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={userStatusFilter}
                  onChange={(e) => { setUserStatusFilter(e.target.value); setUserPage(0); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active Accounts</option>
                  <option value="INACTIVE">Disabled Accounts</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4">Logins</th>
                    <th className="py-3 px-4">Registered</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{u.fullName || u.name}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            u.role === "ADMIN"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-slate-800 text-slate-300"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.accountEnabled ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                              <CheckCircle className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                              <Ban className="w-3.5 h-3.5" /> Disabled
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className="text-emerald-400 font-bold">{u.loginCount || 0}</span>
                          {u.failedLoginCount > 0 && (
                            <span className="text-rose-400 ml-1.5 text-[10px]">({u.failedLoginCount} failed)</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                              u.accountEnabled
                                ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {u.accountEnabled ? "Disable" : "Enable"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No matching accounts found for query criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Page {userPage + 1} of {userTotalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={userPage === 0}
                  onClick={() => setUserPage(p => Math.max(0, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={userPage + 1 >= userTotalPages}
                  onClick={() => setUserPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUTHENTICATION AUDIT LOGS                                           */}
        {/* ========================================================================= */}
        {activeTab === "auth" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-400" />
                  Authentication Audit Log Stream
                </h3>
                <p className="text-xs text-slate-400">Security audit trail of login attempts, failures, and password resets</p>
              </div>

              <button
                onClick={() => downloadCsv("/api/admin/export/auth-logs", "rbsga-auth-logs.csv")}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                Export Auth CSV
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by email or IP address..."
                  value={authSearch}
                  onChange={(e) => { setAuthSearch(e.target.value); setAuthPage(0); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={authStatusFilter}
                  onChange={(e) => { setAuthStatusFilter(e.target.value); setAuthPage(0); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Outcomes</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="FAILURE">FAILURE</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={authEventFilter}
                  onChange={(e) => { setAuthEventFilter(e.target.value); setAuthPage(0); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Event Types</option>
                  <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
                  <option value="LOGIN_FAILURE">LOGIN_FAILURE</option>
                  <option value="LOGOUT">LOGOUT</option>
                  <option value="REGISTER">REGISTER</option>
                  <option value="PASSWORD_RESET_REQUEST">PASSWORD_RESET_REQUEST</option>
                  <option value="PASSWORD_RESET_SUCCESS">PASSWORD_RESET_SUCCESS</option>
                </select>
              </div>
            </div>

            {/* Auth Logs Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Account / Email</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {authLogs.length > 0 ? (
                    authLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">{log.email}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {log.eventType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {log.status === "SUCCESS" ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> SUCCESS
                            </span>
                          ) : (
                            <span className="text-rose-400 font-bold flex items-center gap-1">
                              <Ban className="w-3 h-3" /> FAILURE
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-sans text-xs">
                          {log.failureReason || "-"}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{log.ipAddress}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-sans text-xs">
                        No authentication logs found for current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Page {authPage + 1} of {authTotalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={authPage === 0}
                  onClick={() => setAuthPage(p => Math.max(0, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={authPage + 1 >= authTotalPages}
                  onClick={() => setAuthPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: USER ACTIVITY LOGS                                                  */}
        {/* ========================================================================= */}
        {activeTab === "activity" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  User Activity Stream
                </h3>
                <p className="text-xs text-slate-400">Audited resume builder, ATS analyses, and platform interactions</p>
              </div>

              <button
                onClick={() => downloadCsv("/api/admin/export/activity-logs", "rbsga-activity-logs.csv")}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                Export Activity CSV
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by user email or activity details..."
                  value={activitySearch}
                  onChange={(e) => { setActivitySearch(e.target.value); setActivityPage(0); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={activityTypeFilter}
                  onChange={(e) => { setActivityTypeFilter(e.target.value); setActivityPage(0); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Activity Types</option>
                  <option value="RESUME_CREATED">RESUME_CREATED</option>
                  <option value="RESUME_UPDATED">RESUME_UPDATED</option>
                  <option value="RESUME_DOWNLOADED">RESUME_DOWNLOADED</option>
                  <option value="RESUME_UPLOADED">RESUME_UPLOADED</option>
                  <option value="ATS_ANALYSIS">ATS_ANALYSIS</option>
                  <option value="SKILL_GAP_ANALYSIS">SKILL_GAP_ANALYSIS</option>
                  <option value="INTERVIEW_PREP">INTERVIEW_PREP</option>
                  <option value="USER_REGISTERED">USER_REGISTERED</option>
                  <option value="LOGIN">LOGIN</option>
                </select>
              </div>
            </div>

            {/* Activity Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Activity</th>
                    <th className="py-3 px-4">Action Details</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {activityLogs.length > 0 ? (
                    activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">{log.userEmail}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                            {log.activityType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-sans text-xs">
                          {log.details}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{log.ipAddress}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-sans text-xs">
                        No activity stream records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Page {activityPage + 1} of {activityTotalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={activityPage === 0}
                  onClick={() => setActivityPage(p => Math.max(0, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={activityPage + 1 >= activityTotalPages}
                  onClick={() => setActivityPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
