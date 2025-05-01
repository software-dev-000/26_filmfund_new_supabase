import React from 'react';
import { motion } from 'framer-motion';
import { 
  Film, 
  Users, 
  Shield, 
  AlertTriangle,
  ChevronRight,
  Check,
  X,
  Eye,
  TrendingUp,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  // Mock data - in a real app, this would come from your backend
  const stats = {
    totalProjects: 250,
    activeUsers: 15632,
    pendingApprovals: 12,
    complianceAlerts: 3
  };
  
  const pendingApprovals = [
    {
      id: 1,
      title: "Urban Legends",
      type: "Project",
      filmmaker: "David Johnson",
      submitted: "2025-03-18",
      image: "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg"
    },
    {
      id: 2,
      title: "Blue Skies",
      type: "Project",
      filmmaker: "Emily Chen",
      submitted: "2025-03-17",
      image: "https://images.pexels.com/photos/1693095/pexels-photo-1693095.jpeg"
    },
    {
      id: 3,
      title: "Maria Lopez",
      type: "Filmmaker Verification",
      submitted: "2025-03-16"
    }
  ];
  
  const recentActivity = [
    {
      id: 1,
      action: "Project Approved",
      target: "The Last Horizon",
      admin: "Admin1",
      time: "1 hour ago"
    },
    {
      id: 2,
      action: "KYC Verification",
      target: "John Smith",
      admin: "Admin2",
      time: "3 hours ago"
    },
    {
      id: 3,
      action: "Jurisdiction Update",
      target: "Platform Settings",
      admin: "Admin1",
      time: "Yesterday"
    }
  ];
  
  const complianceAlerts = [
    {
      id: 1,
      issue: "Missing KYC documentation",
      user: "Investor #5423",
      severity: "High",
      time: "1 day ago"
    },
    {
      id: 2,
      issue: "Jurisdiction conflict in project listing",
      project: "Midnight in Tokyo",
      severity: "Medium",
      time: "2 days ago"
    },
    {
      id: 3,
      issue: "Security token configuration needs review",
      project: "Beyond the Edge",
      severity: "Low",
      time: "3 days ago"
    }
  ];

  return (
    <div className="container mx-auto p-6 lg:p-8 min-h-screen bg-navy-950">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">
            Platform management and compliance oversight.
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
      
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<Film size={24} />}
          color="blue"
          delay={0.1}
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={<Users size={24} />}
          color="green"
          delay={0.2}
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<Shield size={24} />}
          color="amber"
          delay={0.3}
        />
        <StatsCard
          title="Compliance Alerts"
          value={stats.complianceAlerts}
          icon={<AlertTriangle size={24} />}
          color="red"
          delay={0.4}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-navy-800 rounded-xl p-6 lg:col-span-2 border border-navy-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Pending Approvals</h2>
            <button className="text-gold-500 hover:text-gold-400 text-sm flex items-center">
              View All <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {pendingApprovals.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center p-4 bg-navy-700 rounded-lg hover:bg-navy-600 transition-colors"
              >
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-12 h-12 rounded-md object-cover mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-navy-600 flex items-center justify-center mr-4 text-gold-500">
                    <Users size={24} />
                  </div>
                )}
                
                <div className="flex-grow">
                  <div className="flex items-center">
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-navy-600 text-gray-300">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {item.filmmaker ? `Submitted by ${item.filmmaker} • ` : ''}
                    {new Date(item.submitted).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full bg-green-800/30 text-green-400 hover:bg-green-800/50 transition-colors">
                    <Check size={16} />
                  </button>
                  <button className="p-2 rounded-full bg-red-800/30 text-red-400 hover:bg-red-800/50 transition-colors">
                    <X size={16} />
                  </button>
                  <button className="p-2 rounded-full bg-navy-600 text-white hover:bg-navy-500 transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Platform Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-navy-800 rounded-xl p-6 border border-navy-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <button className="text-gold-500 hover:text-gold-400 text-sm flex items-center">
              View Log <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className="p-3 bg-navy-700 rounded-lg"
              >
                <div className="flex justify-between mb-1">
                  <span className="text-white font-medium">{activity.action}</span>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-300">{activity.target}</p>
                <p className="text-xs text-gray-400">by {activity.admin}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Compliance Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-navy-800 rounded-xl p-6 mb-8 border border-navy-700"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Compliance Alerts</h2>
          <button className="text-gold-500 hover:text-gold-400 text-sm flex items-center">
            View All Alerts <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-navy-600">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-600">
              {complianceAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-navy-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{alert.issue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {alert.user || alert.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{alert.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-gold-500 hover:text-gold-400">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Platform Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-navy-800 rounded-xl p-6 border border-navy-700"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Platform Growth</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-navy-700 rounded-md text-white">Daily</button>
            <button className="px-3 py-1 text-xs bg-gold-500 rounded-md text-navy-900">Weekly</button>
            <button className="px-3 py-1 text-xs bg-navy-700 rounded-md text-white">Monthly</button>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center bg-navy-700/50 rounded-lg border border-navy-600">
          <div className="text-center">
            <TrendingUp size={32} className="text-gold-500 mx-auto mb-2" />
            <p className="text-white mb-2">Growth Chart</p>
            <p className="text-gray-400 text-sm">
              In a real implementation, this would be a chart showing platform growth metrics
            </p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-navy-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">New Users</p>
            <p className="text-white font-bold">+248</p>
            <p className="text-green-400 text-xs">+12.5%</p>
          </div>
          <div className="bg-navy-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">New Projects</p>
            <p className="text-white font-bold">+32</p>
            <p className="text-green-400 text-xs">+8.3%</p>
          </div>
          <div className="bg-navy-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Transactions</p>
            <p className="text-white font-bold">+183</p>
            <p className="text-green-400 text-xs">+15.2%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  delay: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, delay }) => {
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
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
};

interface SeverityBadgeProps {
  severity: string;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  switch (severity) {
    case "High":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400">
          High
        </span>
      );
    case "Medium":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/30 text-amber-400">
          Medium
        </span>
      );
    case "Low":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
          Low
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
          {severity}
        </span>
      );
  }
};

export default AdminDashboard;