import React from 'react';
import { NavLink } from 'react-router-dom';

const NavLinks: React.FC = () => {
  const links = [
    { to: "/projects", label: "Projects" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/for-filmmakers", label: "For Filmmakers" },
    { to: "/for-fans", label: "For Fans" },
    { to: "/ffa-staking", label: "FFA Staking" },
    { to: "/private-sale", label: "Private Sale" },
    { to: "https://filmfund.gitbook.io/docs", label: "Whitepaper" , target: "_blank"}
  ];

  return (
    <div className="md:flex md:items-center md:space-x-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block md:inline-block px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'text-gold-500 bg-navy-800'
                : 'text-white hover:bg-navy-800/50'
            }`
          }
          target={link.target ?? '_self'}
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
};

export default NavLinks;