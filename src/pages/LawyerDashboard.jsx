const LawyerDashboard = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lawyer Dashboard</h1>
            <p>Welcome to the Lawyer Dashboard.</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder cards */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg">My Active Cases</h3>
                    <p className="text-3xl font-bold mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg">New Inquiries</h3>
                    <p className="text-3xl font-bold mt-2">5</p>
                </div>
            </div>
        </div>
    );
};

export default LawyerDashboard;
