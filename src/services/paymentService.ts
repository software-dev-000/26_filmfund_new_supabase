import { supabase } from '../config/supabase';

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