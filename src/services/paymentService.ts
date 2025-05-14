import { supabase } from '../config/supabase';
import { PrivateSale } from '../types/database';
// Define the return type for createPaymentIntent
interface PaymentIntentResponse {
  clientSecret: string;
}

export const paymentService = {
  async createPaymentIntent(amount: number): Promise<PaymentIntentResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }
};

export const privateSaleService = {
  async createPrivateSale(privateSale: Omit<PrivateSale, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('private_sale')
      .insert(privateSale)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPrivateSaleWithWalletAddress(walletAddress: string) {
    const { data, error } = await supabase
      .from('private_sale')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) throw error;
    return data;
  },

  async getPrivateSaleWithUserId(userId: string) {
    const { data, error } = await supabase
      .from('private_sale')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getPrivateSaleGlobalStatus(userId: string) {
    const { data, error } = await supabase
      .from('private_sale')
      .select('*')

    if (error) throw error;

    // global purchase info
    const totalTokenAmount = data.reduce((acc, curr) => acc + curr.token_amount, 0);
    const totalQuoteAmount = data.reduce((acc, curr) => acc + curr.quote_amount, 0);
    const totalBuyers = data.map((sale) => sale.user_id).filter((userId, index, self) => self.indexOf(userId) === index).length;

    // user purchase info
    const userPurchaseWallets = data.filter((sale) => sale.user_id === userId).map((sale) => ({wallet: sale.wallet_address, amount: sale.token_amount, date: sale.created_at, is_claimed: sale.is_claimed}));
    const userTotalPurchased = userPurchaseWallets.reduce((acc, curr) => acc + curr.amount, 0);
    const userClaimableAmount = data.filter((sale) => sale.user_id === userId && new Date(sale.created_at) < new Date('2025-06-15') && sale.is_claimed === false).reduce((acc, curr) => acc + curr.token_amount, 0);

    return {
      // global sale info
      totalPurchasedTokens: totalTokenAmount,
      totalPurchasedQuote: totalQuoteAmount,
      totalBuyers: totalBuyers,

      // user purchase info
      userTotalPurchased: userTotalPurchased,
      userClaimableAmount: userClaimableAmount,
      userPurchaseWallets: userPurchaseWallets
    };
  }
};

export const displayNumberWithUnits = (number: number) => {
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

