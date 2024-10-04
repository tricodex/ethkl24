/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPublicClient, createWalletClient, custom, http, PublicClient, WalletClient } from 'viem';
import { scroll } from 'viem/chains';

export const getPublicClient = (): PublicClient => {
  return createPublicClient({
    chain: scroll,
    transport: http()
  });
};

export const getWalletClient = (): WalletClient => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return createWalletClient({
      chain: scroll,
      transport: custom((window as any).ethereum)
    });
  }
  throw new Error('Ethereum provider not found');
};

export const getWalletAddress = async (): Promise<`0x${string}`> => {
  const client = getWalletClient();
  const [address] = await client.getAddresses();
  if (!address) throw new Error('No wallet address found');
  return address;
};