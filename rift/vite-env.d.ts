/// <reference types="vite/client" />

// interface ImportMetaEnv {
//   readonly VITE_WALLETCONNECT_PROJECT_ID: string
//   readonly VITE_GAME_FACTORY_ADDRESS: string
//   readonly VITE_GAME_STATE_ADDRESS: string
//   readonly VITE_COMBAT_ADDRESS: string
//   readonly VITE_TURN_EXECUTION_ADDRESS: string
// }

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// declare module '*.png' {
//   const value: string;
//   export default value;
// }
