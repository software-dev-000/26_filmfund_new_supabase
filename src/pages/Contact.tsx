import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  User, 
  Send,
  Linkedin,
  Facebook,
  Instagram
} from 'lucide-react';
import XIcon from '@mui/icons-material/X';
import TelegramIcon from '@mui/icons-material/Telegram';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Implement form submission logic here
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setLoading(false);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email",
      details: "contact@filmfund.io",
      link: "mailto:contact@filmfund.io"
    },
    {
      icon: <Phone size={24} />,
      title: "Phone",
      details: "+33 (758) 42-67-04",
      link: "tel:+33758426704"
    },
    {
      icon: <MapPin size={24} />,
      title: "Office",
      details: "Currently remote",
      link: "#"
    }
  ];

  const socialLinks = [
    { icon: <XIcon style={{ fontSize: 20 }} />, to: "https://x.com/FilmFund_DM/", label: "Twitter" },
    { icon: <Linkedin size={20} />, to: "https://www.linkedin.com/company/filmfund-io/", label: "LinkedIn" },
    { icon: <Instagram size={20} />, to: "https://www.instagram.com/filmfund.io_/", label: "Instagram" },
    { icon: <Facebook size={20} />, to: "https://www.facebook.com/filmfund.io/", label: "Facebook" },
    { icon: <TelegramIcon style={{ fontSize: 20 }} />, to: "https://t.me/FilmFundCommunity/", label: "Telegram" },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28" height="28" viewBox="0,0,256,256">
      <g fill="#f4f0e7" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" ><g transform="scale(8,8)"><path d="M12.65625,4.90625l-0.78125,0.09375c0,0 -3.50391,0.38281 -6.0625,2.4375h-0.03125l-0.03125,0.03125c-0.57422,0.52734 -0.82422,1.17578 -1.21875,2.125c-0.39453,0.94922 -0.81641,2.16016 -1.1875,3.5c-0.74219,2.68359 -1.34375,5.93359 -1.34375,8.90625v0.25l0.125,0.25c0.92578,1.625 2.57031,2.66016 4.09375,3.375c1.52344,0.71484 2.83984,1.09375 3.75,1.125l0.59375,0.03125l0.3125,-0.53125l1.09375,-1.9375c1.16016,0.26172 2.49609,0.4375 4.03125,0.4375c1.53516,0 2.87109,-0.17578 4.03125,-0.4375l1.09375,1.9375l0.3125,0.53125l0.59375,-0.03125c0.91016,-0.03125 2.22656,-0.41016 3.75,-1.125c1.52344,-0.71484 3.16797,-1.75 4.09375,-3.375l0.125,-0.25v-0.25c0,-2.97266 -0.60156,-6.22266 -1.34375,-8.90625c-0.37109,-1.33984 -0.79297,-2.55078 -1.1875,-3.5c-0.39453,-0.94922 -0.64453,-1.59766 -1.21875,-2.125l-0.03125,-0.03125h-0.03125c-2.55859,-2.05469 -6.0625,-2.4375 -6.0625,-2.4375l-0.78125,-0.09375l-0.28125,0.71875c0,0 -0.28906,0.73047 -0.46875,1.5625c-1.13281,-0.15234 -2.05859,-0.1875 -2.59375,-0.1875c-0.53516,0 -1.46094,0.03516 -2.59375,0.1875c-0.17969,-0.83203 -0.46875,-1.5625 -0.46875,-1.5625zM11.28125,7.1875c0.04297,0.14063 0.08594,0.26172 0.125,0.375c-1.29297,0.32031 -2.67187,0.80859 -3.9375,1.59375l1.0625,1.6875c2.59375,-1.60937 6.32031,-1.84375 7.46875,-1.84375c1.14844,0 4.875,0.23438 7.46875,1.84375l1.0625,-1.6875c-1.26562,-0.78516 -2.64453,-1.27344 -3.9375,-1.59375c0.03906,-0.11328 0.08203,-0.23437 0.125,-0.375c0.93359,0.1875 2.71484,0.61719 4.1875,1.78125c-0.00781,0.00391 0.375,0.58203 0.71875,1.40625c0.35156,0.84766 0.74219,1.97656 1.09375,3.25c0.67578,2.44141 1.20703,5.41406 1.25,8.03125c-0.62891,0.96094 -1.79687,1.82813 -3.03125,2.40625c-1.07812,0.50391 -1.92969,0.6875 -2.4375,0.78125l-0.5,-0.84375c0.29688,-0.10937 0.58984,-0.23047 0.84375,-0.34375c1.53906,-0.67578 2.375,-1.40625 2.375,-1.40625l-1.3125,-1.5c0,0 -0.5625,0.51563 -1.875,1.09375c-1.3125,0.57813 -3.31641,1.15625 -6.03125,1.15625c-2.71484,0 -4.71875,-0.57812 -6.03125,-1.15625c-1.3125,-0.57812 -1.875,-1.09375 -1.875,-1.09375l-1.3125,1.5c0,0 0.83594,0.73047 2.375,1.40625c0.25391,0.11328 0.54688,0.23438 0.84375,0.34375l-0.5,0.84375c-0.50781,-0.09375 -1.35937,-0.27734 -2.4375,-0.78125c-1.23437,-0.57812 -2.40234,-1.44531 -3.03125,-2.40625c0.04297,-2.61719 0.57422,-5.58984 1.25,-8.03125c0.35156,-1.27344 0.74219,-2.40234 1.09375,-3.25c0.34375,-0.82422 0.72656,-1.40234 0.71875,-1.40625c1.47266,-1.16406 3.25391,-1.59375 4.1875,-1.78125zM12.5,14c-0.77344,0 -1.45703,0.44141 -1.875,1c-0.41797,0.55859 -0.625,1.24609 -0.625,2c0,0.75391 0.20703,1.44141 0.625,2c0.41797,0.55859 1.10156,1 1.875,1c0.77344,0 1.45703,-0.44141 1.875,-1c0.41797,-0.55859 0.625,-1.24609 0.625,-2c0,-0.75391 -0.20703,-1.44141 -0.625,-2c-0.41797,-0.55859 -1.10156,-1 -1.875,-1zM19.5,14c-0.77344,0 -1.45703,0.44141 -1.875,1c-0.41797,0.55859 -0.625,1.24609 -0.625,2c0,0.75391 0.20703,1.44141 0.625,2c0.41797,0.55859 1.10156,1 1.875,1c0.77344,0 1.45703,-0.44141 1.875,-1c0.41797,-0.55859 0.625,-1.24609 0.625,-2c0,-0.75391 -0.20703,-1.44141 -0.625,-2c-0.41797,-0.55859 -1.10156,-1 -1.875,-1zM12.5,16c0.05469,0 0.125,0.01953 0.25,0.1875c0.125,0.16797 0.25,0.46094 0.25,0.8125c0,0.35156 -0.125,0.64453 -0.25,0.8125c-0.125,0.16797 -0.19531,0.1875 -0.25,0.1875c-0.05469,0 -0.125,-0.01953 -0.25,-0.1875c-0.125,-0.16797 -0.25,-0.46094 -0.25,-0.8125c0,-0.35156 0.125,-0.64453 0.25,-0.8125c0.125,-0.16797 0.19531,-0.1875 0.25,-0.1875zM19.5,16c0.05469,0 0.125,0.01953 0.25,0.1875c0.125,0.16797 0.25,0.46094 0.25,0.8125c0,0.35156 -0.125,0.64453 -0.25,0.8125c-0.125,0.16797 -0.19531,0.1875 -0.25,0.1875c-0.05469,0 -0.125,-0.01953 -0.25,-0.1875c-0.125,-0.16797 -0.25,-0.46094 -0.25,-0.8125c0,-0.35156 0.125,-0.64453 0.25,-0.8125c0.125,-0.16797 0.19531,-0.1875 0.25,-0.1875z"></path></g></g>
      </svg>, to: "https://discord.com/invite/EN3g4SWYwV/", label: "Discord" },
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950"></div>
          <img 
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
            alt="Contact Us"
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
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300">
              Have questions about film financing or investment opportunities? 
              We're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              // <Link
              //   to={info.link}
              //   target="_blank"
              //   key={index}
              //   className="bg-navy-800 rounded-xl p-6 border border-navy-700 hover:border-gold-500/50 transition-colors"
              // >
              <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 hover:border-gold-500/50 transition-colors">
                <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
                <p className="text-gray-400">{info.details}</p>
              </div>
              // </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
              <p className="text-gray-400 mb-8">
                Whether you're a filmmaker looking to fund your next project or an investor 
                interested in opportunities, we'd love to hear from you.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <Link
                        key={index}
                        to={social.to}
                        className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-navy-700 transition-colors"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Office Hours</h3>
                  <div className="space-y-2 text-gray-400">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM CET</p>
                    <p>Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full bg-navy-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 border border-navy-700"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full bg-navy-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 border border-navy-700"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                    Subject
                  </label>
                  <div className="relative">
                    <MessageSquare size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      required
                      className="w-full bg-navy-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 border border-navy-700"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={6}
                    className="w-full bg-navy-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 border border-navy-700"
                    placeholder="Tell us about your project or investment interests..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 py-3 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300">
              Find quick answers to common questions about our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-3">
                How do I start investing in films?
              </h3>
              <p className="text-gray-400">
                Create an account, complete verification, and browse available projects. 
                You can start investing with as little as $5,000.
              </p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-white mb-3">
                How are investments secured?
              </h3>
              <p className="text-gray-400">
                All investments are structured as security tokens, fully compliant with 
                regulations and backed by smart contracts.
              </p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-3">
                Can I submit my film project?
              </h3>
              <p className="text-gray-400">
                Yes! Filmmakers can submit projects through our platform. Each project 
                undergoes a thorough review process.
              </p>
            </motion.div>

            <motion.div
              className="bg-navy-800 rounded-xl p-6 border border-navy-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-3">
                How are returns distributed?
              </h3>
              <p className="text-gray-400">
                Returns are automatically distributed via smart contracts based on 
                revenue sharing terms specified in each project.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;