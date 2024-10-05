import { createPublicClient, createWalletClient, custom, PublicClient, WalletClient, Address, Chain } from 'viem';
import { scrollSepolia } from 'viem/chains';

export const DPMA_FACTORY_ADDRESS: Address = '0x9f74010DA23386AF9d3CBa9ee8ca2c37e66906ae';
export const CONTROLLER_ADDRESS: Address = '0x73a5177990cCAde7f98Ec359Cc99e1c5628a88F3';

let publicClientInstance: PublicClient | null = null;
let walletClientInstance: WalletClient | null = null;

const getEthereum = () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    return window.ethereum;
  }
  throw new Error('MetaMask not found. Please install MetaMask.');
};

export const getPublicClient = (): PublicClient => {
  if (!publicClientInstance) {
    publicClientInstance = createPublicClient({
      chain: scrollSepolia as Chain,
      transport: custom(getEthereum())
    });
  }
  return publicClientInstance;
};

export const getWalletClient = async (): Promise<WalletClient> => {
  if (!walletClientInstance) {
    walletClientInstance = createWalletClient({
      chain: scrollSepolia as Chain,
      transport: custom(getEthereum())
    });
  }
  return walletClientInstance;
};

export const getWalletAddress = async (): Promise<Address> => {
  const ethereum = getEthereum();
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
  if (!accounts || accounts.length === 0) throw new Error('No wallet address found');
  return accounts[0] as Address;
};

export const ensureCorrectNetwork = async () => {
  const ethereum = getEthereum();
  const chainId = await ethereum.request({ method: 'eth_chainId' });
  if (chainId !== '0x8274f') { // Scroll Sepolia chainId
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x8274f' }],
      });
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x8274f',
            chainName: 'Scroll Sepolia',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia-rpc.scroll.io/'],
            blockExplorerUrls: ['https://sepolia-explorer.scroll.io/'],
          }],
        });
      } else {
        throw error;
      }
    }
  }
};