import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/password_reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setMessage('If an account exists with that email, a reset link has been sent.');
      } else {
        throw new Error('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center p-4">
      <div className="bg-panelBg border border-slate-700 rounded-xl w-full max-w-md p-8 shadow-2xl">
        
        <Link to="/login" className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 text-sm">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-400 text-sm">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-center mb-6 text-sm">{error}</div>}
        {message && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-center mb-6 text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white outline-none focus:border-accentBlue" 
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-accentBlue hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
            Send Reset Link
          </button>
        </form>

      </div>
    </div>
  );
}