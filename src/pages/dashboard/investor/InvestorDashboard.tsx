import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Film, 
  ChevronRight,
  Clock,
  Star,
  ArrowUpRight,
  Wallet,
  Coins,
  Lock,
  ChevronUp
} from 'lucide-react';
import { projectService } from '../../../services/projectService';
import { Project, ProjectPayment } from '../../../types/database';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

interface ProjectWithUI extends Project {
  funding_raised: number;
  investors: number;
  days_left: number;
  completion_percent?: number;
  performance?: string;
  amount?: number;
  date?: string;
}

const InvestorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [portfolioStats, setPortfolioStats] = useState({
    totalInvested: 0,
    totalReturns: 0,
    activeInvestments: 0,
    pendingFunding: 0
  });

  const [recentInvestments, setRecentInvestments] = useState<ProjectWithUI[]>([]);
  const [upcomingProjects, setUpcomingProjects] = useState<ProjectWithUI[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAllProjects();
        
        // Transform projects data
        const transformedProjects = data.map(project => ({
          ...project,
          funding_raised: project.project_payments?.reduce((sum: number, payment: ProjectPayment) => sum + payment.amount, 0) || 0,
          investors: project.project_payments?.length || 0,
          days_left: 30, // This should be calculated based on project end date
          completion_percent: project.status === 'production' ? 45 : undefined, // This should be calculated based on actual progress
          performance: project.status === 'production' ? '+23%' : undefined,
          amount: project.project_payments?.reduce((sum: number, payment: ProjectPayment) => sum + payment.amount, 0),
          date: project.project_payments?.find((p: ProjectPayment) => p.status === 'active')?.created_at
        }));

        // Calculate portfolio stats
        const totalInvested = transformedProjects.reduce((sum, project) => sum + project.funding_raised, 0);
        const totalReturns = transformedProjects.reduce((sum, project) => {
          // This is a placeholder calculation - you should implement your actual returns calculation
          return sum + (project.funding_raised * 0.23); // Assuming 23% return
        }, 0);
        const activeInvestments = transformedProjects.filter(project => project.status === 'active').length;
        const pendingFunding = transformedProjects.filter(project => project.status === 'funding').length;

        setPortfolioStats({
          totalInvested,
          totalReturns,
          activeInvestments,
          pendingFunding
        });

        // Set recent investments (last 3 active investments)
        setRecentInvestments(
          transformedProjects
            .filter(project => project.status === 'active')
            .slice(0, 3)
        );

        // Set upcoming projects (projects in funding status)
        setUpcomingProjects(
          transformedProjects
            .filter(project => project.status === 'funding')
            .slice(0, 2)
        );

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const stakingInfo = {
    stakedAmount: 25000,
    tier: 'Gold',
    apy: 18,
    nextReward: '2.5',
    lockPeriod: '180 days remaining'
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 lg:p-8 min-h-screen bg-navy-950 mt-[50px]">
        <div className="mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-navy-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-navy-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-navy-800 rounded-xl p-6 border border-navy-700 h-32"></div>
              ))}
            </div>
            <div className="bg-navy-800 rounded-xl border border-navy-700 mb-8 p-6">
              <div className="h-8 bg-navy-700 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-navy-700 rounded-lg h-48"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 lg:p-8 min-h-screen bg-navy-950">
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
          className="lg:col-span-2 bg-navy-800 rounded-xl border border-navy-700 overflow-hidden"
        >
          <div className="p-6 border-b border-navy-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Investments</h2>
              <button className="text-gold-500 hover:text-gold-400 text-sm flex items-center">
                View All <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="flex overflow-x-hidden">
              <div className="animate-scroll flex">
                {recentInvestments.map((investment) => (
                  <div 
                    key={investment.id} 
                    className="flex items-center p-6 hover:bg-navy-700/50 transition-colors min-w-[400px]"
                  >
                    <img 
                      src={investment.cover_image || "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg"} 
                      alt={investment.title} 
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="text-white font-medium mb-1">{investment.title}</h3>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-400">
                          Invested on {new Date(investment.created_at).toLocaleDateString()}
                        </p>
                        <span className="text-sm text-gray-400">
                          {investment.stable_split}% Stable
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gold-500 font-semibold mb-1">
                        ${investment.funding_raised.toLocaleString()}
                      </p>
                      <span className="inline-flex items-center text-sm text-green-400">
                        <ArrowUpRight size={14} className="mr-1" />
                        {investment.performance || '+0%'}
                      </span>
                    </div>
                  </div>
                ))}
                {/* Duplicate items for seamless scrolling */}
                {recentInvestments.map((investment) => (
                  <div 
                    key={`${investment.id}-duplicate`} 
                    className="flex items-center p-6 hover:bg-navy-700/50 transition-colors min-w-[400px]"
                  >
                    <img 
                      src={investment.cover_image || "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg"} 
                      alt={investment.title} 
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="text-white font-medium mb-1">{investment.title}</h3>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-400">
                          Invested on {new Date(investment.created_at).toLocaleDateString()}
                        </p>
                        <span className="text-sm text-gray-400">
                          {investment.stable_split}% Stable
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gold-500 font-semibold mb-1">
                        ${investment.funding_raised.toLocaleString()}
                      </p>
                      <span className="inline-flex items-center text-sm text-green-400">
                        <ArrowUpRight size={14} className="mr-1" />
                        {investment.performance || '+0%'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  src={project.cover_image || "https://images.pexels.com/photos/3265460/pexels-photo-3265460.jpeg"} 
                  alt={project.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-medium">{project.title}</h3>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-navy-600 text-gray-300 mt-1">
                        {project.genre}
                      </span>
                    </div>
                    <div className="flex items-center text-gold-500">
                      <Star size={14} className="mr-1" />
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Funding Goal</span>
                      <span>${(project.funding_goal / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Stable Split</span>
                      <span>{project.stable_split}%</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Min Investment</span>
                      <span>${(project.funding_goal * 0.01).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gold-500">
                      <span>Launch</span>
                      <span>{project.days_left} days</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
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

// Add this at the end of the file, before the export statement
const styles = `
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}

.animate-scroll:hover {
  animation-play-state: paused;
}
`;

// Add this right after the imports
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default InvestorDashboard;