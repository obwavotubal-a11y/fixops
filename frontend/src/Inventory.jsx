import { useState, useEffect } from 'react';
import { Package, Plus, AlertTriangle } from 'lucide-react';
import AddPartModal from './AddPartModal';

export default function Inventory() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/inventory/')
      .then(res => res.json())
      .then(data => {
        setParts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching inventory:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Inventory Management</h2>
          <p className="text-slate-400 text-sm">Track your parts and stock levels</p>
        </div>
                <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Part
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-panelBg border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-700">
              <th className="p-4 font-medium">Part Name</th>
              <th className="p-4 font-medium">SKU</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Cost Price</th>
              <th className="p-4 font-medium">Selling Price</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">Loading inventory...</td>
              </tr>
            ) : parts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  <Package size={32} className="mx-auto mb-2 text-slate-600" />
                  No parts in inventory yet.
                </td>
              </tr>
            ) : (
              parts.map(part => (
                <tr key={part.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-white font-medium">{part.name}</td>
                  <td className="p-4 text-slate-400">{part.sku}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-2 font-medium ${
                      part.stock_quantity < 5 ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {part.stock_quantity < 5 && <AlertTriangle size={14} />}
                      {part.stock_quantity}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">${part.cost_price}</td>
                  <td className="p-4 text-emerald-400 font-medium">${part.selling_price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
              <AddPartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPartAdded={(newPart) => setParts([...parts, newPart])} 
      />
      </div>

    </div>
  );
}