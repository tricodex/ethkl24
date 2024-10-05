import { createPublicClient, createWalletClient, custom, http, PublicClient, WalletClient } from 'viem';
import { scroll } from 'viem/chains';

let publicClientInstance: PublicClient | null = null;
let walletClientInstance: WalletClient | null = null;

export const getPublicClient = (): PublicClient => {
  if (!publicClientInstance) {
    publicClientInstance = createPublicClient({
      chain: scroll,
      transport: http()
    });
  }
  return publicClientInstance;
};

export const getWalletClient = async (): Promise<WalletClient> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not found. Please install MetaMask.');
  }

  if (!walletClientInstance) {
    walletClientInstance = createWalletClient({
      chain: scroll,
      transport: custom(window.ethereum)
    });
  }

  return walletClientInstance;
};

export const getWalletAddress = async (): Promise<`0x${string}`> => {
  const client = await getWalletClient();
  const [address] = await client.getAddresses();
  if (!address) throw new Error('No wallet address found');
  return address;
};