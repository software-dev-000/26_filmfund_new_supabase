import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Film, 
  ChevronRight,
  Clock,
  BarChart4,
  Star,
  ArrowUpRight,
  Wallet,
  Calendar,
  Coins,
  Lock,
  ChevronUp
} from 'lucide-react';

const InvestorDashboard: React.FC = () => {
  // Mock data - in a real app, this would come from your backend
  const portfolioStats = {
    totalInvested: 125000,
    totalReturns: 28750,
    activeInvestments: 8,
    pendingFunding: 2
  };

  const stakingInfo = {
    stakedAmount: 25000,
    tier: 'Gold',
    apy: 18,
    nextReward: '2.5',
    lockPeriod: '180 days remaining'
  };
  
  const recentInvestments = [
    {
      id: 1,
      title: "The Last Horizon",
      amount: 15000,
      date: "2025-03-15",
      status: "Active",
      performance: "+12.5%",
      stableSplit: 70, // Percentage in stablecoins
      image: "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg"
    },
    {
      id: 2,
      title: "Beyond the Edge",
      amount: 7500,
      date: "2025-02-28",
      status: "Active",
      performance: "+8.3%",
      stableSplit: 60,
      image: "https://images.pexels.com/photos/1174996/pexels-photo-1174996.jpeg"
    },
    {
      id: 3,
      title: "Midnight in Tokyo",
      amount: 10000,
      date: "2025-01-20",
      status: "Active",
      performance: "+15.7%",
      stableSplit: 80,
      image: "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg"
    }
  ];
  
  const upcomingProjects = [
    {
      id: 4,
      title: "Echoes of Tomorrow",
      category: "Sci-Fi",
      fundingGoal: 1800000,
      daysToLaunch: 3,
      stableSplit: 75,
      minStake: 5000,
      image: "https://images.pexels.com/photos/3265460/pexels-photo-3265460.jpeg",
      rating: 4.8
    },
    {
      id: 5,
      title: "The Silent Road",
      category: "Drama",
      fundingGoal: 950000,
      daysToLaunch: 7,
      stableSplit: 65,
      minStake: 2500,
      image: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg",
      rating: 4.5
    }
  ];

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-navy-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">
            Here's an overview of your film investments and opportunities.
          </p>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Invested"
            value={`$${portfolioStats.totalInvested.toLocaleString()}`}
            icon={<Wallet size={24} />}
            color="blue"
            trend="+12.5% from last month"
            delay={0.1}
          />
          <StatsCard
            title="Total Returns"
            value={`$${portfolioStats.totalReturns.toLocaleString()}`}
            icon={<TrendingUp size={24} />}
            color="green"
            trend="+8.3% from last month"
            delay={0.2}
          />
          <StatsCard
            title="Active Investments"
            value={portfolioStats.activeInvestments}
            icon={<Film size={24} />}
            color="purple"
            trend="2 new this month"
            delay={0.3}
          />
          <StatsCard
            title="Pending Funding"
            value={portfolioStats.pendingFunding}
            icon={<Clock size={24} />}
            color="amber"
            trend="Launching soon"
            delay={0.4}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Investments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 bg-navy-800 rounded-xl border border-navy-700"
          >
            <div className="p-6 border-b border-navy-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Recent Investments</h2>
                <button className="text-gold-500 hover:text-gold-400 text-sm flex items-center">
                  View All <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-navy-700">
              {recentInvestments.map((investment) => (
                <div 
                  key={investment.id} 
                  className="flex items-center p-6 hover:bg-navy-700/50 transition-colors"
                >
                  <img 
                    src={investment.image} 
                    alt={investment.title} 
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="text-white font-medium mb-1">{investment.title}</h3>
                    <div className="flex items-center space-x-4">
                      <p className="text-sm text-gray-400">
                        Invested on {new Date(investment.date).toLocaleDateString()}
                      </p>
                      <span className="text-sm text-gray-400">
                        {investment.stableSplit}% Stable
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-500 font-semibold mb-1">
                      ${investment.amount.toLocaleString()}
                    </p>
                    <span className="inline-flex items-center text-sm text-green-400">
                      <ArrowUpRight size={14} className="mr-1" />
                      {investment.performance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Staking Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-navy-800 rounded-xl border border-navy-700"
          >
            <div className="p-6 border-b border-navy-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Your Staking</h2>
                <Link 
                  to="/ffa-staking" 
                  className="text-gold-500 hover:text-gold-400 text-sm flex items-center"
                >
                  Manage <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-gold-500/20 text-gold-500 flex items-center justify-center mr-3">
                    <Coins size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Staked Amount</p>
                    <p className="text-xl font-bold text-white">${stakingInfo.stakedAmount.toLocaleString()} FFA</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-500 rounded-full text-sm font-medium">
                    {stakingInfo.tier}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-navy-700 rounded-lg p-4">
                  <div className="flex items-center text-gray-400 mb-1">
                    <TrendingUp size={16} className="mr-2" />
                    APY
                  </div>
                  <p className="text-xl font-bold text-white">{stakingInfo.apy}%</p>
                </div>
                <div className="bg-navy-700 rounded-lg p-4">
                  <div className="flex items-center text-gray-400 mb-1">
                    <Lock size={16} className="mr-2" />
                    Lock Period
                  </div>
                  <p className="text-sm text-white">{stakingInfo.lockPeriod}</p>
                </div>
              </div>
              
              <div className="bg-navy-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Next Reward</p>
                    <p className="text-lg font-bold text-white">{stakingInfo.nextReward} FFA</p>
                  </div>
                  <div className="text-green-400 flex items-center">
                    <ChevronUp size={16} className="mr-1" />
                    <span className="text-sm">+2.3%</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 py-3 rounded-lg font-medium transition-colors">
                Stake More FFA
              </button>
            </div>
          </motion.div>
          
          {/* Upcoming Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-3 bg-navy-800 rounded-xl border border-navy-700"
          >
            <div className="p-6 border-b border-navy-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Upcoming Projects</h2>
                <button className="text-gold-500 hover:text-gold-400 text-sm flex items-center">
                  Explore <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-navy-700 rounded-lg overflow-hidden hover:bg-navy-600 transition-colors"
                >
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white font-medium">{project.title}</h3>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-navy-600 text-gray-300 mt-1">
                          {project.category}
                        </span>
                      </div>
                      <div className="flex items-center text-gold-500">
                        <Star size={14} className="mr-1" />
                        <span className="text-sm">{project.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>Funding Goal</span>
                        <span>${(project.fundingGoal / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Stable Split</span>
                        <span>{project.stableSplit}%</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Min Investment</span>
                        <span>${project.minStake.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gold-500">
                        <span>Launch</span>
                        <span>{project.daysToLaunch} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  trend: string;
  delay: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend, delay }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };
  
  return (
    <motion.div 
      className="bg-navy-800 rounded-xl p-6 border border-navy-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white mb-2">{value}</p>
      <p className="text-sm text-gray-400">{trend}</p>
    </motion.div>
  );
};

export default InvestorDashboard;