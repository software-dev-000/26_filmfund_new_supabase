import React from 'react';
import { ethers } from 'ethers';
import {
  BrowserProvider,
  FallbackProvider,
  JsonRpcProvider,
  JsonRpcSigner,
} from 'ethers';
import { usePublicClient, useWalletClient } from 'wagmi';

// Define network type structure for ethers providers
interface Network {
  chainId: number;
  name: string;
  ensAddress?: string;
}

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
 * Fetches the BNB balance for a given wallet address
 * @param provider - The ethers provider
 * @param address - The wallet address to check
 * @returns The BNB balance in ethers (as a number)
 */
export const getBnbBalance = async (
  provider: ethers.Provider,
  address: string
): Promise<number> => {
  try {
    const balanceWei = await provider.getBalance(address);
    return parseFloat(ethers.formatEther(balanceWei));
  } catch (error) {
    console.error('Error fetching BNB balance:', error);
    throw new Error(`Failed to fetch BNB balance: ${error}`);
  }
};

/**
 * Transfers BNB from the signer's wallet to the target address
 * @param signer - The ethers signer
 * @param toAddress - The recipient wallet address
 * @param amount - The amount of BNB to transfer in ether
 * @returns The transaction receipt
 */
export const transferBnb = async (
  signer: ethers.Signer,
  toAddress: string,
  amount: number
): Promise<ethers.TransactionReceipt | null> => {
  try {
    // Convert amount from ether to wei
    const amountWei = ethers.parseEther(amount.toString());

    // Create transaction object
    const tx = {
      to: toAddress,
      value: amountWei,
    };

    // Send the transaction
    const transaction = await signer.sendTransaction(tx);

    // Wait for the transaction to be mined
    const receipt = await transaction.wait();
    return receipt;
  } catch (error) {
    console.error('Error transferring BNB:', error);
    throw new Error(`Failed to transfer BNB: ${error}`);
  }
};

/**
 * Check if the user has sufficient BNB balance for a transfer
 * @param provider - The ethers provider
 * @param address - The wallet address to check
 * @param amount - The amount of BNB to check against
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
    const gasBuffer = 0.005; // 0.005 BNB buffer for gas
    return balanceEther >= amount + gasBuffer;
  } catch (error) {
    console.error('Error checking BNB balance:', error);
    throw new Error(`Failed to check BNB balance: ${error}`);
  }
};
