import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle,
  DollarSign,
  Scale,
  FileText,
  AlertCircle,
  ExternalLink,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Disclaimer: React.FC = () => {
  const sections = [
    {
      title: "Investment Risks",
      icon: <AlertTriangle size={24} />,
      content: [
        "Film investments are highly speculative and involve substantial risk.",
        "You may lose some or all of your invested capital.",
        "Past performance is not indicative of future results.",
        "Returns are not guaranteed and can vary significantly."
      ]
    },
    {
      title: "Financial Advice",
      icon: <DollarSign size={24} />,
      content: [
        "FilmFund.io does not provide financial, investment, legal, or tax advice.",
        "Content on this platform is for informational purposes only.",
        "Consult with qualified professionals before making investment decisions.",
        "Consider your investment objectives and risk tolerance."
      ]
    },
    {
      title: "Legal Compliance",
      icon: <Scale size={24} />,
      content: [
        "Securities offered through FilmFund.io are subject to regulatory requirements.",
        "Investments may have restrictions on transfer and resale.",
        "Not all investors may qualify for certain investment opportunities.",
        "Compliance with securities regulations is mandatory."
      ]
    },
    {
      title: "Forward-Looking Statements",
      icon: <TrendingUp size={24} />,
      content: [
        "Projections and forecasts are based on assumptions.",
        "Actual results may differ materially from projections.",
        "Market conditions can impact investment performance.",
        "Economic factors may affect project outcomes."
      ]
    }
  ];

  const additionalInfo = [
    {
      title: "Due Diligence",
      description: "Investors are responsible for conducting their own due diligence before making investment decisions."
    },
    {
      title: "Market Conditions",
      description: "Film industry and market conditions can significantly impact investment outcomes."
    },
    {
      title: "Technology Risks",
      description: "Blockchain and smart contract technology may have inherent risks and limitations."
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950"></div>
          <img 
            src="https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg"
            alt="Legal Warning"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle size={40} className="text-gold-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Legal Disclaimer
            </h1>
            <p className="text-xl text-gray-300">
              Important information about risks and limitations of our platform.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-navy-800 rounded-xl p-6 border border-navy-700 mb-8"
          >
            <div className="flex items-center text-gray-400">
              <AlertCircle size={20} className="mr-2 text-gold-500" />
              Last updated: March 30, 2025
            </div>
          </motion.div> */}

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-500/10 border border-red-500 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start">
              <AlertTriangle size={24} className="text-red-500 mr-4 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-red-500 mb-2">
                  Important Notice
                </h2>
                <p className="text-gray-300">
                  This disclaimer contains important information about the risks of investing 
                  through our platform. Please read carefully before making any investment decisions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mr-4">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {section.content.map((item, i) => (
                    <div key={i} className="flex items-start">
                      <Shield size={20} className="text-gold-500 mr-3 mt-1" />
                      <p className="text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-navy-800 rounded-xl p-8 border border-navy-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Additional Considerations
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {additionalInfo.map((info, index) => (
                <div key={index} className="bg-navy-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {info.title}
                  </h3>
                  <p className="text-gray-400">
                    {info.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* External Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 bg-navy-800 rounded-xl p-8 border border-navy-700"
          >
            <div className="flex items-center mb-6">
              <FileText size={24} className="text-gold-500 mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Additional Resources
              </h2>
            </div>
            <div className="space-y-4">
              <Link 
                to="/terms"
                className="flex items-center justify-between p-4 bg-navy-700 rounded-lg hover:bg-navy-600 transition-colors"
              >
                <span className="text-white">Terms of Service</span>
                <ExternalLink size={20} className="text-gold-500" />
              </Link>
              <Link 
                to="/privacy"
                className="flex items-center justify-between p-4 bg-navy-700 rounded-lg hover:bg-navy-600 transition-colors"
              >
                <span className="text-white">Privacy Policy</span>
                <ExternalLink size={20} className="text-gold-500" />
              </Link>
              <Link 
                to="/contact"
                className="flex items-center justify-between p-4 bg-navy-700 rounded-lg hover:bg-navy-600 transition-colors"
              >
                <span className="text-white">Contact Legal Team</span>
                <ExternalLink size={20} className="text-gold-500" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;