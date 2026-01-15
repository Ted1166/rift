import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";

const mantleSepolia = {
  id: 5003,
  name: "Mantle Sepolia",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: {
    default: { 
      http: [
        "https://rpc.sepolia.mantle.xyz",
        "https://rpc.testnet.mantle.xyz" // fallback
      ] 
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.sepolia.mantle.xyz" },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "Rift Commanders",
  projectId: (import.meta as any).env.VITE_WALLETCONNECT_PROJECT_ID || "",
  chains: [mantleSepolia] as const,
  transports: {
    [mantleSepolia.id]: http("https://rpc.sepolia.mantle.xyz", {
      batch: true,
      retryCount: 3,
      timeout: 30_000,
    }),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}