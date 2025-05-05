import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Clock, ChevronDown } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { Project, ProjectTeamMember, ProjectPayment } from '../../types/database';
import { Link } from 'react-router-dom';
import  ProjectCard from '../project/ProjectCard';

interface ProjectWithUI extends Project {
  project_team_members: ProjectTeamMember[];
  project_payments: ProjectPayment[];
  funding_raised: number;
  director: string;
}

const FeaturedProjects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [projects, setProjects] = useState<ProjectWithUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'feature', name: 'Feature Films' },
    { id: 'action', name: 'Action' },
    { id: 'documentary', name: 'Documentaries' },
    { id: 'series', name: 'Series' },
    { id: 'short', name: 'Short Films' },
    { id: 'animation', name: 'Animation' },
    { id: 'experimental', name: 'Experimental' },
    { id: 'web-series', name: 'Web Series' },
    { id: 'tv-movie', name: 'TV Movies' },
    { id: 'reality', name: 'Reality Shows' }
  ];
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAllProjects();
        
        // Transform projects data and filter for active projects
        const transformedProjects = data
          .filter((project: ProjectWithUI) => project.status === 'active')
          .map((project: ProjectWithUI) => ({
            ...project,
            funding_raised: project.project_payments?.reduce((sum: number, payment: ProjectPayment) => sum + payment.amount, 0) || 0,
            director: project.project_team_members?.find((member: ProjectTeamMember) => 
              member.role.toLowerCase().includes('director')
            )?.name || 'Unknown Director'
          }));
        
        setProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.genre === activeCategory);

  const selectedCategory = categories.find(cat => cat.id === activeCategory)?.name || 'All Projects';

  if (loading) {
    return (
      <section className="py-20 bg-navy-950 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-navy-800 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-navy-800 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-navy-800 rounded-xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-navy-950 relative overflow-hidden">
      {/* Background film grain */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3552472/pexels-photo-3552472.jpeg')] opacity-5 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <motion.span
              className="text-gold-500 font-medium mb-2 block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Investment Opportunities
            </motion.span>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Featured Film Projects
            </motion.h2>
          </div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between bg-navy-800 text-white px-4 py-2 rounded-md w-48 border border-navy-700 hover:bg-navy-700 transition-colors"
              >
                <span>{selectedCategory}</span>
                <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-navy-800 border border-navy-700 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-navy-700 transition-colors ${
                        activeCategory === category.id ? 'text-gold-500' : 'text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No active projects found in this category.</p>
          </div>
        )}
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/projects" 
            className="inline-block border border-gold-500 text-white hover:bg-navy-800 px-6 py-3 rounded-md font-medium transition-colors"
          >
            View All Projects
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// interface ProjectCardProps {
//   project: ProjectWithUI;
//   index: number;
// }

// const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
//   const percentFunded = Math.round((project.funding_raised / project.funding_goal) * 100);
  
//   return (
//     <motion.div 
//       className="bg-navy-800 rounded-xl overflow-hidden flex flex-col border border-navy-700 group h-full"
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ delay: 0.1 * index }}
//     >
//       <div className="relative h-48 overflow-hidden">
//         <img 
//           src={project.cover_image || "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg"} 
//           alt={project.title} 
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//         />
//         {project.featured && (
//           <div className="absolute top-3 right-3 bg-gold-500 text-navy-900 text-xs font-bold px-2 py-1 rounded-md">
//             Featured
//           </div>
//         )}
//         <div className="absolute left-3 bottom-3 bg-navy-900/80 backdrop-blur-sm text-white text-xs py-1 px-2 rounded">
//           {project.genre}
//         </div>
//       </div>
      
//       <div className="p-5 flex-grow flex flex-col">
//         <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
//         <p className="text-gray-400 text-sm mb-3">Directed by {project.director}</p>
        
//         <div className="mb-4 mt-1">
//           <div className="flex justify-between text-sm mb-1">
//             <span className="text-gray-400">Funding Progress</span>
//             <span className="text-gold-500 font-medium">{percentFunded}%</span>
//           </div>
//           <div className="w-full bg-navy-700 rounded-full h-2">
//             <div 
//               className="bg-gold-500 h-2 rounded-full" 
//               style={{ width: `${percentFunded}%` }}
//             ></div>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-2 gap-3 text-sm mb-4">
//           <div className="flex items-center">
//             <DollarSign size={14} className="text-gold-500 mr-1" />
//             <span className="text-gray-300">${(project.funding_raised / 1000000).toFixed(1)}M raised</span>
//           </div>
//           <div className="flex items-center">
//             <Users size={14} className="text-gold-500 mr-1" />
//             <span className="text-gray-300">{project.investors} investors</span>
//           </div>
//           <div className="flex items-center">
//             <DollarSign size={14} className="text-gold-500 mr-1" />
//             <span className="text-gray-300">${(project.funding_goal / 1000000).toFixed(1)}M goal</span>
//           </div>
//           <div className="flex items-center">
//             <Clock size={14} className="text-gold-500 mr-1" />
//             <span className="text-gray-300">{project.days_left} days left</span>
//           </div>
//         </div>
        
//         <Link 
//           to={`/projects/${project.id}`}
//           className="mt-auto bg-navy-700 hover:bg-navy-600 text-white text-center py-2 rounded-md transition-colors"
//         >
//           View Project
//         </Link>
//       </div>
//     </motion.div>
//   );
// };

export default FeaturedProjects;