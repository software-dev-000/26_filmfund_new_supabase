import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, ExternalLink, X } from 'lucide-react';

interface PurchaseProcessingModalProps {
  isOpen: boolean;
  tokenAmount: number;
  quoteAmount: number;
  status: 'processing' | 'success' | 'error' | 'rejected';
  txHash?: string;
  errorMessage?: string;
  onClose: () => void;
}

const PurchaseProcessingModal: React.FC<PurchaseProcessingModalProps> = ({
  isOpen,
  tokenAmount,
  quoteAmount,
  status,
  txHash,
  errorMessage,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/70" onClick={status !== 'processing' ? onClose : undefined} />
      <motion.div 
        className="relative bg-navy-800 p-6 rounded-xl shadow-lg border border-navy-700 max-w-md w-full mx-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Close button */}
        {status !== 'processing' && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}
        
        <div className="flex flex-col items-center text-center">
          {status === 'processing' && (
            <>
              <Loader2 size={60} className="text-gold-500 animate-spin mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Processing Your Purchase</h3>
              <p className="text-gray-400 mb-6">Please wait while we process your transaction. This may take a few moments.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle size={60} className="text-green-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Purchase Successful!</h3>
              <p className="text-gray-400 mb-6">Your token purchase has been completed successfully.</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle size={60} className="text-red-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Purchase Failed</h3>
              <p className="text-gray-400 mb-6">{errorMessage || 'An error occurred while processing your transaction.'}</p>
            </>
          )}
          
          {status === 'rejected' && (
            <>
              <AlertCircle size={60} className="text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Transaction Rejected</h3>
              <p className="text-gray-400 mb-6">You rejected the transaction signature request.</p>
            </>
          )}
          
          <div className="bg-navy-700 rounded-lg p-4 w-full mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Token Amount:</span>
              <span className="text-white font-medium">{tokenAmount.toLocaleString()} FFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Cost:</span>
              <span className="text-white font-medium">${quoteAmount.toFixed(2)} USDT</span>
            </div>
          </div>
          
          {txHash && (
            <a 
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gold-500 hover:text-gold-400 transition-colors mb-6"
            >
              View on Explorer
              <ExternalLink size={16} className="ml-1" />
            </a>
          )}
          
          {status !== 'processing' && (
            <button
              onClick={onClose}
              className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 py-3 rounded-lg font-medium transition-colors"
            >
              {status === 'success' ? 'Done' : 'Try Again'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseProcessingModal;
