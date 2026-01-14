import { useReadContract, useWriteContract, useWatchContractEvent } from "wagmi";
import { CONTRACT_ADDRESSES, GAME_FACTORY_ABI } from "../config/contracts";
import { parseEther } from "viem";

export function useGameFactory() {
  const { writeContractAsync } = useWriteContract();

  const createLobby = async (isPrivate: boolean, betAmount: string) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.GAME_FACTORY,
      abi: GAME_FACTORY_ABI,
      functionName: "createLobby",
      args: [isPrivate],
      value: parseEther(betAmount),
    }as any);
  };

  const joinLobby = async (gameId: bigint, betAmount: string) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.GAME_FACTORY,
      abi: GAME_FACTORY_ABI,
      functionName: "joinLobby",
      args: [gameId],
      value: parseEther(betAmount),
    }as any);
  };

  const quickMatch = async (betAmount: string) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.GAME_FACTORY,
      abi: GAME_FACTORY_ABI,
      functionName: "quickMatch",
      value: parseEther(betAmount),
    }as any);
  };

  const claimWinnings = async (gameId: bigint) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.GAME_FACTORY,
      abi: GAME_FACTORY_ABI,
      functionName: "claimWinnings",
      args: [gameId],
    }as any);
  };

  return {
    createLobby,
    joinLobby,
    quickMatch,
    claimWinnings,
  };
}

export function useOpenLobbies() {
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.GAME_FACTORY,
    abi: GAME_FACTORY_ABI,
    functionName: "getOpenLobbies",
  });

  return { lobbies: data || [], isLoading, refetch };
}

export function useLobbyCreated(onLobbyCreated: (gameId: bigint) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GAME_FACTORY,
    abi: GAME_FACTORY_ABI,
    eventName: "LobbyCreated",
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.gameId) {
          onLobbyCreated(log.args.gameId);
        }
      });
    },
  });
}