import { getPublicClient, getWalletClient, getWalletAddress } from './viemClient';
import { parseEther, Address } from 'viem';

const DPMA_FACTORY_ADDRESS = '0x...' as const; 
const DPMA_FACTORY_ABI = [
  // Add the ABI for the DPMAFactory contract here
] as const;

const PROPERTY_ABI = [
  // Add the ABI for the Property contract here
] as const;

export const deployProperty = async (initBalance: string, name: string, householdName: string): Promise<`0x${string}`> => {
  const publicClient = getPublicClient();
  const walletClient = getWalletClient();
  const address = await getWalletAddress();

  const { request } = await publicClient.simulateContract({
    address: DPMA_FACTORY_ADDRESS,
    abi: DPMA_FACTORY_ABI,
    functionName: 'deployProperty',
    args: [parseEther(initBalance), address, name],
    account: address,
  });

  const hash = await walletClient.writeContract(request);
  return hash;
};

export const payPropertyFee = async (propertyAddress: Address, month: number): Promise<`0x${string}`> => {
  const publicClient = getPublicClient();
  const walletClient = getWalletClient();
  const address = await getWalletAddress();

  const { request } = await publicClient.simulateContract({
    address: propertyAddress,
    abi: PROPERTY_ABI,
    functionName: 'payFee',
    args: [month],
    account: address,
  });

  const hash = await walletClient.writeContract(request);
  return hash;
};

export const addPropertyMembers = async (
  propertyAddress: Address,
  members: Address[],
  month: number,
  feeAmount: string
): Promise<`0x${string}`> => {
  const publicClient = getPublicClient();
  const walletClient = getWalletClient();
  const address = await getWalletAddress();

  const { request } = await publicClient.simulateContract({
    address: propertyAddress,
    abi: PROPERTY_ABI,
    functionName: 'addMembers',
    args: [members, month, parseEther(feeAmount)],
    account: address,
  });

  const hash = await walletClient.writeContract(request);
  return hash;
};

