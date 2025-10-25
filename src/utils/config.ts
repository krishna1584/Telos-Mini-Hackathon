// Configuration using environment variables
export const config = {
  networkName: import.meta.env.VITE_NETWORK_NAME || 'Your Network',
  nativeCurrencySymbol: import.meta.env.VITE_NATIVE_CURRENCY_SYMBOL || 'TOKEN',
  appName: import.meta.env.VITE_APP_NAME || 'NFT Marketplace',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Discover, collect, and trade unique digital assets',
};

// Sample/demo data - replace with your own
export const DEMO_CREATOR_ADDRESS = 'DEMO_CREATOR_ADDRESS_PLACEHOLDER';