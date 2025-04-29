import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Film, 
  DollarSign, 
  TrendingUp, 
  PlusCircle,
  Users,
  ChevronRight,
  Star,
  Edit,
  BarChart4,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectService } from '../../../services/projectService';
import { Project, ProjectPayment } from '../../../types/database';
import ProjectCard from '../../../components/project/ProjectCard';

interface ProjectWithUI extends Project {
  funding_raised: number;
  investors: number;
  days_left: number;
  completion_percent?: number;
}

const FilmmakerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState<ProjectWithUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFundraised: 0,
    currentlyRaising: 0,
    totalProjects: 0,
    activeInvestors: 0
  });
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAllProjects();
        
        // Transform projects data
        const transformedProjects = data.map(project => ({
          ...project,
          funding_raised: project.project_payments?.reduce((sum: number, payment: ProjectPayment) => sum + payment.amount, 0) || 0,
          investors: project.project_payments?.length || 0,
          days_left: 30, // This should be calculated based on project end date
          completion_percent: project.status === 'production' ? 45 : undefined // This should be calculated based on actual progress
        }));
        
        setProjects(transformedProjects);
        
        // Calculate stats
        const totalFundraised = transformedProjects.reduce((sum, project) => sum + project.funding_raised, 0);
        const currentlyRaising = transformedProjects
          .filter(project => project.status === 'funding')
          .reduce((sum, project) => sum + (project.funding_goal - project.funding_raised), 0);
        const totalProjects = transformedProjects.length;
        const activeInvestors = transformedProjects.reduce((sum, project) => sum + project.investors, 0);
        
        setStats({
          totalFundraised,
          currentlyRaising,
          totalProjects,
          activeInvestors
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const recentActivity = [
    {
      id: 1,
      type: "investment",
      message: "New investor joined The Last Horizon",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "milestone",
      message: "Production milestone completed for Whispers in the Wind",
      time: "1 day ago"
    },
    {
      id: 3,
      type: "comment",
      message: "New investor comment on The Last Horizon",
      time: "2 days ago"
    }
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-8 min-h-screen bg-navy-950 mt-[50px]">
        <div className="max-w-7xl mx-auto">
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
    <div className="p-6 lg:p-8 min-h-screen bg-navy-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Filmmaker Dashboard</h1>
            <p className="text-gray-400">
              Manage your film projects and track funding progress
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              to="/filmmaker/new-project"
              className="flex items-center px-4 py-2 bg-gold-500 hover:bg-gold-600 text-navy-900 rounded-lg transition-colors"
            >
              <PlusCircle size={20} className="mr-2" />
              New Project
            </Link>
          </motion.div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Fundraised"
            value={`$${(stats.totalFundraised / 1000000).toFixed(1)}M`}
            icon={<DollarSign size={24} />}
            color="green"
            trend="+12.5% from last month"
            delay={0.1}
          />
          <StatsCard
            title="Currently Raising"
            value={`$${(stats.currentlyRaising / 1000000).toFixed(1)}M`}
            icon={<TrendingUp size={24} />}
            color="blue"
            trend="Active campaign"
            delay={0.2}
          />
          <StatsCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<Film size={24} />}
            color="purple"
            trend="1 in funding"
            delay={0.3}
          />
          <StatsCard
            title="Active Investors"
            value={stats.activeInvestors}
            icon={<Users size={24} />}
            color="amber"
            trend="+24 this month"
            delay={0.4}
          />
        </div>
        
        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-navy-800 rounded-xl border border-navy-700 mb-8"
        >
          <div className="p-6 border-b border-navy-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Projects</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeTab === 'all' 
                      ? 'bg-gold-500 text-navy-900' 
                      : 'bg-navy-700 text-white'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeTab === 'pending' 
                      ? 'bg-gold-500 text-navy-900' 
                      : 'bg-navy-700 text-white'
                  }`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => setActiveTab('active')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeTab === 'active' 
                      ? 'bg-gold-500 text-navy-900' 
                      : 'bg-navy-700 text-white'
                  }`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setActiveTab('completed')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeTab === 'completed' 
                      ? 'bg-gold-500 text-navy-900' 
                      : 'bg-navy-700 text-white'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {projects
              .filter(project => 
                activeTab === 'all' || 
                (activeTab === 'pending' && project.status === 'pending') ||
                (activeTab === 'active' && project.status === 'active') ||
                (activeTab === 'completed' && project.status === 'completed')
              )
              .map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Funding Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 bg-navy-800 rounded-xl border border-navy-700"
          >
            <div className="p-6 border-b border-navy-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Funding Overview</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-navy-700 rounded-md text-white">Weekly</button>
                  <button className="px-3 py-1 text-xs bg-gold-500 rounded-md text-navy-900">Monthly</button>
                  <button className="px-3 py-1 text-xs bg-navy-700 rounded-md text-white">Yearly</button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="h-64 flex items-center justify-center bg-navy-700/50 rounded-lg border border-navy-600">
                <div className="text-center">
                  <BarChart4 size={32} className="text-gold-500 mx-auto mb-2" />
                  <p className="text-white mb-2">Funding Chart</p>
                  {/* <p className="text-gray-400 text-sm">
                    In a real implementation, this would be a chart showing funding over time
                  </p> */}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-navy-800 rounded-xl border border-navy-700"
          >
            <div className="p-6 border-b border-navy-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                <button className="text-gold-500 hover:text-gold-400 text-sm flex items-center">
                  View All <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex p-3 bg-navy-700 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 mr-3">
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div>
                    <p className="text-sm text-white">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Active Projects Section - Now a standalone section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-navy-800 rounded-xl border border-navy-700"
        >
          <div className="p-6 border-b border-navy-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Active Projects</h2>
              <Link 
                to="/projects" 
                className="text-gold-500 hover:text-gold-400 text-sm flex items-center"
              >
                View All <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(project => project.status === 'active')
                .slice(0, 3)
                .map((project, index) => (
                  <div 
                    key={project.id} 
                    className="bg-navy-700 rounded-lg overflow-hidden border border-navy-600 hover:border-navy-500 transition-colors"
                  >
                    <div className="h-40 relative">
                      <img 
                        src={project.cover_image || "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg"} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-400">Active</span>
                      </div>
                      {/* <Link 
                        to={`/filmmaker/projects/${project.id}`}
                        className="absolute top-2 left-2 w-8 h-8 bg-navy-800/80 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-navy-700 transition-colors"
                      >
                        <Edit size={16} />
                      </Link> */}
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-medium mb-1">{project.title}</h3>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Funding Progress</span>
                          <span className="text-green-400 font-medium">
                            {Math.round((project.funding_raised / project.funding_goal) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-navy-600 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.round((project.funding_raised / project.funding_goal) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-2 text-gray-400">
                          <span>${(project.funding_raised / 1000000).toFixed(1)}M raised</span>
                          <span>{project.investors} investors</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              
              {projects.filter(project => project.status === 'active').length === 0 && (
                <div className="col-span-full text-center py-6">
                  <p className="text-gray-400">No active projects found.</p>
                  <Link 
                    to="/filmmaker/new-project" 
                    className="inline-block mt-3 text-gold-500 hover:text-gold-400"
                  >
                    Create a new project
                  </Link>
                </div>
              )}
            </div>
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

interface ActivityIconProps {
  type: string;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({ type }) => {
  switch (type) {
    case "investment":
      return <DollarSign size={20} className="text-green-400" />;
    case "milestone":
      return <Star size={20} className="text-blue-400" />;
    case "comment":
      return <Users size={20} className="text-purple-400" />;
    case "alert":
      return <AlertCircle size={20} className="text-amber-400" />;
    default:
      return <Film size={20} className="text-gray-400" />;
  }
};

export default FilmmakerDashboard;