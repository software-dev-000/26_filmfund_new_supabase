import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  Building2,
  Scale,
  Shield,
  Wallet,
  Coins,
  Tag,
  Globe,
  Lock,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { projectService } from '../../services/projectService';
import StripePaymentForm from '../../components/payment/StripePaymentForm';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: File | null;
  notableProjects: {
    title: string;
    link: string;
    description: string;
  }[];
}

interface FormData {
  title: string;
  tagline: string;
  genre: string;
  status: string;
  timeline: string;
  current_stage: string;
  budget: string;
  website: string;
  funding_goal: string;
  duration: string;
  stable_split: string;
  synopsis: string;
  description: string;
  investment_highlights: { title: string; description: string }[];
  financial_structures: { title: string; description: string }[];
  risks: { title: string; description: string }[];
  milestones: { title: string; duration: string; description: string }[];
  cover_image: File | null;
  team_members: TeamMember[];
  gallery: File[];
  social_links: { website: string; twitter: string; instagram: string };
  tokenization: {
    jurisdiction: string;
    legal_advisor: string;
    tokenized_assets: string[];
    security_type: string;
    max_supply: string;
    token_symbol: string;
    blockchain: string;
    lockup_period: string;
    enable_dividends: boolean;
    trading_option: string;
    whitelist_only: boolean;
    token_price: string;
    custom_terms: string;
    vesting_start_date: string;
    vesting_duration: string;
    cliff_period: string;
    require_kyc_aml: boolean;
    accredited_only: boolean;
    distribution_method: string;
    secondary_market: string;
    spv_name: string;
    legal_documents: File[];
  };
  payment_amount: string;
}

const initialFormData: FormData = {
  title: 'ABC',
  tagline: 'EDF',
  genre: 'action',
  status: 'pending',
  timeline: 'timeline',
  current_stage: 'current stage',
  budget: '1000000',
  website: 'https://www.filmfund.io',
  funding_goal: '1000000',
  duration: '30',
  stable_split: '70',
  synopsis: 'Synopsis',
  description: 'Description',
  investment_highlights: [{ title: 'Investment Highlight 1', description: 'Description'}],
  financial_structures: [{ title: 'Financial Structure 1', description: 'Description'}],
  risks: [{ title: 'Risk 1', description: 'Description'}],
  milestones: [{ title: 'Milestone 1', duration: 'Q1 2025', description: 'Description'}],
  cover_image: null,
  team_members: [{
    name: 'John Doe',
    role: 'Producer',
    bio: 'John Doe is a producer with over 20 years of experience in the film industry.',
    image: null,
    notableProjects: [{
      title: 'Project 1',
      link: 'https://www.filmfund.io',
      description: 'Description'
    }]
  }],
  gallery: [],
  social_links: { website: 'https://www.filmfund.io', twitter: 'https://twitter.com/filmfund', instagram: 'https://www.instagram.com/filmfund' },
  tokenization: {
    jurisdiction: 'us',
    legal_advisor: 'advisor1',
    tokenized_assets: ['Film Equity', 'Future Profits'],
    security_type: 'regD',
    max_supply: '1000000000',
    token_symbol: 'FILM',
    blockchain: 'ethereum',
    lockup_period: '12',
    enable_dividends: true,
    trading_option: 'sto',
    whitelist_only: true,
    token_price: '1.00',
    custom_terms: 'Standard terms apply. Additional conditions may be specified in the legal documentation.',
    vesting_start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    vesting_duration: '24',
    cliff_period: '6',
    require_kyc_aml: true,
    accredited_only: true,
    distribution_method: 'wallet',
    secondary_market: 'sto',
    spv_name: 'FilmFund SPV LLC',
    legal_documents: []
  },
  payment_amount: '2750', // Default payment amount
};

interface NewProjectProps {
  isEditing?: boolean;
  initialData?: any;
  onUpdate?: (data: any) => Promise<void>;
}

