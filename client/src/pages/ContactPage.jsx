import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, FolderKanban, User, Mail, Phone, Send, Terminal, Loader2 } from 'lucide-react';

const ContactPage = () => {
  // ==========================================
  // EDITABLE CONTACT DATA
  // ==========================================
  const contactDetails = [
    { 
      id: "email",
      label: "SECURE EMAIL", 
      value: "sj.brahma2006@gmail.com", 
      link: "mailto:sj.brahma2006@gmail.com",
      icon: <Mail size={20} />
    },
    { 
      id: "phone",
      label: "DIRECT COMMS", 
      value: "+91 7043644056", 
      link: "tel:+917043644056",
      icon: <Phone size={20} />
    },
    { 
      id: "github",
      label: "REPOSITORY", 
      value: "Shubhra-jyoti", 
      link: "https://github.com/Shubhra-jyoti",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
          <path d="M9 18c-4.51 2-5-2-7-2"></path>
        </svg>
      )
    },
    { 
      id: "linkedin",
      label: "PROFESSIONAL NETWORK", 
      value: "Shubhra Jyoti Brahma", 
      link: "https://www.linkedin.com/in/shubhra-jyoti-brahma-8274bb3a8",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      )
    }
  ];
  // ==========================================

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTransmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null); // Clear previous messages

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatusMessage({ 
          type: 'success', 
          text: '[ SUCCESS ] Payload securely delivered to operator.' 
        });
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } else {
        setStatusMessage({ 
          type: 'error', 
          text: `[ ERROR ] ${result.message || 'Transmission failed.'}` 
        });
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ 
        type: 'error', 
        text: '[ CRITICAL ] Network error. Signal lost.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white p-8 pb-32 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">
      
      {/* Glitch Animation Styles Injector */}
      <style>{`
        @keyframes glitch-anim {
          0% { text-shadow: 0.05em 0 0 rgba(255,0,0,0.75), -0.05em -0.025em 0 rgba(0,255,0,0.75), -0.025em 0.05em 0 rgba(0,0,255,0.75); }
          14% { text-shadow: 0.05em 0 0 rgba(255,0,0,0.75), -0.05em -0.025em 0 rgba(0,255,0,0.75), -0.025em 0.05em 0 rgba(0,0,255,0.75); }
          15% { text-shadow: -0.05em -0.025em 0 rgba(255,0,0,0.75), 0.025em 0.025em 0 rgba(0,255,0,0.75), -0.05em -0.05em 0 rgba(0,0,255,0.75); }
          49% { text-shadow: -0.05em -0.025em 0 rgba(255,0,0,0.75), 0.025em 0.025em 0 rgba(0,255,0,0.75), -0.05em -0.05em 0 rgba(0,0,255,0.75); }
          50% { text-shadow: 0.025em 0.05em 0 rgba(255,0,0,0.75), 0.05em 0 0 rgba(0,255,0,0.75), 0 -0.05em 0 rgba(0,0,255,0.75); }
          99% { text-shadow: 0.025em 0.05em 0 rgba(255,0,0,0.75), 0.05em 0 0 rgba(0,255,0,0.75), 0 -0.05em 0 rgba(0,0,255,0.75); }
          100% { text-shadow: -0.025em 0 0 rgba(255,0,0,0.75), -0.025em -0.025em 0 rgba(0,255,0,0.75), -0.025em -0.05em 0 rgba(0,0,255,0.75); }
        }
        .glitch-text {
          animation: glitch-anim 2s infinite linear alternate-reverse;
          position: relative;
        }
      `}</style>

      {/* Cinematic Background Atmosphere */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-black to-black pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto mt-12 flex flex-col gap-12">
        
        {/* Header Section with Glitch Effect */}
        <div className="text-center space-y-4">
          <h1 
            className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-white glitch-text"
            data-text="SHUBHRA"
          >
            SHUBHRA
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto tracking-wide text-sm md:text-base font-mono uppercase text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            Communication Node Active
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          
          {/* Left: Contact Hub */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-2 flex items-center gap-3 text-white border-b border-neutral-800 pb-4">
              <Terminal size={24} className="text-red-500" /> Operator Details
            </h2>
            
            <div className="flex flex-col gap-4">
              {contactDetails.map((contact) => (
                <a 
                  key={contact.id}
                  href={contact.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-6 p-5 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-red-600 transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  <div className="p-3 bg-black rounded-lg border border-neutral-800 text-neutral-400 group-hover:text-red-500 group-hover:border-red-900 transition-colors">
                    {contact.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-mono text-neutral-500 tracking-widest mb-1 group-hover:text-red-400 transition-colors">
                      {contact.label}
                    </h3>
                    <p className="text-lg font-semibold tracking-wide text-neutral-200">
                      {contact.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Secure Transmission Form */}
          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-md shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-red-500 border-b border-red-950/50 pb-4">
              <Send size={24} /> Transmit Payload
            </h2>
            
            <form onSubmit={handleTransmit} className="flex flex-col gap-6 flex-grow relative">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Designation (Name)</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="bg-black/50 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all font-mono disabled:opacity-50"
                  placeholder="Enter your name..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Return Signal (Email)</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="bg-black/50 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all font-mono disabled:opacity-50"
                  placeholder="Enter your email..."
                />
              </div>

              <div className="flex flex-col gap-2 flex-grow">
                <label className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Encrypted Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="bg-black/50 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all font-mono h-full min-h-[120px] resize-none disabled:opacity-50"
                  placeholder="Type your message here..."
                ></textarea>
              </div>

              {/* Status Message Display */}
              {statusMessage && (
                <div className={`p-3 rounded-lg font-mono text-sm tracking-wide text-center border ${
                  statusMessage.type === 'success' 
                    ? 'bg-green-950/40 border-green-900 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                    : 'bg-red-950/40 border-red-900 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                }`}>
                  {statusMessage.text}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full p-4 rounded-lg bg-red-950/40 border border-red-900 text-red-500 font-bold tracking-widest uppercase hover:bg-red-900 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Transmitting...
                  </>
                ) : (
                  <>
                    Initiate Transfer <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/90 backdrop-blur-md border border-red-950/80 rounded-full px-6 py-4 flex items-center gap-8 shadow-[0_0_25px_rgba(220,38,38,0.15)] transition-all duration-500 hover:border-red-900">
          
          <Link to="/" className="text-neutral-500 hover:text-white transition-colors duration-300">
            <Home size={20} />
          </Link>
          
          <Link to="/projects" className="text-neutral-500 hover:text-white transition-colors duration-300">
            <FolderKanban size={20} />
          </Link>
          
          <Link to="/profile" className="text-neutral-500 hover:text-white transition-colors duration-300">
            <User size={20} />
          </Link>
          
          {/* Active Mail Icon */}
          <div className="p-2.5 rounded-full border bg-red-950/40 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-500">
            <Mail size={20} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactPage;