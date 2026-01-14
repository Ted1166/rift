// Contract addresses - Update these after deployment
export const CONTRACT_ADDRESSES = {
  GAME_FACTORY: (import.meta as any).env.VITE_GAME_FACTORY_ADDRESS as `0x${string}`,
  GAME_STATE: (import.meta as any).env.VITE_GAME_STATE_ADDRESS as `0x${string}`,
  COMBAT: (import.meta as any).env.VITE_COMBAT_ADDRESS as `0x${string}`,
  TURN_EXECUTION: (import.meta as any).env.VITE_TURN_EXECUTION_ADDRESS as `0x${string}`,
} as const;

// Network configuration
export const CHAIN_CONFIG = {
  mantleSepolia: {
    id: 5003,
    name: 'Mantle Sepolia',
    network: 'mantle-sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'MNT',
      symbol: 'MNT',
    },
    rpcUrls: {
      default: { http: ['https://rpc.sepolia.mantle.xyz'] },
      public: { http: ['https://rpc.sepolia.mantle.xyz'] },
    },
    blockExplorers: {
      default: { name: 'Mantle Sepolia Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
    },
    testnet: true,
  },
  mantleMainnet: {
    id: 5000,
    name: 'Mantle',
    network: 'mantle',
    nativeCurrency: {
      decimals: 18,
      name: 'MNT',
      symbol: 'MNT',
    },
    rpcUrls: {
      default: { http: ['https://rpc.mantle.xyz'] },
      public: { http: ['https://rpc.mantle.xyz'] },
    },
    blockExplorers: {
      default: { name: 'Mantle Explorer', url: 'https://explorer.mantle.xyz' },
    },
    testnet: false,
  },
} as const;

