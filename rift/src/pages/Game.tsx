import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useGameState, useGameActions, useGameEvents, GamePhase, UnitType } from "@/hooks/useGameState";
import { useGameFactory } from "@/hooks/useGameFactory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PlayerStatsCard from "@/components/PlayerStatsCard";
import { Shield, Sword, Target, Circle, Trophy } from "lucide-react";

const generateSalt = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return `0x${Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')}`;
};

const PHASE_NAMES = ["Deployment", "Planning", "Revealing", "Execution", "Ended"];
const UNIT_NAMES = ["Commander", "Warrior", "Archer"];
const UNIT_ICONS = ["👑", "⚔️", "🎯"];

type Position = { x: number; y: number };
type PlannedMove = { unitId: number; action: number; targetX: number; targetY: number };
type DeploymentSlot = { type: UnitType; pos: Position | null };

export default function Game() {
  const { gameId } = useParams();
  const { address } = useAccount();
  const { toast } = useToast();
  
  // Deployment state
  const [deploySlots, setDeploySlots] = useState<DeploymentSlot[]>([
    { type: 0, pos: null }, // Commander
    { type: 1, pos: null }, // Warrior
    { type: 2, pos: null }, // Archer
  ]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  // Planning state
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<number | null>(null); // 0=move, 1=attack, 2=defend
  const [plannedMoves, setPlannedMoves] = useState<PlannedMove[]>([]);
  const [salt, setSalt] = useState<string>("");

  const { game, units, refetchGame, refetchUnits } = useGameState(BigInt(gameId || 0));
  const { deployUnit, commitMove, revealMove, claimTimeout } = useGameActions(BigInt(gameId || 0));
  const { claimWinnings } = useGameFactory();

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
    if (!salt) setSalt(generateSalt());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchGame();
      refetchUnits();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
  const myUnits = units?.filter(u => 
    u.isAlive && u.owner.toLowerCase() === address?.toLowerCase()
  ) || [];

  // Deployment handlers
  const handleDeployTileClick = (x: number, y: number) => {
    if (selectedSlot === null) return;
    
    const newSlots = [...deploySlots];
    newSlots[selectedSlot].pos = { x, y };
    setDeploySlots(newSlots);
    setSelectedSlot(null);
  };

  const handleBatchDeploy = async () => {
    if (deploySlots.some(s => !s.pos)) {
      toast({ title: "Select all 3 positions first", variant: "destructive" });
      return;
    }

    const types = deploySlots.map(s => s.type);
    const xs = deploySlots.map(s => s.pos!.x);
    const ys = deploySlots.map(s => s.pos!.y);

    try {
      await deployUnit(types, xs, ys);
      toast({ title: "Units deployed!" });
      refetchGame();
      refetchUnits();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Planning handlers
  const handlePlanTileClick = (x: number, y: number) => {
    if (selectedUnitId === null || selectedAction === null) return;

    // Check if already planned for this unit
    const existing = plannedMoves.findIndex(m => m.unitId === selectedUnitId);
    const newMove = { unitId: selectedUnitId, action: selectedAction, targetX: x, targetY: y };
    
    if (existing >= 0) {
      const updated = [...plannedMoves];
      updated[existing] = newMove;
      setPlannedMoves(updated);
    } else {
      setPlannedMoves([...plannedMoves, newMove]);
    }

    setSelectedUnitId(null);
    setSelectedAction(null);
    toast({ title: "Move planned!" });
  };

  const handleCommit = async () => {
    if (plannedMoves.length === 0) {
      toast({ title: "Plan at least one move", variant: "destructive" });
      return;
    }

    const unitIds = plannedMoves.map(m => m.unitId);
    const actions = plannedMoves.map(m => m.action);
    const targetX = plannedMoves.map(m => m.targetX);
    const targetY = plannedMoves.map(m => m.targetY);

    try {
      await commitMove(unitIds, actions, targetX, targetY, salt);
      toast({ title: "Moves committed! Wait for opponent..." });
      refetchGame();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleReveal = async () => {
    if (plannedMoves.length === 0) return;

    const unitIds = plannedMoves.map(m => m.unitId);
    const actions = plannedMoves.map(m => m.action);
    const targetX = plannedMoves.map(m => m.targetX);
    const targetY = plannedMoves.map(m => m.targetY);

    try {
      await revealMove(unitIds, actions, targetX, targetY, salt);
      toast({ title: "Moves revealed!" });
      setPlannedMoves([]);
      setSalt(generateSalt());
      refetchGame();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleClaimWinnings = async () => {
    try {
      await claimWinnings(BigInt(gameId || 0));
      toast({ title: "Winnings claimed! 🎉" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

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
            <div className="flex items-center gap-4">
              {/* Turn Indicator */}
              <div className="flex items-center gap-2">
                <Circle className={`w-4 h-4 ${isMyTurn ? 'fill-green-500 text-green-500' : 'fill-red-500 text-red-500'}`} />
                <span className="text-sm">{isMyTurn ? "Your Turn" : "Opponent's Turn"}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Turn {game.currentTurn}</p>
                <p className="text-sm">
                  {isPlayer1 ? "You: Player 1" : isPlayer2 ? "You: Player 2" : "Spectator"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Battlefield */}
          <div className="lg:col-span-2">
            <Card className="tactical-card p-6">
              <Battlefield
                units={units || []}
                phase={game.phase}
                isPlayer1={isPlayer1}
                deploySlots={deploySlots}
                selectedSlot={selectedSlot}
                plannedMoves={plannedMoves}
                selectedUnitId={selectedUnitId}
                selectedAction={selectedAction}
                onDeployClick={handleDeployTileClick}
                onPlanClick={handlePlanTileClick}
              />
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="space-y-4">
            {game.phase === 0 && isMyTurn && (
              <DeploymentPanel
                deploySlots={deploySlots}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                onDeploy={handleBatchDeploy}
                unitsDeployed={isPlayer1 ? game.player1UnitsDeployed : game.player2UnitsDeployed}
              />
            )}

            {game.phase === 1 && isMyTurn && (
              <PlanningPanel
                myUnits={myUnits}
                plannedMoves={plannedMoves}
                selectedUnitId={selectedUnitId}
                selectedAction={selectedAction}
                onSelectUnit={setSelectedUnitId}
                onSelectAction={setSelectedAction}
                onCommit={handleCommit}
                onClearMoves={() => setPlannedMoves([])}
              />
            )}

            {game.phase === 2 && isMyTurn && (
              <Card className="tactical-card p-6 space-y-4">
                <h2 className="font-display text-xl font-bold">Reveal Phase</h2>
                <p className="text-sm text-muted-foreground">Reveal your committed moves</p>
                <Button onClick={handleReveal} className="w-full" size="lg">
                  Reveal Moves
                </Button>
              </Card>
            )}

            {game.phase === 4 && (
              <Card className="tactical-card p-6 space-y-4">
                <div className="text-center">
                  <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h2 className="font-display text-2xl font-bold mb-2">
                    {game.winner === address ? "Victory! 🎉" : "Defeat"}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Winner: {game.winner === address ? "You" : `${game.winner.slice(0,6)}...${game.winner.slice(-4)}`}
                  </p>
                  
                  {game.winner === address && (
                    <Button onClick={handleClaimWinnings} size="lg" className="w-full mb-4">
                      Claim Winnings
                    </Button>
                  )}

                  <div className="space-y-2">
                    <Link to="/lobby">
                      <Button variant="outline" className="w-full">
                        Return to Lobby
                      </Button>
                    </Link>
                    <Link to="/leaderboard">
                      <Button variant="ghost" className="w-full">
                        View Leaderboard
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Winner Stats */}
                <div className="pt-4 border-t border-border">
                  <PlayerStatsCard address={game.winner} compact />
                </div>
              </Card>
            )}

            {/* Unit Stats */}
            <Card className="tactical-card p-4">
              <h3 className="font-display font-bold mb-3">Your Units</h3>
              <div className="space-y-2">
                {myUnits.map(u => (
                  <div key={u.id} className="flex items-center justify-between text-sm">
                    <span>{UNIT_ICONS[u.unitType]} {UNIT_NAMES[u.unitType]}</span>
                    <span className="text-muted-foreground">HP: {u.health}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Battlefield({ units, phase, isPlayer1, deploySlots, selectedSlot, plannedMoves, selectedUnitId, selectedAction, onDeployClick, onPlanClick }: any) {
  const renderUnit = (x: number, y: number) => {
    const unit = units.find((u: any) => u.x === x && u.y === y && u.isAlive);
    if (!unit) return null;
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl">{UNIT_ICONS[unit.unitType]}</span>
        <span className="text-xs text-muted-foreground">{unit.health}HP</span>
      </div>
    );
  };

  const isPlanned = (x: number, y: number) => {
    return plannedMoves.some((m: PlannedMove) => m.targetX === x && m.targetY === y);
  };

  const isDeploySelected = (x: number, y: number) => {
    if (selectedSlot === null) return false;
    const pos = deploySlots[selectedSlot]?.pos;
    return pos?.x === x && pos?.y === y;
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: 25 }).map((_, i) => {
        const x = i % 5;
        const y = Math.floor(i / 5);
        const isPlayerZone = isPlayer1 ? y >= 3 : y <= 1;
        const canDeploy = phase === 0 && isPlayerZone && selectedSlot !== null;
        const canPlan = phase === 1 && selectedUnitId !== null && selectedAction !== null;

        return (
          <button
            key={i}
            onClick={() => {
              if (canDeploy) onDeployClick(x, y);
              if (canPlan) onPlanClick(x, y);
            }}
            className={`
              relative aspect-square rounded border-2 transition-all
              ${isPlayerZone ? "border-primary/40 bg-primary/10" : "border-border bg-muted/30"}
              ${canDeploy ? "hover:border-primary hover:bg-primary/30 cursor-pointer" : ""}
              ${canPlan ? "hover:border-accent hover:bg-accent/20 cursor-pointer" : ""}
              ${isDeploySelected(x, y) ? "border-primary bg-primary/40" : ""}
              ${isPlanned(x, y) ? "border-accent bg-accent/30" : ""}
            `}
          >
            {renderUnit(x, y)}
          </button>
        );
      })}
    </div>
  );
}

function DeploymentPanel({ deploySlots, selectedSlot, onSelectSlot, onDeploy, unitsDeployed }: any) {
  const allSelected = deploySlots.every((s: DeploymentSlot) => s.pos !== null);

  return (
    <Card className="tactical-card p-6 space-y-4">
      <h2 className="font-display text-xl font-bold">Deploy Units</h2>
      <p className="text-sm text-muted-foreground">
        {unitsDeployed === 3 ? "✅ Deployed!" : "Select positions for all 3 units"}
      </p>
      <div className="space-y-2">
        {deploySlots.map((slot: DeploymentSlot, i: number) => (
          <Button
            key={i}
            variant={selectedSlot === i ? "default" : slot.pos ? "outline" : "ghost"}
            onClick={() => onSelectSlot(i)}
            className="w-full justify-between"
            disabled={unitsDeployed === 3}
          >
            <span className="flex items-center gap-2">
              <span>{UNIT_ICONS[slot.type]}</span>
              <span>{UNIT_NAMES[slot.type]}</span>
            </span>
            {slot.pos && <span className="text-xs">({slot.pos.x}, {slot.pos.y})</span>}
          </Button>
        ))}
      </div>
      <Button 
        onClick={onDeploy} 
        className="w-full" 
        size="lg"
        disabled={!allSelected || unitsDeployed === 3}
      >
        Deploy All Units
      </Button>
    </Card>
  );
}

function PlanningPanel({ myUnits, plannedMoves, selectedUnitId, selectedAction, onSelectUnit, onSelectAction, onCommit, onClearMoves }: any) {
  const actions = [
    { id: 0, name: "Move", icon: <Target className="w-4 h-4" /> },
    { id: 1, name: "Attack", icon: <Sword className="w-4 h-4" /> },
    { id: 2, name: "Defend", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <Card className="tactical-card p-6 space-y-4">
      <h2 className="font-display text-xl font-bold">Plan Moves</h2>
      
      {/* Select Unit */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">1. Select Unit:</p>
        {myUnits.map((u: any) => {
          const planned = plannedMoves.find((m: PlannedMove) => m.unitId === u.id);
          return (
            <Button
              key={u.id}
              variant={selectedUnitId === u.id ? "default" : "outline"}
              onClick={() => onSelectUnit(u.id)}
              className="w-full justify-between"
            >
              <span>{UNIT_ICONS[u.unitType]} {UNIT_NAMES[u.unitType]}</span>
              {planned && <span className="text-xs">✓ Planned</span>}
            </Button>
          );
        })}
      </div>

      {/* Select Action */}
      {selectedUnitId !== null && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">2. Select Action:</p>
          <div className="grid grid-cols-3 gap-2">
            {actions.map(a => (
              <Button
                key={a.id}
                variant={selectedAction === a.id ? "default" : "outline"}
                onClick={() => onSelectAction(a.id)}
                className="flex-col h-auto py-3"
              >
                {a.icon}
                <span className="text-xs mt-1">{a.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedUnitId !== null && selectedAction !== null && (
        <p className="text-sm text-primary">3. Click a tile on the battlefield</p>
      )}

      <div className="pt-4 space-y-2">
        <p className="text-sm text-muted-foreground">
          Planned: {plannedMoves.length}/{myUnits.length}
        </p>
        <div className="flex gap-2">
          <Button onClick={onCommit} className="flex-1" disabled={plannedMoves.length === 0}>
            Commit Moves
          </Button>
          <Button onClick={onClearMoves} variant="outline" disabled={plannedMoves.length === 0}>
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}