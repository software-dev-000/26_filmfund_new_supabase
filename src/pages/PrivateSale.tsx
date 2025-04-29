import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  DollarSign, 
  Clock, 
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PrivateSale: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const saleInfo = {
    tokenPrice: 0.50,
    minPurchase: 1000,
    maxPurchase: 100000,
    totalAllocation: '10,000,000',
    remainingAllocation: '7,250,000',
    endDate: 'March 31, 2025'
  };

  useEffect(() => {
    // Check if already connected
    if (window.ethereum?.selectedAddress) {
      setWalletAddress(window.ethereum.selectedAddress);
      setIsWalletConnected(true);
    }

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsWalletConnected(false);
        setWalletAddress('');
      } else {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    setError(null);

    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to participate in the private sale');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts',
        params: [] 
      });

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      } else {
        setError('No accounts found. Please check your MetaMask configuration.');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      
      // Handle specific MetaMask errors
      if (error.code === 4001) {
        setError('You rejected the connection request. Please try again.');
      } else if (error.code === -32002) {
        setError('Connection request already pending. Please check MetaMask.');
      } else {
        setError('Failed to connect wallet. Please try again or refresh the page.');
      }
    }
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement purchase logic here
    alert('Purchase functionality will be implemented with smart contracts');
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
            {!isWalletConnected && (
              <>
                <button 
                  onClick={connectWallet}
                  className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center mx-auto"
                >
                  <Wallet size={20} className="mr-2" />
                  Connect Wallet
                </button>
                {error && (
                  <div className="mt-4 text-red-400 flex items-center justify-center">
                    <AlertCircle size={16} className="mr-2" />
                    {error}
                  </div>
                )}
              </>
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
              <p className="text-2xl font-bold text-white">${saleInfo.tokenPrice}</p>
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
              <p className="text-2xl font-bold text-white">{saleInfo.totalAllocation}</p>
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
              <h3 className="text-gray-400 text-sm mb-1">Remaining</h3>
              <p className="text-2xl font-bold text-white">{saleInfo.remainingAllocation}</p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Sale Ends</h3>
              <p className="text-2xl font-bold text-white">{saleInfo.endDate}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Purchase Form */}
      {isWalletConnected && (
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
                  <p className="text-gray-400 text-sm">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                </div>

                <form onSubmit={handlePurchase}>
                  <div className="mb-6">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">
                      Amount to Purchase
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="amount"
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(e.target.value)}
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
                  >
                    Purchase Tokens
                  </button>
                </form>
              </motion.div>
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