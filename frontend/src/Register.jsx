import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center p-4">
      <div className="bg-panelBg border border-slate-700 rounded-xl w-full max-w-md p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
          <p className="text-slate-400">Track all your repairs in one place</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-center mb-6 text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-6 rounded-lg text-center">
            <p className="font-bold text-lg mb-2">Registration Successful!</p>
            <p className="text-sm">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white outline-none focus:border-accentBlue" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white outline-none focus:border-accentBlue" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white outline-none focus:border-accentBlue" />
              </div>
            </div>

            <button type="submit" className="w-full bg-accentBlue hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors mt-4">
              Register
            </button>
          </form>
        )}

        {!success && (
          <div className="text-center mt-6 text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-accentBlue hover:underline">Sign In</Link>
          </div>
        )}

      </div>
    </div>
  );
}