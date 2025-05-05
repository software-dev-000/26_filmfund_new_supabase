import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Image,
  FileText,
  Film,
  Users,
  Award,
  Mail,
  Phone,
  Send
} from 'lucide-react';

const PressKit: React.FC = () => {
  const stats = [
    {
      value: "$120M+",
      label: "Total Funded",
      icon: <Film size={24} />
    },
    {
      value: "15K+",
      label: "Global Investors",
      icon: <Users size={24} />
    },
    {
      value: "250+",
      label: "Film Projects",
      icon: <Award size={24} />
    }
  ];

  const brandAssets = [
    {
      type: "Logo",
      formats: ["PNG", "SVG", "EPS"],
      preview: "https://images.pexels.com/photos/3756345/pexels-photo-3756345.jpeg",
      description: "Primary logo in full color, monochrome, and reversed variants."
    },
    {
      type: "Brand Guidelines",
      formats: ["PDF"],
      preview: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
      description: "Complete brand guidelines including typography, colors, and usage rules."
    },
    {
      type: "Product Screenshots",
      formats: ["PNG", "JPG"],
      preview: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
      description: "High-resolution screenshots of our platform and key features."
    }
  ];

  const pressReleases = [
    {
      date: "March 15, 2025",
      title: "FilmFund.io Raises $50M Series B to Revolutionize Film Financing",
      description: "Leading blockchain-based film financing platform secures major funding round."
    },
    {
      date: "February 1, 2025",
      title: "FilmFund.io Launches New Security Token Framework for Independent Films",
      description: "Innovative platform introduces compliant tokenization solution for film projects."
    },
    {
      date: "January 10, 2025",
      title: "FilmFund.io Partners with Major Studios for Blockchain Distribution",
      description: "Strategic partnership brings blockchain technology to film distribution."
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950"></div>
          <img 
            src="https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg"
            alt="Press Kit"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Press Kit & Media Resources
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Everything you need to tell the FilmFund.io story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#assets"
                className="inline-flex items-center bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Assets
              </a>
              <a 
                href="#contact"
                className="inline-flex items-center border border-gold-500 text-white hover:bg-navy-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Mail size={20} className="mr-2" />
                Media Inquiries
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section id="assets" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Brand Assets</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Download our official brand assets and guidelines.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brandAssets.map((asset, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl overflow-hidden border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="aspect-video relative">
                  <img 
                    src={asset.preview} 
                    alt={asset.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-navy-950/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                      <Download size={20} className="mr-2" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{asset.type}</h3>
                  <p className="text-gray-400 mb-4">{asset.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {asset.formats.map((format, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-navy-700 text-gray-300 rounded-full text-sm"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Latest Press Releases</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Stay up to date with our latest announcements and milestones.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {pressReleases.map((release, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-gold-500 mb-2">{release.date}</p>
                    <h3 className="text-xl font-bold text-white mb-2">{release.title}</h3>
                    <p className="text-gray-400">{release.description}</p>
                  </div>
                  <a 
                    href="#"
                    className="inline-flex items-center bg-navy-700 hover:bg-navy-600 text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    <FileText size={18} className="mr-2" />
                    Read More
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="bg-navy-800 rounded-xl p-8 text-center border border-navy-700 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Media Contact
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              For press inquiries, interview requests, or additional information, 
              please contact our media relations team.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-navy-700 rounded-lg p-6">
                <Mail size={24} className="text-gold-500 mb-4 mx-auto" />
                <h3 className="text-white font-medium mb-2">Email</h3>
                <a 
                  href="mailto:press@filmfund.io"
                  className="text-gold-500 hover:text-gold-400 transition-colors"
                >
                  press@filmfund.io
                </a>
              </div>
              <div className="bg-navy-700 rounded-lg p-6">
                <Phone size={24} className="text-gold-500 mb-4 mx-auto" />
                <h3 className="text-white font-medium mb-2">Phone</h3>
                <a 
                  href="tel:+15551234567"
                  className="text-gold-500 hover:text-gold-400 transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PressKit;