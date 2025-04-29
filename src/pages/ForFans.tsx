import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Gift, Ticket, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const ForFans: React.FC = () => {
  const { currentUser, userType } = useAuth();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleGetStarted = () => {
    if (currentUser) {
      if (userType !== 'investor') {
        error('You are not registered as an investor', 
          'Please register as an investor to access this feature.',
          { label: 'Register', onClick: () => navigate('/register') }
        );
        return;
      }
      navigate('/investor/dashboard');
    } else {
      navigate('/register');
    }
  };

  const benefits = [
    {
      icon: <Star size={24} />,
      title: "Exclusive Access",
      description: "Get behind-the-scenes content and early access to film releases."
    },
    {
      icon: <Gift size={24} />,
      title: "Special Perks",
      description: "Receive unique rewards and experiences based on your investment level."
    },
    {
      icon: <Ticket size={24} />,
      title: "Premier Events",
      description: "Attend film premieres and exclusive screenings."
    },
    {
      icon: <Users size={24} />,
      title: "Community",
      description: "Connect with other film enthusiasts and creators."
    }
  ];

  const tiers = [
    {
      name: "Silver Fan",
      price: "500",
      benefits: [
        "Access to exclusive content",
        "Quarterly virtual meetups",
        "Digital copy of the film",
        "Name in credits"
      ]
    },
    {
      name: "Gold Fan",
      price: "2,500",
      benefits: [
        "All Silver benefits",
        "Set visit opportunity",
        "Limited edition merchandise",
        "Meet & greet with cast"
      ]
    },
    {
      name: "Platinum Fan",
      price: "10,000",
      benefits: [
        "All Gold benefits",
        "Executive producer credit",
        "Premiere tickets",
        "Private screening rights"
      ]
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
              Be Part of the Movies You Love
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Support independent films, get exclusive access, and earn returns on successful projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <button 
                  onClick={handleGetStarted}
                  className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Join Now
                </button>
              ) : (
                <Link 
                  to="/register" 
                  className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Join Now
                </Link>
              )}
              <Link 
                to="/projects" 
                className="border border-gold-500 text-white hover:bg-navy-700 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Browse Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2 
            className="text-3xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Fan Benefits
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2 
            className="text-3xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Investment Tiers
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-gold-500 text-3xl font-bold mb-6">
                  ${tier.price}
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <CheckCircle size={16} className="text-gold-500 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={handleGetStarted}
                  className="block w-full bg-navy-700 hover:bg-navy-600 text-white text-center py-2 rounded-md transition-colors"
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="bg-navy-800 rounded-xl p-8 text-center border border-navy-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Join the Film Revolution
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Become part of the next generation of film financing and enjoy exclusive benefits.
            </p>
            <button 
              onClick={handleGetStarted}
              className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-md font-medium transition-colors inline-block"
            >
              Start Investing
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ForFans;