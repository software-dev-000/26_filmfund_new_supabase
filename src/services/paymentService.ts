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

  async getPrivateSaleGlobalStatus() {
    const { data, error } = await supabase
      .from('private_sale')
      .select('*')

    if (error) throw error;

    const totalTokenAmount = data.reduce((acc, curr) => acc + curr.token_amount, 0);
    const totalQuoteAmount = data.reduce((acc, curr) => acc + curr.quote_amount, 0);
    const totalBuyers = data.map((sale) => sale.user_id).filter((userId, index, self) => self.indexOf(userId) === index).length;

    return {
      totalPurchasedTokens: totalTokenAmount,
      totalPurchasedQuote: totalQuoteAmount,
      totalBuyers: totalBuyers
    };
  }
};

export const displayNumberWithUnits = (number: number) => {
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

