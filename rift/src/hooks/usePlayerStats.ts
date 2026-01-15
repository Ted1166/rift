import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, PLAYER_STATS_ABI } from "../config/contracts";

export function usePlayerStats(address?: string) {
  const { data: stats, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.PLAYER_STATS,
    abi: PLAYER_STATS_ABI,
    functionName: "getStats",
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });

  const { data: winRate } = useReadContract({
    address: CONTRACT_ADDRESSES.PLAYER_STATS,
    abi: PLAYER_STATS_ABI,
    functionName: "getWinRate",
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });

  return {
    stats: stats || {
      gamesPlayed: 0n,
      wins: 0n,
      losses: 0n,
      totalDamageDealt: 0n,
      totalUnitsKilled: 0n,
      winStreak: 0n,
      bestWinStreak: 0n,
    },
    winRate: winRate || 0n,
    refetch,
  };
}

export function useLeaderboard(limit: number = 10) {
  const { data, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.PLAYER_STATS,
    abi: PLAYER_STATS_ABI,
    functionName: "getTopPlayers",
    args: [BigInt(limit)],
  });

  return {
    players: data?.[0] || [],
    wins: data?.[1] || [],
    refetch,
  };
}