import { Link } from "react-router-dom";

const CitizenDashboard = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-500 mb-8 font-medium italic">Empowering your legal journey with data-driven aid.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/citizen/submit-case" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Submit New Case</h3>
                    <p className="text-sm text-gray-500 mb-4">Tell us about your situation so we can find the best matches.</p>
                    <span className="text-blue-600 font-bold group-hover:underline">Start Now →</span>
                </Link>

                <Link to="/citizen/matches" className="bg-blue-600 p-8 rounded-2xl shadow-lg border border-blue-700 text-white hover:bg-blue-700 transition-all group">
                    <h3 className="text-xl font-bold mb-2">My Matches</h3>
                    <p className="text-sm opacity-90 mb-4">View NGOs and Lawyers who matched with your case profile.</p>
                    <span className="font-bold border-b-2 border-white/50">View Matches →</span>
                </Link>

                <Link to="/citizen/chat" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group md:col-span-2 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Active Chats</h3>
                        <p className="text-sm text-gray-500">Continue your conversations with approved legal aides.</p>
                    </div>
                    <span className="bg-blue-50 text-blue-600 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest group-hover:bg-blue-100">Open Inbox</span>
                </Link>
            </div>
        </div>
    );
};

export default CitizenDashboard;
