/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/homyClient.ts

import { createPublicClient, http, createWalletClient, custom, PublicClient, WalletClient, Chain, Address, Hash, decodeAbiParameters } from 'viem';
import promptNestedInferenceABIJson from '@/lib/abis/PromptNestedInference.json';

// ABI for the smart contract
const promptNestedInferenceABI = promptNestedInferenceABIJson.abi;

// Define the Manta Pacific Sepolia chain configuration
export const mantaPacificSepolia: Chain = {
  id: 3441006,
  name: 'Manta Pacific Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia ETH',
    symbol: 'SEP',
  },
  rpcUrls: {
    default: {
      http: ['https://pacific-rpc.sepolia-testnet.manta.network/http'],
      webSocket: ['wss://pacific-rpc.sepolia-testnet.manta.network/ws'],
    },
    fallback: {
      http: ['https://another-rpc-url-for-sepolia-testnet.com'],
      webSocket: ['wss://another-rpc-url-for-sepolia-testnet.com/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Manta Pacific Explorer', url: 'https://pacific-explorer.sepolia-testnet.manta.network' },
    etherscan: { name: 'Etherscan Sepolia', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
};

// Address for the deployed Prompt Nested Inference contract
const PROMPT_NESTED_INFERENCE_ADDRESS: Address = '0x93012953008ef9AbcB71F48C340166E8f384e985';

// Public and wallet client instances for reuse
let publicClientInstance: PublicClient | null = null;
let walletClientInstance: WalletClient | null = null;

// Function to create/retrieve the public client instance
export const getPublicClient = (): PublicClient => {
  if (!publicClientInstance) {
    publicClientInstance = createPublicClient({
      chain: mantaPacificSepolia,
      transport: http(),
    });
  }
  return publicClientInstance;
};

// Function to create/retrieve the wallet client instance
export const getWalletClient = async (): Promise<WalletClient> => {
  if (typeof window === 'undefined') {
    throw new Error('Window is undefined. Cannot access Ethereum provider.');
  }

  if (!window.ethereum) {
    throw new Error('MetaMask not found. Please install MetaMask.');
  }

  if (!walletClientInstance) {
    walletClientInstance = createWalletClient({
      chain: mantaPacificSepolia,
      transport: custom(window.ethereum)
    });
  }

  return walletClientInstance;
};

// Function to call the contract and send a transaction for AI inference
export async function callHomy(model1Id: number, model2Id: number, prompt: string): Promise<Hash> {
  try {
    console.log("Retrieving Wallet Client...");
    const walletClient = await getWalletClient();
    const publicClient = getPublicClient();
    const [address] = await walletClient.getAddresses();

    console.log("Wallet Address:", address);
    console.log(`Calling simulateContract for model1Id: ${model1Id}, model2Id: ${model2Id}, prompt: "${prompt}"`);

    // Convert Ether value to Wei
    const valueInEther = '0.011'; // estimate
    const valueInWei = BigInt(parseFloat(valueInEther) * 1e18);

    // Simulate contract call
    const { request } = await publicClient.simulateContract({
      address: PROMPT_NESTED_INFERENCE_ADDRESS,
      abi: promptNestedInferenceABI,
      functionName: 'calculateAIResult',
      args: [BigInt(model1Id), BigInt(model2Id), prompt],
      account: address,
      value: valueInWei
    });

    console.log("Contract request details:", request);

    // Send transaction
    const hash = await walletClient.writeContract({
      ...request,
      value: valueInWei
    });

    console.log("Transaction sent. Waiting for confirmation...");
    await publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction confirmed. Hash:", hash);

    return hash;
  } catch (error) {
    console.error('Error during callHomy:', error);
    throw new Error(`Failed to execute Homy request: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to fetch AI response for a given request ID from the contract
export async function getHomyResponse(requestId: bigint): Promise<string> {
  try {
    const publicClient = getPublicClient();

    console.log(`Fetching AI response for requestId: ${requestId}`);

    // Read the contract to get the AI response
    const request = await publicClient.readContract({
      address: PROMPT_NESTED_INFERENCE_ADDRESS,
      abi: promptNestedInferenceABI,
      functionName: 'requests',
      args: [requestId],
    }) as [string, bigint, `0x${string}`, `0x${string}`];

    console.log("Contract response:", request);

    const [sender, modelId, input, output] = request;

    // Check if output is available
    if (!output || output === '0x') {
      throw new Error('AI response not yet available');
    }

    // Decode the output from bytes to string
    const decodedOutput = decodeAbiParameters(
      [{ type: 'string' }],
      output
    )[0];

    console.log("Decoded AI response:", decodedOutput);
    return decodedOutput;
  } catch (error) {
    console.error('Error fetching HoMy response:', error);
    throw error;
  }
}

// Function to poll the contract until the AI response is available or the max attempts are reached
export async function pollForAIResponse(requestId: bigint, maxAttempts: number = 20, interval: number = 15000): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await getHomyResponse(requestId);
      return response;
    } catch (error) {
      if (error instanceof Error && error.message === 'AI response not yet available') {
        console.log(`AI response not ready, retrying in ${interval / 1000} seconds... (Attempt ${attempt + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, interval));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Failed to fetch AI response after maximum attempts');
}
