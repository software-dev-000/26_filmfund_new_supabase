import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (err) {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <Film size={32} className="text-gold-500" />
            <span className="text-2xl font-bold text-white">FilmFund.io</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">Reset your password</h2>
          <p className="mt-2 text-gray-400">Enter your email to receive reset instructions</p>
        </motion.div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-12 py-3 bg-navy-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-navy-900 bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </motion.form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="text-gold-500 hover:text-gold-400 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword; 