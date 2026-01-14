import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useGameFactory, useOpenLobbies, useLobbyCreated } from "@/hooks/useGameFactory";
import { CONTRACT_ADDRESSES, GAME_FACTORY_ABI } from "@/config/contracts";
import { useToast } from "@/hooks/use-toast";
import { Swords, Plus, Zap } from "lucide-react";
import { formatEther } from "viem";

export default function Lobby() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState("0.01");
  const [isCreating, setIsCreating] = useState(false);
  
  const { createLobby, joinLobby, quickMatch } = useGameFactory();
  const { lobbies, isLoading, refetch } = useOpenLobbies();

  useLobbyCreated((gameId) => {
    toast({ title: "Game created!", description: `Game ID: ${gameId}` });
    navigate(`/game/${gameId}`);
  });

  const handleCreateLobby = async () => {
    if (!isConnected) return;
    setIsCreating(true);
    try {
      await createLobby(false, betAmount);
      toast({ title: "Creating lobby..." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinLobby = async (gameId: bigint, bet: bigint) => {
    if (!isConnected) return;
    try {
      await joinLobby(gameId, formatEther(bet));
      navigate(`/game/${gameId}`);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleQuickMatch = async () => {
    if (!isConnected) return;
    try {
      await quickMatch(betAmount);
      toast({ title: "Finding match..." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <Swords className="w-16 h-16 text-primary mx-auto" />
          <h1 className="font-display text-4xl font-bold">Connect to Battle</h1>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-bold text-primary text-glow">
            Battle Lobby
          </h1>
          <ConnectButton />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="tactical-card p-6 space-y-4">
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Plus className="w-6 h-6 text-primary" />
              Create Lobby
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Bet Amount (MNT)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={handleCreateLobby} 
                disabled={isCreating}
                className="w-full"
                size="lg"
              >
                {isCreating ? "Creating..." : "Create Public Lobby"}
              </Button>
            </div>
          </Card>

          <Card className="tactical-card p-6 space-y-4">
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-accent" />
              Quick Match
            </h2>
            <p className="text-sm text-muted-foreground">
              Join or create a lobby instantly
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Bet Amount (MNT)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={handleQuickMatch}
                className="w-full"
                size="lg"
                variant="default"
              >
                Quick Match
              </Button>
            </div>
          </Card>
        </div>

        {/* Open Lobbies */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-bold">Open Lobbies</h2>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
          
          {isLoading ? (
            <p className="text-muted-foreground">Loading lobbies...</p>
          ) : lobbies.length === 0 ? (
            <Card className="tactical-card p-8 text-center">
              <p className="text-muted-foreground">No open lobbies. Create one!</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {lobbies.map((gameId) => (
                <LobbyCard 
                  key={gameId.toString()} 
                  gameId={gameId} 
                  onJoin={handleJoinLobby}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LobbyCard({ gameId, onJoin }: { gameId: bigint; onJoin: (id: bigint, bet: bigint) => void }) {
  const { data: lobbyData } = useReadContract({
    address: CONTRACT_ADDRESSES.GAME_FACTORY,
    abi: GAME_FACTORY_ABI,
    functionName: "lobbies",
    args: [gameId],
  });

  if (!lobbyData) return null;

   // Destructure tuple: [gameId, player1, player2, createdAt, isPrivate, isStarted, betAmount, prizeClaimed]
  const betAmount = lobbyData[6];

  return (
    <Card className="tactical-card p-6 flex items-center justify-between">
      <div>
        <div className="font-display text-lg font-bold">Game #{gameId.toString()}</div>
        <div className="text-sm text-muted-foreground">
          Bet: {formatEther(betAmount)} MNT
        </div>
      </div>
      <Button onClick={() => onJoin(gameId, betAmount)}>
        Join Battle
      </Button>
    </Card>
  );
}