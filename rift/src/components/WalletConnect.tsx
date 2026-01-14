import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { CyberCard } from "./ui/cyber-card";
import { CyberButton } from "./ui/cyber-button";

export const WalletConnect = () => {
  const handleConnect = () => {
    // This would integrate with wagmi/connectkit in a real implementation
    console.log("Connect wallet clicked");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-16"
    >
      <CyberCard variant="hero" padding="xl" className="text-center max-w-2xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl tracking-wider text-glow mb-4">
          INITIALIZE SYSTEM
        </h2>
        <p className="text-muted-foreground mb-8">
          Connect your wallet to begin
        </p>
        <CyberButton
          variant="primary"
          size="xl"
          className="w-full max-w-md mx-auto"
          onClick={handleConnect}
        >
          <Wallet className="w-5 h-5" />
          CONNECT WALLET
        </CyberButton>
        <p className="text-muted-foreground/60 text-sm mt-6">
          Supports MetaMask, WalletConnect, Coinbase Wallet, and more
        </p>
      </CyberCard>
    </motion.div>
  );
};