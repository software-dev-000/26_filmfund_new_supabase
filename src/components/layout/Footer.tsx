import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-5">
              <Film size={28} className="text-gold-500" />
              <span className="text-xl font-bold">FilmFund.io</span>
            </div>
            <p className="text-gray-400 mb-5">
              Connecting filmmakers with investors through blockchain technology.
              Revolutionizing film financing with transparency and security.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Twitter size={20} />} />
              <SocialIcon icon={<Linkedin size={20} />} />
              <SocialIcon icon={<Instagram size={20} />} />
              <SocialIcon icon={<Facebook size={20} />} />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Platform</h3>
            <ul className="space-y-3">
              <FooterLink to="/projects">Film Projects</FooterLink>
              <FooterLink to="/how-it-works">How It Works</FooterLink>
              <FooterLink to="/token">Token Economics</FooterLink>
              <FooterLink to="/roadmap">Roadmap</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Token</h3>
            <ul className="space-y-3">
              <FooterLink to="/private-sale">Private Sale</FooterLink>
              <FooterLink to="/ffa-staking">Staking</FooterLink>
              <FooterLink to="/tokenomics">Tokenomics</FooterLink>
              <FooterLink to="/whitepaper">Whitepaper</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Company</h3>
            <ul className="space-y-3">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/press">Press Kit</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-navy-800 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} FilmFund.io. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-gold-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gold-300 transition-colors">
                Terms of Service
              </Link>
              <Link to="/legal" className="hover:text-gold-300 transition-colors">
                Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => {
  return (
    <a 
      href="#" 
      className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition-colors"
    >
      {icon}
    </a>
  );
};

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  return (
    <li>
      <Link to={to} className="text-gray-400 hover:text-gold-300 transition-colors">
        {children}
      </Link>
    </li>
  );
};

export default Footer;