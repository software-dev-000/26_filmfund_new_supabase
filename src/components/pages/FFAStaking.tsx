import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Lock, 
  TrendingUp, 
  Shield, 
  Clock,
  ChevronRight,
  CheckCircle,
  DollarSign,
  Percent
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const FFAStaking: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('silver');
  const { currentUser } = useAuth();
  const stakingTiers = [
    {
      id: 'silver',
      name: 'Silver',
      minStake: '10,000',
      apy: '12',
      lockPeriod: '3 months',
      benefits: [
        'Early access to film projects',
        'Basic voting rights',
        'Quarterly rewards distribution',
        'Community forum access'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      minStake: '50,000',
      apy: '18',
      lockPeriod: '6 months',
      benefits: [
        'Priority access to film projects',
        'Enhanced voting power',
        'Monthly rewards distribution',
        'Exclusive film NFT drops',
        'Quarterly stakeholder meetings'
      ]
    },
    {
      id: 'platinum',
      name: 'Platinum',
      minStake: '100,000',
      apy: '24',
      lockPeriod: '12 months',
      benefits: [
        'First access to all film projects',
        'Maximum voting power',
        'Weekly rewards distribution',
        'Premium film NFT collection',
        'Monthly stakeholder meetings',
        'Film premiere invitations'
      ]
    }
  ];

  const stats = [
    {
      title: 'Total Value Locked',
      value: '$24.5M',
      icon: <Lock size={24} />,
      color: 'blue'
    },
    {
      title: 'Average APY',
      value: '18%',
      icon: <TrendingUp size={24} />,
      color: 'green'
    },
    {
      title: 'Total Stakers',
      value: '3,247',
      icon: <Shield size={24} />,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950"></div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              FFA Token Staking
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Stake your FFA tokens to earn rewards and gain exclusive access to film investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <Link 
                  to="#" 
                  className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Start Staking
                </Link>
              ) : (
                <Link 
                  to="/register" 
                  className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Start Staking
                </Link>
              )}
              <Link 
                to="#" 
                className="border border-gold-500 text-white hover:bg-navy-700 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-${stat.color}-500/20 text-${stat.color}-400`}>
                  {stat.icon}
                </div>
                <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Staking Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2 
            className="text-3xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Choose Your Staking Tier
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stakingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                className={`bg-navy-800 flex flex-col justify-between rounded-xl p-6 border-2 transition-colors ${
                  selectedTier === tier.id 
                    ? 'border-gold-500' 
                    : 'border-navy-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedTier(tier.id)}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-gold-500 text-3xl font-bold">{tier.apy}%</span>
                  <span className="text-gray-400 ml-2">APY</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-300">
                    <DollarSign size={16} className="text-gold-500 mr-2" />
                    Min Stake: {tier.minStake} FFA
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock size={16} className="text-gold-500 mr-2" />
                    Lock Period: {tier.lockPeriod}
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center text-gray-300">
                      <CheckCircle size={16} className="text-gold-500 mr-2" />
                      {benefit}
                    </div>
                  ))}
                </div>
                <button 
                  className={`w-full py-3 rounded-md font-medium transition-colors ${
                    selectedTier === tier.id
                      ? 'bg-gold-500 hover:bg-gold-600 text-navy-900'
                      : 'bg-navy-700 hover:bg-navy-600 text-white'
                  }`}
                >
                  Select {tier.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2 
            className="text-3xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            How Staking Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <Coins size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Stake Tokens</h3>
              <p className="text-gray-400">
                Lock your FFA tokens in our staking contract to start earning rewards and gaining access to exclusive benefits.
              </p>
            </motion.div>
            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lock Period</h3>
              <p className="text-gray-400">
                Choose your preferred lock period. Longer lock periods earn higher rewards and provide better benefits.
              </p>
            </motion.div>
            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                <Percent size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Earn Rewards</h3>
              <p className="text-gray-400">
                Receive regular staking rewards and gain access to exclusive film investment opportunities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="bg-navy-800 rounded-xl p-6 text-center border border-navy-700 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Staking?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of FFA token holders earning rewards and gaining exclusive access to film investment opportunities.
            </p>
            {currentUser ? (
              <Link 
                to="#" 
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-md font-medium transition-colors inline-block"
              >
                Start Staking Now
              </Link>
            ) : (
              <Link 
                to="/register" 
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-md font-medium transition-colors inline-block"
              >
                Start Staking Now
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FFAStaking;