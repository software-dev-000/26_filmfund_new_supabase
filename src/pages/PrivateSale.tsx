import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  DollarSign, 
  Shield,
  CheckCircle,
  Copy,
  ExternalLink,
  LogOut,
  Users,
  Loader2,
  Calendar,
  CreditCard,
  ChevronDown,
} from 'lucide-react';
import { web3modal } from '../App';
import { useAccount, useDisconnect } from 'wagmi';
import { useToast } from '../contexts/ToastContext';
import { useEthersProvider, useEthersSigner, getWalletBalance, transferToken } from '../services/web3Service';
import { privateSaleService, displayNumberWithUnits } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';

import PurchaseProcessingModal from '../components/private-sale/PurchaseProcessingModal';

type userWalletPurchase = {
  wallet_address: string;
  token_amount: number;
  created_at: string;
  is_claimed: boolean;
}

const PrivateSale = () => {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [connectedWalletBalance, setConnectedWalletBalance] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const { currentUser } = useAuth();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const provider = useEthersProvider({});
  const signer = useEthersSigner({});
  const toast = useToast();

  const [globalSaleInfo, setGlobalSaleInfo] = useState({
    // token metadata
    tokenPrice: 0.5,
    minPurchase: 1000,
    maxPurchase: 100000,
    tokenContract: '0x7422823916658d872B9deC9a78312FE08fB570c4',
    nextVesting: 'June 15, 2025',
    endDate: 'May 31, 2025',

    // global purchase info
    totalAllocation: 70000000,
    totalPurchasedTokens: 0,
    totalPurchasedQuote: 0,
    totalBuyers: 0,

    // user purchase info
    userTotalPurchased: 0,
    userClaimableAmount: 0,
    userPurchaseWallets: [] as userWalletPurchase[],
    
  });

  const [purchaseModal, setPurchaseModal] = useState({
    isOpen: false,
    tokenAmount: 0,
    quoteAmount: 0,
    status: 'processing' as 'processing' | 'success' | 'error' | 'rejected',
    txHash: '',
    errorMessage: ''
  });

  const DEPOSIT_WALLET_ADDRESS = import.meta.env.VITE_DEPOSIT_WALLET_ADDRESS || '0xf6d6850d02eC403360249C40CbF846AC4d782A31';
  const USDT_ADDRESS = import.meta.env.VITE_USDT_ADDRESS || '0x7422823916658d872B9deC9a78312FE08fB570c4';

  const PURCHASE_PACKS = [
    { name: 'Starter', amount: 1000, tokens: 2000, bonus: 0 },
    { name: 'Growth', amount: 5000, tokens: 10000, bonus: 5 },
    { name: 'Premium', amount: 10000, tokens: 20000, bonus: 10 },
    { name: 'Whale', amount: 50000, tokens: 100000, bonus: 20 }
  ];

  const fetchGlobalSaleInfo = async () => {
    if(!currentUser) {
      return;
    }
    setIsLoading(true);
    try {
      const globalSaleInfo = await privateSaleService.getPrivateSaleGlobalStatus(currentUser.id);
      setGlobalSaleInfo((prev) => ({
        ...prev,
        ...globalSaleInfo,
        userPurchaseWallets: (globalSaleInfo.userPurchaseWallets || []).map((p: any) => ({
          wallet_address: p.wallet,
          token_amount: p.amount,
          created_at: p.date,
          is_claimed: p.is_claimed,
        })),
      }));
    } catch (error) {
      console.error('Error fetching global sale info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUSDTBalance = async () => {
    try {
      if (!address) {
        toast.error('Wallet not connected', 'Please connect your wallet to continue.');
        return;
      }
      setIsLoading(true);
      const balance = await getWalletBalance(address, USDT_ADDRESS);
      setConnectedWalletBalance(balance);
    } catch (error) {
      console.error('Error fetching USDT balance:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGlobalSaleInfo();
  }, []);

  useEffect(() => {
    if (isConnected) {
      getUSDTBalance();
    }
  }, [isConnected]);

  const handlePurchase = async (tokenAmount: number) => {
    if (!signer || !provider) {
      toast.error('Wallet not connected', 'Please connect your wallet to continue.');
      return;
    }

    if (!tokenAmount || tokenAmount <= 0) {
      toast.error('Invalid amount', 'Please enter a valid amount to deposit.');
      return;
    }

    setIsPurchasing(true);
    
    // Open the processing modal
    setPurchaseModal({
      isOpen: true,
      tokenAmount: tokenAmount,
      quoteAmount: tokenAmount * globalSaleInfo.tokenPrice,
      status: 'processing',
      txHash: '',
      errorMessage: ''
    });

    try {
      const signerAddress = await signer.getAddress();

      if (!currentUser) {
        setPurchaseModal(prev => ({
          ...prev,
          status: 'error',
          errorMessage: 'User not found. Please login to continue.'
        }));
        setIsPurchasing(false);
        return;
      }

      // Execute transfer
      const receipt = await transferToken(signer, USDT_ADDRESS, DEPOSIT_WALLET_ADDRESS, tokenAmount * globalSaleInfo.tokenPrice);

      if (receipt) {
        try {
          await privateSaleService.createPrivateSale({
            user_id: currentUser?.id,
            wallet_address: signerAddress,
            token_amount: tokenAmount,
            quote_amount: tokenAmount * globalSaleInfo.tokenPrice,
            transaction_hash: receipt.hash,
            is_claimed: false
          });

          setPurchaseModal(prev => ({
            ...prev,
            status: 'success',
            txHash: receipt.hash
          }));

          await fetchGlobalSaleInfo();
          await refreshBalances();
          setPurchaseAmount('');
        } catch (error) {
          setPurchaseModal(prev => ({
            ...prev,
            status: 'error',
            errorMessage: 'An error occurred while creating your purchase. Please try again.'
          }));
        }
      }
    } catch (error: any) {
      if (error.message?.includes('user rejected action')) {
        setPurchaseModal(prev => ({
          ...prev,
          status: 'rejected',
          errorMessage: 'User rejected transaction'
        }));
      } else {
        setPurchaseModal(prev => ({
          ...prev,
          status: 'error',
          errorMessage: 'An error occurred while creating your purchase. Please try again.'
        }));
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCopyAddress = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Address copied to clipboard');
  };

   // Refresh balances
  const refreshBalances = async () => {
    if (!signer || !provider) {
      toast.error('Wallet not connected', 'Please connect your wallet to continue.');
      return;
    }

    setIsRefreshing(true);

    try {
      const address = await signer.getAddress();
      const balance = await getWalletBalance(address, USDT_ADDRESS);
      setConnectedWalletBalance(balance);
    } catch (error) {
      console.error('Error refreshing balances:', error);
      toast.error('Failed to refresh balances', 'Could not retrieve wallet balances. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCloseModal = () => {
    setPurchaseModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const calculateProgress = () => {
    return (globalSaleInfo.totalPurchasedTokens / globalSaleInfo.totalAllocation * 100).toFixed(2);
  };

  const selectPackage = (pkg: any) => {
    setPurchaseAmount(pkg.tokens.toString());
  };

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Purchase Processing Modal */}
      <PurchaseProcessingModal
        isOpen={purchaseModal.isOpen}
        tokenAmount={purchaseModal.tokenAmount}
        quoteAmount={purchaseModal.quoteAmount}
        status={purchaseModal.status}
        txHash={purchaseModal.txHash}
        errorMessage={purchaseModal.errorMessage}
        onClose={handleCloseModal}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950"></div>
    
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Hero Section with Sale Stats */}
          <div className="pb-0">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">FFA Token Private Sale</h1>
                <p className="text-gray-400 mt-1">
                  Be among the first to acquire FFA tokens at ${globalSaleInfo.tokenPrice} per token
                </p>
              </div>
              
              <div className="mt-4 lg:mt-0">
                {isConnected ? (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2 bg-navy-800 px-3 py-1.5 rounded-lg">
                        <span className="text-sm text-gray-300">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                        <button 
                          onClick={() => handleCopyAddress(address!!)}
                          className="text-gold-500 hover:text-gold-400 transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                        <a 
                          href={`https://sepolia.etherscan.io/address/${address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-500 hover:text-gold-400 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      
                      {isLoading ? (
                        <div className="text-gray-300 bg-navy-800 px-3 py-1.5 rounded-lg">
                          <Loader2 size={16} className="animate-spin" />
                        </div>
                      ) : (
                        <div className="text-gray-300 bg-navy-800 px-3 py-1.5 rounded-lg text-sm">
                          {connectedWalletBalance} USDT
                        </div>
                      )}

                      <button 
                        onClick={() => disconnect()}
                        disabled={isRefreshing}
                        className="bg-navy-800 hover:bg-navy-700 text-gray-300 p-1.5 rounded-lg transition-colors"
                      >
                        <LogOut size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowDashboard(!showDashboard)}
                      className="flex items-center gap-1 text-gold-500 text-sm font-medium"
                    >
                      {showDashboard ? 'Hide' : 'Show'} your dashboard
                      <ChevronDown size={16} className={`transition-transform ${showDashboard ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      if(!currentUser) {
                        toast.error('Please login to purchase tokens');
                        return;
                      }
                      web3modal.open()
                    }}
                    disabled={isRefreshing}
                    className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <Wallet size={18} className="mr-2" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
            
            {/* Sale Progress */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-navy-800 rounded-lg p-3 border border-navy-700">
                <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-2">
                  <DollarSign size={16} />
                </div>
                <h3 className="text-gray-400 text-xs">Token Price</h3>
                <p className="text-white font-bold">${globalSaleInfo.tokenPrice}</p>
              </div>
              
              <div className="bg-navy-800 rounded-lg p-3 border border-navy-700">
                <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-2">
                  <Calendar size={16} />
                </div>
                <h3 className="text-gray-400 text-xs">Sale Ends</h3>
                <p className="text-white font-bold">{globalSaleInfo.endDate}</p>
              </div>
              
              <div className="bg-navy-800 rounded-lg p-3 border border-navy-700">
                <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-2">
                  <Users size={16} />
                </div>
                <h3 className="text-gray-400 text-xs">Total Buyers</h3>
                <p className="text-white font-bold">{globalSaleInfo.totalBuyers}</p>
              </div>
              
              <div className="bg-navy-800 rounded-lg p-3 border border-navy-700">
                <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-2">
                  <Shield size={16} />
                </div>
                <h3 className="text-gray-400 text-xs">Allocation Remaining</h3>
                <p className="text-white font-bold">{(globalSaleInfo.totalAllocation - globalSaleInfo.totalPurchasedTokens).toLocaleString()} FFA</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Sale Progress</span>
                <span className="text-white">{calculateProgress()}%</span>
              </div>
              <div className="w-full bg-navy-700 rounded-full h-2.5">
                <div 
                  className="bg-gold-500 h-2.5 rounded-full" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-400">Sold: {displayNumberWithUnits(globalSaleInfo.totalPurchasedTokens)}</span>
                <span className="text-gray-400">Total: {displayNumberWithUnits(globalSaleInfo.totalAllocation)}</span>
              </div>
            </div>
          </div>

          {/* User Dashboard (Collapsible) */}
          {isConnected && showDashboard && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 p-4 bg-navy-800 rounded-lg border border-navy-700">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white mb-2">Your Investments</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-navy-700 p-2 rounded">
                        <p className="text-xs text-gray-400">Total Purchased</p>
                        <p className="text-white font-bold">{globalSaleInfo.userTotalPurchased} FFA</p>
                      </div>
                      <div className="bg-navy-700 p-2 rounded">
                        <p className="text-xs text-gray-400">Next Vesting</p>
                        <p className="text-white font-bold">{globalSaleInfo.nextVesting}</p>
                      </div>
                      <div className="bg-navy-700 p-2 rounded">
                        <p className="text-xs text-gray-400">Claimable</p>
                        <p className="text-white font-bold">{globalSaleInfo.userClaimableAmount} FFA</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white mb-2">Token Contract</h3>
                    <div className="bg-navy-700 p-2 rounded flex justify-between items-center">
                      <span className="text-xs text-gray-300 font-mono truncate">{globalSaleInfo.tokenContract}</span>
                      <button 
                        onClick={() => handleCopyAddress(globalSaleInfo.tokenContract)}
                        className="bg-navy-600 p-1 rounded text-gold-500 hover:bg-navy-500 transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Wallet Purchase History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-gray-300">
                      <thead className="text-xs uppercase text-gray-400 bg-navy-700">
                        <tr>
                          <th scope="col" className="px-3 py-2">Wallet Address</th>
                          <th scope="col" className="px-3 py-2">Amount</th>
                          <th scope="col" className="px-3 py-2">Purchase Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {globalSaleInfo.userPurchaseWallets.map((purchase, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-navy-700 bg-opacity-30' : ''}>
                            <td className="px-3 py-2 font-mono">{purchase.wallet_address}</td>
                            <td className="px-3 py-2">{purchase.token_amount} FFA</td>
                            <td className="px-3 py-2">{purchase.created_at.split('T')[0]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 flex justify-end">
                    {/* <button 
                      className="bg-gold-500 h-8  text-navy-900 px-3 py-1 rounded text-xs font-medium"
                      onClick={() => console.log(globalSaleInfo.userPurchaseWallets)}
                      disabled={true}
                    >
                      Claim Available Tokens
                    </button> */}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Purchase Area */}
          {isConnected && (
            <div className="bg-navy-800 mb-6 rounded-lg border border-navy-700">
              <div className="p-4">
                <h2 className="text-lg font-medium text-white mb-4">Purchase FFA Tokens</h2>
                
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Left Side - Packages */}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white mb-2">Select a Package</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {PURCHASE_PACKS.map((pkg, index) => (
                        <div
                          key={index}
                          className="bg-navy-700 rounded p-3 border border-navy-600 hover:border-gold-500 cursor-pointer transition-colors"
                          onClick={() => selectPackage(pkg)}
                        >
                          <h4 className="text-white font-medium">{pkg.name}</h4>
                          <div className="text-sm text-gold-500 font-bold mt-1">{pkg.tokens} FFA</div>
                          <div className="text-xs text-gray-400">Cost: {pkg.amount} USDT</div>
                          {pkg.bonus > 0 && (
                            <div className="mt-1 bg-navy-600 rounded px-2 py-0.5 text-xs text-gold-500 inline-block">
                              +{pkg.bonus}% bonus
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Side - Custom Amount */}
                  <div className="flex-1 md:max-w-[500px] h-full">
                    <h3 className="text-sm font-medium text-white mb-2">Custom Amount</h3>
                    <div className="bg-navy-700 rounded p-3">
                      <div className="mb-3">
                        <label htmlFor="amount" className="block text-xs text-gray-400 mb-1">
                          Amount of FFA tokens
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="amount"
                            value={purchaseAmount}
                            onChange={(e) => setPurchaseAmount(e.target.value)}
                            className="w-full bg-navy-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm"
                            placeholder="Enter amount"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                            FFA
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Min: {globalSaleInfo.minPurchase} FFA | Max: {globalSaleInfo.maxPurchase} FFA
                        </p>
                      </div>
                      
                      <div className="mb-3 p-2 bg-navy-600 rounded">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Price per Token</span>
                          <span className="text-white">${globalSaleInfo.tokenPrice}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Total Cost</span>
                          <span className="text-white">
                            ${(Number(purchaseAmount) * globalSaleInfo.tokenPrice || 0).toFixed(2)} USDT
                          </span>
                        </div>
                      </div>
                      
                      <button
                        disabled={isPurchasing || !purchaseAmount}
                        className={`w-full py-2 rounded font-medium flex items-center justify-center text-sm
                        ${isPurchasing || !purchaseAmount ? 'bg-navy-600 text-gray-400' : 'bg-gold-500 hover:bg-gold-600 text-navy-900'}`}
                        onClick={() => {
                          if(Number(purchaseAmount) < globalSaleInfo.minPurchase || Number(purchaseAmount) > globalSaleInfo.maxPurchase) {
                            toast.warning('Invalid amount', `Minimum purchase is ${globalSaleInfo.minPurchase} FFA and maximum is ${globalSaleInfo.maxPurchase} FFA`);
                            return;
                          }
                          handlePurchase(Number(purchaseAmount));
                        }}
                      >
                        {isPurchasing ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard size={16} className="mr-2" />
                            Purchase Tokens
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            
            </div>
          )}

          {/* Benefits Section */}
          <section className="py-8 bg-navy-900">
            <div className="container mx-auto">
              <motion.h2 
                className="text-2xl font-bold text-white text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Private Sale Benefits
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  className="bg-navy-800 rounded-lg p-4 border border-navy-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-3">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Best Price</h3>
                  <p className="text-sm text-gray-400">
                    Access FFA tokens at the lowest possible price before public listing.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-navy-800 rounded-lg p-4 border border-navy-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-3">
                    <Shield size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Early Access</h3>
                  <p className="text-sm text-gray-400">
                    Get priority access to film investment opportunities and platform features.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-navy-800 rounded-lg p-4 border border-navy-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-3">
                    <CheckCircle size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Bonus Rewards</h3>
                  <p className="text-sm text-gray-400">
                    Receive additional staking rewards and exclusive NFT airdrops.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivateSale;