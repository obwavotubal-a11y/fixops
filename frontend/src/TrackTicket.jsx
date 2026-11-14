import { useState } from 'react';
import { Search, Laptop } from 'lucide-react';

export default function TrackTicket() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [pin, setPin] = useState('');
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setTicket(null);
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/track/?ticket_number=${ticketNumber}&pin=${pin}`);
      
      if (!res.ok) {
        throw new Error('Ticket not found or PIN incorrect');
      }

      const data = await res.json();
      setTicket(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Track Your Repair</h1>
          <p className="text-slate-400">Enter your ticket number and PIN to see the live status.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input 
            type="text" 
            placeholder="Ticket # (e.g. 1001)"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            className="flex-1 bg-panelBg border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-accentBlue"
            required
          />
          <input 
            type="text" 
            placeholder="PIN (e.g. 1234)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-32 bg-panelBg border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-accentBlue"
            required
          />
          <button type="submit" className="bg-accentBlue hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Search size={18} /> Track
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-center mb-8">
            {error}
          </div>
        )}

        {/* Ticket Result */}
        {ticket && (
          <div className="bg-panelBg border border-slate-700 rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Ticket {ticket.ticket_number}</p>
                <h2 className="text-xl font-bold text-white">{ticket.device_name}</h2>
                <p className="text-sm text-slate-400">{ticket.customer_name || 'Customer'}</p>
              </div>
              <Laptop className="text-slate-500" size={32} />
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400">Issue</span>
                <span className="text-white text-right">{ticket.issue_description}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400">Priority</span>
                <span className={`font-medium ${
                  ticket.priority === 'HIGH' ? 'text-red-400' : 
                  ticket.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>{ticket.priority}</span>
              </div>
            </div>

            {/* Progress Bar (Visuals based on status) */}
            <div className="mt-8">
              <p className="text-sm text-slate-400 mb-4">Current Status</p>
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-2 rounded-full ${ticket.status === 'OPEN' ? 'bg-slate-400' : 'bg-slate-700'}`}></div>
                <div className={`flex-1 h-2 rounded-full ${ticket.status === 'IN_PROGRESS' ? 'bg-accentBlue' : ticket.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                <div className={`flex-1 h-2 rounded-full ${ticket.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
              </div>
              <div className="flex justify-between mt-2 text-xs font-medium">
                <span className={ticket.status === 'OPEN' ? 'text-white' : 'text-slate-500'}>Received</span>
                <span className={ticket.status === 'IN_PROGRESS' ? 'text-white' : 'text-slate-500'}>Repairing</span>
                <span className={ticket.status === 'COMPLETED' ? 'text-white' : 'text-slate-500'}>Ready</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}