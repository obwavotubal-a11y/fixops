import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EditTicketModal({ ticket, isOpen, onClose, onTicketUpdated }) {
  const [formData, setFormData] = useState({
    status: '',
    assigned_tech: '',
    final_cost: 0,
    priority: ''
  });

  // Load the ticket data into the form when the modal opens
  useEffect(() => {
    if (ticket) {
      setFormData({
        status: ticket.status,
        assigned_tech: ticket.assigned_tech || '',
        final_cost: ticket.final_cost || 0,
        priority: ticket.priority
      });
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Send the update to Django
    fetch(`http://127.0.0.1:8000/api/tickets/${ticket.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      onTicketUpdated(data); // Update the dashboard
      onClose(); // Close modal
    })
    .catch(err => console.error("Error updating ticket:", err));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-panelBg border border-slate-700 rounded-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        
        <div className="mb-6">
          <p className="text-xs text-slate-400 mb-1">Editing Ticket {ticket.ticket_number}</p>
          <h2 className="text-xl font-bold text-white">{ticket.device_name}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue">
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="AWAITING_PARTS">Awaiting Parts</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Assigned Technician</label>
            <input type="text" placeholder="e.g. Sarah K." value={formData.assigned_tech} onChange={e => setFormData({...formData, assigned_tech: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue" />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Final Cost ($)</label>
            <input type="number" step="0.01" value={formData.final_cost} onChange={e => setFormData({...formData, final_cost: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue" />
          </div>
          
          <button type="submit" className="w-full bg-accentBlue hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors mt-2">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}