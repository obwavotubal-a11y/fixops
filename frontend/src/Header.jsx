import { Bell, Search, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-[#0b1120] border-b border-slate-800 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="flex items-center bg-slate-800/50 rounded-lg px-4 py-2 w-96 border border-slate-700/50">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search Tickets, Devices..." 
          className="bg-transparent border-none outline-none text-sm text-white ml-3 w-full placeholder-slate-500"
        />
      </div>

      {/* Right Side: Notifications & Profile */}
      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">
            👤
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white leading-tight">Alex R.</span>
            <span className="text-xs text-slate-400">Manager</span>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}