const NewProject: React.FC<NewProjectProps> = ({ isEditing = false, initialData, onUpdate }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData || initialFormData);
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('tokenization.')) {
      const tokenField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        tokenization: {
          ...prev.tokenization,
          [tokenField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (name: string) => {
    if (name.startsWith('tokenization.')) {
      const tokenField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        tokenization: {
          ...prev.tokenization,
          [tokenField]: !prev.tokenization[tokenField as keyof typeof prev.tokenization]
        }
      }));
    }
  };

  const handleMultiSelect = (field: string, value: string) => {
    const currentValues = formData.tokenization[field as keyof typeof formData.tokenization] as string[];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setFormData(prev => ({
      ...prev,
      tokenization: {
        ...prev.tokenization,
        [field]: updatedValues
      }
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
    
    if (validFiles.length !== files.length) {
      error('Some files were skipped because they exceed the 10MB size limit');
    }

    if (field === 'cover_image') {
      setFormData(prev => ({
        ...prev,
        cover_image: validFiles[0] || null
      }));
    } else if (field === 'gallery') {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...validFiles]
      }));
    } else if (field === 'legal_documents') {
      setFormData(prev => ({
        ...prev,
        tokenization: {
          ...prev.tokenization,
          legal_documents: validFiles
        }
      }));
    } else if (field.startsWith('team_member_image_')) {
      const index = parseInt(field.replace('team_member_image_', ''));
      const newTeamMembers = [...formData.team_members];
      newTeamMembers[index] = { ...newTeamMembers[index], image: validFiles[0] || null };
      setFormData(prev => ({
        ...prev,
        team_members: newTeamMembers
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: validFiles
      }));
    }
  };
  

  const handlePaymentSuccess = async () => {
    console.log('Payment successful. Creating project...');
    setIsCreating(true);
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to create a project');
      }

      if (isEditing && onUpdate) {
        // Update existing project
        setCreationProgress('Updating project...');
        await onUpdate(formData);
        return;
      }

      // First, upload all files in parallel
      setCreationProgress('Uploading files...');
      console.log('Uploading files...');
      
      // Prepare all file upload promises
      const coverImageUploadPromise = formData.cover_image 
        ? projectService.uploadFile(
            'project-cover-image',
            `${currentUser.id}/${formData.cover_image.name}`,
            formData.cover_image
          )
        : Promise.resolve('');

      const teamMemberUploadPromises = formData.team_members.map(member => {
        if (!member.image) return Promise.resolve({ ...member, image_url: '' });
        
        return projectService.uploadFile(
          'team-member-avatar',
          `${currentUser.id}/${member.name.replace(/\s+/g, '-').toLowerCase()}.${member.image.name.split('.').pop()}`,
          member.image
        ).then(memberImageUrl => ({ ...member, image_url: memberImageUrl }));
      });

      // Upload all other files in parallel
      
      const galleryUploadPromises = formData.gallery.map(file => 
        projectService.uploadFile('project-gallery', `${currentUser.id}/${file.name}`, file)
      );
      console.log('legal_documents', formData.tokenization.legal_documents);
      const legalDocumentUploadPromises = formData.tokenization.legal_documents.map(file => 
        projectService.uploadFile('legal-documents', `${currentUser.id}/${file.name}`, file)
      );

      // Wait for all uploads to complete
      const [
        coverImageUrl,
        teamMembersWithImages,
        galleryUploads,
        legalDocumentUploads
      ] = await Promise.all([
        coverImageUploadPromise,
        Promise.all(teamMemberUploadPromises),
        Promise.all(galleryUploadPromises),
        Promise.all(legalDocumentUploadPromises)
      ]);

      console.log('All files uploaded successfully');

      // Now create the project in the database
      setCreationProgress('Creating project in database...');
      console.log('Creating project in database...');
      const project = await projectService.createProject({
        filmmaker_id: currentUser.id,
        title: formData.title,
        tagline: formData.tagline,
        genre: formData.genre,
        status: formData.status as any,
        timeline: formData.timeline,
        current_stage: formData.current_stage,
        budget: parseFloat(formData.budget),
        website: formData.website,
        funding_goal: parseFloat(formData.funding_goal),
        duration: parseInt(formData.duration),
        stable_split: parseInt(formData.stable_split),
        synopsis: formData.synopsis,
        description: formData.description,
        cover_image: coverImageUrl,
      });

      // Add team members with their uploaded images
      setCreationProgress('Adding team members...');
      console.log('Adding team members...');
      const teamMemberPromises = teamMembersWithImages.map(member => 
        projectService.addTeamMember({
          project_id: project.id,
          name: member.name,
          role: member.role,
          bio: member.bio,
          image_url: member.image_url,
        })
      );
      const createdTeamMembers = await Promise.all(teamMemberPromises);

      // Add team member's notable projects
      setCreationProgress('Adding team member\'s notable projects...');
      console.log('Adding team member\'s notable projects...');
      const notableProjectPromises = createdTeamMembers.map((createdMember, index) => 
        formData.team_members[index].notableProjects.map(project => 
          projectService.addNotableProject({
            team_member_id: createdMember.id,
            title: project.title,
            link: project.link,
            description: project.description,
          })
        )
      );
      await Promise.all(notableProjectPromises.flat());
      // Add social links
      setCreationProgress('Adding social links...');
      console.log('Adding social links...');
      // const socialLinkPromises = Object.entries(formData.social_links)
      //   .filter(([_, url]) => url)
      //   .map(([platform, url]) => 
      //     projectService.addProjectSocialLink({
      //       project_id: project.id,
      //       website: platform === 'website' ? url : null,
      //       twitter: platform === 'twitter' ? url : null,
      //       instagram: platform === 'instagram' ? url : null
      //     })
      //   );
      // await Promise.all(socialLinkPromises);
      await projectService.addProjectSocialLink({
        project_id: project.id,
        website: formData.social_links.website,
        twitter: formData.social_links.twitter,
        instagram: formData.social_links.instagram
      });

      // Create tokenization
      setCreationProgress('Creating tokenization...');
      console.log('Creating tokenization...');
      await projectService.createTokenization({
        project_id: project.id,
        jurisdiction: formData.tokenization.jurisdiction,
        legal_advisor: formData.tokenization.legal_advisor,
        tokenized_assets: formData.tokenization.tokenized_assets,
        security_type: formData.tokenization.security_type,
        max_supply: formData.tokenization.max_supply.toString(),
        token_symbol: formData.tokenization.token_symbol,
        blockchain: formData.tokenization.blockchain,
        lockup_period: formData.tokenization.lockup_period.toString(),
        enable_dividends: formData.tokenization.enable_dividends,
        trading_option: formData.tokenization.trading_option,
        whitelist_only: formData.tokenization.whitelist_only,
        token_price: formData.tokenization.token_price.toString(),
        custom_terms: formData.tokenization.custom_terms,
        vesting_start_date: formData.tokenization.vesting_start_date,
        vesting_duration: formData.tokenization.vesting_duration.toString(),
        cliff_period: formData.tokenization.cliff_period.toString(),
        require_kyc_aml: formData.tokenization.require_kyc_aml,
        accredited_only: formData.tokenization.accredited_only,
        distribution_method: formData.tokenization.distribution_method,
        secondary_market: formData.tokenization.secondary_market,
        spv_name: formData.tokenization.spv_name
      });

      // Link uploaded files to the project
      setCreationProgress('Linking files to project...');
      console.log('Linking files to project...');
      const fileLinkPromises = [
        ...galleryUploads.map((url: string) => 
          projectService.addProjectMedia({
            project_id: project.id,
            file_url: url,
            file_type: 'image',
            file_name: url.split('/').pop() || 'image'
          })
        )
      ];
      await Promise.all(fileLinkPromises);

      // Add legal documents
      setCreationProgress('Adding legal documents...');
      console.log('Adding legal documents...');
      const legalDocumentPromises = legalDocumentUploads.map(url => 
        projectService.addLegalDocument({
          project_id: project.id,
          file_url: url,
          file_name: url.split('/').pop() || 'legal_document'
        })
      );
      await Promise.all(legalDocumentPromises);

      // Add investment highlights
      setCreationProgress('Adding investment highlights...');
      console.log('Adding investment highlights...');
      const investmentHighlightPromises = formData.investment_highlights.map(highlight => 
        projectService.addInvestmentHighlight({
          project_id: project.id,
          title: highlight.title,
          description: highlight.description
        })
      );
      await Promise.all(investmentHighlightPromises);

      // Add financial structures
      setCreationProgress('Adding financial structures...');
      console.log('Adding financial structures...');
      const financialStructurePromises = formData.financial_structures.map(structure => 
        projectService.addFinancialStructure({
          project_id: project.id,
          title: structure.title,
          description: structure.description
        })
      );
      await Promise.all(financialStructurePromises);

      // Add project risks
      setCreationProgress('Adding project risks...');
      console.log('Adding project risks...');
      const riskPromises = formData.risks.map(risk => 
        projectService.addRisk({
          project_id: project.id,
          title: risk.title,
          description: risk.description
        })
      );
      await Promise.all(riskPromises);

      // Add project milestones
      setCreationProgress('Adding project milestones...');
      console.log('Adding project milestones...');
      const milestonePromises = formData.milestones.map(milestone => 
        projectService.addMilestone({
          project_id: project.id,
          title: milestone.title,
          duration: milestone.duration,
          description: milestone.description
        })
      );
      await Promise.all(milestonePromises);

      console.log('Project created successfully!');
      success('Project created successfully!');
      if (currentUser.user_metadata.user_type === 'filmmaker') {
        navigate('/filmmaker/dashboard');
      } else if (currentUser.user_metadata.user_type === 'admin' || currentUser.user_metadata.user_type === "superadmin") {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to create project', err);
      error('Failed to create project', err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsCreating(false);
      setCreationProgress('');
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    error('Payment failed', errorMessage);
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team_members: [...prev.team_members, { name: '', role: '', bio: '', image: null, notableProjects: [] }]
    }));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newTeamMembers = [...formData.team_members];
    newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      team_members: newTeamMembers
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.filter((_, i) => i !== index)
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', duration: '', description: '' }]
    }));
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      milestones: newMilestones
    }));
  };
  

  const removeMilestone = (index: number) => {
    const newMilestones = [...formData.milestones];
    newMilestones.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      milestones: newMilestones 
    }));
  };

  const addInvestmentHighlight = () => {
    setFormData(prev => ({
      ...prev,
      investment_highlights: [...prev.investment_highlights, { title: '', description: '' }]
    }));
  };

  const updateInvestmentHighlight = (index: number, field: string, value: string) => {
    const newInvestmentHighlights = [...formData.investment_highlights];
    newInvestmentHighlights[index] = { ...newInvestmentHighlights[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      investment_highlights: newInvestmentHighlights 
    }));
  };

  const removeInvestmentHighlight = (index: number) => {
    const newInvestmentHighlights = [...formData.investment_highlights];
    newInvestmentHighlights.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      investment_highlights: newInvestmentHighlights
    }));
  };

  const addFinancialStructure = () => { 
    setFormData(prev => ({
      ...prev,
      financial_structures: [...prev.financial_structures, { title: '', description: '' }]
    }));
  };

  const updateFinancialStructure = (index: number, field: string, value: string) => {
    const newFinancialStructure = [...formData.financial_structures];
    newFinancialStructure[index] = { ...newFinancialStructure[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      financial_structures: newFinancialStructure
    }));
  };

  const removeFinancialStructure = (index: number) => {
    const newFinancialStructure = [...formData.financial_structures];
    newFinancialStructure.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      financial_structures: newFinancialStructure
    }));
  };  
  
  const addRisk = () => {
    setFormData(prev => ({
      ...prev,
      risks: [...prev.risks, { title: '', description: '' }]
    }));
  };  
  
  const updateRisk = (index: number, field: string, value: string) => {
    const newRisks = [...formData.risks];
    newRisks[index] = { ...newRisks[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      risks: newRisks 
    }));
  };  
  
  const removeRisk = (index: number) => {
    const newRisks = [...formData.risks];
    newRisks.splice(index, 1);
    setFormData(prev => ({    
      ...prev,
      risks: newRisks
    }));
  };  
  
  

  const handleRemoveTeamMemberImage = (index: number) => {
    const newTeamMembers = [...formData.team_members];
    newTeamMembers[index] = { ...newTeamMembers[index], image: null };
    setFormData(prev => ({
      ...prev,
      team_members: newTeamMembers
    }));
  };

  const handleRemoveFile = (field: 'cover_image' | 'gallery' | 'legal_documents', index?: number) => {
    if (field === 'legal_documents') {
      setFormData(prev => ({
        ...prev,
        tokenization: {
          ...prev.tokenization,
          legal_documents: prev.tokenization.legal_documents.filter((_, i) => i !== index)
        }
      }));
    } else if (index !== undefined) {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field] as File[]).filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const addNotableProject = (memberIndex: number) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.map((member, index) => 
        index === memberIndex 
          ? {
              ...member,
              notableProjects: [...member.notableProjects, { title: '', link: '', description: '' }]
            }
          : member
      )
    }));
  };

  const updateNotableProject = (memberIndex: number, projectIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.map((member, index) => 
        index === memberIndex 
          ? {
              ...member,
              notableProjects: member.notableProjects.map((project, pIndex) => 
                pIndex === projectIndex 
                  ? { ...project, [field]: value }
                  : project
              )
            }
          : member
      )
    }));
  };

  const removeNotableProject = (memberIndex: number, projectIndex: number) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.map((member, index) => 
        index === memberIndex 
          ? {
              ...member,
              notableProjects: member.notableProjects.filter((_, pIndex) => pIndex !== projectIndex)
            }
          : member
      )
    }));
  };

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-navy-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mb-4"></div>
              <h3 className="text-white text-lg font-medium mb-2">
                {isEditing ? 'Updating Project' : 'Creating Project'}
              </h3>
              <p className="text-gray-400 text-center">{creationProgress}</p>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              to={isEditing ? "/admin/dashboard" : "/filmmaker/dashboard"}
              className="inline-flex items-center text-gray-400 hover:text-white mb-4"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </h1>
            <p className="text-gray-400">
              {isEditing 
                ? 'Update your project details below.'
                : 'Fill in the details below to submit your film project for funding consideration.'}
            </p>
          </motion.div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {['Project Details', 'Team & Media', 'Financials', 'Tokenization', 'Payment'].map((step, index) => (
                <div 
                  key={index}
                  className="flex-1 relative"
                >
                  <div className={`
                    h-2 ${index === 0 ? 'rounded-l-full' : index === 4 ? 'rounded-r-full' : ''}
                    ${currentStep > index + 1 ? 'bg-gold-500' : 'bg-navy-800'}
                  `}></div>
                  <div className="absolute top-4 left-0 w-full text-center">
                    <span className={`text-sm ${currentStep === index + 1 ? 'text-gold-500' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={(e) => e.preventDefault()}
            className="space-y-8"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Enter your film's title"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="tagline" className="block text-sm font-medium text-gray-300 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        id="tagline"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="A compelling one-line description"
                        required
                      />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-1">
                          Timeline
                        </label>
                        <input
                          type="text"
                          id="timeline"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          placeholder="Enter your film's timeline"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="current_stage" className="block text-sm font-medium text-gray-300 mb-1">
                          Current Stage
                        </label>
                        <input
                          type="text"
                          id="current_stage"
                          name="current_stage"
                          value={formData.current_stage}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          placeholder="Enter your film's current stage"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1">
                          Budget
                        </label>
                        <input
                          type="text"
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          placeholder="Enter your film's budget"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                          Website
                        </label>
                        <input
                          type="text"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          placeholder="Enter your film's website"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-1">
                          Genre
                        </label>
                        <select
                          id="genre"
                          name="genre"
                          value={formData.genre}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          required
                        >
                          <option value="">Select genre</option>
                          <option value="action">Action</option>
                          <option value="drama">Drama</option>
                          <option value="comedy">Comedy</option>
                          <option value="thriller">Thriller</option>
                          <option value="documentary">Documentary</option>
                          <option value="horror">Horror</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          required
                          disabled={currentUser?.user_metadata.user_type !== 'superadmin'}
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="synopsis" className="block text-sm font-medium text-gray-300 mb-1">
                        Synopsis
                      </label>
                      <textarea
                        id="synopsis"
                        name="synopsis"
                        value={formData.synopsis}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Brief overview of your film"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Detailed description of your project"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                    <h2 className="text-xl font-bold text-white mb-4">Milestones</h2>
                  
                    <div className="space-y-6">
                      {formData.milestones.map((milestone, index) => (
                        <div key={index} className="p-4 bg-navy-700 rounded-lg">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-medium">Milestone {index + 1}</h3>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeMilestone(index)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={milestone.title}
                                onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                                className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                placeholder="Title of the milestone"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={milestone.duration}
                                onChange={(e) => updateMilestone(index, 'duration', e.target.value)}
                                className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                placeholder="e.g., Q1 2025"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Description
                            </label>
                            <textarea
                              value={milestone.description}
                              onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                              placeholder="Description of the milestone"
                              required
                            />
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addMilestone}
                        className="w-full py-3 border-2 border-dashed border-navy-600 rounded-lg text-gray-400 hover:text-white hover:border-navy-500 transition-colors"
                      >
                        + Add Milestone
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold text-white mb-4">Team Members</h2>
                  
                  <div className="space-y-6">
                    {formData.team_members.map((member, index) => (
                      <div key={index} className="p-4 bg-navy-700 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-white font-medium">Team Member {index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(index)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                              className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                              placeholder="Full name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Role
                            </label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                              className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                              placeholder="e.g., Director, Producer"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Bio
                          </label>
                          <textarea
                            value={member.bio}
                            onChange={(e) => updateTeamMember(index, 'bio', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="Brief biography and experience"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Profile Image
                          </label>
                          <div className="border-2 border-dashed border-navy-600 rounded-lg p-6">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, `team_member_image_${index}`)}
                              className="hidden"
                              id={`team-member-image-${index}`}
                            />
                            <label
                              htmlFor={`team-member-image-${index}`}
                              className="flex flex-col items-center cursor-pointer"
                            >
                              {member.image ? (
                                <div className="relative w-48 h-48 mb-2">
                                  <img
                                    src={URL.createObjectURL(member.image)}
                                    alt={member.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleRemoveTeamMemberImage(index);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <ImageIcon size={32} className="text-gray-400 mb-2" />
                                  <p className="text-gray-400 text-center mb-1">
                                    Click to upload profile image
                                  </p>
                                  <p className="text-sm text-gray-500 text-center">
                                    PNG, JPG or GIF (max 5MB)
                                  </p>
                                </>
                              )}
                            </label>
                           </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Notable Projects
                          </label>
                          <div className="space-y-4">
                            {member.notableProjects?.map((project, projectIndex) => (
                              <div key={projectIndex} className="p-4 bg-navy-600 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-white font-medium">Project {projectIndex + 1}</h4>
                                    <button
                                      type="button"
                                      onClick={() => removeNotableProject(index, projectIndex)}
                                      className="text-red-400 hover:text-red-300 text-sm">
                                      Remove
                                    </button>
                                  </div>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Project Title
                                      </label>
                                      <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => updateNotableProject(index, projectIndex, 'title', e.target.value)}
                                        className="w-full px-4 py-2 bg-navy-700 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                        placeholder="Enter project title"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Project Link
                                      </label>
                                      <input
                                        type="url"
                                        value={project.link}
                                        onChange={(e) => updateNotableProject(index, projectIndex, 'link', e.target.value)}
                                        className="w-full px-4 py-2 bg-navy-700 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                        placeholder="Enter project URL"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                      Project Description
                                    </label>
                                    <textarea
                                      value={project.description}
                                      onChange={(e) => updateNotableProject(index, projectIndex, 'description', e.target.value)}
                                      rows={2}
                                      className="w-full px-4 py-2 bg-navy-700 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                      placeholder="Brief description of the project"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addNotableProject(index)}
                              className="w-full py-2 border-2 border-dashed border-navy-500 rounded-lg text-gray-400 hover:text-white hover:border-navy-400 transition-colors"
                            >
                              + Add Notable Project
                            </button>
                          </div>
                        </div>

                        
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="w-full py-3 border-2 border-dashed border-navy-600 rounded-lg text-gray-400 hover:text-white hover:border-navy-500 transition-colors"
                    >
                      + Add Team Member
                    </button>
                      </div>
                    </div>

                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold text-white mb-4">Media & Documents</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cover Image
                      </label>
                      <div className="border-2 border-dashed border-navy-600 rounded-lg p-6">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'cover_image')}
                          className="hidden"
                          id="cover-image"
                        />
                        <label
                          htmlFor="cover-image"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          {formData.cover_image ? (
                            <div className="relative w-64 h-36 mb-2">
                              <img
                                src={ URL.createObjectURL(formData.cover_image)}
                                alt="Cover"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveFile('cover_image');
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <ImageIcon size={32} className="text-gray-400 mb-2" />
                              <p className="text-gray-400 text-center mb-1">
                                Click to upload cover image
                              </p>
                              <p className="text-sm text-gray-500 text-center">
                                PNG, JPG or GIF (max 10MB)
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Gallery
                      </label>
                      <div className="border-2 border-dashed border-navy-600 rounded-lg p-6">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileChange(e, 'gallery')}
                          className="hidden"
                          id="gallery-images"
                        />
                        <label
                          htmlFor="gallery-images"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          {formData.gallery.length > 0 ? (
                            <div className="mt-4 grid grid-cols-3 gap-4">
                              {formData.gallery.map((file, index) => (
                                <div key={index} className="relative w-64 h-36">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile('gallery', index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                          <>
                            <ImageIcon size={32} className="text-gray-400 mb-2" />
                            <p className="text-gray-400 text-center mb-1">
                              Click to upload gallery images
                            </p>
                            <p className="text-sm text-gray-500 text-center">
                              PNG, JPG or GIF (max 10MB each)
                            </p>
                          </>)}
                          
                        </label>
                      </div>
                      
                    </div>

                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
            <>
                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                <h2 className="text-xl font-bold text-white mb-4">Investment Highlight</h2>
              
                <div className="space-y-6">
                  {formData.investment_highlights.map((highlight, index) => (
                    <div key={index} className="p-4 bg-navy-700 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-medium">Investment {index + 1}</h3>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeInvestmentHighlight(index)}
                            className="text-red-400 hover:text-red-300 text-sm">
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Title
                        </label>
                          <input
                            type="text"
                            value={highlight.title}
                            onChange={(e) => updateInvestmentHighlight(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="Title of the investment highlight"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                          </label>
                            <input
                            type="text"
                            value={highlight.description}
                            onChange={(e) => updateInvestmentHighlight(index, 'description', e.target.value)}
                            className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="Description of the investment highlight"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addInvestmentHighlight}
                    className="w-full py-3 border-2 border-dashed border-navy-600 rounded-lg text-gray-400 hover:text-white hover:border-navy-500 transition-colors"
                  >
                    + Add Investment Highlight
                  </button>
                </div>
              </div>

              <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                <h2 className="text-xl font-bold text-white mb-4">Financial Structure</h2>
              
                <div className="space-y-6">
                  {formData.financial_structures.map((structure, index) => (
                    <div key={index} className="p-4 bg-navy-700 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-medium">Financial Structure {index + 1}</h3>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeFinancialStructure(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Title
                        </label>
                          <input
                            type="text"
                            value={structure.title}
                            onChange={(e) => updateFinancialStructure(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="Title of the financial structure"
                            required
                          />
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description
                        </label>
                          <input
                            type="text"
                            value={structure.description}
                            onChange={(e) => updateFinancialStructure(index, 'description', e.target.value)}
                            className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="Description of the financial structure"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addFinancialStructure}
                    className="w-full py-3 border-2 border-dashed border-navy-600 rounded-lg text-gray-400 hover:text-white hover:border-navy-500 transition-colors"
                  >
                    + Add Financial Structure
                  </button>
                </div>
              </div>

              <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                <h2 className="text-xl font-bold text-white mb-4">Risks</h2>
              
                <div className="space-y-6">
                  {formData.risks.map((risk, index) => (
                    <div key={index} className="p-4 bg-navy-700 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-medium">Risk {index + 1}</h3>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeRisk(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={risk.title}
                            onChange={(e) => updateRisk(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="Title of the risk"
                            required />
                          </div> 
                          <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={risk.description}
                            onChange={(e) => updateRisk(index, 'description', e.target.value)}
                            className="w-full px-4 py-2 bg-navy-600 border border-navy-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="Description of the risk"
                            required />
                        </div>
                      </div>
                    </div>
                    ))}
                  
                    <button
                      type="button"
                      onClick={addRisk}
                      className="w-full py-3 border-2 border-dashed border-navy-600 rounded-lg text-gray-400 hover:text-white hover:border-navy-500 transition-colors"
                    >
                      + Add Risk
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold text-white mb-4">Token Structure</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="tokenization.jurisdiction" className="block text-sm font-medium text-gray-300 mb-1">
                          Token Jurisdiction
                        </label>
                        <div className="relative">
                          <Building2 size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            id="tokenization.jurisdiction"
                            name="tokenization.jurisdiction"
                            value={formData.tokenization.jurisdiction}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            required
                          >
                            <option value="">Select jurisdiction</option>
                            <option value="us">United States</option>
                            <option value="eu">European Union</option>
                            <option value="uk">United Kingdom</option>
                            <option value="sg">Singapore</option>
                            <option value="ch">Switzerland</option>
                            <option value="ky">Cayman Islands</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="tokenization.legal_advisor" className="block text-sm font-medium text-gray-300 mb-1">
                          Legal Advisor
                        </label>
                        <div className="relative">
                          <Scale size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            id="tokenization.legal_advisor"
                            name="tokenization.legal_advisor"
                            value={formData.tokenization.legal_advisor}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            required
                          >
                            <option value="">Select advisor</option>
                            <option value="advisor1">Smith & Associates LLP</option>
                            <option value="advisor2">Global Securities Law Group</option>
                            <option value="advisor3">Blockchain Legal Partners</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        What Will Be Tokenized
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Film Equity', 'Future Profits', 'IP Rights', 'Distribution Rights'].map((asset) => (
                          <label
                            key={asset}
                            className="flex items-center p-3 bg-navy-700 rounded-lg cursor-pointer hover:bg-navy-600 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.tokenization.tokenized_assets.includes(asset)}
                              onChange={() => handleMultiSelect('tokenized_assets', asset)}
                              className="h-4 w-4 text-gold-500 rounded border-navy-600 focus:ring-gold-500"
                            />
                            <span className="ml-2 text-white">{asset}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="tokenization.security_type" className="block text-sm font-medium text-gray-300 mb-1">
                          Security Token Type
                        </label>
                        <div className="relative">
                          <Shield size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            id="tokenization.security_type"
                            name="tokenization.security_type"
                            value={formData.tokenization.security_type}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            required
                          >
                            <option value="">Select type</option>
                            <option value="regD">Reg D</option>
                            <option value="regS">Reg S</option>
                            <option value="regA">Reg A+</option>
                            <option value="regCF">Reg CF</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="tokenization.blockchain" className="block text-sm font-medium text-gray-300 mb-1">
                          Blockchain Platform
                        </label>
                        <div className="relative">
                          <Wallet size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            id="tokenization.blockchain"
                            name="tokenization.blockchain"
                            value={formData.tokenization.blockchain}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            required
                          >
                            <option value="">Select blockchain</option>
                            <option value="polygon">Polygon</option>
                            <option value="ethereum">Ethereum</option>
                            <option value="bsc">BSC</option>
                            <option value="solana">Solana</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="tokenization.max_supply" className="block text-sm font-medium text-gray-300 mb-1">
                          Maximum Token Supply
                        </label>
                        <div className="relative">
                          <Coins size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="tokenization.max_supply"
                            name="tokenization.max_supply"
                            value={formData.tokenization.max_supply}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="e.g., 1000000"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="tokenization.token_symbol" className="block text-sm font-medium text-gray-300 mb-1">
                          Token Symbol
                        </label>
                        <div className="relative">
                          <Tag size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="tokenization.token_symbol"
                            name="tokenization.token_symbol"
                            value={formData.tokenization.token_symbol}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="e.g., FILM"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="tokenization.lockup_period" className="block text-sm font-medium text-gray-300 mb-1">
                          Lock-up Period (months)
                        </label>
                        <div className="relative">
                          <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="tokenization.lockup_period"
                            name="tokenization.lockup_period"
                            value={formData.tokenization.lockup_period}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="e.g., 12"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="tokenization.token_price" className="block text-sm font-medium text-gray-300 mb-1">
                          Token Price (USD)
                        </label>
                        <div className="relative">
                          <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            id="tokenization.token_price"
                            name="tokenization.token_price"
                            value={formData.tokenization.token_price}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                            placeholder="e.g., 1.00"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="tokenization.trading_option" className="block text-sm font-medium text-gray-300 mb-1">
                        Transfer/Trading Options
                      </label>
                      <div className="relative">
                        <Globe size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                          id="tokenization.trading_option"
                          name="tokenization.trading_option"
                          value={formData.tokenization.trading_option}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          required
                        >
                          <option value="">Select option</option>
                          <option value="sto">STO Exchange</option>
                          <option value="p2p">P2P with KYC</option>
                          <option value="locked">Not Tradable</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.tokenization.enable_dividends}
                          onChange={() => handleCheckboxChange('tokenization.enable_dividends')}
                          className="h-4 w-4 text-gold-500 rounded border-navy-600 focus:ring-gold-500"
                        />
                        <span className="text-white">Enable Dividend Distribution</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.tokenization.whitelist_only}
                          onChange={() => handleCheckboxChange('tokenization.whitelist_only')}
                          className="h-4 w-4 text-gold-500 rounded border-navy-600 focus:ring-gold-500"
                        />
                        <span className="text-white">Whitelisted Transfers Only</span>
                      </label>
                    </div>

                    <div>
                      <label htmlFor="tokenization.custom_terms" className="block text-sm font-medium text-gray-300 mb-1">
                        Additional Terms
                      </label>
                      <textarea
                        id="tokenization.custom_terms"
                        name="tokenization.custom_terms"
                        value={formData.tokenization.custom_terms}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Enter any additional terms or custom conditions..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold text-white mb-4">Vesting Schedule</h2>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="tokenization.vesting_start_date" className="block text-sm font-medium text-gray-300 mb-1">
                        Vesting Start Date
                      </label>
                      <input
                        type="date"
                        id="tokenization.vesting_start_date"
                        name="tokenization.vesting_start_date"
                        value={formData.tokenization.vesting_start_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="tokenization.vesting_duration" className="block text-sm font-medium text-gray-300 mb-1">
                        Vesting Duration (months)
                      </label>
                      <input
                        type="number"
                        id="tokenization.vesting_duration"
                        name="tokenization.vesting_duration"
                        value={formData.tokenization.vesting_duration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="e.g., 24"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="tokenization.cliff_period" className="block text-sm font-medium text-gray-300 mb-1">
                        Cliff Period (months)
                      </label>
                      <input
                        type="number"
                        id="tokenization.cliff_period"
                        name="tokenization.cliff_period"
                        value={formData.tokenization.cliff_period}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="e.g., 6"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold text-white mb-4">Compliance Requirements</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.tokenization.require_kyc_aml}
                        onChange={() => handleCheckboxChange('tokenization.require_kyc_aml')}
                        className="h-4 w-4 text-gold-500 rounded border-navy-600 focus:ring-gold-500"
                      />
                      <span className="text-white">KYC/AML Requirement</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.tokenization.accredited_only}
                        onChange={() => handleCheckboxChange('tokenization.accredited_only')}
                        className="h-4 w-4 text-gold-500 rounded border-navy-600 focus:ring-gold-500"
                      />
                      <span className="text-white">Accredited Investors Only</span>
                    </label>
                  </div>
                </div>

                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold text-white mb-4">Distribution and Trading</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="tokenization.distribution_method" className="block text-sm font-medium text-gray-300 mb-1">
                        Token Distribution Method
                      </label>
                      <select
                        id="tokenization.distribution_method"
                        name="tokenization.distribution_method"
                        value={formData.tokenization.distribution_method}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        required
                      >
                        <option value="">Select method</option>
                        <option value="wallet">Direct Wallet Transfer</option>
                        <option value="custodial">Custodial Service</option>
                        <option value="vesting">Vesting Contract</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="tokenization.secondary_market" className="block text-sm font-medium text-gray-300 mb-1">
                        Secondary Market Listing
                      </label>
                      <select
                        id="tokenization.secondary_market"
                        name="tokenization.secondary_market"
                        value={formData.tokenization.secondary_market}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        required
                      >
                        <option value="">Select listing plan</option>
                        <option value="sto">STO Exchange</option>
                        <option value="p2p">P2P with KYC</option>
                        <option value="none">No Listing Planned</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold text-white mb-4">Legal Entity</h2>
                  
                  <div>
                    <label htmlFor="tokenization.spv_name" className="block text-sm font-medium text-gray-300 mb-1">
                      SPV or Legal Entity Name
                    </label>
                    <input
                      type="text"
                      id="tokenization.spv_name"
                      name="tokenization.spv_name"
                      value={formData.tokenization.spv_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Enter legal entity name"
                    />
                    <p className="mt-1 text-sm text-gray-400">
                      This entity will be registered or used by the legal advisor for token issuance
                    </p>
                  </div>
                </div>

                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold text-white mb-4">Legal Documents</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Legal Documents
                    </label>
                    <div className="border-2 border-dashed border-navy-600 rounded-lg p-6">
                      <input
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={(e) => handleFileChange(e, 'legal_documents')}
                        className="hidden"
                        id="legal-documents"
                      />
                      <label
                        htmlFor="legal-documents"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <FileText size={32} className="text-gray-400 mb-2" />
                        <p className="text-gray-400 text-center mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 text-center">
                          PDF files only, max 10MB each
                        </p>
                      </label>
                      {formData.tokenization.legal_documents?.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {formData.tokenization.legal_documents.map((file, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-400 justify-between bg-navy-700 p-2 rounded-lg">
                              <div className="flex items-center">
                                <FileText size={16} className="mr-2" />
                                {file.name}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile('legal_documents', index)}
                                className="text-red-400 hover:text-red-300 ml-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold text-white mb-4">Payment</h2>
                  
                  <div className="space-y-4">
                  <div>
                    <label htmlFor="payment_amount" className="block text-sm font-medium text-gray-300 mb-1">
                      Payment Amount (USD)
                    </label>
                      <div className="relative">
                        <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          id="payment_amount"
                          name="payment_amount"
                          value={formData.payment_amount}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          placeholder="Enter amount"
                          required
                          min="1"
                          step="0.01"
                          disabled={true}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-400">
                        This fee covers the cost of processing your project submission
                      </p>
                    </div>

                    <StripePaymentForm
                      amount={parseFloat(formData.payment_amount)}
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => setCurrentStep(3)}
                      onError={handlePaymentError}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 border border-navy-600 text-white rounded-lg hover:bg-navy-800 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 4) {
                      if(currentUser?.user_metadata.user_type === 'superadmin' || currentUser?.user_metadata.user_type === 'admin') {
                        handlePaymentSuccess()
                        return;
                      } else {
                        // if user is not superadmin or admin, set current step to 4 (payment). 
                        // setCurrentStep(currentStep + 1)  // currently all user can submit project without payment
                        handlePaymentSuccess()
                        return;
                      }
                    } else {
                      setCurrentStep(currentStep + 1)
                    }
                  }}
                  className="px-6 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors ml-auto"
                >
                  Next
                </button>
              ) : null}
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default NewProject;