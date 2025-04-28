import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Calendar, Clock } from 'lucide-react';

const FeaturedProjects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'feature', name: 'Feature Films' },
    { id: 'documentary', name: 'Documentaries' },
    { id: 'series', name: 'Series' }
  ];
  
  const projects = [
    {
      id: 1,
      title: "The Last Horizon",
      category: "feature",
      genre: "Sci-Fi Thriller",
      director: "Elena Rodriguez",
      fundingGoal: 2500000,
      fundingRaised: 1750000,
      investors: 156,
      daysLeft: 23,
      image: "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg",
      featured: true
    },
    {
      id: 2,
      title: "Beyond the Edge",
      category: "documentary",
      genre: "Adventure Documentary",
      director: "Michael Chen",
      fundingGoal: 850000,
      fundingRaised: 650000,
      investors: 78,
      daysLeft: 15,
      image: "https://images.pexels.com/photos/1174996/pexels-photo-1174996.jpeg",
      featured: true
    },
    {
      id: 3,
      title: "Midnight in Tokyo",
      category: "feature",
      genre: "Drama",
      director: "Hana Tanaka",
      fundingGoal: 1200000,
      fundingRaised: 480000,
      investors: 53,
      daysLeft: 34,
      image: "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg",
      featured: true
    },
    {
      id: 4,
      title: "The Climate Frontier",
      category: "series",
      genre: "Environmental Series",
      director: "David Marshall",
      fundingGoal: 3200000,
      fundingRaised: 1950000,
      investors: 203,
      daysLeft: 45,
      image: "https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg",
      featured: true
    }
  ];
  
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

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
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeCategory === category.id
                    ? 'bg-gold-500 text-navy-900'
                    : 'bg-navy-800 text-white hover:bg-navy-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a 
            href="/projects" 
            className="inline-block border border-gold-500 text-white hover:bg-navy-800 px-6 py-3 rounded-md font-medium transition-colors"
          >
            View All Projects
          </a>
        </motion.div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    category: string;
    genre: string;
    director: string;
    fundingGoal: number;
    fundingRaised: number;
    investors: number;
    daysLeft: number;
    image: string;
    featured: boolean;
  };
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const percentFunded = Math.round((project.fundingRaised / project.fundingGoal) * 100);
  
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
          src={project.image} 
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
            <span className="text-gray-300">${(project.fundingRaised / 1000000).toFixed(1)}M raised</span>
          </div>
          <div className="flex items-center">
            <Users size={14} className="text-gold-500 mr-1" />
            <span className="text-gray-300">{project.investors} investors</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={14} className="text-gold-500 mr-1" />
            <span className="text-gray-300">${(project.fundingGoal / 1000000).toFixed(1)}M goal</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="text-gold-500 mr-1" />
            <span className="text-gray-300">{project.daysLeft} days left</span>
          </div>
        </div>
        
        <a 
          href={`/projects/${project.id}`}
          className="mt-auto bg-navy-700 hover:bg-navy-600 text-white text-center py-2 rounded-md transition-colors"
        >
          View Project
        </a>
      </div>
    </motion.div>
  );
};

export default FeaturedProjects;