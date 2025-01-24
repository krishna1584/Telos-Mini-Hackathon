import { ethers } from 'ethers';
import NFTMarketplaceABI from '../contracts/NFTMarketplace.json';

const TELOS_TESTNET_RPC = 'https://testnet.telos.net/evm';
const NFT_MARKETPLACE_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

let provider: ethers.providers.Web3Provider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;

export const getTelosProvider = () => {
  return new ethers.providers.JsonRpcProvider(TELOS_TESTNET_RPC);
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) throw new Error("Please install MetaMask!");
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x29' }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x29',
            chainName: 'Telos EVM Testnet',
            nativeCurrency: {
              name: 'TLOS',
              symbol: 'TLOS',
              decimals: 18
            },
            rpcUrls: [TELOS_TESTNET_RPC],
            blockExplorerUrls: ['https://testnet.teloscan.io/']
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
      provider = new ethers.providers.JsonRpcProvider(TELOS_TESTNET_RPC);
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
        gasLimit: 500000 // Set a reasonable gas limit
      }
    );
    
    console.log('Transaction Hash:', tx.hash);
    const receipt = await tx.wait(1); // Wait for 1 confirmation
    console.log('Transaction Receipt:', receipt);
    
    return tx;
  } catch (error: any) {
    console.error("Error creating NFT:", error);
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error("Insufficient TLOS for gas fees. Please make sure you have enough TLOS for gas.");
    } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      throw new Error("Network error: Please ensure you're connected to Telos testnet and try again");
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
        gasLimit: 500000
      }
    );
    
    console.log('Buy Transaction Hash:', tx.hash);
    const receipt = await tx.wait(1);
    console.log('Buy Transaction Receipt:', receipt);
    
    return tx;
  } catch (error: any) {
    console.error("Error buying NFT:", error);
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error("Insufficient TLOS. Please make sure you have enough TLOS for the purchase price plus gas fees.");
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