import { Card } from "@/components/ui/card";

export const Showcase = () => {
  const films = [
    { title: "FIT CHECK", creator: "Junie Lau" },
    { title: "THE DEGENERATES", creator: "Dave Clark" },
    { title: "Alt Spectrum", creator: "Henry Daubrez" },
    { title: "ZOO BREAK", creator: "Sarah Chen" },
    { title: "PASSENGERS", creator: "Mike Torres" },
    { title: "It's all yarn", creator: "Emma Wilson" },
  ];

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          See how filmmakers are using VisionFlux
        </h2>
        <p className="text-center text-muted-foreground mb-16">
          Watch Short Films →
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {films.map((film, index) => (
            <Card
              key={film.title}
              className="group relative overflow-hidden bg-secondary border-border hover:border-primary/50 transition-all duration-300 cursor-pointer aspect-video"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-2xl font-bold mb-2 transform group-hover:scale-105 transition-transform duration-300">
                  {film.title}
                </h3>
                <p className="text-sm text-muted-foreground">{film.creator}</p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-lg transition-all duration-300" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
