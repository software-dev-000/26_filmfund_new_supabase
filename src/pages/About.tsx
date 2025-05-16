import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Film, 
  Globe, 
  Users, 
  Award,
  Rocket,
  Target,
  Lightbulb,
  Github,
  Linkedin,
  Twitter,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Marquee from "react-fast-marquee";
import { fetchGlobalStats, GlobalStats } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';

const About: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Determine the correct link destination based on auth status
  let getStartedLink = "/register";
  if(currentUser){
    if (currentUser.user_metadata.user_type === "investor"){
      getStartedLink = "/investor/dashboard";
    } else if (currentUser.user_metadata.user_type === "filmmaker" || currentUser.user_metadata.user_type === "admin"){
      getStartedLink = "/filmmaker/dashboard";
    } else if (currentUser.user_metadata.user_type === "superadmin"){
      getStartedLink = "/admin/dashboard";
    }
  }

  const [stats, setStats] = useState<GlobalStats>({
    totalFunded: 0,
    globalInvestors: 0,
    filmProjects: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const globalStats = await fetchGlobalStats();
        setStats(globalStats);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  const statsData = [
    {
      value: isLoading ? "..." : `$${(stats.totalFunded / 1000000).toFixed(1)}M+`,
      label: "Total Funded",
      icon: <Film size={24} />
    },
    {
      value: isLoading ? "..." : `${stats.globalInvestors.toLocaleString()}+`,
      label: "Global Investors",
      icon: <Globe size={24} />
    },
    {
      value: isLoading ? "..." : `${stats.filmProjects.toLocaleString()}+`,
      label: "Film Projects",
      icon: <Users size={24} />
    },
    {
      value: "0",
      label: "Industry Awards",
      icon: <Award size={24} />
    }
  ];

  const values = [
    {
      icon: <Target size={32} />,
      title: "Innovation",
      description: "Pushing the boundaries of film financing through blockchain technology"
    },
    {
      icon: <Shield size={32} />,
      title: "Security",
      description: "Ensuring compliant and secure investment opportunities"
    },
    {
      icon: <Lightbulb size={32} />,
      title: "Creativity",
      description: "Supporting visionary filmmakers and creative storytelling"
    },
    {
      icon: <Rocket size={32} />,
      title: "Growth",
      description: "Fostering sustainable growth in independent film"
    }
  ];

  const team = [
    {
      name: "Douglas McKenna",
      role: "Co-Founder & CEO",
      image: "/teams/teamimg1.png",
      bio: "Douglas brings over a decade of experience in the film industry, having produced and financed multiple successful film projects. His deep understanding of both traditional and decentralized finance, combined with his hands-on experience in blockchain, positions him as a leading voice in film tokenization.",
      social: {
        linkedin: "https://www.linkedin.com/in/douglas-mckenna-348b862b/",
      }
    },
    {
      name: "Ciprian Filip",
      role: "Co-Founder & Advisor",
      image: "/teams/teamimg2.png",
      bio: "Ciprian Filip brings a wealth of experience in blockchain technology and strategic consulting to FilmFund.io. As a key contributor, he focuses on implementing innovative tokenization models and advising on the overall architecture. His deep understanding of decentralized technologies and practical business insights ensures FilmFund.io delivers cutting-edge solutions for the film financing ecosystem.",
      social: {
        linkedin: "https://www.linkedin.com/in/ciprianfilip/",
      }
    },
    {
      name: "Nenad Nedeljkovic",
      role: "Lead Engineer",
      image: "/teams/teamimg8.png",
      bio: "Nenad is an experienced full stack engineer with a deep passion for blockchain development.Having worked with major decentralized projects, he brings technical expertiseand problem-solving capabilities to FilmFund.io's core development team. Nenad oversees all aspects of platform development, ensuring its functionality,security, and scalability.",
      social: {
        linkedin: "https://www.linkedin.com/in/nenad-nedeljkovic-27ab832/",
      }
    },
    // {
    //   name: "Guy Zajonc",
    //   role: "Senior Advisor - Films",
    //   image: "/teams/teamimg3.png",
    //   bio: "Guy is a former lawyer and CEO-level executive with experience in both private and publicly traded startups. He co-founded a production company, growing it to over $100M in revenue. He has worked with National Geographic, IMAX filmmaker Stephen Low, and collaborated with James Cameron on Ghosts of the Abyss and Battleship Bismarck for DiscoveryChannel.",
    //   social: {
    //     linkedin: "https://www.linkedin.com/in/guy-zajonc-60878495/",
    //   }
    // },
    // {
    //   name: "Jose Paolo Miller",
    //   role: "Legal Advisor (MiCA & Compliance)",
    //   image: "/teams/teamimg10.png",
    //   bio: "Jose is an experienced lawyer specializing in fintech, payments, and blockchain, José provides legal guidance on regulatory compliance, ensuring FilmFund.io aligns with MiCA and other financial regulations. His expertise supports the platform's legal framework for tokenized film financing and investor protection.",
    //   social: {
    //     linkedin: "https://www.linkedin.com/in/jpmiler/",
    //   }
    // },
    // {
    //   name: "Mauro Andriotto",
    //   role: "Legal Advisor",
    //   image: "/teams/teamimg4.png",
    //   bio: "Mauro is a leading expert in blockchain compliance and security token offerings. He has worked with numerous crypto projects, ensuring legal compliance across multiple jurisdictions. Mauro ensures that FilmFund.io complies with global legal standards, guiding the security token issuance and regulatory framework.",
    //   social: {
    //     linkedin: "#",
    //   }
    // },
  ];

  const advisors = [
    {
      name: "Guy Zajonc",
      role: "Senior Advisor - Films",
      image: "/teams/teamimg3.png",
      credentials: "PhD in Cryptography, MIT",
      social: {
        linkedin: "https://www.linkedin.com/in/guy-zajonc-60878495/",
      }
    },
    {
      name: "Jose Paolo Miller",
      role: "Legal Advisor (MiCA & Compliance)",
      image: "/teams/teamimg10.png",
      credentials: "Blockchain Compliance Expert",
      social: {
        linkedin: "https://www.linkedin.com/in/jpmiler/",
      }
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950"></div>
          <img 
            src="https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg"
            alt="Film Production"
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
              Revolutionizing Film Finance Through Technology
            </h1>
            <p className="text-xl text-gray-300">
              We're building the future of film financing, connecting visionary filmmakers 
              with global investors through blockchain technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* KYC Verification Badge */}
      <section className="py-8 bg-navy-950 border-y border-navy-800">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">KYC Verified Platform</h3>
                <p className="text-sm text-gray-400">Compliant with international regulations</p>
              </div>
            </div>
            <div className="h-px md:h-8 w-8 md:w-px bg-navy-700"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Secure & Regulated</h3>
                <p className="text-sm text-gray-400">Your investments are protected</p>
              </div>
            </div>
            <div className="h-px md:h-8 w-8 md:w-px bg-navy-700"></div>
            <div className="relative group">
              <div className="w-48 h-32 bg-navy-800 rounded-lg overflow-hidden border border-navy-700">
                <img 
                  src="/kyc.png" 
                  alt="KYC Verification" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-navy-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link 
                  to="https://techhy.me/kyc/certificate/FilmFund" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white text-sm font-medium hover:text-gold-500 transition-colors"
                >
                  View Full Verification
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
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
                <div className="text-3xl font-bold text-white mb-1">
                  {isLoading ? (
                    <div className="h-8 w-32 bg-navy-700 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission & Values</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We're dedicated to democratizing film finance while maintaining the highest 
              standards of security and compliance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-navy-700 rounded-lg flex items-center justify-center text-gold-500 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-navy-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Our Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Meet the passionate individuals behind FilmFund.io, dedicated to revolutionizing film financing through blockchain technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl overflow-hidden border border-navy-700 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative group h-80">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent opacity-0 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-gold-500 mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm mb-4 flex-grow">{member.bio}</p>
                  <div className="flex space-x-3 mt-auto">
                    {member.social?.github && (
                      <Link to={member.social.github} target="_blank" className="text-gray-400 hover:text-gold-500 transition-colors">
                        <Github size={20} />
                      </Link>
                    )}
                    {member.social.linkedin && (
                      <Link to={member.social.linkedin} target="_blank" className="text-gray-400 hover:text-gold-500 transition-colors">
                        <Linkedin size={20} />
                      </Link>
                    )}
                    {member.social?.twitter && (
                      <Link to={member.social.twitter} target="_blank" className="text-gray-400 hover:text-gold-500 transition-colors">
                        <Twitter size={20} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Our Advisors</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Industry leaders providing strategic guidance and expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {advisors.map((advisor, index) => (
              <motion.div
                key={index}
                className="bg-navy-800 rounded-xl p-6 border border-navy-700 flex items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <img 
                  src={advisor.image} 
                  alt={advisor.name} 
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{advisor.name}</h3>
                  <p className="text-gold-500 mb-2">{advisor.role}</p>
                  {/* <p className="text-gray-400 text-sm">{advisor.credentials}</p> */}
                  <Link to={advisor.social.linkedin} target="_blank" className="text-gray-400 hover:text-gold-500 transition-colors">
                    <Linkedin size={20} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="bg-navy-800 rounded-xl p-8 text-center border border-navy-700 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Join the Film Finance Revolution
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you're a filmmaker seeking funding or an investor looking for opportunities, 
              we're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to={getStartedLink} 
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
              <Link 
                to="/contact" 
                className="border border-gold-500 text-white hover:bg-navy-700 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;