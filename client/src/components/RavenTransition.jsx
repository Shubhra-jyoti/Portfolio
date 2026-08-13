import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const FEATHER_COUNT = 50; // Massive flock
const LIFETIME_MS = 2200; // Accelerated timeline for travel effect

// Unique sway per feather to simulate turbulent wind
function buildSwayKeyframes(name, amplitude, cycles, phase) {
  const steps = 24;
  let body = '';
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const pct = (t * 100).toFixed(2);
    const x = Math.sin(t * Math.PI * 2 * cycles + phase) * amplitude;
    const y = Math.cos(t * Math.PI * 2 * cycles + phase) * (amplitude * 0.5); // Add slight perpendicular bounce
    body += `${pct}% { transform: translate(${x.toFixed(1)}px, ${y.toFixed(1)}px); }\n`;
  }
  return `@keyframes ${name} {\n${body}}`;
}

function makeFeather(id) {
  const size = 25 + Math.random() * 35; // Slightly larger for motion blur visibility
  return {
    id,
    // Spawn across a massive grid favoring the bottom-right quadrant
    startX: 30 + Math.random() * 120, // 30vw to 150vw
    startY: 60 + Math.random() * 100, // 60vh to 160vh
    delay: Math.random() * 0.4, // Tightly packed burst
    fallDuration: 0.6 + Math.random() * 0.8, // Aggressive speed (0.6s - 1.4s)
    size,
    swayAmp: 15 + Math.random() * 45, // Tighter sway for directional focus
    swayCycles: 1 + Math.random() * 2,
    swayPhase: Math.random() * Math.PI * 2,
    tumbleDuration: 0.3 + Math.random() * 0.6, // Rapid tumbling
    tumbleReverse: Math.random() > 0.5,
    // Base rotation pointing diagonally Top-Left (-45 degrees roughly)
    startRotation: -60 + Math.random() * 30, 
    barbSeed: Math.random(),
  };
}

function buildBarbs(seed) {
  const lines = [];
  const count = 11;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const y = 8 + t * 62;
    const spread = Math.sin(t * Math.PI);
    const lenL = 6 + spread * 12 + (Math.sin(seed * 40 + i) * 1.5);
    const lenR = 5 + spread * 9 + (Math.cos(seed * 30 + i) * 1.5);
    const droop = 4 + spread * 3;
    lines.push(
      `M20 ${y} C ${20 - lenL * 0.5} ${y - droop * 0.2}, ${20 - lenL} ${y + droop}, ${20 - lenL * 1.05} ${y + droop * 1.6}`
    );
    lines.push(
      `M20 ${y} C ${20 + lenR * 0.5} ${y - droop * 0.2}, ${20 + lenR} ${y + droop}, ${20 + lenR * 1.05} ${y + droop * 1.6}`
    );
  }
  return lines;
}

function Feather({ f }) {
  const swayName = `sway-${f.id}`;
  const barbs = useMemo(() => buildBarbs(f.barbSeed), [f.barbSeed]);
  const gid = f.id;

  return (
    <div
      className="raven-fall"
      style={{
        '--start-x': f.startX,
        '--start-y': f.startY,
        animationDelay: `${f.delay}s`,
        animationDuration: `${f.fallDuration}s`,
      }}
    >
      <style>{buildSwayKeyframes(swayName, f.swayAmp, f.swayCycles, f.swayPhase)}</style>
      <div
        className="raven-sway"
        style={{
          animationName: swayName,
          animationDuration: `${f.fallDuration}s`,
          animationDelay: `${f.delay}s`,
        }}
      >
        <div
          className="raven-tumble"
          style={{
            width: f.size,
            height: f.size * 1.9,
            animationDuration: `${f.tumbleDuration}s`,
            animationDirection: f.tumbleReverse ? 'reverse' : 'normal',
            '--base-rot': `${f.startRotation}deg`,
          }}
        >
          <svg
            width={f.size}
            height={f.size * 1.9}
            viewBox="0 0 40 82"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', overflow: 'visible' }}
          >
            <defs>
              <filter id={`bleed-${gid}`} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="3.2" />
              </filter>
              <linearGradient id={`redGrad-${gid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff2740" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#c4001f" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#5c0011" stopOpacity="0.55" />
              </linearGradient>
              <clipPath id={`clip-${gid}`}>
                <path d="M20 2 C 9 9, 4 28, 6 48 C 7 58, 12 70, 20 80 C 28 70, 33 58, 34 48 C 36 28, 31 9, 20 2 Z" />
              </clipPath>
            </defs>

            {/* bleeding red glow */}
            <path
              d="M20 2 C 9 9, 4 28, 6 48 C 7 58, 12 70, 20 80 C 28 70, 33 58, 34 48 C 36 28, 31 9, 20 2 Z"
              fill={`url(#redGrad-${gid})`}
              filter={`url(#bleed-${gid})`}
              transform="translate(20 41) scale(1.14) translate(-20 -41)"
            />

            {/* solid black body */}
            <path
              d="M20 2 C 9 9, 4 28, 6 48 C 7 58, 12 70, 20 80 C 28 70, 33 58, 34 48 C 36 28, 31 9, 20 2 Z"
              fill="#0a0a0c"
              stroke="#ff2740"
              strokeWidth="0.7"
              strokeOpacity="0.85"
            />

            {/* barb texture */}
            <g clipPath={`url(#clip-${gid})`}>
              {barbs.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#000000" strokeOpacity="0.55" strokeWidth="0.5" />
              ))}
            </g>

            {/* central shaft */}
            <path d="M20 3 L20 79" stroke="#ff2740" strokeWidth="0.9" strokeOpacity="0.8" />
            <path d="M20 3 L20 79" stroke="#ff2740" strokeWidth="2.6" strokeOpacity="0.18" filter={`url(#bleed-${gid})`} />

            {/* tip drip */}
            <ellipse cx="20" cy="81.5" rx="1.1" ry="2.4" fill={`url(#redGrad-${gid})`} filter={`url(#bleed-${gid})`} opacity="0.8" />
            <ellipse cx="19.4" cy="86" rx="0.6" ry="1.1" fill="#ff2740" opacity="0.55" filter={`url(#bleed-${gid})`} />
          </svg>
        </div>
      </div>
    </div>
  );
}

