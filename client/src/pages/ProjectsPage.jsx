import { useState, useEffect } from 'react';
import { ExternalLink, Home, FolderKanban, User, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const getLanguageTheme = (lang) => {
  const themes = {
    'JavaScript': { main: '#f7df1e', dark: '#716307', glow: 'rgba(247, 223, 30, 0.6)' },
    'TypeScript': { main: '#3178c6', dark: '#103155', glow: 'rgba(49, 120, 198, 0.6)' },
    'HTML': { main: '#e34f26', dark: '#5a1d0d', glow: 'rgba(227, 79, 38, 0.6)' },
    'CSS': { main: '#1572b6', dark: '#082d47', glow: 'rgba(21, 114, 182, 0.6)' },
    'Python': { main: '#3776ab', dark: '#132a3d', glow: 'rgba(55, 118, 171, 0.6)' },
    'React': { main: '#61dafb', dark: '#115b70', glow: 'rgba(97, 218, 251, 0.6)' },
    'Node.js': { main: '#339933', dark: '#113311', glow: 'rgba(51, 153, 51, 0.6)' },
    'MongoDB': { main: '#4ade80', dark: '#144524', glow: 'rgba(74, 222, 128, 0.6)' }
  };
  // Default Bloody Red Theme
  return themes[lang] || { main: '#ef4444', dark: '#7f1d1d', glow: 'rgba(239, 68, 68, 0.6)' };
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setProjects(data.data);
        } else {
          throw new Error("Invalid data format received.");
        }
      } catch (err) {
        setError("Failed to synchronize with central repository.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filterOptions = ["All", ...new Set(projects?.flatMap(p => p?.languages || []) || [])];
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project?.languages?.includes(activeFilter));

  // Get active theme colors based on current filter selection
  const currentTheme = getLanguageTheme(activeFilter);

  return (
    <div className="relative min-h-screen w-full bg-black text-white p-8 pb-32 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">
      
      {/* Dynamic Background Atmosphere */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-700 opacity-40"
        style={{ backgroundImage: `radial-gradient(circle at 50% 10%, ${currentTheme.dark} 0%, black 70%)` }}
      ></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(${currentTheme.main} 1px, transparent 1px), linear-gradient(90deg, ${currentTheme.main} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header Section with Glowing Neon Text */}
        <div className="text-center mt-12 space-y-4">
          <h1 
            className="text-4xl md:text-6xl font-bold uppercase tracking-widest transition-all duration-500"
            style={{ 
              color: currentTheme.main,
              textShadow: `0 0 25px ${currentTheme.glow}, 0 0 50px ${currentTheme.glow}` 
            }}
          >
            System Architectures
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto tracking-wide text-sm md:text-base font-mono">
            LIVE SYNCHRONIZATION FROM SECURE REPOSITORIES.
          </p>
        </div>
        
        {/* --- DYNAMIC REPO COUNTER --- */}
        {!loading && !error && (
          <div className="flex justify-center mt-6 animate-fade-in">
            <div 
              className="flex items-center gap-3 px-5 py-2 rounded-lg border backdrop-blur-sm transition-all duration-500"
              style={{ 
                backgroundColor: `${currentTheme.dark}40`,
                borderColor: `${currentTheme.main}40`,
                boxShadow: `0 0 20px ${currentTheme.glow}40`
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: currentTheme.main, boxShadow: `0 0 10px ${currentTheme.main}` }}
              ></div>
              <span 
                className="text-xs md:text-sm font-mono tracking-[0.2em] uppercase font-bold"
                style={{ color: currentTheme.main, textShadow: `0 0 8px ${currentTheme.glow}` }}
              >
                [ {projects.length} ] Repositories Online
              </span>
            </div>
          </div>
        )}
        {/* ---------------------------- */}

        {/* INFINITE MARQUEE CAROUSEL FILTERS */}
        {!loading && !error && (
          <div className="w-full overflow-hidden py-4 relative flex items-center">
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

            <div className="flex gap-4 animate-marquee whitespace-nowrap w-max">
              {[...filterOptions, ...filterOptions].map((filter, index) => {
                const filterTheme = getLanguageTheme(filter);
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={`${filter}-${index}`}
                    onClick={() => setActiveFilter(filter)}
                    className="px-6 py-2.5 rounded-full text-sm font-mono uppercase tracking-wider transition-all duration-300 border cursor-pointer shrink-0"
                    style={{
                      backgroundColor: isActive ? `${filterTheme.main}30` : 'rgba(0,0,0,0.8)',
                      borderColor: isActive ? filterTheme.main : 'rgba(255,255,255,0.1)',
                      color: isActive ? filterTheme.main : '#a3a3a3',
                      boxShadow: isActive ? `0 0 20px ${filterTheme.glow}` : 'none',
                      textShadow: isActive ? `0 0 10px ${filterTheme.glow}` : 'none'
                    }}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading && <div className="text-center font-mono tracking-widest mt-12 animate-pulse" style={{ color: currentTheme.main }}>INITIALIZING DATA ARCHIVE...</div>}
        {error && <div className="text-center text-red-500 border border-red-900/50 bg-red-950/20 p-6 rounded-lg max-w-lg mx-auto font-mono mt-12">[ ERROR ] {error}</div>}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => {
              const primaryLang = project?.languages?.[0] || 'N/A';
              const cardTheme = getLanguageTheme(primaryLang);

              return (
                <a 
                  href={project?.githubLink || '#'}
                  target="_blank"
                  rel="noreferrer"
                  key={project?.id || Math.random()}
                  className="group relative bg-neutral-950/90 border rounded-2xl p-6 transition-all duration-500 flex flex-col h-full overflow-hidden backdrop-blur-md shadow-lg block hover:cursor-pointer"
                  style={{ 
                    borderColor: 'rgba(255,255,255,0.08)',
                    boxShadow: `0 10px 30px rgba(0,0,0,0.8)`
                  }}
                >
                  {/* Hover Glow Edge Effect */}
                  <div 
                    className="absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" 
                    style={{ 
                      border: `1px solid ${cardTheme.main}`,
                      boxShadow: `inset 0 0 20px ${cardTheme.glow}, 0 0 25px ${cardTheme.glow}` 
                    }}
                  ></div>

                  <div className="relative flex justify-between items-start mb-6 z-10">
                    <div 
                      className="w-12 h-12 rounded-lg bg-black/90 border flex items-center justify-center font-bold font-mono transition-all duration-500 group-hover:scale-110"
                      style={{ color: cardTheme.main, borderColor: cardTheme.dark, boxShadow: `0 0 10px ${cardTheme.glow}` }}
                    >
                      {primaryLang.substring(0, 2).toUpperCase()}
                    </div>
                    
                    <div className="flex gap-2">
                      {/* GitHub Link Icon */}
                      {project?.githubLink && (
                        <div className="p-2 bg-black/60 rounded-md border border-neutral-800 text-neutral-400 group-hover:text-white transition-all duration-300 group-hover:scale-110" style={{ borderColor: 'transparent' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                            <path d="M9 18c-4.51 2-5-2-7-2"></path>
                          </svg>
                        </div>
                      )}
                      
                      {/* Live Link Icon */}
                      {project?.liveLink && (
                        <div 
                          onClick={(e) => {
                             e.preventDefault(); 
                             window.open(project.liveLink, '_blank', 'noreferrer');
                          }}
                          className="p-2 bg-black/60 rounded-md border border-neutral-800 text-neutral-400 hover:text-white transition-all duration-300 hover:scale-110 z-20"
                        >
                          <ExternalLink size={16} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative mb-6 flex-grow z-10">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight text-neutral-100 group-hover:text-white transition-colors duration-300">
                      {project?.name || "Unknown Architecture"}
                    </h3>
                    <p className="text-xs uppercase tracking-widest font-mono mb-3" style={{ color: cardTheme.main, textShadow: `0 0 8px ${cardTheme.glow}` }}>
                      ROLE: {project?.role || "Developer"}
                    </p>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {project?.description || "System architecture data pending transmission."}
                    </p>
                  </div>

                  {/* Multi-language tags with individual glows */}
                  <div className="relative flex flex-wrap gap-2 mt-auto z-10">
                    {project?.languages?.map(lang => {
                      const tagTheme = getLanguageTheme(lang);
                      return (
                        <span 
                          key={lang} 
                          className="px-2.5 py-1 text-[10px] rounded bg-black/60 border uppercase tracking-wider font-mono transition-all duration-300"
                          style={{ color: tagTheme.main, borderColor: `${tagTheme.main}40`, boxShadow: `0 0 5px ${tagTheme.glow}` }}
                        >
                          {lang}
                        </span>
                      );
                    })}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div 
          className="bg-black/90 backdrop-blur-md border rounded-full px-6 py-4 flex items-center gap-8 transition-all duration-500"
          style={{ borderColor: currentTheme.dark, boxShadow: `0 0 30px ${currentTheme.glow}` }}
        >
          <Link to="/" className="text-neutral-500 hover:text-white transition-colors duration-300"><Home size={20} /></Link>
          <div 
            className="p-2.5 rounded-full border shadow-lg transition-all duration-500"
            style={{ backgroundColor: currentTheme.dark, borderColor: currentTheme.main, color: currentTheme.main, boxShadow: `0 0 15px ${currentTheme.glow}` }}
          >
            <FolderKanban size={20} />
          </div>
          <Link to="/profile" className="text-neutral-500 hover:text-white transition-colors duration-300"><User size={20} /></Link>
          <Link to="/contact" className="text-neutral-500 hover:text-white transition-colors duration-300"><Mail size={20} /></Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;