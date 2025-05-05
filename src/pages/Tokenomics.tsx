import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Lock, TrendingUp, Users, Shield, PieChart as ChartPie, Zap, ArrowUpRight, Clock, Award } from 'lucide-react';

const Tokenomics: React.FC = () => {
  const tokenInfo = {
    name: "FilmFund Token",
    symbol: "FFA",
    totalSupply: "100,000,000",
    initialPrice: "$0.50",
    currentPrice: "$2.15",
    marketCap: "$215,000,000",
    circulation: "35,000,000"
  };

  const distribution = [
    { category: "Public Sale", percentage: 30, color: "bg-blue-500" },
    { category: "Team & Advisors", percentage: 20, color: "bg-purple-500" },
    { category: "Platform Development", percentage: 15, color: "bg-green-500" },
    { category: "Marketing", percentage: 10, color: "bg-yellow-500" },
    { category: "Community Rewards", percentage: 15, color: "bg-red-500" },
    { category: "Reserve", percentage: 10, color: "bg-indigo-500" }
  ];

  const stakingTiers = [
    {
      name: "Silver",
      minStake: "10,000",
      apy: "12%",
      benefits: [
        "Early access to film projects",
        "Basic voting rights",
        "Quarterly rewards"
      ]
    },
    {
      name: "Gold",
      minStake: "50,000",
      apy: "18%",
      benefits: [
        "Priority project access",
        "Enhanced voting power",
        "Monthly rewards",
        "Exclusive NFT drops"
      ]
    },
    {
      name: "Platinum",
      minStake: "100,000",
      apy: "24%",
      benefits: [
        "First access to all projects",
        "Maximum voting power",
        "Weekly rewards",
        "Premium NFT collection",
        "Film premiere invitations"
      ]
    }
  ];

  const metrics = [
    {
      label: "Total Value Locked",
      value: "$24.5M",
      change: "+15.2%",
      icon: <Lock size={24} />
    },
    {
      label: "Staking APY",
      value: "18%",
      change: "+2.5%",
      icon: <TrendingUp size={24} />
    },
    {
      label: "Total Stakers",
      value: "3,247",
      change: "+126",
      icon: <Users size={24} />
    },
    {
      label: "Security Score",
      value: "98/100",
      change: "A+",
      icon: <Shield size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950"></div>
          <img 
            src="https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg"
            alt="Tokenomics"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              FFA Token Economics
            </h1>
            <p className="text-xl text-gray-300">
              Understanding the tokenomics of the FilmFund ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Token Info */}
      <section className="py-12 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center text-gray-400 mb-2">
                <Coins size={20} className="mr-2" />
                Total Supply
              </div>
              <p className="text-2xl font-bold text-white">{tokenInfo.totalSupply}</p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center text-gray-400 mb-2">
                <TrendingUp size={20} className="mr-2" />
                Current Price
              </div>
              <p className="text-2xl font-bold text-white">{tokenInfo.currentPrice}</p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center text-gray-400 mb-2">
                <ChartPie size={20} className="mr-2" />
                Market Cap
              </div>
              <p className="text-2xl font-bold text-white">{tokenInfo.marketCap}</p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center text-gray-400  mb-2">
                <Zap size={20} className="mr-2" />
                Circulating Supply
              </div>
              <p className="text-2xl font-bold text-white">{tokenInfo.circulation}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Token Distribution */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Token Distribution</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Transparent allocation of FFA tokens across different segments of our ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
            >
              <div className="aspect-square relative">
                {/* Pie Chart Visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 relative">
                    {distribution.map((segment, index) => {
                      const rotation = index * (360 / distribution.length);
                      return (
                        <div
                          key={segment.category}
                          className={`absolute w-full h-full ${segment.color} opacity-80`}
                          style={{
                            clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)',
                            transform: `rotate(${rotation}deg)`
                          }}
                        />
                      );
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-2xl font-bold">100M</div>
                        <div className="text-sm text-gray-400">Total Supply</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {distribution.map((segment, index) => (
                <div 
                  key={segment.category}
                  className="bg-navy-800 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${segment.color} mr-3`}></div>
                    <span className="text-white">{segment.category}</span>
                  </div>
                  <span className="text-gray-400">{segment.percentage}%</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Staking Tiers */}
      <section className="py-20 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Staking Tiers</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Stake FFA tokens to earn rewards and gain exclusive access to film projects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stakingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="text-gold-500 text-3xl font-bold mb-2">{tier.apy}</div>
                  <p className="text-gray-400">Min. Stake: {tier.minStake} FFA</p>
                </div>
                <div className="space-y-3">
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center text-gray-300">
                      <Award size={16} className="text-gold-500 mr-2" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Platform Metrics</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Real-time statistics of the FFA token ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500">
                    {metric.icon}
                  </div>
                  <div className="flex items-center text-green-400">
                    <ArrowUpRight size={16} className="mr-1" />
                    {metric.change}
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm mb-1">{metric.label}</h3>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="bg-navy-800 rounded-xl p-8 text-center border border-navy-700 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Earning with FFA
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of token holders earning rewards and gaining exclusive access 
              to film investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register" 
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Buy FFA Tokens
              </a>
              <a 
                href="/ffa-staking" 
                className="border border-gold-500 text-white hover:bg-navy-700 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Learn About Staking
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Tokenomics;