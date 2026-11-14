import { X, Printer, CheckCircle } from 'lucide-react';

export default function InvoiceModal({ ticket, isOpen, onClose }) {
  if (!isOpen || !ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      {/* The Printable Receipt Area */}
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-md p-8 relative shadow-2xl">
        
        {/* Close Button (Hidden when printing) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 print:hidden"
        >
          <X size={24} />
        </button>

        {/* Invoice Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <CheckCircle className="text-emerald-500" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">REPAIR COMPLETED</h1>
          <p className="text-slate-500 text-sm mt-1">Invoice #{ticket.ticket_number}</p>
        </div>

        {/* Customer & Device Info */}
        <div className="border-t border-b border-slate-200 py-4 mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Customer:</span>
            <span className="font-semibold text-slate-800">{ticket.customer_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Device:</span>
            <span className="font-semibold text-slate-800">{ticket.device_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Technician:</span>
            <span className="font-semibold text-slate-800">{ticket.assigned_tech || 'N/A'}</span>
          </div>
        </div>

        {/* Issue Description */}
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Service Performed</p>
          <p className="text-sm text-slate-700">{ticket.issue_description}</p>
        </div>

        {/* Total Cost */}
        <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center mb-8 border border-slate-200">
          <span className="font-semibold text-slate-600">Total Amount Due</span>
          <span className="text-2xl font-bold text-slate-900">
            ${parseFloat(ticket.final_cost || 0).toFixed(2)}
          </span>
        </div>

        {/* Print Button (Hidden when printing) */}
        <div className="print:hidden flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-2 rounded-lg transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 bg-accentBlue hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={18} /> Print / Save PDF
          </button>
        </div>

      </div>
    </div>
  );
}