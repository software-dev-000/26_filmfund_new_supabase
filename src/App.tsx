import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/layout/Navbar';
import Footer from './pages/layout/Footer';
import Hero from './components/landing/Hero';
import VideoShowcase from './components/landing/VideoShowcase';
import HowItWorks from './components/landing/HowItWorks';
import FeaturedProjects from './components/landing/FeaturedProjects';
import Benefits from './components/landing/Benefits';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import InvestorDashboard from './pages/dashboard/investor/InvestorDashboard';
import FilmmakerDashboard from './pages/dashboard/filmmaker/FilmmakerDashboard';
import NewProject from './pages/projects/NewProject';
import ProjectsPage from './pages/projects';
import ProjectView from './pages/projects/DetailView';
import HowItWorksPage from './pages/HowItWorks';
import ForFilmmakers from './pages/ForFilmmakers';
import ForFans from './pages/ForFans';
import FFAStaking from './pages/FFAStaking';
import PrivateSale from './pages/PrivateSale';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import PressKit from './pages/PressKit';
import Roadmap from './pages/Roadmap';
import Tokenomics from './pages/tokenomics';
import UserSettings from './pages/UserSettings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminLogin from './pages/auth/AdminLogin';
import AdminRoute from './pages/auth/AdminRoute';
import FilmmakerRoute from './pages/auth/FilmmakerRoute';
import InvestorRoute from './pages/auth/InvestorRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow mt-[70px]">
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
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

function Home() {
  const { currentUser } = useAuth();
  console.log(`currentUser: ${JSON.stringify(currentUser, null, 2)}`);
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

export default App;