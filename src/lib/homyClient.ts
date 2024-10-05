import { createPublicClient, http, createWalletClient, custom, PublicClient, WalletClient, Chain, Address, Hash, parseAbi } from 'viem';

// Define the custom chain
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
    public: {
      http: ['https://pacific-rpc.sepolia-testnet.manta.network/http'],
      webSocket: ['wss://pacific-rpc.sepolia-testnet.manta.network/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Manta Pacific Explorer', url: 'https://pacific-explorer.sepolia-testnet.manta.network' },
  },
  testnet: true,
};

const PROMPT_NESTED_INFERENCE_ADDRESS: Address = '0x93012953008ef9AbcB71F48C340166E8f384e985';

const ABI = parseAbi([
  'function calculateAIResult(uint256 model1Id, uint256 model2Id, string calldata model1Prompt) payable returns (uint256)',
  'function requests(uint256) view returns (address sender, uint256 modelId, bytes input, bytes output)'
]);

let publicClientInstance: PublicClient | null = null;
let walletClientInstance: WalletClient | null = null;

export const getPublicClient = (): PublicClient => {
  if (!publicClientInstance) {
    publicClientInstance = createPublicClient({
      chain: mantaPacificSepolia,
      transport: http()
    });
  }
  return publicClientInstance;
};

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

export async function callHomy(model1Id: number, model2Id: number, prompt: string): Promise<Hash> {
  try {
    const walletClient = await getWalletClient();
    const publicClient = getPublicClient();
    const [address] = await walletClient.getAddresses();

    const { request } = await publicClient.simulateContract({
      address: PROMPT_NESTED_INFERENCE_ADDRESS,
      abi: ABI,
      functionName: 'calculateAIResult',
      args: [BigInt(model1Id), BigInt(model2Id), prompt],
      account: address,
    });

    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    console.error('Error calling Homy:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to execute Homy request: ${error.message}`);
    }
    throw error;  }
}

export async function getHoMyResponse(requestId: bigint): Promise<string> {
  try {
    const publicClient = getPublicClient();
    const data = await publicClient.readContract({
      address: PROMPT_NESTED_INFERENCE_ADDRESS,
      abi: ABI,
      functionName: 'requests',
      args: [requestId],
    });

    const output = data[3];
    if (typeof output === 'string' && output.startsWith('0x')) {
      const byteArray = new Uint8Array(output.slice(2).match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      return new TextDecoder().decode(byteArray);
    }
    return '';
  } catch (error) {
    console.error('Error fetching HoMy response:', error);
    throw new Error('Failed to fetch AI response. Please try again.');
  }
}