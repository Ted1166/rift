import { ethers } from "ethers";
import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const networkName = hre.network.name;
  const rpcUrl = process.env.MANTLE_SEPOLIA_RPC || "https://rpc.sepolia.mantle.xyz";

  console.log("\n🎮 ═══════════════════════════════════════════════════════");
  console.log("   RIFT COMMANDERS DEPLOYMENT");
  console.log("   Network:", networkName);
  console.log("═══════════════════════════════════════════════════════\n");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log("📋 Deployment Information:");
  console.log("─────────────────────────────────────────────────────────");
  console.log("  Deployer address:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("  Account balance: ", ethers.formatEther(balance), "MNT");
  console.log("─────────────────────────────────────────────────────────\n");

  if (balance < ethers.parseEther("0.01")) {
    throw new Error("❌ Insufficient balance! Need at least 0.01 MNT");
  }

  let deploymentInfo: any = {
    network: networkName,
    deployer: wallet.address,
    deploymentTime: new Date().toISOString(),
    contracts: {},
  };

  // Deploy GameFactory (which creates GameState, Combat, and TurnExecution internally)
  console.log("📦 [1/1] Deploying GameFactory...");
  const GameFactoryArtifact = await hre.artifacts.readArtifact("GameFactory");
  const GameFactoryFactory = new ethers.ContractFactory(
    GameFactoryArtifact.abi,
    GameFactoryArtifact.bytecode,
    wallet
  );
  const gameFactory = await GameFactoryFactory.deploy();
  await gameFactory.waitForDeployment();
  const factoryAddress = await gameFactory.getAddress();
  console.log("✅ GameFactory deployed at:", factoryAddress);
  console.log();

  // Get addresses of contracts created by GameFactory
  console.log("🔍 Getting child contract addresses...");
  
  // Create a properly typed contract instance
  const gameFactoryContract = new ethers.Contract(
    factoryAddress,
    GameFactoryArtifact.abi,
    wallet
  );
  
  const gameStateAddress = await gameFactoryContract.gameState();
  console.log("✅ GameState deployed to:", gameStateAddress);

  // Get Combat and TurnExecution addresses from GameState
  const GameStateArtifact = await hre.artifacts.readArtifact("GameState");
  const gameStateContract = new ethers.Contract(
    gameStateAddress,
    GameStateArtifact.abi,
    wallet
  );
  
  const combatAddress = await gameStateContract.combat();
  const turnExecutionAddress = await gameStateContract.turnExecution();
  
  console.log("✅ Combat deployed to:", combatAddress);
  console.log("✅ TurnExecution deployed to:", turnExecutionAddress);
  console.log();

  deploymentInfo.contracts = {
    GameFactory: factoryAddress,
    GameState: gameStateAddress,
    Combat: combatAddress,
    TurnExecution: turnExecutionAddress,
  };

  // Save deployment info
  const deploymentsDir = path.join(process.cwd(), "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `rift_${networkName}_${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  fs.writeFileSync(
    path.join(deploymentsDir, `${networkName}_latest.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to:", filename);
  console.log();

  console.log("🎉 ═══════════════════════════════════════════════════════");
  console.log("   DEPLOYMENT COMPLETE!");
  console.log("═══════════════════════════════════════════════════════");
  console.log("\n📋 Contract Addresses:");
  console.log("─────────────────────────────────────────────────────────");
  
  Object.entries(deploymentInfo.contracts).forEach(([name, address]) => {
    console.log(`  ${name.padEnd(18)}: ${address}`);
  });
  
  console.log("─────────────────────────────────────────────────────────");

  console.log("\n📝 Add these to your frontend .env file:");
  console.log("─────────────────────────────────────────────────────────");
  console.log(`VITE_GAME_FACTORY_ADDRESS=${factoryAddress}`);
  console.log(`VITE_GAME_STATE_ADDRESS=${gameStateAddress}`);
  console.log(`VITE_COMBAT_ADDRESS=${combatAddress}`);
  console.log(`VITE_TURN_EXECUTION_ADDRESS=${turnExecutionAddress}`);
  console.log("─────────────────────────────────────────────────────────");

  console.log("\n🔗 View on Mantle Sepolia Explorer:");
  console.log("─────────────────────────────────────────────────────────");
  Object.entries(deploymentInfo.contracts).forEach(([name, address]) => {
    console.log(`  ${name}: https://explorer.sepolia.mantle.xyz/address/${address}`);
  });

  // Verification commands
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("\n🔍 Verify contracts with:");
    console.log("─────────────────────────────────────────────────────────");
    console.log(`npx hardhat verify --network ${networkName} ${factoryAddress}`);
    console.log("─────────────────────────────────────────────────────────");
  }

  console.log("\n✨ Deployment complete! Ready to battle! ⚔️\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ ═══════════════════════════════════════════════════════");
    console.error("   DEPLOYMENT FAILED!");
    console.error("═══════════════════════════════════════════════════════\n");
    console.error(error);
    process.exit(1);
  });