const RavenTransition = () => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [feathers, setFeathers] = useState([]);
  const nextId = useRef(0);
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reduceMotion.current) return;

    setIsAnimating(true);
    const generated = Array.from({ length: FEATHER_COUNT }).map(() => makeFeather(nextId.current++));
    setFeathers(generated);

    const timer = setTimeout(() => setIsAnimating(false), LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <style>{`
        /* Diagonal Travel Animation */
        @keyframes raven-fall-anim {
          0% {
            transform: translate(calc(var(--start-x) * 1vw), calc(var(--start-y) * 1vh)) scale(0.5);
            opacity: 0;
            filter: blur(10px);
          }
          10% { 
            opacity: 1; 
            filter: blur(0px);
            transform: translate(calc((var(--start-x) - 15) * 1vw), calc((var(--start-y) - 15) * 1vh)) scale(1.1);
          }
          85% { opacity: 0.95; filter: blur(0px); }
          100% {
            /* Aggressively rip across to the top-left */
            transform: translate(calc((var(--start-x) - 130) * 1vw), calc((var(--start-y) - 130) * 1vh)) scale(1.3);
            opacity: 0;
            filter: blur(8px);
          }
        }

        /* Tumble relative to the diagonal path */
        @keyframes raven-tumble-anim {
          0%   { transform: rotate(var(--base-rot)) scaleX(1); }
          25%  { transform: rotate(calc(var(--base-rot) - 95deg)) scaleX(0.32); }
          50%  { transform: rotate(calc(var(--base-rot) - 180deg)) scaleX(1); }
          75%  { transform: rotate(calc(var(--base-rot) - 275deg)) scaleX(0.32); }
          100% { transform: rotate(calc(var(--base-rot) - 360deg)) scaleX(1); }
        }

        /* High-speed dimensional travel background flash */
        @keyframes raven-portal-rush {
          0%   { background-position: 200% 200%; opacity: 0; }
          15%  { opacity: 0.6; }
          80%  { opacity: 0.4; }
          100% { background-position: -50% -50%; opacity: 0; }
        }

        .raven-portal {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(140,0,20,0.4) 0%, rgba(10,10,12,0.6) 40%, rgba(0,0,0,0.9) 100%);
          background-size: 300% 300%;
          animation: raven-portal-rush 1.4s cubic-bezier(0.2, 0, 0, 1) forwards;
        }

        /* Simulated speed lines via pseudo-elements */
        .raven-portal::after {
          content: '';
          position: absolute;
          inset: -50%;
          background: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(255, 39, 64, 0.03) 10px,
            rgba(255, 39, 64, 0.03) 12px
          );
          animation: raven-portal-rush 1s linear forwards;
        }

        .raven-fall {
          position: absolute;
          top: 0;
          left: 0;
          will-change: transform, opacity, filter;
          animation-name: raven-fall-anim;
          animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
          animation-fill-mode: forwards;
        }

        .raven-sway {
          will-change: transform;
          animation-timing-function: ease-in-out;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }

        .raven-tumble {
          will-change: transform;
          animation-name: raven-tumble-anim;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 0 6px rgba(255, 39, 64, 0.45)) drop-shadow(0 0 16px rgba(120, 0, 15, 0.35));
        }
      `}</style>

      <div className="raven-portal" />

      {feathers.map((f) => (
        <Feather key={f.id} f={f} />
      ))}
    </div>
  );
};

export default RavenTransition;