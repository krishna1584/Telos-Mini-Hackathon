# TelosNFT Marketplace 🎨

A modern, fast, and eco-friendly NFT marketplace built on the Telos blockchain. Experience seamless NFT trading with minimal gas fees and lightning-fast transactions.

## ✨ Features

- 🎨 **Create & Mint NFTs** - Turn your digital art into unique tokens
- 🛒 **Buy & Sell** - Trade NFTs with instant transactions
- 💼 **Portfolio Management** - Track your NFT collection
- ⚡ **Lightning Fast** - Built on Telos for sub-second finality
- 🌱 **Eco-Friendly** - Carbon-neutral blockchain technology
- 💰 **Low Fees** - Minimal gas costs for all transactions
- 🔒 **Secure** - Smart contract audited and battle-tested

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling framework
- **Lucide React** - Beautiful SVG icons

### Blockchain
- **Solidity ^0.8.0** - Smart contract development
- **OpenZeppelin** - Security-first contract libraries
- **Telos Blockchain** - Fast, eco-friendly EVM network
- **Ethers.js v5** - Ethereum library for wallet integration

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Smart Contract Features
- **ERC721** - NFT standard implementation
- **ReentrancyGuard** - Security against reentrancy attacks
- **Access Control** - Owner-based permissions
- **Event Emission** - Transparent transaction logging

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MetaMask or compatible Web3 wallet
- Network tokens for gas fees (obtain from your chosen network's faucet)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishna1584/Telos-Mini-Hackathon
   cd Telos-Mini-Hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the application** (See [Configuration](#-configuration) section below)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## ⚙️ Configuration

To run this project on your system, you'll need to update the following configuration files:

### 1. Smart Contract Configuration

**File**: `src/utils/web3.ts`

Update these constants with your deployed contract details:

```typescript
// Replace with your deployed contract address
const NFT_MARKETPLACE_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

// Update with your network's RPC URL
const NETWORK_RPC_URL = 'YOUR_NETWORK_RPC_URL';
```

### 2. Contract ABI

**File**: `src/contracts/NFTMarketplace.json`

Replace the entire file content with your deployed contract's ABI:

```json
{
  "abi": [
    // Your contract ABI array goes here
    // Get this from your contract compilation output
  ]
}
```

### 3. Network Configuration (Optional)

If deploying to a different network, update the network details in `src/utils/web3.ts`:

```typescript
// Update chain configuration in connectWallet function
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x29', // Your network chain ID in hex
    chainName: 'Your Network Name',
    nativeCurrency: {
      name: 'TOKEN_NAME',
      symbol: 'TOKEN_SYMBOL',
      decimals: 18
    },
    rpcUrls: ['YOUR_RPC_URL'],
    blockExplorerUrls: ['YOUR_EXPLORER_URL']
  }]
});
```

### 4. Environment Variables (Recommended)

Create a `.env` file in the root directory:

```env
VITE_CONTRACT_ADDRESS=your_contract_address_here
VITE_RPC_URL=your_network_rpc_url
VITE_CHAIN_ID=your_network_chain_id
```

Then update `src/utils/web3.ts` to use environment variables:

```typescript
const NETWORK_RPC_URL = import.meta.env.VITE_RPC_URL || 'YOUR_DEFAULT_RPC_URL';
const NFT_MARKETPLACE_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'YOUR_DEFAULT_ADDRESS';
```

### 5. Deploy Your Smart Contract

Before running the frontend, you'll need to deploy the smart contract:

1. **Set up your deployment environment**
2. **Deploy the NFTMarketplace.sol contract** to your preferred network
3. **Copy the deployed address and ABI** to the configuration files above

### 6. Get Network Tokens

- Obtain the native tokens for your chosen network
- You'll need tokens for gas fees and testing purchases

### Network Configuration

The dApp is configured for **Telos EVM Network**:
- **Chain ID**: Configure in your web3.ts file
- **RPC URL**: Set your preferred RPC endpoint
- **Currency**: TLOS
- **Explorer**: Configure your block explorer URL

## 📱 Usage

### 1. Connect Wallet
- Click "Connect Wallet" in the header
- Approve MetaMask connection
- Switch to your configured network (automatic prompt if needed)

### 2. Create NFT
- Click "Create NFT" button
- Fill in NFT details:
  - Name
  - Price (in network tokens)
  - Image URL
  - Category
- Confirm transaction in wallet

### 3. Buy NFT
- Browse the marketplace
- Click "Buy Now" on desired NFT
- Confirm purchase transaction

### 4. View Collection
- Switch to "My NFTs" tab
- View your owned NFTs
- Track your portfolio value

## 🏗️ Project Structure

```
├── contracts/                 # Smart contracts
│   ├── NFTMarketplace.sol     # Main marketplace contract
│   └── NFTMarketplace.json    # Contract ABI
├── src/
│   ├── components/            # React components
│   ├── utils/
│   │   └── web3.ts           # Blockchain interaction logic
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── tsconfig.json            # TypeScript configuration
```

## 🔧 Smart Contract

### NFTMarketplace.sol Features

- **Market Item Creation** - List NFTs for sale
- **Purchase Mechanism** - Secure buying process
- **Ownership Transfer** - Automatic token transfers
- **Fee Structure** - Configurable listing fees
- **Event Logging** - Comprehensive transaction history

### Key Functions

```solidity
function createMarketItem(...) public payable nonReentrant
function createMarketSale(...) public payable nonReentrant
function fetchMarketItems() public view returns (MarketItem[])
function fetchMyNFTs() public view returns (MarketItem[])
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Built with ❤️ for the Telos ecosystem
