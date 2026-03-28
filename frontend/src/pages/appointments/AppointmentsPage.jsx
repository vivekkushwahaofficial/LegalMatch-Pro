import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";
import { apiCall } from "../../api/apiConfig";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const acceptedMatches = useMemo(
    () => matches.filter((m) => ["APPROVED", "ACCEPTED"].includes(String(m.matchStatus || "").toUpperCase())),
    [matches]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, matchesData] = await Promise.all([
        apiCall("/appointments/my", "GET"),
        apiCall("/matches/my", "GET"),
      ]);

      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setMatches(Array.isArray(matchesData) ? matchesData : []);
    } catch (error) {
      console.error("Failed to load appointments", error);
      setAppointments([]);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!selectedMatchId || !date || !time) {
      alert("Please select match, date and time");
      return;
    }

    try {
      await apiCall("/appointments", "POST", {
        matchId: Number(selectedMatchId),
        date,
        time,
        status: "SCHEDULED",
      });

      setDate("");
      setTime("");
      await loadData();
      alert("Appointment scheduled successfully");
    } catch (error) {
      console.error("Failed to schedule appointment", error);
      alert(error?.message || "Unable to schedule appointment");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiCall(`/appointments/${id}/update`, "PUT", { status });
      await loadData();
    } catch (error) {
      console.error("Failed to update appointment", error);
      alert("Unable to update appointment");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-blue-600" />
          Appointment Scheduler
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Schedule meetings with accepted matches and track upcoming appointments.
        </p>

        <form onSubmit={handleSchedule} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
          >
            <option value="">Select accepted match</option>
            {acceptedMatches.map((m) => (
              <option key={m.matchId || m.id} value={m.matchId || m.id}>
                {m.matchedUserName} - {m.caseTitle}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold hover:bg-blue-700 transition-colors"
          >
            Schedule
          </button>
        </form>
      </section>

      <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock3 className="w-5 h-5 text-blue-600" />
          Upcoming Appointments
        </h2>

        {loading ? (
          <p className="text-slate-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-slate-500">No appointments scheduled yet.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((item) => {
              const status = String(item.status || "SCHEDULED").toUpperCase();
              return (
                <div key={item.id} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">Case #{item.caseId || "-"}</p>
                    <p className="text-sm text-slate-600">
                      {item.date || "-"} {item.time || ""}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Status: {status}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStatus(item.id, "COMPLETED")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, "CANCELLED")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AppointmentsPage;
