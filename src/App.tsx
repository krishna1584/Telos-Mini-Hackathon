import React, { useState, useEffect } from 'react';
import { Wallet, PlusIcon, ShoppingCartIcon, X, Loader2, Hexagon, Sparkles, Coins } from 'lucide-react';
import { connectWallet, createNFT, buyNFT, fetchMarketItems, fetchMyNFTs, getBalance } from './utils/web3';
import { config, DEMO_CREATOR_ADDRESS } from './utils/config';
import { ethers } from 'ethers';

type NFT = {
  id: number;
  name: string;
  price: number;
  creator: string;
  image: string;
  category: string;
  sold: boolean;
};
const INITIAL_NFTS: NFT[] = [
  {
    id: 1,
    name: "Pixel Baddie",
    price: 25,
    creator: DEMO_CREATOR_ADDRESS,
    image: "https://i.seadn.io/gae/uGcdM7SZW1b-bvvSZDH01XoBQ3wFfGeh4iAy5m7OHeoUuQdiOvSKZxDGuFADMiNglqFTzv-BxUH94ckXqx9C7bhAC7yXMBKLD-4VAw?auto=format&dpr=1&w=1000",
    category: "Digital Art",
    sold: false
  },
  {
    id: 2,
    name: "बन्दर",
    price: 18,
    creator: DEMO_CREATOR_ADDRESS,
    image: "https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg",
    category: "Digital Art",
    sold: false
  },
  {
    id: 3,
    name: "Yakuza Chimpo",
    price: 32,
    creator: DEMO_CREATOR_ADDRESS,
    image: "https://img.freepik.com/premium-photo/gorilla-with-suit-tie-that-says-gorilla-it_919652-503.jpg",
    category: "Photography",
    sold: false
  },
  {
    id: 4,
    name: "Mancryption",
    price: 45,
    creator: DEMO_CREATOR_ADDRESS,
    image: "https://img.freepik.com/free-photo/cyberpunk-bitcoin-illustration_23-2151611169.jpg",
    category: "Digital Art",
    sold: false
  },
  {
    id: 5,
    name: "Asur",
    price: 28,
    creator: DEMO_CREATOR_ADDRESS,
    image: "https://i.seadn.io/gae/hNUs-d6IGNNY9MVXy-yr7lf5EI155TxOICA47T636Me8o9Rk3Q15N9b3Yu7bD7Wz1ctOqlMy9PvNLJcgqQUJ78XZ?auto=format&dpr=1&w=1000",
    category: "Art",
    sold: false
  },
  {
    id: 6,
    name: "Crazy Meow",
    price: 55,
    creator: DEMO_CREATOR_ADDRESS,
    image: "https://preview.redd.it/a-cat-skydiving-v0-0qabokc3czib1.jpg?width=1024&format=pjpg&auto=webp&s=00f1506e03e40489a707aeea076a4564afa27968",
    category: "Digital Art",
    sold: false
  },
  {
    id: 7,
    name: "Angry Zebra",
    price: 40,
    creator: DEMO_CREATOR_ADDRESS,
    image: "https://www.shutterstock.com/image-photo/anime-artistic-image-frightened-angry-600nw-2543601241.jpg",
    category: "Art",
    sold: false
  },
  {
    id: 8,
    name: "Digital Genesis",
    price: 35,
    creator: DEMO_CREATOR_ADDRESS,
    image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&auto=format&fit=crop",
    category: "Digital Art",
    sold: false
  }
];

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState<number | null>(null);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [newNFT, setNewNFT] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Digital Art'
  });
  const [NFTs, setNFTs] = useState<NFT[]>(INITIAL_NFTS);
  const [myNFTs, setMyNFTs] = useState<NFT[]>([]);
  const [activeTab, setActiveTab] = useState('market');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNFTs();
  }, [account]);

  useEffect(() => {
    const updateBalance = async () => {
      if (account) {
        try {
          const bal = await getBalance(account);
          setBalance(parseFloat(bal).toFixed(4));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };
    updateBalance();
  }, [account]);

  const loadNFTs = async () => {
    try {
      setLoading(true);
      if (account) {
        const marketItems = await fetchMarketItems();
        const formattedItems = marketItems.map((item: any) => ({
          id: item.itemId.toNumber(),
          name: item.name,
          price: parseFloat(ethers.utils.formatEther(item.price)),
          creator: item.seller,
          image: item.image,
          category: item.category,
          sold: item.sold
        }));
        setNFTs([...INITIAL_NFTS, ...formattedItems]);

        const myItems = await fetchMyNFTs();
        const formattedMyItems = myItems.map((item: any) => ({
          id: item.itemId.toNumber(),
          name: item.name,
          price: parseFloat(ethers.utils.formatEther(item.price)),
          creator: item.seller,
          image: item.image,
          category: item.category,
          sold: item.sold
        }));
        setMyNFTs(formattedMyItems);
      }
    } catch (error) {
      console.error("Error loading NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setAccount(address);
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      alert(error.message || "Failed to connect wallet. Please try again.");
    }
  };

  const handleCreateNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!account) {
      setError("Please connect your wallet first!");
      return;
    }

    try {
      setLoading(true);
      await createNFT(
        newNFT.name,
        newNFT.price,
        newNFT.category,
        newNFT.image
      );
      
      setNewNFT({ name: '', price: '', image: '', category: 'Digital Art' });
      setIsModalOpen(false);
      await loadNFTs();
    } catch (error: any) {
      console.error("Error creating NFT:", error);
      setError(error.message || "Failed to create NFT. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNFT = async (nft: NFT) => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setBuyLoading(nft.id);
      await buyNFT(nft.id, nft.price.toString());
      await loadNFTs();
    } catch (error: any) {
      console.error("Error buying NFT:", error);
      alert(error.message || "Failed to buy NFT. Please try again.");
    } finally {
      setBuyLoading(null);
    }
  };

  if (!showMarketplace) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=3000')] bg-cover bg-center opacity-10"></div>
        
        <header className="relative p-4 border-b border-blue-800/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Hexagon className="w-8 h-8 text-blue-400 animate-pulse" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                {config.appName}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {account && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/50 rounded-lg">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-blue-200">{balance} {config.nativeCurrencySymbol}</span>
                </div>
              )}
              <button
                onClick={handleConnectWallet}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <Wallet className="w-5 h-5" />
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </header>

        <main className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <div className="relative inline-block">
              <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 animate-gradient">
                Welcome to {config.appName}
              </h1>
              <Sparkles className="absolute -top-8 -right-8 w-12 h-12 text-blue-400 animate-bounce" />
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {config.appDescription} on the {config.networkName} blockchain. 
              Our platform offers fast transactions, low fees, and a sustainable approach to NFT trading.
            </p>
            <div className="flex flex-col gap-8 mt-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-blue-900/30 p-8 rounded-xl backdrop-blur-sm border border-blue-500/20 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                  <h3 className="text-2xl font-bold mb-4 text-blue-300 group-hover:text-blue-400 transition-colors">Low Gas Fees</h3>
                  <p className="text-blue-200 group-hover:text-blue-100 transition-colors">Experience minimal transaction costs on the {config.networkName} network</p>
                </div>
                <div className="group bg-blue-900/30 p-8 rounded-xl backdrop-blur-sm border border-blue-500/20 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                  <h3 className="text-2xl font-bold mb-4 text-blue-300 group-hover:text-blue-400 transition-colors">Fast Transactions</h3>
                  <p className="text-blue-200 group-hover:text-blue-100 transition-colors">Lightning-fast confirmations for seamless trading</p>
                </div>
                <div className="group bg-blue-900/30 p-8 rounded-xl backdrop-blur-sm border border-blue-500/20 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                  <h3 className="text-2xl font-bold mb-4 text-blue-300 group-hover:text-blue-400 transition-colors">Eco-Friendly</h3>
                  <p className="text-blue-200 group-hover:text-blue-100 transition-colors">Sustainable blockchain technology with minimal environmental impact</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowMarketplace(true)}
              className="mt-16 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-lg font-bold transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 group relative overflow-hidden"
            >
              <span className="relative z-10">Enter Marketplace</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] text-white">
      <header className="p-4 border-b border-blue-800/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Hexagon className="w-8 h-8 text-blue-400 animate-pulse" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              {config.appName}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {account && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/50 rounded-lg">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-blue-200">{balance} {config.nativeCurrencySymbol}</span>
              </div>
            )}
            <button
              onClick={handleConnectWallet}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
            >
              <Wallet className="w-5 h-5" />
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <section className="mb-12">
          <div className="bg-blue-900/30 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/20">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Discover, Collect, and Sell NFTs on {config.networkName}
            </h2>
            <p className="text-blue-200 mb-6 max-w-2xl">
              Experience fast and eco-friendly NFT trading on the {config.networkName} blockchain
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              Create NFT
            </button>
          </div>
        </section>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'market'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-900/30 text-blue-200 hover:bg-blue-800/50'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('my-nfts')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'my-nfts'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-900/30 text-blue-200 hover:bg-blue-800/50'
            }`}
          >
            My NFTs
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            (activeTab === 'market' ? NFTs : myNFTs).map((nft) => (
              <div 
                key={nft.id} 
                className="group relative bg-blue-900/30 rounded-xl overflow-hidden backdrop-blur-sm border border-blue-500/20 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
              >
                <div className="relative aspect-square">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold">{nft.name}</p>
                      <p className="text-blue-200 text-sm">{nft.category}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-blue-300">
                      Creator
                      <div className="text-blue-100">{`${nft.creator.slice(0, 6)}...${nft.creator.slice(-4)}`}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-300">Price</div>
                      <div className="text-lg font-bold text-blue-400">{nft.price} {config.nativeCurrencySymbol}</div>
                    </div>
                  </div>
                  {activeTab === 'market' && !nft.sold && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyNFT(nft);
                      }}
                      disabled={buyLoading === nft.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      {buyLoading === nft.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <ShoppingCartIcon className="w-5 h-5" />
                          Buy Now
                        </>
                      )}
                    </button>
                  )}
                  {nft.sold && (
                    <div className="text-center py-2 text-blue-300 font-medium">
                      Sold
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-blue-900/80 rounded-xl p-6 w-full max-w-md relative border border-blue-500/30 transform transition-all duration-300 animate-modal-enter">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-blue-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-white">Create New NFT</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleCreateNFT} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                  NFT Name
                </label>
                <input
                  type="text"
                  required
                  value={newNFT.name}
                  onChange={(e) => setNewNFT({ ...newNFT, name: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-950/50 rounded-lg border border-blue-500/30 focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-300/50"
                  placeholder="Enter NFT name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                  Price ({config.nativeCurrencySymbol})
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={newNFT.price}
                  onChange={(e) => setNewNFT({ ...newNFT, price: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-950/50 rounded-lg border border-blue-500/30 focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-300/50"
                  placeholder={`Enter price in ${config.nativeCurrencySymbol}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={newNFT.image}
                  onChange={(e) => setNewNFT({ ...newNFT, image: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-950/50 rounded-lg border border-blue-500/30 focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-300/50"
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                  Category
                </label>
                <select
                  value={newNFT.category}
                  onChange={(e) => setNewNFT({ ...newNFT, category: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-950/50 rounded-lg border border-blue-500/30 focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option>Digital Art</option>
                  <option>Art</option>
                  <option>Photography</option>
                  <option>Music</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Create NFT'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
