import { getPublicClient, getWalletClient, getWalletAddress } from './viemClient';
import { parseEther, Address, Hash } from 'viem';

const DPMA_FACTORY_ADDRESS = '0x...' as const;
const CONTROLLER_ADDRESS = '0x...' as const; 

const DPMA_FACTORY_ABI = [
  {
    inputs: [
      { name: 'initBalance', type: 'uint256' },
      { name: '_owner', type: 'address' },
      { name: '_name', type: 'string' }
    ],
    name: 'deployProperty',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
] as const;

const PROPERTY_ABI = [
  {
    inputs: [{ name: '_currMonth', type: 'uint8' }],
    name: 'payFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
] as const;

export const deployProperty = async (initBalance: string, name: string): Promise<Address> => {
  const publicClient = getPublicClient();
  const walletClient = await getWalletClient();
  const address = await getWalletAddress();

  const { request } = await publicClient.simulateContract({
    address: DPMA_FACTORY_ADDRESS,
    abi: DPMA_FACTORY_ABI,
    functionName: 'deployProperty',
    args: [parseEther(initBalance), address, name],
    account: address,
  });

  const hash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  // Assuming the deployed property address is emitted in the first log
  const propertyAddress = receipt.logs[0].address as Address;
  return propertyAddress;
};

export const payPropertyFee = async (propertyAddress: Address, month: number): Promise<Hash> => {
  const publicClient = getPublicClient();
  const walletClient = await getWalletClient();
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

