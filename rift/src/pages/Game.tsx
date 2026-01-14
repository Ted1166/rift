import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { useGameState, useGameActions, useGameEvents, GamePhase, UnitType } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Sword, Target } from "lucide-react";
// Generate random salt in browser
const generateSalt = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return `0x${Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')}`;
};

const PHASE_NAMES = ["Deployment", "Planning", "Revealing", "Execution", "Ended"];
const UNIT_NAMES = ["Commander", "Warrior", "Archer"];
const UNIT_ICONS = ["👑", "⚔️", "🎯"];

export default function Game() {
  const { gameId } = useParams();
  const { address } = useAccount();
  const { toast } = useToast();
  const [selectedUnit, setSelectedUnit] = useState<UnitType | null>(null);
  const [moves, setMoves] = useState<Array<{ unitId: number; action: number; x: number; y: number }>>([]);
  const [salt, setSalt] = useState<string>("");

  const { game, units, refetchGame, refetchUnits } = useGameState(BigInt(gameId || 0));
  const { deployUnit, commitMove, revealMove, claimTimeout } = useGameActions(BigInt(gameId || 0));

  useGameEvents(
    BigInt(gameId || 0),
    (phase) => {
      toast({ title: `Phase: ${PHASE_NAMES[phase]}` });
      refetchGame();
      refetchUnits();
    },
    (winner) => {
      toast({ title: "Game Over!", description: `Winner: ${winner}` });
      refetchGame();
    }
  );

  useEffect(() => {
    if (!salt) {
      setSalt(generateSalt());
    }
  }, []);

  const handleDeploy = async (x: number, y: number) => {
    if (selectedUnit === null) {
      toast({ title: "Select a unit type first", variant: "destructive" });
      return;
    }
    
    try {
      await deployUnit(selectedUnit, x, y);
      toast({ title: "Unit deployed!" });
      setSelectedUnit(null);
      refetchGame();
      refetchUnits();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCommit = async () => {
    if (moves.length === 0) {
      toast({ title: "Plan your moves first", variant: "destructive" });
      return;
    }

    const unitIds = moves.map(m => m.unitId);
    const actions = moves.map(m => m.action);
    const targetX = moves.map(m => m.x);
    const targetY = moves.map(m => m.y);

    try {
      await commitMove(unitIds, actions, targetX, targetY, salt);
      toast({ title: "Moves committed!" });
      refetchGame();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleReveal = async () => {
    if (moves.length === 0) {
      toast({ title: "No moves to reveal", variant: "destructive" });
      return;
    }

    const unitIds = moves.map(m => m.unitId);
    const actions = moves.map(m => m.action);
    const targetX = moves.map(m => m.x);
    const targetY = moves.map(m => m.y);

    try {
      await revealMove(unitIds, actions, targetX, targetY, salt);
      toast({ title: "Moves revealed!" });
      setMoves([]);
      setSalt(generateSalt());
      refetchGame();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading game...</div>
      </div>
    );
  }

  const isPlayer1 = address?.toLowerCase() === game.player1.toLowerCase();
  const isPlayer2 = address?.toLowerCase() === game.player2.toLowerCase();
  const isMyTurn = isPlayer1 || isPlayer2;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="tactical-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-primary">
                Game #{gameId}
              </h1>
              <p className="text-muted-foreground">
                Phase: <span className="text-foreground font-semibold">{PHASE_NAMES[game.phase]}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Turn {game.currentTurn}</p>
              <p className="text-sm">
                {isPlayer1 ? "You are Player 1" : isPlayer2 ? "You are Player 2" : "Spectator"}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card className="tactical-card p-6">
              <Battlefield
                units={units || []}
                phase={game.phase}
                isPlayer1={isPlayer1}
                onTileClick={game.phase === 0 ? handleDeploy : undefined}
              />
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="space-y-4">
            {game.phase === 0 && isMyTurn && (
              <DeploymentPanel
                selectedUnit={selectedUnit}
                onSelectUnit={setSelectedUnit}
                unitsDeployed={isPlayer1 ? game.player1UnitsDeployed : game.player2UnitsDeployed}
              />
            )}

            {game.phase === 1 && isMyTurn && (
              <PlanningPanel
                units={units || []}
                isPlayer1={isPlayer1}
                moves={moves}
                onMovesChange={setMoves}
                onCommit={handleCommit}
              />
            )}

            {game.phase === 2 && isMyTurn && (
              <Card className="tactical-card p-6 space-y-4">
                <h2 className="font-display text-xl font-bold">Reveal Phase</h2>
                <p className="text-sm text-muted-foreground">
                  Reveal your committed moves
                </p>
                <Button onClick={handleReveal} className="w-full">
                  Reveal Moves
                </Button>
              </Card>
            )}

            {game.phase === 4 && (
              <Card className="tactical-card p-6 space-y-4">
                <h2 className="font-display text-xl font-bold">Game Over</h2>
                <p className="text-sm">
                  Winner: {game.winner === address ? "You!" : game.winner}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Battlefield({ units, phase, isPlayer1, onTileClick }: any) {
  const renderUnit = (x: number, y: number) => {
    const unit = units.find((u: any) => u.x === x && u.y === y && u.isAlive);
    if (!unit) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center text-3xl">
        {UNIT_ICONS[unit.unitType]}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: 25 }).map((_, i) => {
        const x = i % 5;
        const y = Math.floor(i / 5);
        const isPlayerZone = isPlayer1 ? y >= 3 : y <= 1;
        const canDeploy = phase === 0 && isPlayerZone;

        return (
          <button
            key={i}
            onClick={() => canDeploy && onTileClick?.(x, y)}
            className={`
              relative aspect-square rounded border-2 transition-all
              ${isPlayerZone ? "border-primary/40 bg-primary/10" : "border-border bg-muted/30"}
              ${canDeploy ? "hover:border-primary hover:bg-primary/20 cursor-pointer" : ""}
            `}
          >
            {renderUnit(x, y)}
          </button>
        );
      })}
    </div>
  );
}

function DeploymentPanel({ selectedUnit, onSelectUnit, unitsDeployed }: any) {
  return (
    <Card className="tactical-card p-6 space-y-4">
      <h2 className="font-display text-xl font-bold">Deploy Units</h2>
      <p className="text-sm text-muted-foreground">
        Units deployed: {unitsDeployed}/3
      </p>
      <div className="space-y-2">
        {[0, 1, 2].map((type) => (
          <Button
            key={type}
            variant={selectedUnit === type ? "default" : "outline"}
            onClick={() => onSelectUnit(type as UnitType)}
            className="w-full justify-start"
          >
            <span className="mr-2">{UNIT_ICONS[type]}</span>
            {UNIT_NAMES[type]}
          </Button>
        ))}
      </div>
    </Card>
  );
}

function PlanningPanel({ units, isPlayer1, moves, onMovesChange, onCommit }: any) {
  const myUnits = units.filter((u: any) => {
    const ownerIsPlayer1 = u.owner.toLowerCase() === units[0]?.owner?.toLowerCase();
    return ownerIsPlayer1 === isPlayer1 && u.isAlive;
  });

  return (
    <Card className="tactical-card p-6 space-y-4">
      <h2 className="font-display text-xl font-bold">Plan Moves</h2>
      <p className="text-sm text-muted-foreground">
        Planned: {moves.length}/{myUnits.length}
      </p>
      <div className="space-y-2">
        <Button onClick={onCommit} className="w-full" disabled={moves.length === 0}>
          Commit Moves
        </Button>
      </div>
    </Card>
  );
}