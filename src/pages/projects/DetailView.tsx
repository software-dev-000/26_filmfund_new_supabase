import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, 
  DollarSign, 
  Users, 
  Clock, 
  Globe,
  FileText,
  Calendar,
  TrendingUp,
  Shield,
  ChevronRight,
  PlayCircle,
  User,
  Briefcase,
  Target,
  PieChart,
  X,
  Linkedin,
  Twitter,
  Mail,
  Award
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { 
  Project, 
  ProjectTeamMember,
  ProjectMilestone,
  ProjectTokenization,
  ProjectInvestmentHighlight,
  ProjectFinancialStructure,
  ProjectPayment
} from '../../types/database';

interface ProjectWithUI extends Project {
  type: string;
  days_left: number;
  funding_raised: number;
  investors: number;
  director: string;
  project_team_members?: ProjectTeamMember[];
  project_milestones?: ProjectMilestone[];
  project_tokenization?: ProjectTokenization;
  project_investment_highlights?: ProjectInvestmentHighlight[];
  project_financial_structures?: ProjectFinancialStructure[];
  project_payments?: ProjectPayment[];
}

interface TeamMemberModalProps {
  member: ProjectTeamMember;
  onClose: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white">{member.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <img 
                  src={member.image_url || "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-gold-500 font-medium mb-2">Role</h3>
                  <p className="text-white">{member.role}</p>
                </div>
                {member.experience && (
                  <div>
                    <h3 className="text-gold-500 font-medium mb-2">Experience</h3>
                    <p className="text-white">{member.experience}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-gold-500 font-medium mb-2">Bio</h3>
                <p className="text-white">{member.bio}</p>
              </div>

              {member.project_team_member_projects && member.project_team_member_projects.length > 0 && (
                <div>
                  <h3 className="text-gold-500 font-medium mb-4">Notable Projects</h3>
                  <div className="space-y-4">
                    {member.project_team_member_projects.map((project, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-bold text-white mb-2">{project.title}</h4>
                        {project.description && (
                          <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                        )}
                        {project.link && (
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold-500 hover:text-gold-400 text-sm inline-flex items-center"
                          >
                            View Project
                            <ChevronRight size={16} className="ml-1" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {member.social_links && (
                <div>
                  <h3 className="text-gold-500 font-medium mb-2">Connect</h3>
                  <div className="flex space-x-4">
                    {member.social_links.linkedin && (
                      <a 
                        href={member.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Linkedin size={24} />
                      </a>
                    )}
                    {member.social_links.twitter && (
                      <a 
                        href={member.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Twitter size={24} />
                      </a>
                    )}
                    {member.social_links.email && (
                      <a 
                        href={`mailto:${member.social_links.email}`}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Mail size={24} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectWithUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<ProjectTeamMember | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
        const data = await projectService.getProject(id);
        const transformedProject: ProjectWithUI = {
          ...data,
          type: 'independent', // Default to independent for now
          days_left: 30, // Default to 30 days
          funding_raised: data.project_payments?.reduce((sum: number, payment: { amount: number }) => sum + payment.amount, 0) || 0,
          investors: data.project_payments?.length || 0,
          director: data.project_team_members?.[0]?.name || 'Unknown Director'
        };
        setProject(transformedProject);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <p className="text-gray-400">The project you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const percentFunded = Math.round((project.funding_raised / project.funding_goal) * 100);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] rounded-lg overflow-hidden mb-8">
          <img 
            src={project.cover_image || "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg"} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{project.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{project.tagline}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-gray-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                  {project.genre}
                </span>
                <span className="bg-gray-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                  {project.current_stage || 'Pre-Production'}
                </span>
                <span className="bg-gray-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                  Budget: ${(project.budget / 1000000).toFixed(1)}M
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Funding Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-xl font-bold">
                    ${(project.funding_raised / 1000000).toFixed(1)}M
                  </h3>
                  <p className="text-gray-400">raised of ${(project.funding_goal / 1000000).toFixed(1)}M goal</p>
                </div>
                <div className="text-right">
                  <p className="text-gold-500 font-bold">{percentFunded}%</p>
                  <p className="text-gray-400">{project.days_left} days left</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-gold-500 h-2 rounded-full" 
                  style={{ width: `${percentFunded}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center text-gray-400 mb-1">
                    <Users size={16} className="mr-2" />
                    Investors
                  </div>
                  <p className="text-xl font-bold">{project.investors}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center text-gray-400 mb-1">
                    <DollarSign size={16} className="mr-2" />
                    Min Investment
                  </div>
                  <p className="text-xl font-bold">
                    ${(project.funding_goal * 0.01).toFixed(0)}
                  </p>
                </div>
              </div>
              
              <button className="w-full bg-gold-500 hover:bg-gold-600 text-gray-900 py-3 rounded-lg font-medium transition-colors">
                Invest Now
              </button>
            </motion.div>

            {/* Project Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">{project.description}</p>
                <h3 className="text-xl font-bold mb-2">Synopsis</h3>
                <p className="text-gray-300">{project.synopsis}</p>
              </div>
            </motion.div>

            {/* Team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.project_team_members?.map((member: ProjectTeamMember, index: number) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMember(member)}
                    className="text-center cursor-pointer bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                      <img 
                        src={member.image_url || "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                    <p className="text-gold-500 mb-2">{member.role}</p>
                    <p className="text-gray-400 text-sm line-clamp-2">{member.bio}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Project Timeline</h2>
              <div className="space-y-6">
                {project.project_milestones?.map((milestone: ProjectMilestone, index: number) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-32 pt-1">
                      <p className="text-gold-500 font-medium">{milestone.duration}</p>
                    </div>
                    <div className="flex-grow pl-6 border-l border-gray-700">
                      <h3 className="text-lg font-bold mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Legal & Jurisdiction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Legal Information</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-400 mb-1">
                    <Globe size={16} className="mr-2" />
                    Jurisdiction
                  </div>
                  <p className="text-white">{project.project_tokenization?.jurisdiction || 'United States'}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-400 mb-1">
                    <Shield size={16} className="mr-2" />
                    Legal Counsel
                  </div>
                  <p className="text-white">{project.project_tokenization?.legal_advisor || 'Pending'}</p>
                </div>
              </div>
            </motion.div>

            {/* Security Token Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Security Token</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-400 mb-1">
                    <FileText size={16} className="mr-2" />
                    Token Type
                  </div>
                  <p className="text-white">{project.project_tokenization?.security_type || 'Revenue Share'}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-400 mb-1">
                    <Shield size={16} className="mr-2" />
                    Token Rights
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center text-white">
                      <ChevronRight size={16} className="text-gold-500 mr-2" />
                      Revenue Share
                    </li>
                    <li className="flex items-center text-white">
                      <ChevronRight size={16} className="text-gold-500 mr-2" />
                      Voting Rights
                    </li>
                    <li className="flex items-center text-white">
                        <ChevronRight size={16} className="text-gold-500 mr-2" />
                      Distribution Rights
                      </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Investment Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Investment Highlights</h2>
              <div className="space-y-4">
                {project.project_investment_highlights?.map((highlight: ProjectInvestmentHighlight, index: number) => (
                  <div key={index} className="flex items-start">
                    <Target size={16} className="text-gold-500 mr-2 mt-1" />
                    <div>
                      <h3 className="font-bold">{highlight.title}</h3>
                      <p className="text-gray-400 text-sm">{highlight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Financial Structure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Financial Structure</h2>
              <div className="space-y-4">
                {project.project_financial_structures?.map((structure: ProjectFinancialStructure, index: number) => (
                  <div key={index} className="flex items-start">
                    <PieChart size={16} className="text-gold-500 mr-2 mt-1" />
                    <div>
                      <h3 className="font-bold">{structure.title}</h3>
                      <p className="text-gray-400 text-sm">{structure.description}</p>
                  </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Team Member Modal */}
      <AnimatePresence>
        {selectedMember && (
          <TeamMemberModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetailView;