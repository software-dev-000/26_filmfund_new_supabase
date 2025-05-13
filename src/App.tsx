import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useScrollToTop } from './hooks/useScrollToTop';
import Navbar from './pages/layout/Navbar';
import Footer from './pages/layout/Footer';
import Hero from './components/landing/Hero';
import VideoShowcase from './components/landing/VideoShowcase';
import HowItWorks from './components/landing/HowItWorks';
import FeaturedProjects from './components/landing/FeaturedProjects';
import Benefits from './components/landing/Benefits';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { bsc, bscTestnet } from 'viem/chains';
import { type Config, cookieToInitialState, WagmiProvider } from 'wagmi';
import { createAppKit } from '@reown/appkit/react';
import { WalletProvider } from './contexts/WalletContext';
import { projectId, wagmiAdapter } from './hooks/web3modal';

import './index.css';

// Lazy load components
const AdminDashboard = lazy(() => import('./pages/dashboard/admin/AdminDashboard'));
const InvestorDashboard = lazy(() => import('./pages/dashboard/investor/InvestorDashboard'));
const FilmmakerDashboard = lazy(() => import('./pages/dashboard/filmmaker/FilmmakerDashboard'));
const NewProject = lazy(() => import('./pages/projects/NewProject'));
const ProjectsPage = lazy(() => import('./pages/projects'));
const ProjectView = lazy(() => import('./pages/projects/DetailView'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorks'));
const ForFilmmakers = lazy(() => import('./pages/ForFilmmakers'));
const ForFans = lazy(() => import('./pages/ForFans'));
const FFAStaking = lazy(() => import('./pages/FFAStaking'));
const PrivateSale = lazy(() => import('./pages/PrivateSale'));
const About = lazy(() => import('./pages/About'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const PressKit = lazy(() => import('./pages/PressKit'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Tokenomics = lazy(() => import('./pages/Tokenomics'));
const UserSettings = lazy(() => import('./pages/UserSettings'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const AdminRoute = lazy(() => import('./pages/auth/AdminRoute'));
const FilmmakerRoute = lazy(() => import('./pages/auth/FilmmakerRoute'));
const InvestorRoute = lazy(() => import('./pages/auth/InvestorRoute'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);


if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'valmira_frontend',
  description: 'The first innovated multi chain meme launchpad',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

// Create the modal
export const web3modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [bsc, bscTestnet],
  defaultNetwork: bsc,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});


function App() {
  const queryClient = new QueryClient();

  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    document.cookie
  );
  
  return (
    <AuthProvider>
      <ToastProvider>
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <WalletProvider>
              <Router>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow mt-[70px]">
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin/dashboard/*" element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        } />
                        <Route path="/investor/dashboard/*" element={
                          <InvestorRoute>
                            <InvestorDashboard />
                          </InvestorRoute>
                        } />
                        <Route path="/filmmaker/dashboard/*" element={
                          <FilmmakerRoute>
                            <FilmmakerDashboard />
                          </FilmmakerRoute>
                        } />
                        <Route path="/filmmaker/new-project" element={
                          <FilmmakerRoute>
                            <NewProject />
                          </FilmmakerRoute>
                        } />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/projects/:id" element={<ProjectView />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/for-filmmakers" element={<ForFilmmakers />} />
                        <Route path="/for-fans" element={<ForFans />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/press-kit" element={<PressKit />} />
                        <Route path="/roadmap" element={<Roadmap />} />
                        <Route path="/tokenomics" element={<Tokenomics />} />
                        <Route path="/ffa-staking" element={<FFAStaking />} />
                        <Route path="/private-sale" element={<PrivateSale />} />
                        <Route path="/user/settings" element={<UserSettings />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
              </Router>
            </WalletProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <VideoShowcase />
      <HowItWorks />
      <FeaturedProjects />
      <Benefits />
    </>
  );
}

// Separate component to use the hook inside Router context
function ScrollToTop() {
  useScrollToTop();
  return null;
}

export default App;
