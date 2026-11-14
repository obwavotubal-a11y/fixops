import { useState } from 'react';
import { X } from 'lucide-react';

export default function NewTicketModal({ isOpen, onClose, onTicketAdded }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    device_name: '',
    issue_description: '',
    priority: 'MEDIUM',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://127.0.0.1:8000/api/tickets/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      onTicketAdded(data); // Tell Dashboard to add it
      setFormData({ customer_name: '', device_name: '', issue_description: '', priority: 'MEDIUM' }); // Reset form
      onClose(); // Close modal
    })
    .catch(err => console.error("Error creating ticket:", err));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-panelBg border border-slate-700 rounded-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6">Create New Ticket</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Customer Name</label>
            <input required type="text" value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue" />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">Device Name</label>
            <input required type="text" value={formData.device_name} onChange={e => setFormData({...formData, device_name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue" />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">Issue Description</label>
            <textarea required value={formData.issue_description} onChange={e => setFormData({...formData, issue_description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue h-24 resize-none" />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">Priority</label>
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          
          <button type="submit" className="w-full bg-accentBlue hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors mt-2">
            Create Ticket
          </button>
        </form>
      </div>
    </div>
  );
}