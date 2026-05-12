import { useEffect, useState } from "react";

export default function CurtainLoader() {
  const [animate, setAnimate] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Small delay to ensure the browser has painted the initial red state
    const startTimeout = setTimeout(() => setAnimate(true), 100); 
    // Matches the 2.2s animation duration + start delay
    const hideTimeout = setTimeout(() => setHide(true), 2400);   

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (hide) return null;

  return (
    <div className={`curtain-container ${animate ? "active" : ""}`}>
      <div className="curtain-fabric"></div>
      
      {/* Inline styles for the specific requirements provided */}
      <style>{`
        .curtain-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          pointer-events: none;
        }

        .curtain-fabric {
          width: 100%;
          height: 100%;
          /* Applying the requested fabric texture */
          background: repeating-linear-gradient(
            90deg,
            #ff0000,
            #ff0000 10px,
            #cc0000 10px,
            #cc0000 20px
          );
          box-shadow: 0 0 50px rgba(0,0,0,0.3);
        }

        .curtain-container.active .curtain-fabric {
          animation: curtainCrunch 2.2s ease forwards;
        }

        @keyframes curtainCrunch {
          /* Step 1: full screen */
          0% {
            width: 100%;
            height: 100%;
            border-radius: 0;
            transform: scale(1) rotate(0deg);
          }

          /* Step 2: shrink horizontally (curtain closing) */
          40% {
            width: 20%;
            height: 100%;
            border-radius: 20px;
          }

          /* Step 3: collapse into a ball */
          70% {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            transform: translate(0, 0) rotate(90deg);
          }

          /* Step 4: Throw away with 180-degree rotation */
          100% {
            transform: translate(500px, -500px) rotate(180deg) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}