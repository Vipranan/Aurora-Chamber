import React from 'react';

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main aurora gradient background */}
      <div
        className="absolute inset-0 animate-aurora"
        style={{
          background: 'linear-gradient(120deg, #4a0a0a, #6b210a, #803100, #a04100, #6b210a, #4a0a0a)',
        }}
      />

      {/* Animated gradient orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-40 blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(var(--aurora-gold)), transparent)',
          animationDelay: '0s',
        }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(var(--aurora-yellow)), transparent)',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full opacity-35 blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(var(--aurora-orange)), transparent)',
          animationDelay: '4s',
        }}
      />

      {/* Ember particles effect */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `drift ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes drift {
          0% {
            transform: translate(0, 0);
            opacity: 0.7;
          }
          50% {
            transform: translate(${Math.random() * 20 - 10}px, -50px);
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() * 40 - 20}px, -100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AuroraBackground;
