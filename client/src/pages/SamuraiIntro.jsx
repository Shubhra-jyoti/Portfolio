import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * SamuraiIntro
 * A one-shot, page-load reveal: a stylised samurai silhouette draws and
 * strikes a katana across the screen, the flash of the blade splits the
 * black curtain in two, and the portfolio underneath is revealed.
 *
 * Perf notes:
 * - Only opacity / transform / clip-path are animated (GPU compositable).
 * - The whole overlay unmounts itself via onComplete once the timeline
 *   finishes, so nothing lingers in the DOM or the paint tree.
 * - Respects prefers-reduced-motion by skipping straight to a quick fade.
 * - Plays once per browser session (sessionStorage), so returning to the
 *   page (SPA nav, refresh mid-session) doesn't replay it every time.
 */
const SamuraiIntro = ({ onComplete }) => {
  const rootRef = useRef(null);
  const samuraiRef = useRef(null);
  const armRef = useRef(null);
  const flashRef = useRef(null);
  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);
  const shineRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const tl = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        sessionStorage.setItem('samuraiIntroPlayed', '1');
        onComplete?.();
      },
    });

    if (prefersReducedMotion) {
      tl.to(rootRef.current, { opacity: 0, duration: 0.35, ease: 'power1.out' });
      return () => tl.kill();
    }

    // Initial poses
    gsap.set(samuraiRef.current, { opacity: 0, scale: 0.88, y: 16 });
    gsap.set(armRef.current, { rotate: -118, transformOrigin: '2px 2px' });
    gsap.set(flashRef.current, { opacity: 0, scaleX: 0, transformOrigin: 'left center' });
    gsap.set(shineRef.current, { opacity: 0 });

    tl
      // Samurai steps into frame
      .to(samuraiRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
      })
      // Beat of stillness before the draw
      .to(samuraiRef.current, { duration: 0.18 })
      // The strike — fast wind-through, everything else keys off this
      .to(armRef.current, {
        rotate: 34,
        duration: 0.16,
        ease: 'power4.in',
      }, 'strike')
      .to(flashRef.current, {
        opacity: 1,
        scaleX: 1,
        duration: 0.1,
        ease: 'power2.out',
      }, 'strike+=0.08')
      .to(flashRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      }, 'strike+=0.22')
      // Curtain is cut open along the blade's line
      .to(leftCurtainRef.current, {
        xPercent: -115,
        yPercent: -12,
        rotate: -5,
        duration: 0.85,
        ease: 'power4.inOut',
      }, 'strike+=0.1')
      .to(rightCurtainRef.current, {
        xPercent: 115,
        yPercent: 12,
        rotate: 5,
        duration: 0.85,
        ease: 'power4.inOut',
      }, 'strike+=0.1')
      // A brief glint travels the blade for a bit of polish
      .fromTo(shineRef.current,
        { opacity: 0.9, xPercent: -40 },
        { opacity: 0, xPercent: 40, duration: 0.5, ease: 'power2.out' },
        'strike+=0.05'
      )
      // Samurai exits with the curtain
      .to(samuraiRef.current, {
        opacity: 0,
        x: -60,
        duration: 0.5,
        ease: 'power2.in',
      }, 'strike+=0.15');

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Curtain panels, split with a diagonal seam so they read as "cut" apart */}
      <div
        ref={leftCurtainRef}
        className="absolute inset-0 bg-black will-change-transform"
        style={{
          clipPath: 'polygon(0% 0%, 58% 0%, 42% 100%, 0% 100%)',
          backgroundImage:
            'radial-gradient(circle at 30% 40%, #1a0505 0%, #000000 65%)',
        }}
      />
      <div
        ref={rightCurtainRef}
        className="absolute inset-0 bg-black will-change-transform"
        style={{
          clipPath: 'polygon(58% 0%, 100% 0%, 100% 100%, 42% 100%)',
          backgroundImage:
            'radial-gradient(circle at 70% 60%, #1a0505 0%, #000000 65%)',
        }}
      />

      {/* Blade flash across the seam */}
      <div
        ref={flashRef}
        className="absolute left-0 right-0 top-1/2 h-[3px] will-change-transform"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #fff 15%, #ef4444 50%, #fff 85%, transparent 100%)',
          boxShadow: '0 0 24px 4px rgba(239,68,68,0.8), 0 0 60px 12px rgba(239,68,68,0.4)',
          transform: 'translateY(-50%) rotate(-4deg)',
        }}
      />

      {/* Samurai silhouette */}
      <div
        ref={samuraiRef}
        className="absolute left-1/2 top-1/2 will-change-transform"
        style={{ transform: 'translate(-50%, -55%)' }}
      >
        <svg width="220" height="320" viewBox="0 0 220 320" fill="none">
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c1c1c" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d4d4d8" />
              <stop offset="55%" stopColor="#fafafa" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Head + topknot */}
          <circle cx="108" cy="46" r="30" fill="#0a0a0a" />
          <path d="M100,17 Q108,-4 118,15" stroke="#0a0a0a" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Kimono body */}
          <path
            d="M108,72 C90,72 76,88 74,112 L56,300 L160,300 L142,112 C140,88 126,72 108,72 Z"
            fill="url(#bodyGrad)"
          />
          {/* Obi sash */}
          <rect x="70" y="150" width="76" height="14" fill="#7f1d1d" opacity="0.85" />
          {/* Haori collar accent */}
          <path d="M92,80 L108,140 L124,80" stroke="#ef4444" strokeWidth="3" opacity="0.7" fill="none" />

          {/* Off-hand, resting */}
          <path d="M80,120 Q64,150 68,190" stroke="#0a0a0a" strokeWidth="16" strokeLinecap="round" fill="none" />

          {/* Sword arm + katana, pivots at the shoulder for the strike */}
          <g transform="translate(150,98)">
            <g ref={armRef}>
              <path
                d="M0,0 Q32,8 58,4 Q64,3 64,-3 Q64,-9 58,-11 Q32,-16 0,-9 Z"
                fill="#0a0a0a"
              />
              <rect x="50" y="-9" width="7" height="15" rx="1.5" fill="#3f3f46" />
              <path d="M58,-4 L182,-34 L188,-28 L64,4 Z" fill="url(#bladeGrad)" />
            </g>
          </g>
        </svg>
      </div>

      {/* Traveling glint along the blade line for extra shine */}
      <div
        ref={shineRef}
        className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full will-change-transform"
        style={{
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
};

export default SamuraiIntro;
