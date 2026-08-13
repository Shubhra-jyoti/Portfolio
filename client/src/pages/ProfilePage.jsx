import { useState, useEffect } from 'react';
// 1. ADDED: Link, Home, FolderKanban, and Mail imports
import { Link } from 'react-router-dom';
import { Layout, Server, Database, FileText, Loader2, User, Home, FolderKanban, Mail } from 'lucide-react';

// 2. ADDED: The currentTheme definition that your navbar uses
const currentTheme = {
  main: "#ef4444", // Red-500
  dark: "#450a0a", // Red-950
  glow: "rgba(239, 68, 68, 0.3)"
};

const ProfilePage = () => {
  const [operatorData, setOperatorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOperatorData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/operator`);
        const payload = await response.json();
        setOperatorData(payload.data);
      } catch (error) {
        console.error("Failed to fetch operator data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperatorData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono">
        <Loader2 className="animate-spin mr-3" /> INITIALIZING OPERATOR PROFILE...
      </div>
    );
  }

  const safeData = operatorData || {};

  const techCategories = [
    {
      title: "Frontend Architecture",
      icon: <Layout size={22} />,
      color: "#61dafb",
      skills: safeData.frontendTech?.length > 0 ? safeData.frontendTech : ["System Data Pending..."]
    },
    {
      title: "Backend & APIs",
      icon: <Server size={22} />,
      color: "#eab308",
      skills: safeData.backendTech?.length > 0 ? safeData.backendTech : ["System Data Pending..."]
    },
    {
      title: "Database & Analytics",
      icon: <Database size={22} />,
      color: "#4ade80",
      skills: safeData.databaseTech?.length > 0 ? safeData.databaseTech : ["System Data Pending..."]
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500 pb-20 pt-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* IDENTITY HEADER */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-10">
          
          {/* Avatar Rendering */}
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-neutral-800 shadow-[0_0_30px_rgba(239,68,68,0.1)] shrink-0 bg-neutral-900 flex items-center justify-center">
            {safeData.avatarUrl ? (
              <img 
                src={safeData.avatarUrl} 
                alt="Operator Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={64} className="text-neutral-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent translate-y-[-100%] animate-scan pointer-events-none"></div>
          </div>

          <div className="flex-1 space-y-5 text-center md:text-left">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                Shubhra Jyoti Brahma
              </h1>
              <p className="text-red-500 font-mono tracking-widest text-sm uppercase">
                Software Engineer // Systems Operator
              </p>
            </div>

            {/* Dynamic Bio */}
            <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl">
              {safeData.bio || "Operator biography data is currently pending transmission from the central database. Please stand by."}
            </p>

            {/* UPGRADED: Dynamic Resume Array Rendering */}
            {safeData.resumes && safeData.resumes.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                {safeData.resumes.map((resume, index) => (
                  <a 
                    key={index}
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-950/30 text-red-500 border border-red-900/50 hover:bg-red-900 hover:text-white rounded-lg transition-all font-mono text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.05)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  >
                    <FileText size={18} /> {resume.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* TECH STACK MATRIX */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b border-neutral-800 pb-4">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Technical Matrix</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techCategories.map((category, index) => (
              <div key={index} className="bg-neutral-950/50 border border-neutral-900 rounded-xl p-6 hover:border-neutral-700 transition-colors group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-black border border-neutral-800 group-hover:border-neutral-600 transition-colors" style={{ color: category.color }}>
                    {category.icon}
                  </div>
                  <h3 className="font-bold tracking-wide">{category.title}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, sIndex) => (
                    <span 
                      key={sIndex} 
                      className="px-3 py-1 bg-black border border-neutral-800 rounded text-xs font-mono text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
      
      {/* NAVBAR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div 
          className="bg-black/90 backdrop-blur-md border rounded-full px-6 py-4 flex items-center gap-8 transition-all duration-500"
          style={{ borderColor: currentTheme.dark, boxShadow: `0 0 30px ${currentTheme.glow}` }}
        >
          <Link to="/" className="text-neutral-500 hover:text-white transition-colors duration-300">
            <Home size={20} />
          </Link>
          
          <Link to="/projects" className="text-neutral-500 hover:text-white transition-colors duration-300">
            <FolderKanban size={20} />
          </Link>
          
          {/* Highlighted active state for the Profile Icon */}
          <div 
            className="p-2.5 rounded-full border shadow-lg transition-all duration-500"
            style={{ backgroundColor: currentTheme.dark, borderColor: currentTheme.main, color: currentTheme.main, boxShadow: `0 0 15px ${currentTheme.glow}` }}
          >
            <User size={20} />
          </div>
          
          <Link to="/contact" className="text-neutral-500 hover:text-white transition-colors duration-300">
            <Mail size={20} />
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default ProfilePage;