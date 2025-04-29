import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DollarSign, Users, Clock } from 'lucide-react';
import { Project } from '../../types/database';

export interface ProjectWithUI extends Project {
  type?: string;
  days_left?: number;
  funding_raised?: number;
  investors?: number;
  director?: string;
  featured?: boolean;
}

interface ProjectCardProps {
  project: ProjectWithUI;
  index: number;
  linkTo?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  index, 
  linkTo = `/projects/${project.id}` 
}) => {
  const percentFunded = Math.round((project.funding_raised || 0) / (project.funding_goal || 1) * 100);
  
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
        <p className="text-gray-400 text-sm mb-3">Directed by {project.director || 'Unknown'}</p>
        
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
            <span className="text-gray-300">${((project.funding_raised || 0) / 1000000).toFixed(1)}M raised</span>
          </div>
          <div className="flex items-center">
            <Users size={14} className="text-gold-500 mr-1" />
            <span className="text-gray-300">{project.investors || 0} investors</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={14} className="text-gold-500 mr-1" />
            <span className="text-gray-300">${((project.funding_goal || 0) / 1000000).toFixed(1)}M goal</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="text-gold-500 mr-1" />
            <span className="text-gray-300">{project.days_left || 30} days left</span>
          </div>
        </div>
        
        <Link 
          to={linkTo}
          className="mt-auto bg-navy-700 hover:bg-navy-600 text-white text-center py-2 rounded-md transition-colors"
        >
          View Project
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 