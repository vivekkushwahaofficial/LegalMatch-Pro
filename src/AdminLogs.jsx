import { useEffect, useState } from "react";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);

  // Temporary dummy data (since backend may not be ready)
  useEffect(() => {
    const dummyLogs = [
      { id: 1, message: "User Dharshini logged in", level: "INFO", timestamp: "2026-03-28 10:00" },
      { id: 2, message: "Case created successfully", level: "INFO", timestamp: "2026-03-28 10:05" },
      { id: 3, message: "Failed to fetch lawyers", level: "ERROR", timestamp: "2026-03-28 10:10" },
      { id: 4, message: "Unauthorized access attempt", level: "WARN", timestamp: "2026-03-28 10:15" }
    ];

    setLogs(dummyLogs);
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-4">System Logs</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Message</th>
            <th className="p-2">Level</th>
            <th className="p-2">Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="p-2">{log.id}</td>
              <td className="p-2">{log.message}</td>

              <td className={`p-2 font-semibold ${
                log.level === "ERROR"
                  ? "text-red-500"
                  : log.level === "WARN"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}>
                {log.level}
              </td>

              <td className="p-2">{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}