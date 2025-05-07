import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight, Shield, Users, DollarSign } from 'lucide-react';
import { fetchGlobalStats, GlobalStats } from '../../services/projectService';

const VideoShowcase: React.FC = () => {
  const [stats, setStats] = useState<GlobalStats>({
    totalFunded: 0,
    globalInvestors: 0,
    filmProjects: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGlobalStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const features = [
    {
      title: "Secure Investment",
      description: "Fully compliant security tokens with smart contract distribution",
      icon: <Shield size={24} className="text-gold-500" />
    },
    {
      title: "Global Access",
      description: "Connect with investors and projects from around the world",
      icon: <Users size={24} className="text-gold-500" />
    },
    {
      title: "Transparent Returns",
      description: "Clear revenue sharing models and automated distributions",
      icon: <DollarSign size={24} className="text-gold-500" />
    }
  ];

  return (
    <section className="py-12 bg-navy-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-transparent opacity-50"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full bg-gold-500/5"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight
                ],
                scale: [1, 2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-video bg-navy-800 rounded-xl overflow-hidden relative group">
              <img 
                src="https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg"
                alt="Platform Demo"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                <motion.button
                  className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center text-navy-900 transition-transform duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={32} className="ml-1" />
                </motion.button>
              </div>
              
              {/* Decorative Elements */}
              <motion.div 
                className="absolute -top-4 -right-4 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -bottom-8 -left-8 w-48 h-48 bg-gold-500/10 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <motion.div
                className="bg-navy-800/80 backdrop-blur-sm rounded-lg p-3 text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {isLoading ? (
                    <div className="h-8 w-24 bg-navy-700 rounded animate-pulse"></div>
                  ) : (
                    `${stats.filmProjects.toLocaleString()}+`
                  )}
                </motion.div>
                <div className="text-sm text-gray-400">Projects</div>
              </motion.div>
              <motion.div
                className="bg-navy-800/80 backdrop-blur-sm rounded-lg p-3 text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {isLoading ? (
                    <div className="h-8 w-24 bg-navy-700 rounded animate-pulse"></div>
                  ) : (
                    `$${(stats.totalFunded / 1000000).toFixed(1)}M`
                  )}
                </motion.div>
                <div className="text-sm text-gray-400">Funded</div>
              </motion.div>
              <motion.div
                className="bg-navy-800/80 backdrop-blur-sm rounded-lg p-3 text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {isLoading ? (
                    <div className="h-8 w-24 bg-navy-700 rounded animate-pulse"></div>
                  ) : (
                    `${stats.globalInvestors.toLocaleString()}+`
                  )}
                </motion.div>
                <div className="text-sm text-gray-400">Investors</div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Experience the Future of Film Investment
            </h2>
            <p className="text-gray-300 mb-6 text-lg">
              Our platform revolutionizes film financing by connecting visionary filmmakers 
              with passionate investors through blockchain technology and security tokens.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="p-3 bg-navy-800 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <button className="group inline-flex items-center text-gold-500 hover:text-gold-400 transition-colors">
                <span>Learn more about our platform</span>
                <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;