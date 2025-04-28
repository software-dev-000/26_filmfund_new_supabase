import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center space-x-2 mb-5">
            <img 
              src="/favicon.webp" 
              alt="FilmFund.io" 
              className="h-8"
            />
            <span className="text-xl font-bold">FilmFund.io</span>
          </div>
          <p className="text-gray-400 mb-5">
            Connecting filmmakers with investors through blockchain technology.
            Revolutionizing film financing with transparency and security.
          </p>
          <div className="flex space-x-8">
            <SocialIcon icon={<Twitter size={20} />} to="https://x.com/FilmFund_DM/" />
            <SocialIcon icon={<Linkedin size={20} />} to="https://www.linkedin.com/company/filmfund-io/" />
            <SocialIcon icon={<Instagram size={20} />} to="https://www.instagram.com/filmfund.io_/" />
            <SocialIcon icon={<Facebook size={20} />} to="https://www.facebook.com/filmfund.io/" />
          </div>
          
          {/* <div className="">
            <h3 className="text-lg font-semibold mb-5">Platform</h3>
            <ul className="space-y-3">
              <FooterLink to="/projects">Film Projects</FooterLink>
              <FooterLink to="/how-it-works">How It Works</FooterLink>
              <FooterLink to="#">Token Economics</FooterLink>
              <FooterLink to="#">Roadmap</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Token</h3>
            <ul className="space-y-3">
              <FooterLink to="#">Private Sale</FooterLink>
              <FooterLink to="/ffa-staking">Staking</FooterLink>
              <FooterLink to="#">Tokenomics</FooterLink>
              <FooterLink to="#">Whitepaper</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Company</h3>
            <ul className="space-y-3">
              <FooterLink to="#">About Us</FooterLink>
              <FooterLink to="#">Contact</FooterLink>
              <FooterLink to="#">Careers</FooterLink>
              <FooterLink to="#">Press Kit</FooterLink>
            </ul>
          </div> */}
        </div>
        
        <div className="border-t border-navy-800 pt-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} FilmFund.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode, to: string }> = ({ icon, to }) => {
  return (
    <a 
      href={to} 
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