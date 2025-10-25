/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NETWORK_NAME: string
  readonly VITE_RPC_URL: string
  readonly VITE_CHAIN_ID: string
  readonly VITE_CHAIN_ID_DECIMAL: string
  readonly VITE_NATIVE_CURRENCY_NAME: string
  readonly VITE_NATIVE_CURRENCY_SYMBOL: string
  readonly VITE_BLOCK_EXPLORER_URL: string
  readonly VITE_NFT_MARKETPLACE_ADDRESS: string
  readonly VITE_DEFAULT_GAS_LIMIT: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Extend window object for ethereum provider
declare global {
  interface Window {
    ethereum?: any
  }
}