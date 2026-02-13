import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { User, Bell } from 'lucide-react';

const DashboardLayout = ({ role }) => {
    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar role={role} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Top Header (Optional - to match the avatar in top right of image) */}
                {/* The image shows the 'LegalMatch Pro' logo on top left (Sidebar) and a user avatar on top right (Header) */}
                <header className="h-16 flex items-center justify-end px-8 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="text-slate-400 hover:text-slate-600">
                            <Bell size={20} />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 overflow-hidden">
                            {/* Placeholder Avatar */}
                            <span className="text-xs font-bold">JD</span>
                        </div>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
