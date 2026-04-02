import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ShieldCheck, Briefcase, ScrollText, BarChart3, PieChart as PieChartIcon, MapPinned, Building2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import GeoDistributionMap from "../../components/dashboard/GeoDistributionMap";
import { apiCall } from "../../api/apiConfig";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState({});
  const [userMetrics, setUserMetrics] = useState({ roles: {}, verification: {} });
  const [caseMetrics, setCaseMetrics] = useState({ byStatus: {} });
  const [matchMetrics, setMatchMetrics] = useState({ byStatus: {} });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        const [overviewData, usersData, casesData, matchesData] = await Promise.all([
          apiCall("/analytics/overview", "GET"),
          apiCall("/analytics/users", "GET"),
          apiCall("/analytics/cases", "GET"),
          apiCall("/analytics/matches", "GET"),
        ]);
        setOverview(overviewData || {});
        setUserMetrics(usersData || { roles: {}, verification: {} });
        setCaseMetrics(casesData || { byStatus: {} });
        setMatchMetrics(matchesData || { byStatus: {} });
      } catch (loadError) {
        console.error("Failed to load analytics", loadError);
        setError("Analytics is temporarily unavailable. Showing navigation and monitoring links only.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const growthData = useMemo(() => {
    const users = Array.isArray(overview.userGrowthTrend) ? overview.userGrowthTrend : [];
    const cases = Array.isArray(overview.caseGrowthTrend) ? overview.caseGrowthTrend : [];

    const byMonth = new Map();
    users.forEach((entry) => {
      byMonth.set(entry.month, { month: entry.month, users: Number(entry.count || 0), cases: 0 });
    });
    cases.forEach((entry) => {
      const existing = byMonth.get(entry.month) || { month: entry.month, users: 0, cases: 0 };
      existing.cases = Number(entry.count || 0);
      byMonth.set(entry.month, existing);
    });

    return Array.from(byMonth.values());
  }, [overview]);

  const roleDistribution = useMemo(() => {
    const roles = userMetrics.roles || {};
    return Object.keys(roles).map((key) => ({ name: key, value: Number(roles[key] || 0) }));
  }, [userMetrics]);

  const caseStatusData = useMemo(() => {
    const byStatus = caseMetrics.byStatus || {};
    return Object.keys(byStatus).map((status) => ({ status, count: Number(byStatus[status] || 0) }));
  }, [caseMetrics]);

  const matchStatusData = useMemo(() => {
    const byStatus = matchMetrics.byStatus || {};
    return Object.keys(byStatus).map((status) => ({ status, count: Number(byStatus[status] || 0) }));
  }, [matchMetrics]);

  const geoData = useMemo(() => {
    return Array.isArray(overview.geoCaseDistribution) ? overview.geoCaseDistribution : [];
  }, [overview]);

  const kpiCards = [
    { label: "Total Users", value: Number(overview.totalUsers || 0), icon: Users },
    { label: "Total Lawyers", value: Number(overview.totalLawyers || 0), icon: Briefcase },
    { label: "Total NGOs", value: Number(overview.totalNgos || 0), icon: Building2 },
    { label: "Total Cases", value: Number(overview.totalCases || 0), icon: ScrollText },
    { label: "Total Matches", value: Number(overview.totalMatches || 0), icon: BarChart3 },
    { label: "Resolved Cases", value: Number(overview.resolvedCases || 0), icon: ShieldCheck },
  ];

  const pieColors = ["#2563EB", "#0EA5E9", "#14B8A6", "#6366F1", "#8B5CF6", "#10B981"];

  // Dashboard cards for quick admin navigation.
  const cards = [
    {
      title: "User Management",
      description: "Review users and manage status actions.",
      path: "/admin/users",
      icon: Users,
    },
    {
      title: "Verification Center",
      description: "Approve or reject lawyer and NGO verifications.",
      path: "/admin/verification",
      icon: ShieldCheck,
    },
    {
      title: "Case Monitoring",
      description: "Track all submitted cases and assignments.",
      path: "/admin/cases",
      icon: Briefcase,
    },
    {
      title: "System Logs",
      description: "Monitor activity and error logs from the system.",
      path: "/admin/logs",
      icon: ScrollText,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform control center for operations and monitoring.</p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        {kpiCards.map((item) => (
          <div key={item.label} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{loading ? "..." : item.value.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <item.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <card.icon size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">{card.title}</h2>
                <p className="text-sm text-slate-500 mt-1">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <h2 className="font-semibold text-slate-900">User and Case Growth Trends</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="cases" stroke="#0EA5E9" strokeWidth={2} name="Cases" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-4 h-4 text-slate-500" />
            <h2 className="font-semibold text-slate-900">User Role Distribution</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleDistribution} dataKey="value" nameKey="name" outerRadius={90} label>
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Cases by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Matches by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MapPinned className="w-4 h-4 text-slate-500" />
          <h2 className="font-semibold text-slate-900">Geographic Distribution (Map View)</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
            <GeoDistributionMap />
          </div>
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Top Case Locations</h3>
            <ul className="space-y-2 text-sm">
              {geoData.length === 0 ? (
                <li className="text-slate-500">No location data yet.</li>
              ) : (
                geoData.map((item, index) => (
                  <li key={`${item.location}-${index}`} className="flex items-center justify-between rounded-md bg-white px-2 py-1 border border-slate-200">
                    <span className="text-slate-700 truncate mr-2">{item.location}</span>
                    <span className="text-slate-500 font-semibold">{item.count}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
