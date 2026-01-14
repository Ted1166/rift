import { cn } from "../lib/utils";
import { Heart, Sword, Shield } from "lucide-react";

interface UnitCardProps {
  name: string;
  icon: string;
  image: string;
  health: number;
  attack: number;
  defense: number;
  moveRange: string;
  attackRange: string;
  description: string;
  accentColor: "gold" | "red" | "green";
}

const UnitCard = ({
  name,
  icon,
  image,
  health,
  attack,
  defense,
  moveRange,
  attackRange,
  description,
  accentColor,
}: UnitCardProps) => {
  const colorClasses = {
    gold: {
      border: "border-accent/50 hover:border-accent",
      glow: "group-hover:shadow-[0_0_30px_hsl(45_100%_50%/0.3)]",
      text: "text-accent",
      bg: "bg-accent/10",
    },
    red: {
      border: "border-warrior-red/50 hover:border-warrior-red",
      glow: "group-hover:shadow-[0_0_30px_hsl(0_80%_55%/0.3)]",
      text: "text-warrior-red",
      bg: "bg-warrior-red/10",
    },
    green: {
      border: "border-archer-green/50 hover:border-archer-green",
      glow: "group-hover:shadow-[0_0_30px_hsl(150_70%_45%/0.3)]",
      text: "text-archer-green",
      bg: "bg-archer-green/10",
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card transition-all duration-500",
        colors.border,
        colors.glow
      )}
    >
      {/* Top accent line */}
      <div className={cn("absolute top-0 left-0 right-0 h-1", colors.bg)} />
      
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        
        {/* Icon badge */}
        <div className={cn("absolute top-4 left-4 text-3xl px-3 py-1 rounded-lg", colors.bg)}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className={cn("font-display text-2xl font-bold", colors.text)}>
          {name}
        </h3>
        
        <p className="text-muted-foreground font-body text-sm leading-relaxed">
          {description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
              <Heart className="w-4 h-4" />
            </div>
            <div className="font-display text-lg font-bold text-foreground">{health}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Health</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
              <Sword className="w-4 h-4" />
            </div>
            <div className="font-display text-lg font-bold text-foreground">{attack}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Attack</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <Shield className="w-4 h-4" />
            </div>
            <div className="font-display text-lg font-bold text-foreground">{defense}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Defense</div>
          </div>
        </div>

        {/* Range info */}
        <div className="flex justify-between text-sm pt-2">
          <div className="text-muted-foreground">
            <span className="text-foreground font-semibold">{moveRange}</span> Move Range
          </div>
          <div className="text-muted-foreground">
            <span className="text-foreground font-semibold">{attackRange}</span> Attack Range
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCard;