import React from 'react';
import { ethers } from 'ethers';
import {
  BrowserProvider,
  FallbackProvider,
  JsonRpcProvider,
  JsonRpcSigner,
} from 'ethers';
import { usePublicClient, useWalletClient } from 'wagmi';
import { getBalance, GetBalanceReturnType } from '@wagmi/core'
import { wagmiConfig } from '../hooks/wagmi';

import ABI from '../types/ABI.json';

const ERC20_ABI = ABI.abi;

// Define network type structure for ethers providers
interface Network {
  chainId: number;
  name: string;
  ensAddress?: string;
}

const network = import.meta.env.VITE_NETWORK || 'mainnet';
const RPC_URL = (network === 'mainnet') ? import.meta.env.VITE_MAINNET_RPC_URL : 'https://sepolia.drpc.org';
const provider = new ethers.JsonRpcProvider(RPC_URL);

/**
 * Converts a wagmi any to an ethers Provider
 */
function publicClientToProvider(
  publicClient: any
): JsonRpcProvider | FallbackProvider {
  const { chain, transport } = publicClient;
  const network: Network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  if (transport.type === 'fallback') {
    const providers = (transport.transports as any[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    );
    if (providers.length === 1) return providers[0];
    return new FallbackProvider(providers);
  }

  return new JsonRpcProvider((transport as any).url, network);
}

/**
 * Converts a wagmi any to an ethers Signer
 */
function walletClientToSigner(walletClient: any): JsonRpcSigner {
  const { account, chain, transport } = walletClient;
  const network: Network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

interface ChainIdParam {
  chainId?: number;
}

/**
 * Hook to convert a viem Public Client to an ethers.js Provider.
 */
export function useEthersProvider({
  chainId,
}: ChainIdParam): JsonRpcProvider | FallbackProvider {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(
    () => publicClientToProvider(publicClient),
    [publicClient]
  );
}

/**
 * Hook to convert a viem Wallet Client to an ethers.js Signer.
 */
export function useEthersSigner({
  chainId,
}: ChainIdParam): JsonRpcSigner | undefined {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}



/**
 * Fetches the token balance for a given wallet address
 * @param provider - The ethers provider
 * @param address - The token contract address
 * @returns The token balance (as a string)
 */
export const getWalletBalance = async (
  walletAddress: string,
  tokenAddress: string
): Promise<string> => {
  try {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const decimals = await getTokenDecimals(tokenAddress);
    const balance = await contract.balanceOf(walletAddress);
    const formattedBalance = ethers.formatUnits(balance, decimals);
    return formattedBalance;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw new Error(`Failed to fetch wallet balance: ${error}`);
  }
};

/**
 * Gets token decimals
 * @param tokenAddress The token contract address
 * @returns Token decimals
 */
export async function getTokenDecimals(tokenAddress: string): Promise<number> {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );
    return await tokenContract.decimals();
  } catch (error) {
    console.error('Failed to get token decimals:', {
      tokenAddress,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

/**
 * Transfers USDT from the signer's wallet to the target address
 * @param signer - The ethers signer
 * @param tokenAddress - The token contract address
 * @param toAddress - The recipient wallet address
 * @param amount - The amount of USDT to transfer
 * @returns The transaction receipt
 */
export const transferToken = async (
  signer: ethers.Signer,
  tokenAddress: string,
  toAddress: string,
  amount: number
): Promise<ethers.TransactionReceipt | null> => {
  try {
    // Convert amount from ether to wei
    // const amountWei = ethers.parseEther(amount.toString());

    // // Create transaction object
    // const tx = {
    //   to: toAddress,
    //   value: amountWei,
    // };

    // // Send the transaction
    // const transaction = await signer.sendTransaction(tx);

    // // Wait for the transaction to be mined
    // const receipt = await transaction.wait();
    // return receipt;
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const decimals = await getTokenDecimals(tokenAddress);
    const amountInWei = ethers.parseUnits(amount.toString(), decimals);
    const tx = await contract.transfer(toAddress, amountInWei);
    const receipt = await tx.wait();
    return receipt;

  } catch (error) {
    console.error('Error transferring USDT:', error);
    throw error;
  }
};

/**
 * Check if the user has sufficient BNB balance for a transfer
 * @param provider - The ethers provider
 * @param address - The wallet address to check
 * @param amount - The amount of ETH to check against
 * @returns Boolean indicating if the balance is sufficient
 */
export const hasSufficientBalance = async (
  provider: ethers.Provider,
  address: string,
  amount: number
): Promise<boolean> => {
  try {
    const balanceWei = await provider.getBalance(address);
    const balanceEther = parseFloat(ethers.formatEther(balanceWei));

    // Leave a small amount for gas
    const gasBuffer = 0.005; // 0.005 ETH buffer for gas
    return balanceEther >= amount + gasBuffer;
  } catch (error) {
    console.error('Error checking ETH balance:', error);
    throw new Error(`Failed to check ETH balance: ${error}`);
  }
};