// Contract ABIs
export const GAME_FACTORY_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "player1", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "player2", "type": "address" }
    ],
    "name": "GameStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "isPrivate", "type": "bool" },
      { "indexed": false, "internalType": "uint256", "name": "betAmount", "type": "uint256" }
    ],
    "name": "LobbyCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" }
    ],
    "name": "PlayerJoined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "WinningsClaimed",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "gameId", "type": "uint256" }],
    "name": "cancelLobby",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "gameId", "type": "uint256" }],
    "name": "claimWinnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bool", "name": "isPrivate", "type": "bool" }],
    "name": "createLobby",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameCounter",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameState",
    "outputs": [{ "internalType": "contract GameState", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOpenLobbies",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "player", "type": "address" }],
    "name": "getPlayerGames",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "gameId", "type": "uint256" }],
    "name": "joinLobby",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "lobbies",
    "outputs": [
      { "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "internalType": "address", "name": "player1", "type": "address" },
      { "internalType": "address", "name": "player2", "type": "address" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
      { "internalType": "bool", "name": "isPrivate", "type": "bool" },
      { "internalType": "bool", "name": "isStarted", "type": "bool" },
      { "internalType": "uint256", "name": "betAmount", "type": "uint256" },
      { "internalType": "bool", "name": "prizeClaimed", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "quickMatch",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

export const GAME_STATE_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" }
    ],
    "name": "GameEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "player1", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "player2", "type": "address" }
    ],
    "name": "GameInitialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": false, "internalType": "enum GameState.GamePhase", "name": "newPhase", "type": "uint8" }
    ],
    "name": "PhaseChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "winner", "type": "address" }
    ],
    "name": "PlayerTimedOut",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": false, "internalType": "uint8", "name": "attackerId", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "targetId", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "damage", "type": "uint8" }
    ],
    "name": "UnitAttacked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": false, "internalType": "uint8", "name": "unitId", "type": "uint8" }
    ],
    "name": "UnitDefending",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "unitId", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "x", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "y", "type": "uint8" }
    ],
    "name": "UnitDeployed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "indexed": false, "internalType": "uint8", "name": "unitId", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "fromX", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "fromY", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "toX", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "toY", "type": "uint8" }
    ],
    "name": "UnitMoved",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "gameId", "type": "uint256" }],
    "name": "claimTimeout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "internalType": "bytes32", "name": "moveHash", "type": "bytes32" }
    ],
    "name": "commitMove",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "combat",
    "outputs": [{ "internalType": "contract Combat", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "internalType": "enum GameState.UnitType", "name": "unitType", "type": "uint8" },
      { "internalType": "uint8", "name": "x", "type": "uint8" },
      { "internalType": "uint8", "name": "y", "type": "uint8" }
    ],
    "name": "deployUnit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "gameId", "type": "uint256" }],
    "name": "getAllUnits",
    "outputs": [
      {
        "components": [
          { "internalType": "enum GameState.UnitType", "name": "unitType", "type": "uint8" },
          { "internalType": "uint8", "name": "x", "type": "uint8" },
          { "internalType": "uint8", "name": "y", "type": "uint8" },
          { "internalType": "uint8", "name": "health", "type": "uint8" },
          { "internalType": "uint8", "name": "attack", "type": "uint8" },
          { "internalType": "uint8", "name": "defense", "type": "uint8" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "bool", "name": "isAlive", "type": "bool" },
          { "internalType": "uint8", "name": "id", "type": "uint8" }
        ],
        "internalType": "struct GameState.Unit[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "gameId", "type": "uint256" }],
    "name": "getGame",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "player1", "type": "address" },
          { "internalType": "address", "name": "player2", "type": "address" },
          { "internalType": "enum GameState.GamePhase", "name": "phase", "type": "uint8" },
          { "internalType": "uint8", "name": "currentTurn", "type": "uint8" },
          { "internalType": "address", "name": "winner", "type": "address" },
          { "internalType": "uint256", "name": "lastActionTime", "type": "uint256" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "uint8", "name": "player1UnitsDeployed", "type": "uint8" },
          { "internalType": "uint8", "name": "player2UnitsDeployed", "type": "uint8" }
        ],
        "internalType": "struct GameState.Game",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "internalType": "uint8", "name": "x", "type": "uint8" },
      { "internalType": "uint8", "name": "y", "type": "uint8" }
    ],
    "name": "getTile",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "internalType": "uint8", "name": "unitId", "type": "uint8" }
    ],
    "name": "getUnit",
    "outputs": [
      {
        "components": [
          { "internalType": "enum GameState.UnitType", "name": "unitType", "type": "uint8" },
          { "internalType": "uint8", "name": "x", "type": "uint8" },
          { "internalType": "uint8", "name": "y", "type": "uint8" },
          { "internalType": "uint8", "name": "health", "type": "uint8" },
          { "internalType": "uint8", "name": "attack", "type": "uint8" },
          { "internalType": "uint8", "name": "defense", "type": "uint8" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "bool", "name": "isAlive", "type": "bool" },
          { "internalType": "uint8", "name": "id", "type": "uint8" }
        ],
        "internalType": "struct GameState.Unit",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "internalType": "uint8[]", "name": "unitIds", "type": "uint8[]" },
      { "internalType": "uint8[]", "name": "actions", "type": "uint8[]" },
      { "internalType": "uint8[]", "name": "targetX", "type": "uint8[]" },
      { "internalType": "uint8[]", "name": "targetY", "type": "uint8[]" },
      { "internalType": "bytes32", "name": "salt", "type": "bytes32" }
    ],
    "name": "revealMove",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }],
    "name": "setFactory",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "turnExecution",
    "outputs": [{ "internalType": "contract TurnExecution", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Helper to validate contract addresses are set
export function validateContractAddresses(): boolean {
  return Boolean(
    CONTRACT_ADDRESSES.GAME_FACTORY &&
    CONTRACT_ADDRESSES.GAME_STATE &&
    CONTRACT_ADDRESSES.COMBAT &&
    CONTRACT_ADDRESSES.TURN_EXECUTION
  );
}