import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto animate-fade-in">
        <h1 className="hero-text mb-8 text-black shine">
          VisionFlux
        </h1>
        <p className="text-2xl md:text-4xl mb-12 text-black max-w-3xl mx-auto" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 500 }}>
          Turn your words into worlds
        </p>
        <button
          onClick={() => navigate("/create")}
          className="btn-visionflux text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
        >
          Create with VisionFlux
        </button>
        <p className="mt-8 text-sm text-black">
          Explore AI Subscriptions · See FAQ
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-black/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-black/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};
