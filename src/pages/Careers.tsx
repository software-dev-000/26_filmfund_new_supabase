import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Globe, 
  Users, 
  Heart,
  Coffee,
  Laptop,
  Zap,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Careers: React.FC = () => {
  const benefits = [
    {
      icon: <Globe size={24} />,
      title: "Remote-First",
      description: "Work from anywhere in the world with our distributed team"
    },
    {
      icon: <Heart size={24} />,
      title: "Health & Wellness",
      description: "Comprehensive health coverage and wellness programs"
    },
    {
      icon: <Coffee size={24} />,
      title: "Work-Life Balance",
      description: "Flexible hours and unlimited PTO policy"
    },
    {
      icon: <Laptop size={24} />,
      title: "Equipment Budget",
      description: "Annual allowance for your home office setup"
    }
  ];

  const positions = [
    // {
    //   title: "Senior Blockchain Engineer",
    //   department: "Engineering",
    //   location: "Remote",
    //   type: "Full-time",
    //   description: "Build and maintain our security token infrastructure and smart contracts."
    // },
    {
      title: "Film Industry Relations Manager",
      department: "Business Development",
      location: "Los Angeles / Remote",
      type: "Full-time",
      description: "Develop and maintain relationships with film industry partners."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create beautiful and intuitive experiences for our platform."
    },
    // {
    //   title: "Compliance Officer",
    //   department: "Legal",
    //   location: "Remote",
    //   type: "Full-time",
    //   description: "Ensure platform compliance with securities regulations."
    // }
  ];

  const values = [
    {
      icon: <Zap size={32} />,
      title: "Innovation",
      description: "We're not just following the industry—we're leading it."
    },
    {
      icon: <Users size={32} />,
      title: "Collaboration",
      description: "Great ideas can come from anywhere. We work together to achieve more."
    },
    {
      icon: <Heart size={32} />,
      title: "Passion",
      description: "We love what we do and it shows in our work."
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950"></div>
          <img 
            src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
            alt="Careers at FilmFund"
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
              Join Our Mission
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Help us revolutionize film financing and empower the next generation of storytellers.
            </p>
            <Link 
              to="#open-positions" 
              className="inline-flex items-center bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-lg font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Briefcase size={20} className="mr-2" />
              View Open Positions
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Benefits & Perks</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We believe in taking care of our team with competitive compensation and 
              great benefits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              These core values guide everything we do at FilmFund.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-8 border border-navy-700 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Open Positions</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join our team and help shape the future of film financing.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {positions.map((position, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 text-sm bg-navy-700 text-gray-300 rounded-full">
                        {position.department}
                      </span>
                      <span className="inline-block px-3 py-1 text-sm bg-navy-700 text-gray-300 rounded-full">
                        {position.location}
                      </span>
                      <span className="inline-block px-3 py-1 text-sm bg-navy-700 text-gray-300 rounded-full">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  {/* <Link 
                    to={`/careers/${position.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="mt-4 md:mt-0 inline-flex items-center bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Send size={18} className="mr-2" />
                    Apply Now
                  </Link> */}
                </div>
                <p className="text-gray-400">{position.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="bg-navy-800 rounded-xl p-8 text-center border border-navy-700 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Don't See the Right Role?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. Send us your resume 
              and let us know how you can contribute to our mission.
            </p>
            <Link 
              to="mailto:contact@filmfund.io"
              className="inline-flex items-center bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              <Send size={20} className="mr-2" />
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Careers;