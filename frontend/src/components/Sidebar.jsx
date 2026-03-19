import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  Shield,
  Briefcase,
  User,
  Building2,
  Search,
  BarChart,
  FolderOpen
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    // remove stored login data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");

    // redirect to login page
    navigate("/login");
  };

  // Simplified navigation structure based on the image
  // Image shows: Profile Management, Case Submission, Directory, Matches, Impact Dashboard, Admin Panel
  // We'll map these somewhat to roles or just show them all for Admin to match the image structure
  const getLinks = (role) => {
    // For the purpose of "matching the image", we'll use the Admin view as the primary example
    // but keep the role logic for other users.
    if (role === 'admin') {
      return [
        { name: 'Profile Management', path: '/admin/profiles', icon: User },
        { name: 'Case Submission', path: '/admin/cases', icon: FolderOpen },
        { name: 'Directory', path: '/admin/directory', icon: Search },
        { name: 'Matches', path: '/admin/matches', icon: Shield },
        { name: 'Impact Dashboard', path: '/admin/impact', icon: BarChart },
        { name: 'Admin Panel', path: '/admin', icon: Settings },
      ];
    }

    // Role specific fallbacks
    switch (role) {
      case 'lawyer': return [{ name: 'My Cases', path: '/lawyer', icon: Briefcase }];
      case 'ngo': return [{ name: 'Impact Dashboard', path: '/ngo', icon: Building2 }];
      case 'citizen':
        return [
          { name: 'Profile Management', path: '/citizen/profile', icon: User },
          { name: 'Case Submission', path: '/citizen/submit-case', icon: FolderOpen },
          { name: 'Directory', path: '/citizen/lawyers', icon: Search },
          { name: 'Matches', path: '/citizen/matches', icon: Shield },
          { name: 'Impact Dashboard', path: '/citizen', icon: BarChart }, // temporary
        ];
      default: return [];
    }
  };

  const links = getLinks(role);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
        flex flex-col h-screen
      `}>

        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          {/* Using a simple text logo or icon to match the 'LegalMatch Pro' in the image */}
          <div className="flex items-center gap-2 text-slate-900">
            <Shield className="text-blue-700" fill="currentColor" size={24} />
            <span className="text-xl font-bold tracking-tight">LegalMatch Pro</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-slate-50 text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
              `}
            >
              <link.icon size={18} strokeWidth={2} />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink to={`/${role}/chat`}>
          Chat
        </NavLink>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-slate-100">
          {/* Placeholder for user profile at bottom if needed, though image shows it top right maybe? */}
          {/* The image shows a user avatar in the top right of the main content. We'll leave sidebar simple. */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium px-3"
          >            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
