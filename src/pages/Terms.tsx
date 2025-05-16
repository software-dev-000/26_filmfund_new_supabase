import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using FilmFund.io, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
        "These terms may be modified or updated at any time without notice. Your continued use of the platform following any changes indicates your acceptance of such changes."
      ]
    },
    {
      title: "2. Investment Risks",
      content: [
        "Film investments involve substantial risks and are not suitable for all investors.",
        "Past performance is not indicative of future results.",
        "You should only invest capital that you are willing to lose entirely.",
        "We strongly recommend consulting with financial and legal advisors before making any investment decisions."
      ]
    },
    {
      title: "3. User Accounts",
      content: [
        "You must be at least 18 years old to use this service.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You agree to provide accurate and complete information during registration.",
        "We reserve the right to suspend or terminate accounts that violate our terms."
      ]
    },
    {
      title: "4. Security Tokens",
      content: [
        "All film investments are structured as security tokens.",
        "Token holders are subject to applicable securities regulations.",
        "Tokens may have transfer restrictions and lock-up periods.",
        "Smart contracts govern the distribution of returns."
      ]
    },
    {
      title: "5. Intellectual Property",
      content: [
        "All content on FilmFund.io is protected by copyright and other intellectual property laws.",
        "You may not reproduce, distribute, or create derivative works without our express permission.",
        "Project materials are confidential and subject to non-disclosure agreements."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950"></div>
          <img 
            src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg"
            alt="Legal Document"
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
              <Shield size={40} className="text-gold-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300">
              Please read these terms carefully before using our platform.
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

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.content.map((paragraph, i) => (
                    <div key={i} className="flex items-start">
                      <Check size={20} className="text-gold-500 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-gray-300">{paragraph}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-navy-800 rounded-xl p-8 border border-navy-700 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions About Our Terms?
            </h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about these terms, please contact our legal team.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Terms;