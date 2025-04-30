import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Film, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserType } from '../../contexts/AuthContext';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('filmmaker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!acceptTerms) {
      return setError('You must accept the terms of service');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, firstName, lastName, userType);
      setShowSuccess(true);
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to create an account: ${err.message}`);
      } else {
        setError('An unexpected error occurred');
      }
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
            <img src="/favicon.webp" alt="FilmFund.io" className="h-8" />
            <span className="text-2xl font-bold text-white">FilmFund.io</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-gray-400">Join the future of film financing</p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2"
              role="alert"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="block sm:inline">Account created successfully! Redirecting...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="user-type" className="block text-sm font-medium text-gray-400 mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('filmmaker')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    userType === 'filmmaker'
                      ? 'bg-gold-500 text-navy-900'
                      : 'bg-navy-800 text-white hover:bg-navy-700'
                  }`}
                >
                  Filmmaker
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('investor')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    userType === 'investor'
                      ? 'bg-gold-500 text-navy-900'
                      : 'bg-navy-800 text-white hover:bg-navy-700'
                  }`}
                >
                  Investor
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none relative block w-full px-12 py-3 bg-navy-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="First name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="sr-only">Last name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none relative block w-full px-12 py-3 bg-navy-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

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
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-12 py-3 bg-navy-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-12 py-3 bg-navy-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 bg-navy-800 border-navy-700 rounded text-gold-500 focus:ring-gold-500"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
              I agree to the{' '}
              <Link to="/terms" className="text-gold-500 hover:text-gold-400">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-gold-500 hover:text-gold-400">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-navy-900 bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </motion.form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-500 hover:text-gold-400 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;