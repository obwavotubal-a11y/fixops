import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      // Send the new password to Django
      const res = await fetch('http://127.0.0.1:8000/api/reset/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token, new_password: password })
      });

      if (!res.ok) {
        throw new Error('Invalid or expired reset link. Please request a new one.');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center p-4">
      <div className="bg-panelBg border border-slate-700 rounded-xl w-full max-w-md p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Set New Password</h1>
          <p className="text-slate-400 text-sm">Please enter your new password below.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-center mb-6 text-sm">{error}</div>}

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-6 rounded-lg text-center">
            <CheckCircle size={48} className="mx-auto mb-4" />
            <p className="font-bold text-lg mb-2">Password Reset Successful!</p>
            <p className="text-sm">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white outline-none focus:border-accentBlue" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white outline-none focus:border-accentBlue" 
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-accentBlue hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors mt-4">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}