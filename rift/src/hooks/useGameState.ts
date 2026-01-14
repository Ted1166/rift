import { useReadContract, useWriteContract, useWatchContractEvent } from "wagmi";
import { CONTRACT_ADDRESSES, GAME_STATE_ABI } from "../config/contracts";
import { keccak256, encodePacked } from "viem";

export type UnitType = 0 | 1 | 2; // Commander, Warrior, Archer
export type GamePhase = 0 | 1 | 2 | 3 | 4; // Deployment, Planning, Revealing, Execution, Ended

export function useGameState(gameId: bigint) {
  const { data: game, refetch: refetchGame } = useReadContract({
    address: CONTRACT_ADDRESSES.GAME_STATE,
    abi: GAME_STATE_ABI,
    functionName: "getGame",
    args: [gameId],
  });

  const { data: units, refetch: refetchUnits } = useReadContract({
    address: CONTRACT_ADDRESSES.GAME_STATE,
    abi: GAME_STATE_ABI,
    functionName: "getAllUnits",
    args: [gameId],
  });

  return { game, units, refetchGame, refetchUnits };
}

export function useGameActions(gameId: bigint) {
  const { writeContractAsync } = useWriteContract();

  const deployUnit = async (unitType: UnitType, x: number, y: number) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.GAME_STATE,
      abi: GAME_STATE_ABI,
      functionName: "deployUnit",
      args: [gameId, unitType, x, y],
    }as any);
  };

  const commitMove = async (
    unitIds: number[],
    actions: number[],
    targetX: number[],
    targetY: number[],
    salt: string
  ) => {
    const hash = keccak256(
      encodePacked(
        ["uint8[]", "uint8[]", "uint8[]", "uint8[]", "bytes32"],
        [unitIds, actions, targetX, targetY, salt as `0x${string}`]
      )
    );

    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.GAME_STATE,
      abi: GAME_STATE_ABI,
      functionName: "commitMove",
      args: [gameId, hash],
    }as any);
  };

  const revealMove = async (
    unitIds: number[],
    actions: number[],
    targetX: number[],
    targetY: number[],
    salt: string
  ) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.GAME_STATE,
      abi: GAME_STATE_ABI,
      functionName: "revealMove",
      args: [gameId, unitIds, actions, targetX, targetY, salt as `0x${string}`],
    }as any);
  };

  const claimTimeout = async () => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.GAME_STATE,
      abi: GAME_STATE_ABI,
      functionName: "claimTimeout",
      args: [gameId],
    }as any);
  };

  return { deployUnit, commitMove, revealMove, claimTimeout };
}

export function useGameEvents(
  gameId: bigint,
  onPhaseChanged?: (phase: GamePhase) => void,
  onGameEnded?: (winner: string) => void
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GAME_STATE,
    abi: GAME_STATE_ABI,
    eventName: "PhaseChanged",
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.gameId === gameId && log.args.newPhase !== undefined) {
          onPhaseChanged?.(log.args.newPhase as GamePhase);
        }
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GAME_STATE,
    abi: GAME_STATE_ABI,
    eventName: "GameEnded",
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.gameId === gameId && log.args.winner) {
          onGameEnded?.(log.args.winner);
        }
      });
    },
  });
}