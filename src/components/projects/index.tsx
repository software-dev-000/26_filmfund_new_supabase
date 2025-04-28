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
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.director.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold mb-4 md:mb-0">Film Projects</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-gray-800 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none bg-gray-800 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gold-500"
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <Link to={`/projects/${project.id}`}>
        <div className="relative h-48">
          <img
            src={project.cover_image || "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg"}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="text-gray-300">{project.director}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gold-500">{project.genre}</span>
            <span className="bg-gold-500 text-black px-2 py-1 rounded text-sm">{project.type}</span>
          </div>
          <div className="mb-4">
            <div className="h-2 bg-gray-700 rounded-full mb-2">
              <div
                className="h-full bg-gold-500 rounded-full"
                style={{ width: `${Math.min(percentFunded, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>{percentFunded}% Funded</span>
              <span>${project.funding_goal.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <DollarSign size={14} className="text-gold-500 mr-1" />
              <span className="text-gray-300">${(project.funding_raised / 1000000).toFixed(1)}M raised</span>
            </div>
            <div className="flex items-center">
              <Users size={14} className="text-gold-500 mr-1" />
              <span className="text-gray-300">{project.investors} investors</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="text-gold-500 mr-1" />
              <span className="text-gray-300">{project.days_left} days left</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectsPage;