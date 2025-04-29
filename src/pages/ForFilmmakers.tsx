import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Shield, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const ForFilmmakers: React.FC = () => {
  const { currentUser, userType } = useAuth();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleGetStarted = () => {
    if (currentUser) {
      if (userType !== 'filmmaker') {
        error('You are not registered as a filmmaker', 
          'Please register as a filmmaker to access this feature.',
          { label: 'Register', onClick: () => navigate('/register') }
        );
        return;
      }
      navigate('/filmmaker/dashboard');
    } else {
      navigate('/register');
    }
  };

  const benefits = [
    {
      icon: <Globe size={24} />,
      title: "Global Reach",
      description: "Access a worldwide network of investors passionate about film."
    },
    {
      icon: <DollarSign size={24} />,
      title: "Efficient Fundraising",
      description: "Streamlined process to raise capital with transparent terms."
    },
    {
      icon: <Shield size={24} />,
      title: "Legal Compliance",
      description: "Built-in regulatory compliance and legal framework."
    },
    {
      icon: <Users size={24} />,
      title: "Community Building",
      description: "Connect with fans and build a dedicated audience."
    }
  ];

  const features = [
    {
      title: "Project Dashboard",
      description: "Track fundraising progress, investor communications, and project milestones.",
      image: "https://images.pexels.com/photos/7376/startup-photos.jpg"
    },
    {
      title: "Marketing Tools",
      description: "Built-in tools to promote your project and engage with potential investors.",
      image: "https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg"
    },
    {
      title: "Legal Templates",
      description: "Access standardized legal documents and agreements.",
      image: "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
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
              Empower Your Film Project
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Access the capital and resources you need to bring your vision to life through 
              our innovative film financing platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGetStarted}
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Submit Your Project
              </button>
              <Link 
                to="/contact" 
                className="border border-gold-500 text-white hover:bg-navy-700 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Schedule a Call
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
            Why Choose FilmFund.io
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

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl overflow-hidden border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
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
              Ready to Fund Your Film?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join FilmFund.io today and connect with investors who believe in your vision.
            </p>
            <button 
              onClick={handleGetStarted}
              className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-md font-medium transition-colors inline-block"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ForFilmmakers;