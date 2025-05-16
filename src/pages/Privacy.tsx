import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  Key,
  Globe,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Database size={24} />,
      content: [
        {
          subtitle: "Personal Information",
          items: [
            "Name and contact details",
            "Government-issued ID for KYC",
            "Financial information",
            "Investment preferences"
          ]
        },
        {
          subtitle: "Technical Data",
          items: [
            "IP address and device information",
            "Browser type and settings",
            "Usage patterns and preferences",
            "Cookies and similar technologies"
          ]
        }
      ]
    },
    {
      title: "How We Use Your Data",
      icon: <Eye size={24} />,
      content: [
        {
          subtitle: "Core Services",
          items: [
            "Process investments and transactions",
            "Verify identity and compliance",
            "Provide customer support",
            "Send important updates"
          ]
        },
        {
          subtitle: "Platform Improvement",
          items: [
            "Analyze usage patterns",
            "Enhance user experience",
            "Develop new features",
            "Prevent fraud and abuse"
          ]
        }
      ]
    },
    {
      title: "Data Protection",
      icon: <Lock size={24} />,
      content: [
        {
          subtitle: "Security Measures",
          items: [
            "End-to-end encryption",
            "Regular security audits",
            "Access controls",
            "Secure data storage"
          ]
        },
        {
          subtitle: "Third-Party Security",
          items: [
            "Vendor assessment",
            "Data processing agreements",
            "Compliance monitoring",
            "Regular reviews"
          ]
        }
      ]
    },
    {
      title: "Your Rights",
      icon: <UserCheck size={24} />,
      content: [
        {
          subtitle: "Data Control",
          items: [
            "Access your personal data",
            "Request data correction",
            "Download your information",
            "Delete your account"
          ]
        },
        {
          subtitle: "Communication Preferences",
          items: [
            "Opt-out options",
            "Marketing preferences",
            "Notification settings",
            "Contact frequency"
          ]
        }
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
            src="https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg"
            alt="Data Privacy"
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
              <Lock size={40} className="text-gold-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300">
              Your privacy is our priority. Learn how we protect and manage your data.
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

          {/* Privacy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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

                <div className="grid md:grid-cols-2 gap-6">
                  {section.content.map((subsection, i) => (
                    <div key={i} className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        {subsection.subtitle}
                      </h3>
                      <ul className="space-y-2">
                        {subsection.items.map((item, j) => (
                          <li key={j} className="flex items-center text-gray-300">
                            <Shield size={16} className="text-gold-500 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Data Request Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-navy-800 rounded-xl p-8 border border-navy-700"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Your Data Rights
              </h2>
              <p className="text-gray-300">
                You have control over your personal data. Here's how you can exercise your rights:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-navy-700 rounded-lg p-6 text-center">
                <Key size={24} className="text-gold-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Access Data
                </h3>
                <p className="text-gray-400">
                  Request a copy of your personal information
                </p>
              </div>

              <div className="bg-navy-700 rounded-lg p-6 text-center">
                <Globe size={24} className="text-gold-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Update Info
                </h3>
                <p className="text-gray-400">
                  Modify or correct your personal details
                </p>
              </div>

              <div className="bg-navy-700 rounded-lg p-6 text-center">
                <Trash2 size={24} className="text-gold-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Delete Data
                </h3>
                <p className="text-gray-400">
                  Request removal of your information
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-navy-800 rounded-xl p-8 border border-navy-700 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about our privacy practices, please contact our data protection team.
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

export default Privacy;