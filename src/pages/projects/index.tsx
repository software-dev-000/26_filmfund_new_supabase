import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Film, 
  Filter,
  Search,
  ChevronDown,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { Project } from '../../types/database';

interface ProjectWithUI extends Project {
  type: string;
  days_left: number;
  funding_raised: number;
  investors: number;
  director: string;
}

const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<ProjectWithUI[]>([]);
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'action', name: 'Action Films' },
    { id: 'romance', name: 'Love Stories' },
    { id: 'drama', name: 'Drama' },
    { id: 'documentary', name: 'Documentary' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'comedy', name: 'Comedy' }
  ];
  
  const types = [
    { id: 'all', name: 'All Types' },
    { id: 'independent', name: 'Independent Filmmaker' },
    { id: 'studio', name: 'Studio Production' },
    { id: 'emerging', name: 'Emerging Talent' }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAllProjects();
        const transformedProjects: ProjectWithUI[] = data.map(project => ({
          ...project,
          type: 'independent', // Default to independent for now
          days_left: 30, // Default to 30 days
          funding_raised: project.project_payments?.reduce((sum: number, payment: { amount: number }) => sum + payment.amount, 0) || 0,
          investors: project.project_payments?.length || 0,
          director: project.project_team_members?.[0]?.name || 'Unknown Director'
        }));
        setProjects(transformedProjects);
        console.log(`projects = ${JSON.stringify(transformedProjects, null, 2)}`);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);
  
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.genre.toLowerCase() === selectedCategory;
    const matchesType = selectedType === 'all' || project.type === selectedType;
    const matchesStatus = project.status === 'active';
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.director.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto min-h-screen bg-gray-900 text-white p-8">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold mb-4 md:mb-0">Film Projects</h1>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative  w-full md:fit">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div className="relative w-full md:fit">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-gray-800 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gold-500 w-full md:w-fit"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative w-full md:fit">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none bg-gray-800 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gold-500 w-full md:w-fit"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: ProjectWithUI;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const percentFunded = Math.round((project.funding_raised / project.funding_goal) * 100);
  
  return (
    <motion.div 
      className="bg-navy-800 rounded-xl overflow-hidden flex flex-col border border-navy-700 group h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.cover_image || "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg"} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {project.featured && (
          <div className="absolute top-3 right-3 bg-gold-500 text-navy-900 text-xs font-bold px-2 py-1 rounded-md">
            Featured
          </div>
        )}
        <div className="absolute left-3 bottom-3 bg-navy-900/80 backdrop-blur-sm text-white text-xs py-1 px-2 rounded">
          {project.genre}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-3">Directed by {project.director}</p>
        
        <div className="mb-4 mt-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Funding Progress</span>
            <span className="text-gold-500 font-medium">{percentFunded}%</span>
          </div>
          <div className="w-full bg-navy-700 rounded-full h-2">
            <div 
              className="bg-gold-500 h-2 rounded-full" 
              style={{ width: `${percentFunded}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center">
            <DollarSign size={14} className="text-gold-500 mr-1" />
            <span className="text-gray-300">${(project.funding_raised / 1000000).toFixed(1)}M raised</span>
          </div>
          <div className="flex items-center">
            <Users size={14} className="text-gold-500 mr-1" />
            <span className="text-gray-300">{project.investors} investors</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={14} className="text-gold-500 mr-1" />
            <span className="text-gray-300">${(project.funding_goal / 1000000).toFixed(1)}M goal</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="text-gold-500 mr-1" />
            <span className="text-gray-300">{project.days_left} days left</span>
          </div>
        </div>
        
        <Link 
          to={`/projects/${project.id}`}
          className="mt-auto bg-navy-700 hover:bg-navy-600 text-white text-center py-2 rounded-md transition-colors"
        >
          View Project
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectsPage;