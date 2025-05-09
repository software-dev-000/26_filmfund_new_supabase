import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flag,
  CheckCircle,
  Clock,
  Rocket,
  Globe,
  Users,
  Shield,
  Zap,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Roadmap: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Determine the correct link destination based on auth status
  let getStartedLink = "/register";
  if(currentUser){
    if (currentUser.user_metadata.user_type === "investor"){
      getStartedLink = "/investor/dashboard";
    } else if (currentUser.user_metadata.user_type === "filmmaker" || currentUser.user_metadata.user_type === "admin"){
      getStartedLink = "/filmmaker/dashboard";
    } else if (currentUser.user_metadata.user_type === "superadmin"){
      getStartedLink = "/admin/dashboard";
    }
  }

  const [stats, setStats] = useState({
    activeUsers: 0,
    projectsFunded: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch total number of users
        const { count: userCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Fetch total number of funded projects
        const { count: projectCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'funded');

        setStats({
          activeUsers: userCount || 0,
          projectsFunded: projectCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const phases = [
    {
      title: "Phase 1: Foundation",
      status: "completed",
      date: "Q4 2024",
      milestones: [
        "Platform architecture development",
        "Smart contract audits",
        "Initial team formation",
        "Regulatory compliance framework"
      ]
    },
    {
      title: "Phase 2: Launch",
      status: "completed",
      date: "Q1 2025",
      milestones: [
        "Token generation event",
        "Platform beta release",
        "First film projects onboarding",
        "Community building initiatives"
      ]
    },
    {
      title: "Phase 3: Growth",
      status: "in-progress",
      date: "Q2 2025",
      milestones: [
        "Major studio partnerships",
        "Enhanced security features",
        "Mobile app development",
        "International market expansion"
      ]
    },
    {
      title: "Phase 4: Expansion",
      status: "upcoming",
      date: "Q3 2025",
      milestones: [
        "NFT marketplace launch",
        "Cross-chain integration",
        "Advanced analytics dashboard",
        "Institutional investor program"
      ]
    },
    {
      title: "Phase 5: Innovation",
      status: "upcoming",
      date: "Q4 2025",
      milestones: [
        "AI-powered project evaluation",
        "Decentralized governance",
        "Secondary market launch",
        "Global film festival partnerships"
      ]
    }
  ];

  const achievements = [
    {
      icon: <Globe size={24} />,
      title: "Global Reach",
      value: "25+ Countries"
    },
    {
      icon: <Users size={24} />,
      title: "Active Users",
      value: isLoading ? "..." : `${stats.activeUsers.toLocaleString()}+`
    },
    {
      icon: <Shield size={24} />,
      title: "Security Score",
      value: "A+"
    },
    {
      icon: <Zap size={24} />,
      title: "Projects Funded",
      value: isLoading ? "..." : `${stats.projectsFunded.toLocaleString()}+`
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950"></div>
          <img 
            src="https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg"
            alt="Roadmap"
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
              Our Journey & Vision
            </h1>
            <p className="text-xl text-gray-300">
              Mapping the future of decentralized film financing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                  {achievement.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoading && (achievement.title === "Active Users" || achievement.title === "Projects Funded") ? (
                    <div className="h-8 w-24 bg-navy-700 rounded animate-pulse"></div>
                  ) : (
                    achievement.value
                  )}
                </div>
                <div className="text-gray-400">{achievement.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Development Roadmap</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our strategic plan for revolutionizing the film financing industry.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-8">
                  <div className="flex-shrink-0 w-32">
                    <div className="text-gold-500 font-medium">{phase.date}</div>
                  </div>
                  <div className="flex-grow ml-8 bg-navy-800 rounded-xl p-6 border border-navy-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        phase.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : phase.status === 'in-progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {phase.status === 'completed' && <CheckCircle size={16} className="inline mr-1" />}
                        {phase.status === 'in-progress' && <Clock size={16} className="inline mr-1" />}
                        {phase.status === 'upcoming' && <Rocket size={16} className="inline mr-1" />}
                        {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {phase.milestones.map((milestone, i) => (
                        <div key={i} className="flex items-center text-gray-300">
                          <ChevronRight size={16} className="text-gold-500 mr-2" />
                          {milestone}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {index < phases.length - 1 && (
                  <div className="absolute left-16 top-16 bottom-0 w-px bg-navy-700"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Our Vision for the Future
              </h2>
              <p className="text-gray-300 mb-6">
                We're building a future where film financing is accessible, transparent, 
                and efficient. Our platform bridges the gap between filmmakers and investors, 
                creating new opportunities for both creative expression and financial returns.
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <Flag size={20} className="text-gold-500 mr-3" />
                  Democratizing film investment opportunities
                </div>
                <div className="flex items-center text-gray-300">
                  <Shield size={20} className="text-gold-500 mr-3" />
                  Ensuring regulatory compliance and security
                </div>
                <div className="flex items-center text-gray-300">
                  <Globe size={20} className="text-gold-500 mr-3" />
                  Expanding global access to film financing
                </div>
                <div className="flex items-center text-gray-300">
                  <Users size={20} className="text-gold-500 mr-3" />
                  Building a vibrant film investment community
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg"
                alt="Future of Film"
                className="rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent rounded-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="bg-navy-800 rounded-xl p-8 text-center border border-navy-700 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Be Part of Our Journey
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join us in revolutionizing the film industry through blockchain technology 
              and decentralized finance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to={getStartedLink} 
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
              <Link 
                to="/contact" 
                className="border border-gold-500 text-white hover:bg-navy-700 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Roadmap;