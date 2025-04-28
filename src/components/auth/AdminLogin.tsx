import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate against your backend
    if (email === 'admin@filmfund.io' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/dashboard');
    } else {
      alert('Invalid admin credentials');
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
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield size={32} className="text-gold-500" />
            <span className="text-2xl font-bold text-white">Admin Portal</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Admin Login</h2>
          <p className="mt-2 text-gray-400">Access the admin dashboard</p>
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
                  placeholder="Admin email"
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
                  placeholder="Admin password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-navy-900 bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
            >
              Access Admin Dashboard
            </button>
          </div>
        </motion.form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Not an administrator?{' '}
          <Link to="/login" className="text-gold-500 hover:text-gold-400 font-medium">
            Return to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;