const CitizenDashboard = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Citizen Dashboard</h1>
            <p>Welcome to the Citizen Dashboard.</p>
            <div className="mt-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Submit New Legal Request
                </button>
            </div>
        </div>
    );
};

export default CitizenDashboard;
