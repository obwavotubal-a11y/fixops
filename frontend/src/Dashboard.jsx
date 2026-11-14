import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, DollarSign, Ticket, Plus } from 'lucide-react';
import Analytics from './Analytics';
import NewTicketModal from './NewTicketModal';
import EditTicketModal from './EditTicketModal';
import InvoiceModal from './InvoiceModal';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [invoiceTicket, setInvoiceTicket] = useState(null);
  const userRole = localStorage.getItem('user_role');

  // 1. Fetch initial data
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tickets/')
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error("Error fetching tickets:", err));
  }, []);

  // 2. WebSocket for real-time updates
  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/tickets/');

    socket.onopen = () => console.log('✅ WebSocket Connected');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTickets((prevTickets) => {
        const existingTicketIndex = prevTickets.findIndex(t => t.id === data.id);
        if (existingTicketIndex !== -1) {
          const updatedTickets = [...prevTickets];
          updatedTickets[existingTicketIndex] = data;
          return updatedTickets;
        } else {
          return [data, ...prevTickets];
        }
      });
    };

    socket.onerror = (error) => console.error('❌ WebSocket Error:', error);
    return () => socket.close();
  }, []);

  // 3. Stat calculations
  const stats = [
    { title: 'Active Tickets', value: tickets.filter(t => t.status !== 'COMPLETED').length.toString(), change: '+5%', trend: 'up', icon: Ticket },
    ...(userRole === 'MANAGER' ? [{ title: 'Rev. This Month', value: '$24,800', change: '+12%', trend: 'up', icon: DollarSign }] : []),
    { title: 'Avg. Repair Time', value: '4.2h', change: '-2%', trend: 'down', icon: Clock },
  ];

  const columns = [
    { title: 'Open', status: 'OPEN', count: tickets.filter(t => t.status === 'OPEN').length, color: 'bg-slate-500' },
    { title: 'In Progress', status: 'IN_PROGRESS', count: tickets.filter(t => t.status === 'IN_PROGRESS').length, color: 'bg-blue-500' },
    { title: 'Completed', status: 'COMPLETED', count: tickets.filter(t => t.status === 'COMPLETED').length, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-panelBg border border-slate-700/50 rounded-xl p-5 flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-medium flex items-center ${stat.trend === 'up' ? 'text-emerald-400' : 'text-emerald-400'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Service Ticket Queue</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> New Ticket
          </button>
          <button className="bg-accentBlue hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Repair Board ⌄
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col, i) => (
          <div key={i} className="bg-[#0f172a] rounded-xl border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                <h3 className="font-medium text-slate-200">{col.title}</h3>
              </div>
              <span className="bg-slate-800 text-slate-400 text-xs py-1 px-2 rounded-md">{col.count}</span>
            </div>

            <div className="space-y-3">
              {tickets.filter(t => t.status === col.status).map(ticket => (
                <div key={ticket.id} className="bg-panelBg border border-slate-700/50 rounded-lg p-4 shadow-sm hover:border-slate-600 transition-colors cursor-pointer">
                  <p className="text-xs text-slate-500 mb-2">Ticket {ticket.ticket_number}</p>
                  <h4 className="text-sm font-semibold text-white mb-1">{ticket.device_name}</h4>
                  <p className="text-xs text-slate-400 mb-3">{ticket.issue_description}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className={`text-xs font-medium ${
                      ticket.priority === 'HIGH' ? 'text-red-400' : 
                      ticket.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-emerald-400'
                    }`}>
                      {ticket.priority} Priority
                    </span>
                    
                    {/* SECURE BUTTON LOGIC */}
                    {ticket.status === 'COMPLETED' && userRole === 'MANAGER' ? (
                      <button 
                        onClick={() => setInvoiceTicket(ticket)}
                        className="text-xs px-3 py-1.5 rounded transition-colors text-white bg-emerald-600 hover:bg-emerald-500"
                      >
                        Invoice
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-xs px-3 py-1.5 rounded transition-colors text-white bg-slate-800 hover:bg-slate-700"
                      >
                        View
                      </button>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ONLY FOR MANAGERS */}
      {userRole === 'MANAGER' && <Analytics tickets={tickets} />}
      
      {/* ALL MODALS */}
      <NewTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTicketAdded={(newTicket) => setTickets([newTicket, ...tickets])} 
      />

      <EditTicketModal 
        isOpen={selectedTicket !== null} 
        ticket={selectedTicket} 
        onClose={() => setSelectedTicket(null)}
        onTicketUpdated={(updatedTicket) => {
          setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        }}
      />

      <InvoiceModal 
        isOpen={invoiceTicket !== null} 
        ticket={invoiceTicket} 
        onClose={() => setInvoiceTicket(null)} 
      />

    </div>
  );
}