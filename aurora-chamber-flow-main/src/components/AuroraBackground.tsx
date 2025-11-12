const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main aurora gradient background */}
      <div 
        className="absolute inset-0 animate-aurora"
        style={{
          background: 'linear-gradient(120deg, #050f2c, #0d153f, #0a3d4a, #134e4a, #0d153f, #1a1649)',
        }}
      />
      
      {/* Animated gradient orbs */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(var(--aurora-cyan)), transparent)',
          animationDelay: '0s',
        }}
      />
      <div 
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(var(--aurora-blue)), transparent)',
          animationDelay: '2s',
        }}
      />
      <div 
        className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full opacity-25 blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(var(--aurora-green)), transparent)',
          animationDelay: '4s',
        }}
      />
      
      {/* Starfield effect */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-50"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AuroraBackground;
