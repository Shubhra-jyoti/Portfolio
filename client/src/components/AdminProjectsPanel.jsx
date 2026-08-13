import { useState, useEffect } from 'react';
import { Save, Loader2, Globe, EyeOff } from 'lucide-react';

const AdminProjectsPanel = () => {
  const [repos, setRepos] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    customDescription: '',
    role: '',
    liveUrl: '',
    isHidden: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch GitHub Repos
      // 1. Fetch GitHub Repos
      const repoRes = await fetch('http://localhost:5000/api/projects');
      const repoPayload = await repoRes.json();
      
      // Extract the actual array from the "data" key
      const repoData = repoPayload.data || repoPayload; 
      
      console.log("RAW REPO DATA FROM BACKEND:", repoData); 

      // 2. Fetch Overrides
      const metaRes = await fetch('http://localhost:5000/api/projects/meta');
      const metaPayload = await metaRes.json();
      
      const metaData = metaPayload.data || metaPayload;

      console.log("RAW OVERRIDE DATA FROM BACKEND:", metaData); 

      // STRICT ARRAY ENFORCEMENT
      setRepos(Array.isArray(repoData) ? repoData : []);
      setOverrides(Array.isArray(metaData) ? metaData : []);
      if (!Array.isArray(repoData)) {
         setMessage({ text: 'Warning: Backend did not return a valid array for repositories.', type: 'error' });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Fetch failure:", error);
      setMessage({ text: 'Failed to establish database connection.', type: 'error' });
      setIsLoading(false);
    }
  };

  const handleRepoSelect = (e) => {
    const repoId = e.target.value;
    setSelectedRepo(repoId);
    
    // Auto-fill logic
    const existing = overrides.find(o => o.repoId === repoId);
    if (existing) {
      setFormData({
        customDescription: existing.customDescription || '',
        role: existing.role || '',
        liveUrl: existing.liveUrl || '',
        isHidden: existing.isHidden || false
      });
    } else {
      setFormData({ customDescription: '', role: '', liveUrl: '', isHidden: false });
    }
    setMessage({ text: '', type: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    // Safe lookup
    const repoDetails = Array.isArray(repos) ? repos.find(r => r.id.toString() === selectedRepo) : null;
    
    if (!repoDetails) {
        setMessage({ text: 'Critical Error: Cannot locate repository details.', type: 'error' });
        setIsSaving(false);
        return;
    }

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('http://localhost:5000/api/projects/meta/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          repoId: selectedRepo,
          repoName: repoDetails.name,
          ...formData
        })
      });

      if (response.ok) {
        setMessage({ text: 'Override successfully injected into mainframe.', type: 'success' });
        fetchData(); 
      } else {
        setMessage({ text: 'Transmission rejected. Check backend logs.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error during save operation.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center gap-3 text-neutral-500 font-mono"><Loader2 className="animate-spin" /> Syncing with repository network...</div>;
  }

  return (
    <div className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-6">
      <div className="mb-6">
        <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">Target Repository</label>
        <select 
          value={selectedRepo} 
          onChange={handleRepoSelect}
          className="w-full bg-black border border-neutral-700 rounded-lg py-3 px-4 text-white outline-none focus:border-red-500 font-mono text-sm"
        >
          <option value="">-- Initialize Selection --</option>
          {/* Safe map rendering */}
          {Array.isArray(repos) && repos.map(repo => (
            <option key={repo.id} value={repo.id}>{repo.name}</option>
          ))}
        </select>
      </div>

      {selectedRepo && (
        <form onSubmit={handleSave} className="space-y-5 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">Operator Role</label>
              <input 
                type="text" 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                placeholder="e.g., Frontend Architect, Backend Developer"
                className="w-full bg-black/50 border border-neutral-800 rounded-lg py-2 px-3 text-white outline-none focus:border-red-500 font-sans text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">Live Production URL</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                <input 
                  type="url" 
                  value={formData.liveUrl}
                  onChange={e => setFormData({...formData, liveUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-black/50 border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-white outline-none focus:border-red-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">Architecture Override (Custom Description)</label>
            <textarea 
              value={formData.customDescription}
              onChange={e => setFormData({...formData, customDescription: e.target.value})}
              rows="4"
              placeholder="Override the default GitHub description with specific technical details..."
              className="w-full bg-black/50 border border-neutral-800 rounded-lg py-2 px-3 text-white outline-none focus:border-red-500 font-sans text-sm resize-none"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-black/40 border border-neutral-800 rounded-lg">
            <input 
              type="checkbox" 
              id="hideRepo"
              checked={formData.isHidden}
              onChange={e => setFormData({...formData, isHidden: e.target.checked})}
              className="w-4 h-4 accent-red-600"
            />
            <label htmlFor="hideRepo" className="text-sm font-mono tracking-wide text-neutral-300 flex items-center gap-2 cursor-pointer">
              <EyeOff size={16} /> Hide this project from the public portfolio
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
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
      )}
    </div>
  );
};

export default AdminProjectsPanel;