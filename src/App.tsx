import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/landing/Hero';
import HowItWorks from './components/landing/HowItWorks';
import FeaturedProjects from './components/landing/FeaturedProjects';
import Benefits from './components/landing/Benefits';
import AdminDashboard from './components/dashboard/admin/AdminDashboard';
import InvestorDashboard from './components/dashboard/investor/InvestorDashboard';
import FilmmakerDashboard from './components/dashboard/filmmaker/FilmmakerDashboard';
import NewProject from './components/filmmaker/NewProject';
import ProjectsPage from './components/projects';
import ProjectView from './components/projects/DetailView';
import HowItWorksPage from './components/pages/HowItWorks';
import ForFilmmakers from './components/pages/ForFilmmakers';
import ForFans from './components/pages/ForFans';
import FFAStaking from './components/pages/FFAStaking';
import PrivateSale from './components/pages/PrivateSale';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import AdminLogin from './components/auth/AdminLogin';
import AdminRoute from './components/auth/AdminRoute';
import FilmmakerRoute from './components/auth/FilmmakerRoute';
import InvestorRoute from './components/auth/InvestorRoute';
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
                <Route path="/ffa-staking" element={<FFAStaking />} />
                <Route path="/private-sale" element={<PrivateSale />} />
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
      <HowItWorks />
      <FeaturedProjects />
      <Benefits />
    </>
  );
}

export default App;