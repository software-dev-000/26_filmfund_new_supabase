import React from 'react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 z-0"></div>
      
      {/* Film grain overlay */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3552472/pexels-photo-3552472.jpeg')] opacity-10 mix-blend-overlay z-0"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-6 items-center">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                The Future of <span className="text-gold-500">Film Financing</span> is Here
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                FilmFund.io connects filmmakers with global investors through 
                compliant security tokens, revolutionizing how films get funded.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors"
                >
                  Get Started
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="border border-gold-500 text-white hover:bg-navy-800 px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors"
                >
                  <Play size={18} className="mr-2" />
                  How It Works
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-12 grid grid-cols-3 gap-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="p-4">
                <p className="text-3xl font-bold text-gold-500 mb-1">$120M+</p>
                <p className="text-sm text-gray-400">Funds Raised</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-gold-500 mb-1">250+</p>
                <p className="text-sm text-gray-400">Film Projects</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-gold-500 mb-1">15K+</p>
                <p className="text-sm text-gray-400">Investors</p>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative">
              <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-1">
                <img 
                  src="https://images.pexels.com/photos/7234263/pexels-photo-7234263.jpeg" 
                  alt="Dashboard Preview" 
                  className="rounded-lg w-full shadow-2xl"
                />
              </div>
              
              {/* Feature highlights */}
              <FeatureBadge 
                icon={<TrendingUp size={16} />}
                text="Real-time funding analytics"
                position="top-left"
              />
              <FeatureBadge 
                icon={<Shield size={16} />}
                text="Regulatory compliant"
                position="bottom-right"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface FeatureBadgeProps {
  icon: React.ReactNode;
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, text, position }) => {
  const positionClasses = {
    'top-left': '-top-4 -left-4',
    'top-right': '-top-4 -right-4',
    'bottom-left': '-bottom-4 -left-4',
    'bottom-right': '-bottom-4 -right-4'
  };
  
  return (
    <motion.div 
      className={`absolute ${positionClasses[position]} bg-navy-800 text-white rounded-full px-4 py-2 flex items-center shadow-lg border border-navy-700`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <span className="mr-2 text-gold-500">{icon}</span>
      {text}
    </motion.div>
  );
};

export default Hero;