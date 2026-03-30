import {
  Users,
  Activity,
  FileText,
  CheckCircle
} from "lucide-react";

const Analytics = () => {

  const stats = [
    { title: "Total Users", value: 120, icon: Users, color: "bg-blue-500" },
    { title: "Active Users", value: 45, icon: Activity, color: "bg-green-500" },
    { title: "Total Cases", value: 60, icon: FileText, color: "bg-orange-500" },
    { title: "Resolved Cases", value: 40, icon: CheckCircle, color: "bg-purple-500" }
  ];

  return (
    <div className="space-y-8">

      {/* Title */}
      <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} text-white p-6 rounded-xl shadow-lg hover:scale-105 transition`}
          >
            <div className="flex justify-between items-center">
              <stat.icon size={28} />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="mt-3 text-sm opacity-90">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">📈 Case Progress</h2>

        <div className="space-y-4">

          <div>
            <p className="text-sm mb-1">Resolved Cases</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full w-[66%]"></div>
            </div>
          </div>

          <div>
            <p className="text-sm mb-1">Pending Cases</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-yellow-500 h-3 rounded-full w-[34%]"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Fake Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">📊 Monthly Activity</h2>

        <div className="flex items-end gap-4 h-40">

          {[40, 60, 80, 30, 70, 50].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="bg-blue-500 w-full rounded-t-lg"
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs mt-2">M{i + 1}</span>
            </div>
          ))}

        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">🕒 Recent Activity</h2>

        <ul className="space-y-3 text-sm text-gray-600">
          <li>✅ New user registered</li>
          <li>📁 Case submitted</li>
          <li>⚖️ Lawyer assigned</li>
          <li>💬 Chat initiated</li>
        </ul>
      </div>

    </div>
  );
};

export default Analytics;