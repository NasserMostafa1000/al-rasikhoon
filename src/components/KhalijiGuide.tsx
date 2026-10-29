type Props = {
  size?: number;
  className?: string;
};

/** Premium Gulf mascot for Ask AI — official render with idle motion. */
export default function KhalijiGuide({ size = 108, className = "" }: Props) {
  return (
    <div
      className={`khaliji-guide relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="khaliji-sprite overflow-hidden rounded-full bg-gradient-to-b from-gold-soft/40 to-cream shadow-[0_12px_28px_rgba(15,45,61,0.28)] ring-2 ring-gold/50"
        style={{ width: size, height: size }}
      >
        <img
          src="/images/khaliji-ask-ai.jpg"
          alt=""
          draggable={false}
          className="h-full w-full scale-110 object-cover object-[50%_18%] pointer-events-none"
        />
      </div>
      <style>{`
        .khaliji-sprite {
          transform-origin: 50% 85%;
          animation: khaliji-idle 2.6s ease-in-out infinite;
        }
        @keyframes khaliji-idle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-6px) rotate(-4deg); }
          60% { transform: translateY(-2px) rotate(3deg); }
          80% { transform: translateY(-7px) rotate(-2deg); }
        }
      `}</style>
    </div>
  );
}
