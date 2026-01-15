import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLeaderboard } from "@/hooks/usePlayerStats";
import { Trophy, Medal, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Leaderboard() {
  const { players, wins, refetch } = useLeaderboard(20);

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">#{rank + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-primary text-glow mb-2">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">Top commanders on the battlefield</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => refetch()} variant="outline">
              Refresh
            </Button>
            <ConnectButton />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Link to="/">
            <Button variant="outline">Home</Button>
          </Link>
          <Link to="/lobby">
            <Button variant="outline">Lobby</Button>
          </Link>
        </div>

        {/* Leaderboard */}
        <Card className="tactical-card p-6">
          {players.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No players yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {players.map((player, i) => (
                <div
                  key={player}
                  className={`
                    flex items-center justify-between p-4 rounded-lg
                    ${i < 3 ? 'bg-primary/10 border border-primary/30' : 'bg-muted/30'}
                    hover:bg-primary/20 transition-colors
                  `}
                >
                  <div className="flex items-center gap-4">
                    {getRankIcon(i)}
                    <div>
                      <div className="font-mono text-sm">
                        {player.slice(0, 6)}...{player.slice(-4)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {wins[i]?.toString() || 0} wins
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-primary">
                        {wins[i]?.toString() || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Victories</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Call to Action */}
        <Card className="tactical-card p-8 text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Ready to Climb?</h2>
          <p className="text-muted-foreground mb-4">
            Battle your way to the top of the leaderboard
          </p>
          <Link to="/lobby">
            <Button size="lg">Start Playing</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}