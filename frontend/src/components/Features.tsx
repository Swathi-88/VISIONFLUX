import { Sparkles, Layers, Film } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Consistent",
      description: "Bring your own assets, or generate them in VisionFlux. Then easily manage and reference them as you start to generate clips.",
    },
    {
      icon: Layers,
      title: "Seamless",
      description: "An interface designed for the creative story-building process from ideation to iteration.",
    },
    {
      icon: Film,
      title: "Cinematic",
      description: "State-of-the-art video quality made possible by advanced AI models.",
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 animate-slide-up">
          VisionFlux is an AI filmmaking tool built with and for creatives.
        </h2>
        <p className="text-xl text-center text-muted-foreground mb-20 max-w-3xl mx-auto animate-slide-up">
          Seamlessly create cinematic clips, scenes and stories using advanced generative AI models.
        </p>

        <div className="grid md:grid-cols-3 gap-12 mt-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
