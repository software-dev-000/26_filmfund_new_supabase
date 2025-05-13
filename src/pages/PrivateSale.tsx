import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  DollarSign, 
  Clock, 
  Shield,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  LogOut,
  Users,
} from 'lucide-react';
import { web3modal } from '../App';
import { useAccount, useDisconnect } from 'wagmi';
import { useToast } from '../contexts/ToastContext';
import { useEthersProvider, useEthersSigner, hasSufficientBalance, transferBnb, getBnbBalance } from '../services/web3Service';
import TokenPack from '../components/private-sale/TokenPack';
import { privateSaleService, displayNumberWithUnits } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';


const PrivateSale: React.FC = () => {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [globalSaleInfo, setGlobalSaleInfo] = useState<any>({
    tokenPrice: 0.5,
    minPurchase: 1000,
    maxPurchase: 100000,
    totalAllocation: 70000000,
    totalPurchasedTokens: 0,
    totalPurchasedQuote: 0,
    totalBuyers: 0,
    endDate: 'May 31, 2025'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedWalletBalance, setConnectedWalletBalance] = useState<number | null>(0);
  const { currentUser } = useAuth();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const provider = useEthersProvider({});
  const signer = useEthersSigner({});
  const toast = useToast();
  const depositWalletAddress = import.meta.env.VITE_DEPOSIT_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000';
  const saleInfo = {
    tokenPrice: 0.5,
    minPurchase: 1000,
    maxPurchase: 100000,
    totalAllocation: '70,000,000',
    remainingAllocation: '70,000,000',
    endDate: 'May 31, 2025'
  };

  const fetchGlobalSaleInfo = async () => {
    setIsLoading(true);
    try {
      const globalSaleInfo = await privateSaleService.getPrivateSaleGlobalStatus();
      console.log(`Fetching Global Sale Info: ${JSON.stringify(globalSaleInfo, null, 2)}`);
      setGlobalSaleInfo((prev: any) => ({
        ...prev,
        ...globalSaleInfo
      }));
    } catch (error) {
      console.error('Error fetching global sale info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalSaleInfo();
  }, []);

  const handlePurchase = async (tokenAmount: number) => {
    // e.preventDefault();
    // // Implement purchase logic here
    // alert('Purchase functionality will be implemented with smart contracts');
    if (!signer || !provider) {
      toast.success('Wallet not connected', 'Please connect your wallet to continue.');
      return;
    }

    if (!tokenAmount || tokenAmount <= 0) {
      toast.error('Invalid amount', 'Please enter a valid amount to deposit.');
      return;
    }

    setIsLoading(true);

    try {
      const signerAddress = await signer.getAddress();

      console.log(`Purchasing ${tokenAmount} FFA tokens from ${signerAddress}`);

      if (!currentUser) {
        toast.error('User not found', 'Please login to continue.');
        setIsLoading(false);
        return;
      }

      const purchaseInfo = await privateSaleService.createPrivateSale({
        user_id: currentUser?.id,
        wallet_address: signerAddress,
        token_amount: tokenAmount,
        quote_amount: tokenAmount * globalSaleInfo.tokenPrice,
        transaction_hash: '0xAXFSWE',
      });

      if(purchaseInfo) {
        toast.success('Purchase successful', 'You have successfully purchased FFA tokens.');
        setIsLoading(false);
        await fetchGlobalSaleInfo();
        return;
      }

      // // Check if signer has sufficient balance
      // const sufficient = await hasSufficientBalance(
      //   provider,
      //   signerAddress,
      //   amount
      // );

      // if (!sufficient) {
      //   toast.error('Insufficient balance', "You don't have enough BNB to complete this transaction.");
      //   setIsLoading(false);
      //   return;
      // }

      // // Execute transfer
      // const receipt = await transferBnb(signer, depositWalletAddress, amount);

      // if (receipt) {
      //   toast.success('Transfer successful', `Successfully transferred ${amount} BNB to the deposit wallet.`);

      //   // Refresh balances after successful transfer
      //   await refreshBalances();

      //   // Clear input
      //   setPurchaseAmount('');
       
      // }
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast.error('Token purchase failed', error.message || 'Failed to purchase tokens. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // You can add a toast notification here if you have one
      toast.success('Address copied to clipboard');
    }
  };

   // Refresh balances
  const refreshBalances = async () => {
    if (!signer || !provider) {
      toast.error('Wallet not connected', 'Please connect your wallet to continue.');
      return;
    }

    setIsRefreshing(true);

    try {
      // Get signer address
      const address = await signer.getAddress();

      // Get connected wallet balance
      const connectedBalance = await getBnbBalance(provider, address);
      setConnectedWalletBalance(connectedBalance);

    } catch (error) {
      console.error('Error refreshing balances:', error);
      toast.error('Failed to refresh balances', 'Could not retrieve wallet balances. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };


  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950"></div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              FFA Token Private Sale
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Be among the first to acquire FFA tokens and gain early access to film investment opportunities.
            </p>
           
           {isConnected ? (
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={() => disconnect()}
                  disabled={isRefreshing}
                  className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
                >
                  <LogOut size={20} className="mr-2" />
                  Disconnect Wallet
                </button>

                <div className="flex items-center gap-4 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-4 bg-navy-800 px-4 py-2 rounded-lg">
                    <span className="text-gray-300 text-md">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <button 
                      onClick={handleCopyAddress}
                      className="text-gold-500 hover:text-gold-400 transition-colors"
                    >
                      <Copy size={20} />
                    </button>
                    <a 
                      href={`https://bscscan.com/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-400 transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                  
                  <div className="text-gray-300 bg-navy-800 px-4 py-2 rounded-lg">
                    Balance: {connectedWalletBalance}
                  </div>
                </div>

                
              </div>
            ) : (
              <button 
                onClick={() => web3modal.open()}
                disabled={isRefreshing}
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center mx-auto"
              >
                <Wallet size={20} className="mr-2" />
                Connect Wallet
              </button>
            )}
            {error && (
              <div className="mt-4 text-red-400 flex items-center justify-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}
             
          </motion.div>
        </div>
      </section>

      

      {/* Sale Info */}
      <section className="py-12 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Token Price</h3>
              <p className="text-2xl font-bold text-white">${globalSaleInfo.tokenPrice}</p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Total Allocation</h3>
              <p className="text-2xl font-bold text-white">{displayNumberWithUnits(globalSaleInfo.totalAllocation)}</p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Total Purchased Tokens</h3>
              {isLoading ? (
                <div className="h-8 w-full bg-navy-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-white">{displayNumberWithUnits(globalSaleInfo.totalPurchasedTokens)}</p>
              )}
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Total Buyers</h3>
              {isLoading ? (
                <div className="h-8 w-full bg-navy-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-white">{displayNumberWithUnits(globalSaleInfo.totalBuyers)}</p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Purchase Form */}
      {isConnected && (
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-xl mx-auto">
              <motion.div
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Purchase FFA Tokens</h2>
                  <p className="text-gray-400 text-sm">Connected: {address}</p>
                </div>

                <div className="mb-6">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">
                    Amount to Purchase
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="amount"
                      value={purchaseAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*$/.test(value)) {
                          setPurchaseAmount(value);
                        }
                      }}
                      className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Enter amount"
                      min={saleInfo.minPurchase}
                      max={saleInfo.maxPurchase}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      FFA
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Min: {saleInfo.minPurchase} FFA | Max: {saleInfo.maxPurchase} FFA
                  </p>
                </div>

                <div className="mb-6 p-4 bg-navy-700 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Price per Token</span>
                    <span className="text-white">${saleInfo.tokenPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Total Cost</span>
                    <span className="text-white">
                      ${(Number(purchaseAmount) * saleInfo.tokenPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 py-3 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    if(Number(purchaseAmount) < 1000 || Number(purchaseAmount) > 100000) {
                      toast.warning('Invalid amount', 'Minimum purchase is 1000 FFA and maximum is 100000 FFA');
                      return;
                    }
                    handlePurchase(Number(purchaseAmount))
                  }}
                >
                  Purchase Tokens
                </button>
              </motion.div>
            </div>
          </div>

          {/* Token Packs Section  */}
        
          <div className="container mx-auto my-12 px-4 md:px-6">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Choose a Token Pack</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <TokenPack amount={1000} price={saleInfo.tokenPrice} onSelect={() => handlePurchase(1000)} />
              <TokenPack amount={5000} price={saleInfo.tokenPrice} onSelect={() => handlePurchase(5000)} />
              <TokenPack amount={25000} price={saleInfo.tokenPrice} onSelect={() => handlePurchase(25000)} />
              <TokenPack amount={100000} price={saleInfo.tokenPrice} onSelect={() => handlePurchase(100000)} />
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-16 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2 
            className="text-3xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Private Sale Benefits
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Best Price</h3>
              <p className="text-gray-400">
                Access FFA tokens at the lowest possible price before public listing.
              </p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Early Access</h3>
              <p className="text-gray-400">
                Get priority access to film investment opportunities and platform features.
              </p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bonus Rewards</h3>
              <p className="text-gray-400">
                Receive additional staking rewards and exclusive NFT airdrops.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivateSale;



