import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await res.json();
      
      // Save the token to local storage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_role', data.role);       
      localStorage.setItem('username', data.username); 
      
      // Update App state and redirect to dashboard
      setAuth(true);
      navigate('/');
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center p-4">
      <div className="bg-panelBg border border-slate-700 rounded-xl w-full max-w-md p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="text-accentBlue font-bold text-2xl flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">🛠️</span> FixOps Manager
          </div>
          <p className="text-slate-400">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-center mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white outline-none focus:border-accentBlue"
                required
              />
            </div>
          </div>

                    <div>
            {/* 👇 REPLACE THE LABEL LINE WITH THESE 4 LINES 👇 */}
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-slate-400">Password</label>
              <Link to="/forgot-password" className="text-xs text-accentBlue hover:underline">Forgot password?</Link>
            </div>
            {/* 👆 END OF NEW LINES 👆 */}

            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white outline-none focus:border-accentBlue"
                placeholder="Enter password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-accentBlue hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
}