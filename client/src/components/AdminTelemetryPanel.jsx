import { useState, useEffect } from 'react';
import { Save, Loader2, Activity, Trash2, GraduationCap } from 'lucide-react';

const AdminTelemetryPanel = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    semester: '',
    spi: ''
  });

  // Fetch current stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats');
      const payload = await response.json();
      setStats(payload.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch failure:", error);
      setMessage({ text: 'Failed to establish database connection.', type: 'error' });
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('http://localhost:5000/api/stats/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          semester: Number(formData.semester),
          spi: Number(formData.spi)
        })
      });

      if (response.ok) {
        setMessage({ text: 'Telemetry data successfully injected.', type: 'success' });
        setFormData({ semester: '', spi: '' }); // Clear the form
        fetchStats(); // Refresh the list
      } else {
        setMessage({ text: 'Transmission rejected. Invalid token or data.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error during save operation.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (semesterNum) => {
    if (!window.confirm(`Are you sure you want to purge Semester ${semesterNum} data?`)) return;
    
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`http://localhost:5000/api/stats/${semesterNum}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchStats(); // Refresh the list
      }
    } catch (error) {
      console.error("Delete failure:", error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center gap-3 text-neutral-500 font-mono"><Loader2 className="animate-spin" /> Accessing academic records...</div>;
  }

  return (
    <div className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-6 animate-fade-in space-y-8">
      
      {/* INPUT FORM SECTION */}
      <form onSubmit={handleSave} className="space-y-6 border-b border-neutral-800 pb-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
          <Activity size={16} /> Log Semester Data
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">Semester Number</label>
            <input 
              type="number" 
              name="semester"
              min="1"
              max="10"
              value={formData.semester}
              onChange={handleInputChange}
              placeholder="e.g., 1"
              required
              className="w-full bg-black/50 border border-neutral-800 rounded-lg py-2 px-3 text-white outline-none focus:border-red-500 font-mono text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">SPI Score</label>
            <input 
              type="number" 
              name="spi"
              step="0.01"
              min="0"
              max="10"
              value={formData.spi}
              onChange={handleInputChange}
              placeholder="e.g., 9.0"
              required
              className="w-full bg-black/50 border border-neutral-800 rounded-lg py-2 px-3 text-white outline-none focus:border-red-500 font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm font-mono">
            {message.text && (
              <span className={message.type === 'success' ? 'text-green-500' : 'text-red-500'}>
                [{message.type.toUpperCase()}] {message.text}
              </span>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-red-900/80 hover:bg-red-700 text-white font-bold tracking-widest uppercase text-sm rounded transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Inject Data
          </button>
        </div>
      </form>

      {/* CURRENT DATA ARCHIVE */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
          <GraduationCap size={16} /> Data Archives
        </h3>
        
        {stats.length === 0 ? (
          <p className="text-xs text-neutral-600 font-mono italic">No telemetry data found in the database.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.semester} className="bg-black border border-neutral-800 p-4 rounded-lg flex items-center justify-between group hover:border-neutral-600 transition-colors">
                <div>
                  <div className="text-xs font-mono text-neutral-500 tracking-widest uppercase mb-1">Semester {stat.semester}</div>
                  <div className="text-2xl font-bold text-white">{stat.spi.toFixed(2)}</div>
                </div>
                <button 
                  onClick={() => handleDelete(stat.semester)}
                  className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-950/30 rounded transition-all"
                  title="Purge Record"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminTelemetryPanel;