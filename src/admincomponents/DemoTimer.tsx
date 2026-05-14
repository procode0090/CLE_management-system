import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Clock } from 'lucide-react';

const DemoTimer = () => {
//   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

//   useEffect(() => {
//     // Set expiry to May 30, 2026
//     const expiryDate = new Date("2026-05-25T00:00:00").getTime();

//     const timer = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = expiryDate - now;

//       if (distance < 0) {
//         clearInterval(timer);
//         return;
//       }

//       setTimeLeft({
//         days: Math.floor(distance / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//         mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
//       });
//     }, 60000); // Update every minute since seconds are hidden

//     return () => clearInterval(timer);
//   }, []);
const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  const calculateTime = useCallback(() => {
    const expiryDate = new Date("2026-05-30T00:00:00").getTime();
    const now = new Date().getTime();
    const distance = expiryDate - now;

    if (distance < 0) return { days: 0, hours: 0, mins: 0 };

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    };
  }, []);

  useEffect(() => {
    // 1. Run immediately on mount so there is no "00:00" delay
    setTimeLeft(calculateTime());

    // 2. Set interval for subsequent updates
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 10000); // Updated to 10s for better responsiveness without lag

    return () => clearInterval(timer);
  }, [calculateTime]);

  return (
    <div className="fixed top-0 left-0 w-full z-[9999] pointer-events-none">
      <div className="flex justify-end mt-6 mx-6">
        <div className="pointer-events-auto bg-[#008080] backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-6">
          
          {/* Status Label */}
          <div className="flex items-center gap-2 border-r border-white/10 pr-6">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
            <span className=" font-black uppercase tracking-[0.2em] text-white text-[16px]">
              Demo <span className="text-white">Access </span>
            </span>
          </div>

          {/* Time Display (Smaller, No Seconds) */}
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hrs', val: timeLeft.hours },
                { label: 'Min', val: timeLeft.mins }
              ].map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                  <span className="text-sm font-mono font-bold text-white leading-none text-[20px]">
                    {unit.val.toString().padStart(2, '0')}
                  </span>
                  <span className=" font-black uppercase text-white tracking-tighter mt-1 text-[16px]">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Static Expiry Info */}
          {/* <div className="pl-6 border-l border-white/10">
            <p className="text-[8px] font-black uppercase tracking-widest text-white">
              Expires 30.05.26
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DemoTimer;