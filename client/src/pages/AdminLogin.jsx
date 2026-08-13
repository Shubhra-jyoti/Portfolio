import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Terminal, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // Securely store the JWT token
        localStorage.setItem('adminToken', data.token);
        // Route to the dashboard (we will build this next)
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Authentication failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Network failure. Cannot reach authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-8 font-sans selection:bg-red-500">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-black to-black pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-neutral-950/90 border border-red-900/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(239,68,68,0.15)] backdrop-blur-md">
          
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-black border border-red-900 rounded-full text-red-500 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <ShieldAlert size={32} />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-white">
              Restricted Access
            </h1>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mt-2">
              Provide operator credentials
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                Operator ID
              </label>
              <div className="relative">
                <Terminal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                <input 
                  type="text" 
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all font-mono"
                  placeholder="Enter ID..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                Passcode
              </label>
              <input 
                type="password" 
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all font-mono tracking-widest"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900 rounded-lg text-red-500 text-xs font-mono tracking-wide text-center">
                [ ERROR ] {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full p-4 rounded-lg bg-red-900/80 hover:bg-red-700 text-white font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Authenticate'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;