import UnitCard from "./UnitCard";
import commanderImg from "@/assets/commander-unit.png";
import warriorImg from "@/assets/warrior-unit.png";
import archerImg from "@/assets/archer-unit.png";

const UnitsSection = () => {
  const units = [
    {
      name: "Commander",
      icon: "👑",
      image: commanderImg,
      health: 20,
      attack: 5,
      defense: 3,
      moveRange: "1 tile",
      attackRange: "1 tile",
      description: "The heart of your army. Protect at all costs - if your Commander falls, you lose the battle.",
      accentColor: "gold" as const,
    },
    {
      name: "Warrior",
      icon: "⚔️",
      image: warriorImg,
      health: 15,
      attack: 7,
      defense: 2,
      moveRange: "1 tile",
      attackRange: "1 tile",
      description: "Heavy-hitting melee fighter. Push the frontline and deal devastating damage up close.",
      accentColor: "red" as const,
    },
    {
      name: "Archer",
      icon: "🎯",
      image: archerImg,
      health: 10,
      attack: 6,
      defense: 1,
      moveRange: "1 tile",
      attackRange: "2 tiles",
      description: "Ranged specialist. Strike from a distance but stay protected - glass cannon in combat.",
      accentColor: "green" as const,
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Command Your <span className="text-primary text-glow">Forces</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Each unit brings unique strengths to the battlefield. Master their abilities
            to outmaneuver and destroy your opponent.
          </p>
        </div>

        {/* Units grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {units.map((unit) => (
            <UnitCard key={unit.name} {...unit} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UnitsSection;