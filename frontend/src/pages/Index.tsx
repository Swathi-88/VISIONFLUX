import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Showcase } from "@/components/Showcase";
import { FilmStrip } from "@/components/FilmStrip";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <Showcase />
      <FilmStrip />
      <Footer />
    </div>
  );
};

export default Index;
