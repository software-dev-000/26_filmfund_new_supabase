import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, BarChart as ChartBar, CheckCircle, Wallet, FileText, Lock, BarChart4 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const { currentUser } = useAuth();

  const steps = [
    {
      icon: <FileText size={24} />,
      title: "Submit Your Project",
      description: "Filmmakers submit detailed project proposals including script, budget, team, and timeline.",
      details: [
        "Complete project documentation",
        "Financial projections and budgets",
        "Team credentials and track record",
        "Marketing and distribution strategy"
      ]
    },
    {
      icon: <Shield size={24} />,
      title: "Compliance Review",
      description: "Our team ensures all projects meet regulatory requirements and platform standards.",
      details: [
        "Legal and regulatory compliance",
        "Project viability assessment",
        "Risk analysis and mitigation",
        "Security token structure review"
      ]
    },
    {
      icon: <Wallet size={24} />,
      title: "Token Structure",
      description: "Projects are structured as compliant security tokens with clear terms and conditions.",
      details: [
        "Revenue sharing model",
        "Investor rights and protections",
        "Distribution waterfall",
        "Exit mechanisms"
      ]
    },
    {
      icon: <Users size={24} />,
      title: "Investor Access",
      description: "Qualified investors can browse and invest in projects based on their staking tier.",
      details: [
        "KYC/AML verification",
        "Accreditation status",
        "Investment limits",
        "Portfolio management"
      ]
    }
  ];

  const benefits = [
    {
      icon: <Lock size={24} />,
      title: "Regulatory Compliance",
      description: "All investments are structured as compliant security tokens following relevant securities laws."
    },
    {
      icon: <BarChart4 size={24} />,
      title: "Transparent Returns",
      description: "Clear revenue sharing models with automatic distribution via smart contracts."
    },
    {
      icon: <ChartBar size={24} />,
      title: "Portfolio Tracking",
      description: "Real-time monitoring of your film investments and returns."
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950"></div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How FilmFund.io Works
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              A revolutionary platform connecting filmmakers with investors through 
              secure, compliant tokenized film financing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mr-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-gray-300 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <CheckCircle size={16} className="text-gold-500 mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2 
            className="text-3xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Platform Benefits
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="bg-navy-800 rounded-xl p-8 text-center border border-navy-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join FilmFund.io today and become part of the future of film financing.
              Whether you're an investor or filmmaker, we have the tools you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <Link 
                  to={`/${currentUser.user_metadata.user_type}/dashboard`}
                  className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link 
                  to="/register" 
                  className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Create Account
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
    </div>
  );
};

export default HowItWorks;