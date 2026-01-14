import { Lock, Eye, Zap, RotateCcw } from "lucide-react";

const MechanicsSection = () => {
  const phases = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Deploy",
      description: "Place your 3 units on your side of the 5×5 battlefield. Commander, Warrior, Archer - position them strategically.",
      step: "01",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Plan",
      description: "Choose 1 action per unit in secret: Move, Attack, or Defend. Your moves are hidden from your opponent.",
      step: "02",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Reveal",
      description: "Both players reveal their committed moves simultaneously. No take-backs, no advantages.",
      step: "03",
    },
    {
      icon: <RotateCcw className="w-8 h-8" />,
      title: "Execute",
      description: "Actions resolve at the same time. Damage is dealt, positions change. Repeat until a Commander falls.",
      step: "04",
    },
  ];

  return (
    <section className="py-24 relative bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            How to <span className="text-accent text-glow-gold">Battle</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Strategic depth through simultaneous turn execution. 
            Predict your opponent's moves to claim victory.
          </p>
        </div>

        {/* Phases timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {phases.map((phase, index) => (
              <div key={phase.title} className="relative group">
                {/* Connector line */}
                {index < phases.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                
                <div className="tactical-card rounded-xl p-6 h-full transition-all duration-300 hover:translate-y-[-4px]">
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 font-display text-5xl font-black text-primary/10">
                    {phase.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 rift-border">
                    {phase.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid battlefield illustration */}
        <div className="mt-20 flex justify-center">
          <div className="relative">
            {/* 5x5 grid */}
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }).map((_, i) => {
                const row = Math.floor(i / 5);
                const isPlayerZone = row >= 3;
                const isEnemyZone = row <= 1;
                const isNoMansLand = row === 2;
                
                return (
                  <div
                    key={i}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded border transition-all duration-300 hover:scale-105 ${
                      isPlayerZone 
                        ? "bg-primary/20 border-primary/40" 
                        : isEnemyZone 
                        ? "bg-destructive/20 border-destructive/40"
                        : "bg-muted/30 border-border"
                    }`}
                  />
                );
              })}
            </div>
            
            {/* Labels */}
            <div className="absolute -left-24 top-0 text-sm text-muted-foreground font-body rotate-[-90deg] origin-right">
              Enemy Zone
            </div>
            <div className="absolute -left-24 bottom-0 text-sm text-primary font-body rotate-[-90deg] origin-right">
              Your Zone
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MechanicsSection;