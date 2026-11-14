import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddPartModal({ isOpen, onClose, onPartAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    stock_quantity: 0,
    cost_price: 0,
    selling_price: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://127.0.0.1:8000/api/inventory/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to add part");
      return res.json();
    })
    .then(data => {
      onPartAdded(data); 
      setFormData({ name: '', sku: '', stock_quantity: 0, cost_price: 0, selling_price: 0 });
      onClose();
    })
    .catch(err => console.error("Error adding part:", err));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-panelBg border border-slate-700 rounded-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6">Add New Part</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Part Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue" placeholder="e.g. iPhone 13 Screen" />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">SKU (Part Number)</label>
            <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue" placeholder="e.g. SCR-IP13" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Stock Qty</label>
              <input required type="number" min="0" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Cost Price ($)</label>
              <input required type="number" step="0.01" min="0" value={formData.cost_price} onChange={e => setFormData({...formData, cost_price: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Selling Price ($)</label>
            <input required type="number" step="0.01" min="0" value={formData.selling_price} onChange={e => setFormData({...formData, selling_price: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-accentBlue" />
          </div>
          
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-lg transition-colors mt-2">
            Save Part
          </button>
        </form>
      </div>
    </div>
  );
}