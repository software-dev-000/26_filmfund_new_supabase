import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Film } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../config/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      
      // Get user data after successful login
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User data:', user);
      
      toast.success('Successfully signed in!');
      if(user?.user_metadata?.user_type === 'superadmin') {
        navigate('/admin/dashboard');
      } else if(user?.user_metadata?.user_type === 'filmmaker' || user?.user_metadata?.user_type === 'admin') {
        navigate('/filmmaker/dashboard');
      } else if(user?.user_metadata?.user_type === 'investor') {
        navigate('/investor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error('Failed to sign in', err.message);
      } else {
        toast.error('Failed to sign in. Please check your credentials.');
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
          {/* <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <img src="/favicon.webp" alt="FilmFund.io" className="h-8" />
            <span className="text-2xl font-bold text-white">FilmFund.io</span>
          </Link> */}
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-12 py-3 bg-navy-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-navy-800 border-navy-700 rounded text-gold-500 focus:ring-gold-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="text-gold-500 hover:text-gold-400">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-navy-900 bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </motion.form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold-500 hover:text-gold-400 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

