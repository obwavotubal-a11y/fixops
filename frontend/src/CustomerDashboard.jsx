import { useState, useEffect } from 'react';
import { Laptop, LogOut } from 'lucide-react';

export default function CustomerDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    fetch('http://127.0.0.1:8000/api/tickets/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-darkBg p-8 text-white">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-accentBlue">My Repairs</h1>
            <p className="text-slate-400">Welcome back, {username}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 mt-10">Loading your devices...</p>
        ) : tickets.length === 0 ? (
          <div className="text-center mt-20">
            <Laptop size={64} className="mx-auto text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No devices found</h2>
            <p className="text-slate-400">You don't have any active repairs with us right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-panelBg border border-slate-700 rounded-xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{ticket.ticket_number}</p>
                    <h3 className="text-lg font-bold">{ticket.device_name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">{ticket.issue_description}</p>
                
                {ticket.status === 'COMPLETED' && (
                  <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                    <span className="text-sm text-slate-400">Total Cost</span>
                    <span className="font-bold text-emerald-400">${ticket.final_cost}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}