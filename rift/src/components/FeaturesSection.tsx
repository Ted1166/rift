import { Shield, Lock, Coins, Globe, Cpu, Clock } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Fully On-Chain",
      description: "All game logic and state stored on Mantle Network. Verifiable, transparent, unstoppable.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Commit-Reveal",
      description: "Moves are hashed and hidden until both players commit. No frontrunning possible.",
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Wager MNT",
      description: "Optional betting system lets you stake MNT tokens on your tactical prowess.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "No Server Required",
      description: "Decentralized gameplay with no trusted third parties. Pure blockchain gaming.",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Deterministic",
      description: "Same inputs always produce same outputs. Fair, reproducible combat resolution.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Turn Timer",
      description: "5-minute action window. Claim victory if opponent times out. No stalling.",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Built for the <span className="text-primary text-glow">Blockchain</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Every feature designed for trustless, verifiable gameplay on Mantle Network.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="tactical-card rounded-xl p-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;