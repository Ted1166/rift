import { Card } from "./ui/card";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { Trophy, Target, Flame, TrendingUp } from "lucide-react";

interface PlayerStatsCardProps {
  address?: string;
  compact?: boolean;
}

export default function PlayerStatsCard({ address, compact = false }: PlayerStatsCardProps) {
  const { stats, winRate } = usePlayerStats(address);

  const displayStats = [
    {
      icon: <Trophy className="w-5 h-5 text-accent" />,
      label: "Wins",
      value: stats.wins.toString(),
    },
    {
      icon: <Target className="w-5 h-5 text-primary" />,
      label: "Win Rate",
      value: `${winRate.toString()}%`,
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      label: "Win Streak",
      value: stats.winStreak.toString(),
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      label: "Best Streak",
      value: stats.bestWinStreak.toString(),
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="font-semibold">{stats.wins.toString()}W</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{stats.losses.toString()}L</span>
        </div>
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>{stats.winStreak.toString()}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="tactical-card p-6">
      <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-accent" />
        Your Stats
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {displayStats.map((stat, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {stat.icon}
              <span>{stat.label}</span>
            </div>
            <div className="font-display text-2xl font-bold text-foreground">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Games Played</span>
          <span className="font-semibold">{stats.gamesPlayed.toString()}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">Losses</span>
          <span className="font-semibold">{stats.losses.toString()}</span>
        </div>
      </div>
    </Card>
  );
}