import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LawyerDashboard = () => {
    const [lawyerData, setLawyerData] = useState({
        activeCases: 0,
        newInquiries: 0,
        requests: []
    });

    useEffect(() => {
        fetchLawyerData();
    }, []);

    const fetchLawyerData = async () => {
        try {
            // 👉 Replace with your real backend API later
            const response = await fetch("http://localhost:8080/lawyer/dashboard");

            if (!response.ok) {
                throw new Error("API not available");
            }

            const data = await response.json();
            setLawyerData(data);

        } catch (error) {
            console.log("Using fallback dummy data");

            // 🔥 Fallback dummy data (so UI doesn't break)
            setLawyerData({
                activeCases: 12,
                newInquiries: 5,
                requests: [
                    { id: 1, clientName: "Dharshini", caseId: 101 },
                    { id: 2, clientName: "Rahul", caseId: 102 }
                ]
            });
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lawyer Dashboard</h1>
            <p>Welcome to the Lawyer Dashboard.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Active Cases */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg">My Active Cases</h3>
                    <p className="text-3xl font-bold mt-2">
                        {lawyerData.activeCases}
                    </p>
                </div>

                {/* New Inquiries */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg">New Inquiries</h3>
                    <p className="text-3xl font-bold mt-2">
                        {lawyerData.newInquiries}
                    </p>
                </div>

                {/* Requests */}
                <Link
                    to="/lawyer/requests"
                    className="bg-blue-600 p-6 rounded-xl shadow-md border border-blue-700 text-white hover:bg-blue-700 transition-all"
                >
                    <h3 className="font-bold text-lg">Connection Requests</h3>
                    <p className="text-sm opacity-90 mt-2">
                        {lawyerData.requests.length} pending requests — Review and approve new chat requests from clients.
                    </p>
                </Link>

            </div>

            {/* Optional: Show request list */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Recent Requests</h2>

                {lawyerData.requests.length === 0 ? (
                    <p>No requests found.</p>
                ) : (
                    <ul className="space-y-2">
                        {lawyerData.requests.map((req) => (
                            <li key={req.id} className="p-3 border rounded-lg bg-gray-50">
                                <p><strong>Client:</strong> {req.clientName}</p>
                                <p><strong>Case ID:</strong> {req.caseId}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    );
};

export default LawyerDashboard;