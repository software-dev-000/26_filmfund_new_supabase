import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Film, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface MenuLink {
  label: string;
  to: string;
  external?: boolean;
}

interface MenuItem {
  title: string;
  links: MenuLink[];
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const menuItems: MenuItem[] = [
    {
      title: 'Platform',
      links: [
        { to: '/projects', label: 'Film Projects' },
        { to: '/how-it-works', label: 'How It Works' },
        { to: '/tokenomics', label: 'Tokenomics' },
        { to: '/roadmap', label: 'Roadmap' }
      ]
    },
    {
      title: 'Token',
      links: [
        { to: '/private-sale', label: 'Private Sale' },
        { to: '/for-fans', label: 'For Fans' },
        { to: '/for-filmmakers', label: 'For Filmmakers' },
        { to: 'https://filmfund.io/whitepaper.pdf', label: 'Whitepaper', external: true }
      ]
    },
    {
      title: 'Company',
      links: [
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact' },
        { to: '/careers', label: 'Careers' },
        { to: '/press-kit', label: 'Press Kit' }
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const DesktopNavigation = () => (
    <div className="flex items-center space-x-6 gap-10">
      {menuItems.map((item) => (
        <div key={item.title} className="relative group">
          <div className="flex items-center space-x-1 text-white hover:text-gold-300 transition-colors text-lg cursor-pointer">
            <span>{item.title}</span>
            <ChevronDown size={18} className="transition-transform group-hover:rotate-180" />
          </div>
          
          {/* Dropdown Menu */}
          <div 
            className="absolute top-full left-0 mt-2 w-56 bg-navy-950/95 backdrop-blur-sm rounded-lg shadow-xl py-2 transition-all duration-200 border border-navy-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible"
          >
            {item.links.map((link) => (
              link.external ? (
                <a
                  key={link.to}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2.5 text-white hover:bg-navy-800/80 transition-colors text-base"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 transition-colors text-base ${
                      isActive ? 'bg-navy-800/80 text-gold-500' : 'text-white hover:bg-navy-800/80'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-navy-950/95 backdrop-blur-sm shadow-lg py-2' : 'bg-navy-950/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 min-w-[80px]">
            <img 
              src="/favicon.webp" 
              alt="FilmFund.io" 
              className="h-8 md:h-12"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <DesktopNavigation />
            <div className="flex items-center space-x-1">
              {currentUser ? (
                <div className="flex items-center gap-5">
                  <NavLink 
                    to={currentUser.user_metadata.user_type === 'superadmin' || currentUser.user_metadata.user_type === 'admin' ? '/admin/dashboard' : `/${currentUser.user_metadata.user_type}/dashboard`}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-lg ${
                        isActive 
                          ? 'bg-navy-800 text-gold-500' 
                          : 'text-white hover:bg-navy-800/50'
                      }`
                    }
                  >
                    <User size={18} />
                    <span>Dashboard</span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-navy-800/50 transition-colors text-lg"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <NavLink 
                    to="/login" 
                    className="text-white hover:text-gold-300 px-4 transition-colors text-lg"
                  >
                    Login
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-4 py-2 rounded-lg transition-colors text-lg"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-gold-300 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-navy-800">
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.title}>
                  <button
                    className="flex items-center justify-between w-full px-4 py-2.5 text-white hover:bg-navy-800/80 rounded-lg transition-colors text-lg"
                    onClick={() => setActiveDropdown(activeDropdown === item.title ? null : item.title)}
                  >
                    <span>{item.title}</span>
                    <ChevronDown size={18} className={`transition-transform ${activeDropdown === item.title ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`pl-4 space-y-4 mt-1 ${activeDropdown === item.title ? 'block' : 'hidden'}`}>
                    {item.links.map((link) => (
                      link.external ? (
                        <Link
                          key={link.to}
                          to={link.to}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2.5 text-white hover:bg-navy-800/80 rounded-lg transition-colors text-base"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          className={({ isActive }) =>
                            `block px-4 py-2.5 rounded-lg transition-colors text-base ${
                              isActive ? 'bg-navy-800/80 text-gold-500' : 'text-white hover:bg-navy-800/80'
                            }`
                          }
                        >
                          {link.label}
                        </NavLink>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-navy-800">
              {currentUser ? (
                <>
                  <NavLink 
                    to={currentUser.user_metadata.user_type === 'superadmin' || currentUser.user_metadata.user_type === 'admin' ? '/admin/dashboard' : `/${currentUser.user_metadata.user_type}/dashboard`}
                    className="block px-4 py-2 text-white hover:bg-navy-800 rounded-lg transition-colors text-lg"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-navy-800 rounded-lg transition-colors text-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink 
                    to="/login" 
                    className="block px-4 py-2 text-white hover:bg-navy-800 rounded-lg transition-colors text-lg"
                  >
                    Login
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    className="block px-4 py-2 bg-gold-500 hover:bg-gold-600 text-navy-900 rounded-lg transition-colors text-lg"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;