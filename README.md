# ⚔️ RIFT COMMANDERS

> **A tactical strategy game**

![Mantle](https://img.shields.io/badge/Mantle-Sepolia-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

Strategic 2-player turn-based combat on a 5×5 battlefield. Command your forces, plan moves in secret, execute simultaneously using commit-reveal mechanics to achieve victory.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Game Description](#-game-description)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Game Mechanics](#-game-mechanics)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎮 Overview

**Rift Commanders** is a tactical combat game where two players deploy units, plan moves simultaneously, and battle in commit-reveal turns. Victory is achieved by eliminating the enemy Commander through strategic planning and simultaneous turn execution.

- **Genre:** Turn-based Tactical Strategy
- **Blockchain:** Mantle Network (Sepolia Testnet)
- **Smart Contracts:** Solidity 0.8.20
- **Players:** 1v1 PvP
- **Game Length:** 5-15 minutes per match
- **Built for:** Mantle Global Hackathon 2025

---

## 🎯 Game Description

Command 3 unique units - a powerful Commander, a close-range Warrior, and a long-range Archer. Plan your moves in secret using commit-reveal mechanics, then watch as both players' actions execute simultaneously. Outsmart your opponent to eliminate their Commander first.

### Core Gameplay Loop

1. **Deployment Phase** - Deploy 3 units on your side of the battlefield
2. **Planning Phase** - Secretly plan 1 action per unit (Move/Attack/Defend)
3. **Revealing Phase** - Both players reveal their committed moves
4. **Execution Phase** - Moves execute simultaneously, damage dealt
5. **Repeat** until a Commander is eliminated

---

## ✨ Features

### Core Mechanics
- **5×5 Grid Battlefield** - Compact tactical combat arena
- **3 Unique Unit Types:**
  - 👑 **Commander** (20 HP, 5 ATK, 3 DEF) - Must protect to win
  - ⚔️ **Warrior** (15 HP, 7 ATK, 2 DEF) - High-damage melee fighter
  - 🎯 **Archer** (10 HP, 6 ATK, 1 DEF) - Long-range attacker (2 tile range)
- **Commit-Reveal Mechanics** - Moves are hashed and hidden until reveal phase
- **Simultaneous Turn Execution** - No turn order advantage
- **Strategic Depth** - Positioning, prediction, and timing matter

### On-Chain Features
- ✅ Fully deterministic gameplay
- ✅ All game state stored on Mantle Network
- ✅ Verifiable move execution with commit-reveal
- ✅ No centralized server required
- ✅ EVM compatible smart contracts
- ✅ Optional betting system (wager MNT tokens)

---

## 🛠 Tech Stack

### Smart Contracts
- **Solidity 0.8.20** - Smart contract language
- **Hardhat 3.0.13** - Development framework
- **Mantle Sepolia** - Testnet deployment

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.7.3** - Type safety
- **Vite 7.1.7** - Build tool
- **Tailwind CSS 4.1.18** - Styling
- **React Router 6.22.3** - Navigation

### Web3 Integration
- **Wagmi 2.12.29** - React hooks for Ethereum
- **Viem 2.21.45** - Ethereum library
- **ConnectKit 1.8.2** - Beautiful wallet connection UI
- **TanStack Query 5.62.11** - Data fetching & caching

---

## 🚀 Getting Started

### Prerequisites

```bash
# Install Node.js (v22+ LTS recommended)
# Install npm or yarn
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rift-commanders.git
cd rift-commanders
```

2. **Install contract dependencies**
```bash
cd contracts
npm install
```

3. **Compile contracts**
```bash
npx hardhat compile
```

4. **Deploy to Mantle Sepolia**
```bash
# Configure .env with your private key
cp .env.example .env
# Edit .env and add your PRIVATE_KEY

# Deploy
npm run deploy:mantle-sepolia
```

5. **Install frontend dependencies**
```bash
cd ../client
npm install
```

6. **Configure frontend environment**
```bash
# Copy .env.example to .env
cp .env.example .env

# Add deployed contract addresses from step 4
VITE_GAME_FACTORY_ADDRESS=0x...
VITE_GAME_STATE_ADDRESS=0x...
VITE_COMBAT_ADDRESS=0x...
VITE_TURN_EXECUTION_ADDRESS=0x...

# Get WalletConnect Project ID from https://cloud.walletconnect.com
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

7. **Run the frontend**
```bash
npm run dev
```

The game will be available at `http://localhost:5173`

---

## 🎲 Game Mechanics

### Unit Stats

| Unit | Health | Attack | Defense | Move Range | Attack Range |
|------|--------|--------|---------|------------|--------------|
| 👑 Commander | 20 | 5 | 3 | 1 tile | 1 tile (melee) |
| ⚔️ Warrior | 15 | 7 | 2 | 1 tile | 1 tile (melee) |
| 🎯 Archer | 10 | 6 | 1 | 1 tile | 2 tiles (ranged) |

### Action Types

- **Move** - Relocate unit 1 tile (Manhattan distance)
- **Attack** - Deal damage to enemy within range
- **Defend** - Reduce incoming damage by 50% for this turn

### Win Conditions

- ✅ Eliminate enemy Commander
- ✅ Claim timeout (if opponent doesn't act within 5 minutes)

### Deployment Zones

- **Player 1** - Bottom 2 rows (rows 3-4)
- **Player 2** - Top 2 rows (rows 0-1)
- **No-Man's Land** - Middle row (row 2)

---

## 📁 Project Structure

```
rift-commanders/
├── contracts/              # Solidity smart contracts
│   ├── src/
│   │   ├── GameFactory.sol      # Lobby & game creation
│   │   ├── GameState.sol        # Main game logic & state
│   │   ├── Combat.sol           # Combat calculations
│   │   └── TurnExecution.sol    # Commit-reveal mechanics
│   ├── scripts/
│   │   └── deploy.ts            # Deployment script
│   ├── hardhat.config.ts
│   └── package.json
│
└── client/                # React frontend
    ├── src/
    │   ├── components/    # UI components
    │   │   ├── game/
    │   │   ├── lobby/
    │   │   └── ui/
    │   ├── config/       # Contract addresses & ABIs
    │   ├── hooks/        # Custom React hooks
    │   ├── pages/        # Route pages
    │   ├── providers/    # Wallet provider
    │   ├── types/        # TypeScript types
    │   └── utils/        # Helper functions
    ├── package.json
    └── vite.config.ts
```

```

View on Mantle Sepolia Explorer:
- [Explorer](https://explorer.sepolia.mantle.xyz)

### Deploy Your Own

```bash
# Configure .env in contracts/
PRIVATE_KEY=your_wallet_private_key
MANTLE_SEPOLIA_RPC=https://rpc.sepolia.mantle.xyz

# Deploy
cd contracts
npm run deploy:mantle-sepolia

# Verify (optional)
npm run verify:mantle-sepolia <CONTRACT_ADDRESS>
```

### Frontend Deployment (Vercel)

```bash
# Build
cd client
npm run build

# Deploy to Vercel
vercel --prod
```

**Live Demo:** [Add your deployed URL]

---

## 🎮 How to Play

1. **Connect Wallet** - Use MetaMask, WalletConnect, or any EVM wallet
2. **Create/Join Game** - Start a new match or join existing lobby
3. **Deploy Units** - Place Commander, Warrior, Archer on your territory
4. **Plan Moves** - Select units and choose actions (Move/Attack/Defend)
5. **Commit Moves** - Submit hashed moves on-chain
6. **Reveal Moves** - Reveal your moves after opponent commits
7. **Execute Turn** - Watch simultaneous combat resolution
8. **Win** - Eliminate enemy Commander or claim timeout

---

## 🔧 Development

### Run Local Tests

```bash
cd contracts
npx hardhat test
```

### Local Development Flow

```bash
# Terminal 1 - Local Hardhat node
cd contracts
npx hardhat node

# Terminal 2 - Deploy to local
npm run deploy:local

# Terminal 3 - Frontend
cd client
npm run dev
```

---

## 🐛 Known Issues

- Turn timer mechanism implemented but needs UI polish
- Mobile responsiveness needs improvement
- Game stats/leaderboard not yet implemented

---

## 🗺 Roadmap

- [x] Core game mechanics (commit-reveal)
- [x] Unit deployment system
- [x] Betting/wagering system
- [ ] Turn timer UI
- [ ] Sound effects and animations
- [ ] Mobile-responsive UI
- [ ] Leaderboard and player stats
- [ ] Tournament mode
- [ ] Additional unit types
- [ ] Spectator mode

---

## 🤝 Contributing

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Developer:** [Ted Adams]
- **GitHub:** [@yourusername](https://github.com/Ted1166)
- **Twitter:** [@yourhandle](https://twitter.com/yourhandle)

---

## 🎯 Strategy Tips

- **Protect your Commander** - Keep them in the back rows
- **Use Archer's range** - Harass from 2 tiles away
- **Warrior frontline** - Tank damage and push forward
- **Predict opponent moves** - Think one step ahead during planning
- **Control center tiles** - Dominate the middle row
- **Defend strategically** - Use defend action when expecting attacks
- **Commit early** - Force opponent to commit without seeing your moves

---

## 🔐 Security

- All game logic is on-chain and verifiable
- Commit-reveal prevents move frontrunning
- No trusted third parties required
- Smart contracts are immutable after deployment

---
