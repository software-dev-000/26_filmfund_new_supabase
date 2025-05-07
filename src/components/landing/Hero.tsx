import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-900/80 to-navy-950/95 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 transform"
        >
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
        </video>
      </div>

      {/* Animated Film Reels Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-16 rounded-full bg-gold-500/10 backdrop-blur-sm"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight
                ],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.div
                className="w-full h-full rounded-full bg-gold-500/20"
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="w-full h-full rounded-full border-2 border-dashed border-gold-500/30 relative">
                  <div className="absolute inset-2 border-2 border-gold-500/20 rounded-full"></div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
            </span>
            <span className="text-gold-500 font-medium mr-2">Now Live</span>
            <span className="text-gray-400 block sm:inline">Join the revolution in film financing</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mt-10 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            The Future of{' '}
            <span className="relative inline-block">
              <span className="text-gold-500">Film Financing</span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-gold-500/0 via-gold-500/50 to-gold-500/0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              ></motion.span>
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Connect with global investors through secure, tokenized film financing.
            Transform your creative vision into reality.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              to="/register" 
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gold-500 px-8 py-3 font-medium text-navy-900 transition-all duration-300 hover:bg-gold-400 hover:scale-[1.02] active:scale-[0.98]"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="relative flex items-center">
                Get Started
                <ChevronRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
            
            <Link 
              to="/how-it-works" 
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg px-8 py-3 font-medium"
            >
              <span className="absolute inset-0 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10"></span>
              <span className="absolute inset-0 border border-white/10 rounded-lg"></span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-gold-500/20 via-transparent to-gold-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
              <span className="relative flex items-center text-white">
                <Play size={18} className="mr-2 transition-transform duration-300 group-hover:scale-110" />
                Watch Demo
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;