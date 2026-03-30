import { Link } from "react-router-dom";
import { Users, ShieldCheck, Briefcase, ScrollText } from "lucide-react";

const AdminDashboard = () => {
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
    </div>
  );
};

export default AdminDashboard;
