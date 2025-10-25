import { ethers } from 'ethers';
import NFTMarketplaceABI from '../contracts/NFTMarketplace.json';

// Configuration from environment variables
const NETWORK_RPC_URL = import.meta.env.VITE_RPC_URL || 'YOUR_RPC_URL';
const NFT_MARKETPLACE_ADDRESS = import.meta.env.VITE_NFT_MARKETPLACE_ADDRESS || 'YOUR_CONTRACT_ADDRESS';
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || '0x1';
const CHAIN_ID_DECIMAL = import.meta.env.VITE_CHAIN_ID_DECIMAL || '1';
const NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME || 'Your Network';
const NATIVE_CURRENCY_NAME = import.meta.env.VITE_NATIVE_CURRENCY_NAME || 'ETH';
const NATIVE_CURRENCY_SYMBOL = import.meta.env.VITE_NATIVE_CURRENCY_SYMBOL || 'ETH';
const BLOCK_EXPLORER_URL = import.meta.env.VITE_BLOCK_EXPLORER_URL || 'https://etherscan.io';
const DEFAULT_GAS_LIMIT = parseInt(import.meta.env.VITE_DEFAULT_GAS_LIMIT || '500000');

let provider: ethers.providers.Web3Provider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;

export const getNetworkProvider = () => {
  return new ethers.providers.JsonRpcProvider(NETWORK_RPC_URL);
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) throw new Error("Please install MetaMask!");
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_ID }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: CHAIN_ID,
            chainName: NETWORK_NAME,
            nativeCurrency: {
              name: NATIVE_CURRENCY_NAME,
              symbol: NATIVE_CURRENCY_SYMBOL,
              decimals: 18
            },
            rpcUrls: [NETWORK_RPC_URL],
            blockExplorerUrls: [BLOCK_EXPLORER_URL]
          }]
        });
      } else {
        throw switchError;
      }
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    
    contract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS, 
      NFTMarketplaceABI.abi, 
      signer
    );
    
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

const ensureContract = () => {
  if (!contract || !signer) {
    throw new Error("Please connect your wallet first!");
  }
  return contract;
};

export const getBalance = async (address: string) => {
  try {
    if (!provider) {
      provider = new ethers.providers.JsonRpcProvider(NETWORK_RPC_URL);
    }
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
};

export const createNFT = async (name: string, price: string, category: string, image: string) => {
  try {
    const nftContract = ensureContract();
    
    // Convert price to wei
    const priceInWei = ethers.utils.parseEther(price);
    console.log('Price in Wei:', priceInWei.toString());
    
    // Generate token ID
    const tokenId = Math.floor(Date.now() / 1000);
    console.log('Token ID:', tokenId);

    // Create NFT with no listing fee
    const tx = await nftContract.createMarketItem(
      NFT_MARKETPLACE_ADDRESS,
      tokenId,
      priceInWei,
      category,
      image,
      name,
      { 
        value: 0, // No listing fee
        gasLimit: DEFAULT_GAS_LIMIT
      }
    );
    
    console.log('Transaction Hash:', tx.hash);
    const receipt = await tx.wait(1); // Wait for 1 confirmation
    console.log('Transaction Receipt:', receipt);
    
    return tx;
  } catch (error: any) {
    console.error("Error creating NFT:", error);
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error(`Insufficient ${NATIVE_CURRENCY_SYMBOL} for gas fees. Please make sure you have enough ${NATIVE_CURRENCY_SYMBOL} for gas.`);
    } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      throw new Error(`Network error: Please ensure you're connected to ${NETWORK_NAME} and try again`);
    } else if (error.message.includes("user rejected")) {
      throw new Error("Transaction was rejected by user");
    } else {
      throw new Error("Failed to create NFT. Please try again.");
    }
  }
};

export const buyNFT = async (itemId: number, price: string) => {
  try {
    const nftContract = ensureContract();
    const priceInWei = ethers.utils.parseEther(price);
    
    const tx = await nftContract.createMarketSale(
      NFT_MARKETPLACE_ADDRESS,
      itemId,
      { 
        value: priceInWei,
        gasLimit: DEFAULT_GAS_LIMIT
      }
    );
    
    console.log('Buy Transaction Hash:', tx.hash);
    const receipt = await tx.wait(1);
    console.log('Buy Transaction Receipt:', receipt);
    
    return tx;
  } catch (error: any) {
    console.error("Error buying NFT:", error);
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error(`Insufficient ${NATIVE_CURRENCY_SYMBOL}. Please make sure you have enough ${NATIVE_CURRENCY_SYMBOL} for the purchase price plus gas fees.`);
    } else if (error.code === 4001) {
      throw new Error("Transaction was rejected by user");
    } else {
      throw new Error("Failed to buy NFT. Please try again.");
    }
  }
};

export const fetchMarketItems = async () => {
  try {
    const nftContract = ensureContract();
    const items = await nftContract.fetchMarketItems();
    return items;
  } catch (error: any) {
    console.error("Error fetching market items:", error);
    throw new Error(`Failed to fetch market items: ${error.message}`);
  }
};

export const fetchMyNFTs = async () => {
  try {
    const nftContract = ensureContract();
    const items = await nftContract.fetchMyNFTs();
    return items;
  } catch (error: any) {
    console.error("Error fetching my NFTs:", error);
    throw new Error(`Failed to fetch your NFTs: ${error.message}`);
  }
};