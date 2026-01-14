import "hardhat/types/config";
import "hardhat/types/runtime";
import type { HardhatEthersHelpers } from "@nomicfoundation/hardhat-ethers/types";

declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    ethers: HardhatEthersHelpers;
  }
}

declare module "hardhat/types/config" {
  interface HttpNetworkUserConfig {
    type?: string;
  }
  
  interface HardhatNetworkUserConfig {
    type?: string;
  }
}