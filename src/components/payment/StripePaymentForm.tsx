import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from '../../contexts/ToastContext';
import { paymentService } from '../../services/paymentService';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  onError?: (errorMessage: string) => void;
}

const PaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onSuccess, onCancel, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { error: showError, success } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // First submit the payment details
      const { error: submitError } = await elements.submit();
      if (submitError) {
        showError('Payment submission failed', submitError.message);
        setIsProcessing(false);
        return;
      }

      // Then confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (confirmError) {
        // Handle error
        showError('Payment confirmation failed', confirmError.message);
        if (onError) {
          onError(confirmError.message || 'Payment confirmation failed');
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        success('Payment successful!');
        // Call the onSuccess callback to create the project
        onSuccess();
      } else {
        // Payment requires additional action (like 3D Secure)
        // Redirect to the payment success page
        window.location.href = `${window.location.origin}/payment/success`;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      showError('Payment failed', errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
        <h2 className="text-xl font-bold text-white mb-4">Payment Details</h2>
        <div className="mb-4">
          <p className="text-gray-300">Amount to pay: ${amount.toFixed(2)}</p>
        </div>
        <PaymentElement />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-navy-600 text-white rounded-lg hover:bg-navy-800 transition-colors"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handlePayment}
          className="px-6 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

const StripePaymentForm: React.FC<StripePaymentFormProps> = (props) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        setIsLoading(true);
        const { clientSecret: secret } = await paymentService.createPaymentIntent(props.amount);
        setClientSecret(secret);
      } catch (err) {
        error('Failed to initialize payment', err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientSecret();
  }, [props.amount, error]);

  if (isLoading || !clientSecret) {
    return (
      <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 text-center">
        <p className="text-white">Initializing payment...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePaymentForm;