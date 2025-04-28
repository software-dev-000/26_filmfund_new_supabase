import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  TrendingUp,
  Globe,
  BarChart4, 
  Users, 
  Lock,
  Film,
  DollarSign
} from 'lucide-react';

const Benefits: React.FC = () => {
  const investorBenefits = [
    {
      icon: <Shield size={30} />,
      title: "Regulatory Compliance",
      description: "All investments are structured as compliant security tokens following relevant securities laws."
    },
    {
      icon: <TrendingUp size={30} />,
      title: "Transparent Returns",
      description: "Clear revenue sharing models with automatic distribution via smart contracts."
    },
    {
      icon: <Globe size={30} />,
      title: "Global Access",
      description: "Invest in film projects from anywhere in the world with proper jurisdictional compliance."
    }
  ];
  
  const filmmakerBenefits = [
    {
      icon: <BarChart4 size={30} />,
      title: "Efficient Fundraising",
      description: "Reach qualified investors globally and track fundraising progress in real time."
    },
    {
      icon: <Users size={30} />,
      title: "Community Building",
      description: "Connect with investors who become advocates for your project's success."
    },
    {
      icon: <Lock size={30} />,
      title: "Creative Control",
      description: "Maintain creative integrity while accessing the capital needed to produce your vision."
    }
  ];

  return (
    <section className="py-20 bg-navy-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.span
            className="text-gold-500 font-medium mb-2 block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Choose FilmFund.io
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Benefits for All Stakeholders
          </motion.h2>
          <motion.p
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our platform creates value for both investors and filmmakers through 
            tokenized film financing and distribution.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <motion.h3 
              className="text-2xl font-bold text-white mb-8 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <DollarSign size={24} className="text-gold-500 mr-2" />
              For Investors
            </motion.h3>
            
            <div className="space-y-8">
              {investorBenefits.map((benefit, index) => (
                <BenefitCard key={index} {...benefit} index={index} direction="left" />
              ))}
            </div>
          </div>
          
          <div>
            <motion.h3 
              className="text-2xl font-bold text-white mb-8 flex items-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Film size={24} className="text-gold-500 mr-2" />
              For Filmmakers
            </motion.h3>
            
            <div className="space-y-8">
              {filmmakerBenefits.map((benefit, index) => (
                <BenefitCard key={index} {...benefit} index={index} direction="right" />
              ))}
            </div>
          </div>
        </div>
        
        <motion.div 
          className="mt-16 p-8 bg-navy-800 rounded-xl border border-navy-700 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join FilmFund.io today and become part of the future of film financing.
            Whether you're an investor or filmmaker, we have the tools you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register" 
              className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Create Account
            </a>
            <a 
              href="/contact" 
              className="border border-gold-500 text-white hover:bg-navy-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  direction: 'left' | 'right';
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, index, direction }) => {
  return (
    <motion.div 
      className="flex gap-4"
      initial={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * (index + 1) }}
    >
      <div className="flex-shrink-0 p-4 bg-navy-800 rounded-lg text-gold-500">
        {icon}
      </div>
      
      <div>
        <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
};

export default Benefits;