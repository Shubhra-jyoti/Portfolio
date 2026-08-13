import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { Home, FolderKanban, User, Mail, Loader2 } from 'lucide-react';
import SamuraiIntro from './SamuraiIntro';

const HomePage = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // --- DATABASE STATE (unchanged) ---
  const [operatorData, setOperatorData] = useState(null);
  const [statsData, setStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- INTRO STATE ---
  // Plays once per browser session so SPA navigation back to "/" doesn't repeat it.
  const [showIntro, setShowIntro] = useState(
    () => typeof window !== 'undefined' && !sessionStorage.getItem('samuraiIntroPlayed')
  );

  useEffect(() => {
    const fetchCoreSystems = async () => {
      try {
        const [operatorRes, statsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/operator`),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stats`)
        ]);
        
        const operatorPayload = await operatorRes.json();
        const statsPayload = await statsRes.json();
        
        setOperatorData(operatorPayload.data);
        setStatsData(statsPayload.data || []);
      } catch (error) {
        console.error("Telemetry connection failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoreSystems();
  }, []);

  // Once the curtain has finished splitting, gently settle the revealed
  // content in — a small, cheap complement to the main signature animation.
  useEffect(() => {
    if (!showIntro && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [showIntro]);

  // Tech Stack with Official Brand Colors and Custom SVG Icons
  const techSkills = [
    {
      name: "React",
      colorMain: "#61dafb",
      colorDark: "#0891b2",
      colorGlow: "rgba(97,218,251,0.5)",
      icon: (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-4 h-4 fill-current">
          <circle cx="0" cy="0" r="2.05" />
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      )
    },
    {
      name: "Next.js",
      colorMain: "#ffffff",
      colorDark: "#52525b",
      colorGlow: "rgba(255,255,255,0.4)",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.826-6.626l-3.32-4.996H5.21v6.953h1.61v-4.73l3.056 4.73h1.922V10.37h-1.624v4.996z"/>
        </svg>
      )
    },
    {
      name: "Express.js",
      colorMain: "#eab308",
      colorDark: "#854d0e",
      colorGlow: "rgba(234,179,8,0.5)",
      icon: (
        <span className="font-bold text-xs font-mono tracking-tighter">ex</span>
      )
    },
    {
      name: "Tailwind CSS",
      colorMain: "#38bdf8",
      colorDark: "#0284c7",
      colorGlow: "rgba(56,189,248,0.5)",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.625C13.666,10.612,15.024,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.625C16.337,6.188,14.979,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.625c1.177,1.187,2.535,2.575,5.512,2.575c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.625C10.337,13.388,8.979,12,6.001,12z"/>
        </svg>
      )
    },
    {
      name: "MongoDB",
      colorMain: "#4ade80",
      colorDark: "#166534",
      colorGlow: "rgba(74,222,128,0.5)",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M11.95 2C11.95 2 6 7.4 6 13.9C6 17.65 8.7 21 11.95 21C15.2 21 17.9 17.65 17.9 13.9C17.9 7.4 11.95 2 11.95 2ZM11.95 19.5V4.3C13.6 6.55 16.3 10.45 16.3 13.9C16.3 17 14.3 19.1 11.95 19.5Z"/>
        </svg>
      )
    }
  ];

  const softSkills = ["Agile Thinker", "Team Collaborator", "Problem Solver"];

  // Default Cinematic Red Theme
  const defaultTheme = {
    colorMain: "#ef4444", 
    colorDark: "#7f1d1d", 
    colorGlow: "rgba(239,68,68,0.5)"
  };

  const handleMouseEnter = (skill) => {
    gsap.to(containerRef.current, {
      '--theme-main': skill.colorMain,
      '--theme-dark': skill.colorDark,
      '--theme-glow': skill.colorGlow,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(containerRef.current, {
      '--theme-main': defaultTheme.colorMain,
      '--theme-dark': defaultTheme.colorDark,
      '--theme-glow': defaultTheme.colorGlow,
      duration: 0.8,
      ease: "power2.inOut"
    });
  };

  return (
    <>
      {showIntro && <SamuraiIntro onComplete={() => setShowIntro(false)} />}

      {isLoading ? (
        <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono tracking-widest uppercase">
          <Loader2 className="animate-spin mr-3" /> Initializing Core Systems...
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative min-h-screen w-full flex items-center justify-center p-8 overflow-hidden bg-black transition-colors"
          style={{
            '--theme-main': defaultTheme.colorMain,
            '--theme-dark': defaultTheme.colorDark,
            '--theme-glow': defaultTheme.colorGlow,
          }}
        >
          {/* CUSTOM CODED ECLIPSE BACKGROUND */}
          <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--theme-dark)_0%,_#000000_60%)] opacity-50 transition-colors duration-500"></div>
            <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-black rounded-full transition-shadow duration-500 blur-[2px]"
                 style={{ boxShadow: '0 0 120px 40px var(--theme-dark)' }}>
            </div>
            {/* Subtle drifting ember particles for ambient depth */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(14)].map((_, i) => (
                <span
                  key={i}
                  className="absolute rounded-full opacity-0 animate-ember"
                  style={{
                    left: `${(i * 37) % 100}%`,
                    bottom: '-10px',
                    width: `${2 + (i % 3)}px`,
                    height: `${2 + (i % 3)}px`,
                    backgroundColor: 'var(--theme-main)',
                    boxShadow: '0 0 6px 1px var(--theme-glow)',
                    animationDelay: `${i * 0.9}s`,
                    animationDuration: `${8 + (i % 5)}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main Content Container */}
          <div ref={contentRef} className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 mt-12">

            {/* Left Side: Info Panel */}
            <div className="w-full md:w-1/2 flex flex-col gap-8">
              <div>
                <h1
                  className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-transparent bg-clip-text transition-all duration-500"
                  style={{
                    backgroundImage: 'linear-gradient(to right, var(--theme-main), var(--theme-dark))',
                    filter: 'drop-shadow(0 0 15px var(--theme-glow))'
                  }}
                >
                  Shubhra
                </h1>
                <h2 className="text-xl md:text-2xl mt-2 text-gray-400 tracking-wide font-mono">
                  Full-Stack Developer
                </h2>
              </div>

              {/* DYNAMIC ACADEMIC STATS PANEL */}
              <div
                className="bg-black/60 border p-6 rounded-lg backdrop-blur-md transition-all duration-500"
                style={{
                  borderColor: 'var(--theme-dark)',
                  boxShadow: '0 0 30px var(--theme-glow)'
                }}
              >
                <h3
                  className="font-semibold tracking-widest mb-4 border-b pb-2 transition-colors duration-500"
                  style={{ color: 'var(--theme-main)', borderColor: 'var(--theme-dark)' }}
                >
                  ACADEMIC TELEMETRY
                </h3>
                <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  {statsData.length > 0 ? (
                    statsData.map((stat) => (
                      <div
                        key={stat.semester}
                        className="flex justify-between items-center p-2 rounded cursor-pointer transition-colors duration-300 hover:bg-neutral-900/50"
                      >
                        <span className="text-gray-300">Semester {stat.semester} SPI</span>
                        <span className="font-mono transition-colors duration-500" style={{ color: 'var(--theme-main)' }}>
                          {stat.spi.toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-neutral-500 font-mono text-sm italic py-2">
                      No telemetry data available.
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Skills Panel with Icons */}
              <div className="flex flex-wrap gap-3">
                {techSkills.map((skill) => (
                  <button
                    key={skill.name}
                    onMouseEnter={() => handleMouseEnter(skill)}
                    onMouseLeave={handleMouseLeave}
                    className="group flex items-center gap-2 px-4 py-2 bg-black/60 border text-gray-300 rounded backdrop-blur-sm transition-all duration-300"
                    style={{ borderColor: 'var(--theme-dark)' }}
                  >
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'var(--theme-main)' }}>
                      {skill.icon}
                    </span>
                    <span className="group-hover:text-white transition-colors duration-300">
                      {skill.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                {softSkills.map((skill, index) => (
                   <span key={index} className="text-sm text-gray-400 flex items-center gap-2">
                     <span
                       className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                       style={{ backgroundColor: 'var(--theme-main)', boxShadow: '0 0 5px var(--theme-glow)' }}
                     ></span>
                     {skill}
                   </span>
                ))}
              </div>
            </div>

            {/* Right Side: DYNAMIC PROFILE IMAGE */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative group cursor-pointer">
                <div
                  className="absolute -inset-1 rounded-lg blur opacity-30 transition-all duration-500"
                  style={{ backgroundImage: 'linear-gradient(to right, var(--theme-main), var(--theme-dark))' }}
                ></div>
                <div
                  className="relative h-[400px] w-[300px] bg-neutral-950/80 rounded-lg border flex flex-col items-center justify-center overflow-hidden backdrop-blur-md transition-all duration-500"
                  style={{ borderColor: 'var(--theme-dark)' }}
                >
                  {operatorData?.avatarUrl ? (
                    <>
                      <img src={operatorData.avatarUrl} alt="Operator" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--theme-glow)] to-transparent opacity-10 translate-y-[-100%] animate-scan pointer-events-none"></div>
                    </>
                  ) : (
                    <>
                      <span className="text-neutral-500 font-mono text-sm uppercase tracking-widest text-center px-4">
                        Awaiting Transmission
                      </span>
                      <span className="text-neutral-700 font-mono text-xs uppercase tracking-widest text-center px-4 mt-2">
                        (Admin Image Upload)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Floating Bottom Navigation Bar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-black/80 backdrop-blur-md border border-red-900/50 rounded-full px-6 py-4 flex items-center gap-8 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-500" style={{ borderColor: 'var(--theme-dark)' }}>
              <div className="p-2 rounded-full border shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-colors duration-500" style={{ backgroundColor: 'var(--theme-dark)', borderColor: 'var(--theme-main)', color: 'var(--theme-main)' }}>
                <Home size={22} />
              </div>
              <Link to="/projects" className="text-gray-500 hover:text-white transition-colors duration-300"><FolderKanban size={22} /></Link>
              <Link to="/profile" className="text-neutral-500 hover:text-white transition-colors duration-300"><User size={20} /></Link>
              <Link to="/contact" className="text-neutral-500 hover:text-white transition-colors duration-300"><Mail size={20} /></Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
