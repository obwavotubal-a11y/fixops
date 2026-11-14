import { LayoutDashboard, Ticket, Box, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
    const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Tickets', icon: Ticket, path: '/tickets' },
    { name: 'Inventory', icon: Box, path: '/inventory' },
    { name: 'Techs', icon: Users, path: '/techs' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

   const handleLogout = () => {
    localStorage.clear(); // Clears the token and role
    window.location.href = '/login'; // Forces a full page reload to the login screen
  };

  return (
    <div className="w-64 h-screen bg-[#0b1120] border-r border-slate-800 flex flex-col">
      
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="text-accentBlue font-bold text-xl flex items-center gap-2">
          <span className="text-2xl">🛠️</span> FixOps Manager
        </div>
      </div>

            {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout Area (Bottom) */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Alex R.</p>
            <p className="text-xs text-slate-400">Manager</p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 p-2 rounded-lg transition-colors"
          title="Log Out"
        >
          <LogOut size={20} />
        </button>
      </div>

    </div>
  );
}