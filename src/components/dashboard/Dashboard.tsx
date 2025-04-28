import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Film, 
  DollarSign, 
  Users, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Home,
  BarChart2,
  Shield,
  PlusCircle
} from 'lucide-react';

// Dashboard Components
import InvestorDashboard from './investor/InvestorDashboard';
import FilmmakerDashboard from './filmmaker/FilmmakerDashboard';
import AdminDashboard from './admin/AdminDashboard';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Mock user data - in a real app, this would come from your auth system
  const userType = "investor"; // Could be "investor", "filmmaker", or "admin"
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="bg-navy-950 min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-navy-900 transition-transform transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:flex flex-col`}
      >
        <div className="p-4 border-b border-navy-700 flex items-center gap-3">
          <Film size={24} className="text-gold-500" />
          <span className="text-lg font-bold text-white">FilmFund.io</span>
          <button 
            className="ml-auto lg:hidden text-white" 
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <SidebarSection title="Main">
            <SidebarLink to="/dashboard" icon={<Home size={20} />} label="Overview" />
            
            {userType === "investor" && (
              <>
                <SidebarLink to="/dashboard/investments" icon={<DollarSign size={20} />} label="My Investments" />
                <SidebarLink to="/dashboard/projects" icon={<Film size={20} />} label="Browse Projects" />
                <SidebarLink to="/dashboard/returns" icon={<BarChart2 size={20} />} label="Returns" />
              </>
            )}
            
            {userType === "filmmaker" && (
              <>
                <SidebarLink to="/dashboard/projects" icon={<Film size={20} />} label="My Projects" />
                <SidebarLink to="/dashboard/create-project" icon={<PlusCircle size={20} />} label="Create Project" />
                <SidebarLink to="/dashboard/funding" icon={<DollarSign size={20} />} label="Funding Status" />
              </>
            )}
            
            {userType === "admin" && (
              <>
                <SidebarLink to="/dashboard/projects" icon={<Film size={20} />} label="All Projects" />
                <SidebarLink to="/dashboard/users" icon={<Users size={20} />} label="Users" />
                <SidebarLink to="/dashboard/compliance" icon={<Shield size={20} />} label="Compliance" />
              </>
            )}
          </SidebarSection>
          
          <SidebarSection title="Account">
            <SidebarLink to="/dashboard/profile" icon={<User size={20} />} label="Profile" />
            <SidebarLink to="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
            <SidebarLink to="/logout" icon={<LogOut size={20} />} label="Log Out" />
          </SidebarSection>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile header */}
        <header className="bg-navy-900 lg:hidden p-4 shadow-md flex items-center">
          <button 
            className="text-white mr-4" 
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <Film size={24} className="text-gold-500" />
          <span className="text-lg font-bold text-white ml-2">FilmFund.io</span>
        </header>
        
        {/* Dashboard content */}
        <div className="p-4 md:p-6 lg:p-8">
          <Routes>
            <Route index element={
              userType === "investor" ? <InvestorDashboard /> :
              userType === "filmmaker" ? <FilmmakerDashboard /> :
              <AdminDashboard />
            } />
            {/* Add additional routes for your dashboard pages */}
          </Routes>
        </div>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="mx-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm transition-colors ${
        isActive 
          ? 'bg-navy-800 text-gold-500' 
          : 'text-gray-300 hover:bg-navy-800 hover:text-white'
      }`}
    >
      <span className={`mr-3 ${isActive ? 'text-gold-500' : 'text-gray-400'}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
};

export default Dashboard;