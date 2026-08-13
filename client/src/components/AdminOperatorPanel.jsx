import { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, FileText, UserCircle, Code2, Server, Database, Plus, Trash2 } from 'lucide-react';

const AdminOperatorPanel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    avatarUrl: '',
    bio: '',
    resumes: [], // <-- Upgraded to an array
    frontendTech: '',
    backendTech: '',
    databaseTech: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/operator');
      const payload = await response.json();
      
      const data = payload.data || {};

      setFormData({
        avatarUrl: data.avatarUrl || '',
        bio: data.bio || '',
        resumes: Array.isArray(data.resumes) ? data.resumes : [], // <-- Load array
        frontendTech: Array.isArray(data.frontendTech) ? data.frontendTech.join(', ') : '',
        backendTech: Array.isArray(data.backendTech) ? data.backendTech.join(', ') : '',
        databaseTech: Array.isArray(data.databaseTech) ? data.databaseTech.join(', ') : '' 
      });
      
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

  // --- NEW DYNAMIC RESUME HANDLERS ---
  const handleAddResume = () => {
    setFormData({
      ...formData,
      resumes: [...formData.resumes, { title: '', url: '' }]
    });
  };

  const handleRemoveResume = (index) => {
    const newResumes = formData.resumes.filter((_, i) => i !== index);
    setFormData({ ...formData, resumes: newResumes });
  };

  const handleResumeChange = (index, field, value) => {
    const newResumes = [...formData.resumes];
    newResumes[index][field] = value;
    setFormData({ ...formData, resumes: newResumes });
  };
  // -----------------------------------

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    const token = localStorage.getItem('adminToken');

    const formatArray = (str) => str.split(',').map(item => item.trim()).filter(Boolean);

    // Filter out any blank resume slots before saving
    const cleanedResumes = formData.resumes.filter(r => r.title.trim() !== '' && r.url.trim() !== '');

    const payloadToSave = {
      avatarUrl: formData.avatarUrl,
      bio: formData.bio,
      resumes: cleanedResumes, // <-- Save array
      frontendTech: formatArray(formData.frontendTech),
      backendTech: formatArray(formData.backendTech),
      databaseTech: formatArray(formData.databaseTech) 
    };

    try {
      const response = await fetch('http://localhost:5000/api/operator/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payloadToSave)
      });

      if (response.ok) {
        setMessage({ text: 'Operator profile successfully synchronized.', type: 'success' });
        // Update local state to match the cleaned version we just sent
        setFormData(prev => ({ ...prev, resumes: cleanedResumes }));
      } else {
        setMessage({ text: 'Transmission rejected. Invalid token.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error during save operation.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center gap-3 text-neutral-500 font-mono"><Loader2 className="animate-spin" /> Syncing operator data...</div>;
  }

  return (
    <div className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-6 animate-fade-in">
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Identity Section */}
        <div className="space-y-4 border-b border-neutral-800 pb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
            <UserCircle size={16} /> Core Identity
          </h3>
          
          <div>
            <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">Avatar URL (GitHub Direct Link)</label>
            <div className="relative">
              <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
              <input 
                type="url" 
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username.png"
                className="w-full bg-black/50 border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-white outline-none focus:border-red-500 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">System Bio</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter operator biography..."
              className="w-full bg-black/50 border border-neutral-800 rounded-lg py-2 px-3 text-white outline-none focus:border-red-500 font-sans text-sm resize-none"
            />
          </div>
        </div>

        {/* Dynamic Resume Section */}
        <div className="space-y-4 border-b border-neutral-800 pb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
              <FileText size={16} /> Document Archives
            </h3>
            <button 
              type="button" 
              onClick={handleAddResume}
              className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 border border-neutral-700 hover:border-neutral-500 px-3 py-1 rounded transition-all"
            >
              <Plus size={12} /> Add Document Slot
            </button>
          </div>
          
          {formData.resumes.length === 0 ? (
            <p className="text-xs text-neutral-600 font-mono italic">No document slots active. Click above to add.</p>
          ) : (
            <div className="space-y-3">
              {formData.resumes.map((resume, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-3 items-center bg-black/30 p-3 border border-neutral-800 rounded-lg">
                  <div className="w-full md:w-1/3">
                    <input 
                      type="text" 
                      value={resume.title}
                      onChange={(e) => handleResumeChange(index, 'title', e.target.value)}
                      placeholder="e.g., Software Engineer Resume"
                      className="w-full bg-black border border-neutral-700 rounded py-2 px-3 text-white outline-none focus:border-red-500 font-sans text-sm"
                      required
                    />
                  </div>
                  <div className="w-full md:w-flex-1">
                    <input 
                      type="url" 
                      value={resume.url}
                      onChange={(e) => handleResumeChange(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-black border border-neutral-700 rounded py-2 px-3 text-white outline-none focus:border-red-500 font-mono text-sm"
                      required
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveResume(index)}
                    className="shrink-0 p-2 text-neutral-500 hover:text-red-500 hover:bg-red-950/30 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tech Stack Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
            <Code2 size={16} /> Tech Stack Matrix
          </h3>
          <p className="text-xs text-neutral-500 font-mono mb-4">Separate technologies with commas (e.g., React, Next.js, Tailwind CSS)</p>
          
          <div>
            <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2 flex items-center gap-2">
              <Code2 size={12} /> Frontend Architecture
            </label>
            <input 
              type="text" 
              name="frontendTech"
              value={formData.frontendTech}
              onChange={handleInputChange}
              placeholder="React, Next.js, Tailwind CSS, Bootstrap, HTML5"
              className="w-full bg-black/50 border border-neutral-800 rounded-lg py-2 px-3 text-white outline-none focus:border-red-500 font-sans text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2 flex items-center gap-2">
              <Server size={12} /> Backend & APIs
            </label>
            <input 
              type="text" 
              name="backendTech"
              value={formData.backendTech}
              onChange={handleInputChange}
              placeholder="Node.js, Express.js, FastAPI, Python"
              className="w-full bg-black/50 border border-neutral-800 rounded-lg py-2 px-3 text-white outline-none focus:border-red-500 font-sans text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2 flex items-center gap-2">
              <Database size={12} /> Database & Analytics
            </label>
            <input 
              type="text" 
              name="databaseTech"
              value={formData.databaseTech}
              onChange={handleInputChange}
              placeholder="MongoDB, Mongoose, Data Structures, MLOps Context"
              className="w-full bg-black/50 border border-neutral-800 rounded-lg py-2 px-3 text-white outline-none focus:border-red-500 font-sans text-sm"
            />
          </div>
        </div>

        {/* Save Execution */}
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
            Commit Profile
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminOperatorPanel;