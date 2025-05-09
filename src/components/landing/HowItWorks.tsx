import React from 'react';
import { motion } from 'framer-motion';
import { Film, DollarSign, Users, BarChart4 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HowItWorks: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Determine the correct link destination based on auth status
  let getStartedLink = "/register";
  let getStartedText = "Join FilmFund.io";
  if(currentUser){
    if (currentUser.user_metadata.user_type === "investor"){
      getStartedLink = "/investor/dashboard";
    } else if (currentUser.user_metadata.user_type === "filmmaker" || currentUser.user_metadata.user_type === "admin"){
      getStartedLink = "/filmmaker/dashboard";
    } else if (currentUser.user_metadata.user_type === "superadmin"){
      getStartedLink = "/admin/dashboard";
    }
    getStartedText = "Go to Dashboard";
  }

  const steps = [
    {
      icon: <Film size={24} />,
      title: "Filmmakers Submit Projects",
      description: "Filmmakers upload project details, budgets, scripts, and team information for review by our curation team."
    },
    {
      icon: <Users size={24} />,
      title: "Investors Browse Opportunities",
      description: "Accredited investors explore curated film projects and their investment terms based on staking tier access."
    },
    {
      icon: <DollarSign size={24} />,
      title: "Compliant Security Tokens",
      description: "Once funded, projects issue security tokens fully compliant with jurisdictional regulations."
    },
    {
      icon: <BarChart4 size={24} />,
      title: "Revenue Distribution",
      description: "Smart contracts automatically distribute revenue to investors based on token ownership."
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
            Simple Process
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How FilmFund.io Works
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} step={index + 1} {...step} />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to={getStartedLink} 
            className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-md font-medium transition-colors"
          >
            {getStartedText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, step }) => {
  return (
    <motion.div 
      className="bg-navy-800 rounded-xl p-6 relative overflow-hidden border border-navy-700 h-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * step }}
    >
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-navy-700/50 z-0"></div>
      
      <div className="mb-4 p-3 bg-navy-700/50 rounded-lg inline-block text-gold-500 relative z-10">
        {icon}
      </div>
      
      <div className="absolute top-5 right-5 text-5xl font-bold text-navy-700 opacity-50">
        {step}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 flex-grow">{description}</p>
    </motion.div>
  );
};

export default HowItWorks;