import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FolderKanban, User, Mail, ShieldCheck,Activity } from 'lucide-react';
import AdminProjectsPanel from '../components/AdminProjectsPanel';
import AdminOperatorPanel from '../components/AdminOperatorPanel';
import AdminTelemetryPanel from '../components/AdminTelemetryPanel';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');

  // Security Check: Kick out unauthenticated users
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // Redirect back to your secret login route if no token is found
      navigate(import.meta.env.VITE_SECRET_LOGIN_ROUTE || '/jyoti/2006');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex selection:bg-red-500">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-900 flex flex-col relative z-20">
        <div className="p-6 border-b border-neutral-900 flex items-center gap-3">
          <ShieldCheck className="text-red-500" size={24} />
          <h1 className="font-bold tracking-widest uppercase text-sm">Control Room</h1>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-mono tracking-wide transition-all ${
              activeTab === 'projects' ? 'bg-red-950/40 text-red-500 border border-red-900/50' : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <FolderKanban size={18} /> Project Overrides
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-mono tracking-wide transition-all ${
              activeTab === 'profile' ? 'bg-red-950/40 text-red-500 border border-red-900/50' : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <User size={18} /> Operator Profile
          </button>

          {/* Inside your sidebar rendering area */}
<button 
  onClick={() => setActiveTab('telemetry')}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm tracking-wide transition-all ${
    activeTab === 'telemetry' ? 'bg-red-950/50 text-red-500 border border-red-900/50' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
  }`}
>
  <Activity size={18} /> Telemetry
</button>
        </nav>

        <div className="p-4 border-t border-neutral-900">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded-lg text-sm font-mono tracking-wide text-neutral-500 hover:text-red-500 hover:bg-red-950/20 transition-all"
          >
            <LogOut size={18} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative z-10 p-10 max-w-5xl mx-auto">
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-4">Project Overrides</h2>
              <p className="text-neutral-400 font-mono text-sm">Select a GitHub repository below to inject custom architectures, roles, and live links.</p>
              
              {/* The new data panel */}
              <AdminProjectsPanel />
              
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-4">Operator Profile</h2>
              <p className="text-neutral-400 font-mono text-sm">Modify system bio, tech stack categories, and documentation archives.</p>

              {/* The new data panel */}
              <AdminOperatorPanel />

            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-4">Academic Telemetry</h2>
              <p className="text-neutral-400 font-mono text-sm">Inject semester SPI grades to synchronize with the homepage matrix.</p>

              {/* The new data panel */}
              <AdminTelemetryPanel />

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;