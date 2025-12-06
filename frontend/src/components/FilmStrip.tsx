export const FilmStrip = () => {
  const projects = [
    "FIT CHECK",
    "THE DEGENERATES",
    "Alt Spectrum",
    "ZOO BREAK",
    "PASSENGERS",
    "It's all yarn",
    "NEON DREAMS",
    "URBAN TALES",
  ];

  return (
    <section className="py-20 bg-secondary/30 overflow-hidden">
      <div className="relative">
        <div className="flex gap-6 animate-scroll">
          {/* First set */}
          {projects.map((project, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 w-64 h-40 bg-muted rounded-lg flex items-center justify-center font-bold text-xl border border-border hover:border-primary/50 transition-colors duration-300 cursor-pointer"
            >
              {project}
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {projects.map((project, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 w-64 h-40 bg-muted rounded-lg flex items-center justify-center font-bold text-xl border border-border hover:border-primary/50 transition-colors duration-300 cursor-pointer"
            >
              {project}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
