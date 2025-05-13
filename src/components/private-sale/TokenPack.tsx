import { motion } from "framer-motion";
import { Package } from "lucide-react";

export default function TokenPack({ amount, price, onSelect }: { amount: number, price: number, onSelect: () => void }) {
  const totalPrice = (amount * price).toFixed(2);
  
  
  return (
    <motion.div 
      className="bg-navy-800 rounded-xl p-6 border border-navy-700 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
    >
      <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4 self-center">
        <Package size={24} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 text-center">{amount.toLocaleString()} FFA</h3>
      <p className="text-gray-400 text-center mb-4">${totalPrice}</p>
      <button
        onClick={onSelect}
        className="mt-auto bg-navy-700 hover:bg-navy-600 text-white py-2 rounded-lg font-medium transition-colors"
      >
        Select Pack
      </button>
    </motion.div>
  );
};