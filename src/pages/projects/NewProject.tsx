import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
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
  currentStage: string;
  budget: string;
  website: string;
  fundingGoal: string;
  duration: string;
  stableSplit: string;
  synopsis: string;
  description: string;
  investmentHighlights: { title: string; description: string }[];
  financialStructure: { title: string; description: string }[];
  risks: { title: string; description: string }[];
  milestones: { title: string; duration: string; description: string }[];
  coverImage: File | null;
  teamMembers: TeamMember[];
  documents: File[];
  gallery: File[];
  socialLinks: { website: string; twitter: string; instagram: string };
  tokenization: {
    jurisdiction: string;
    legalAdvisor: string;
    tokenizedAssets: string[];
    securityType: string;
    maxSupply: string;
    tokenSymbol: string;
    blockchain: string;
    lockupPeriod: string;
    enableDividends: boolean;
    tradingOption: string;
    whitelistOnly: boolean;
    tokenPrice: string;
    customTerms: string;
    vestingStartDate: string;
    vestingDuration: string;
    cliffPeriod: string;
    requireKycAml: boolean;
    accreditedOnly: boolean;
    distributionMethod: string;
    secondaryMarket: string;
    spvName: string;
    legalDocuments: File[];
  };
  paymentAmount: string;
}

const initialFormData: FormData = {
  title: 'ABC',
  tagline: 'EDF',
  genre: 'action',
  status: 'pending',
  timeline: '123',
  currentStage: '123',
  budget: '123',
  website: '123',
  fundingGoal: '100000',
  duration: '30',
    stableSplit: '70',
  synopsis: 'Synopsis',
  description: 'Description',
  investmentHighlights: [{ title: 'Investment Highlight 1', description: 'Description'}],
  financialStructure: [{ title: 'Financial Structure 1', description: 'Description'}],
  risks: [{ title: 'Risk 1', description: 'Description'}],
  milestones: [{ title: 'Milestone 1', duration: '123', description: 'Description'}],
  coverImage: null,
  teamMembers: [{
    name: '',
    role: '',
    bio: '',
    image: null,
    notableProjects: []
  }],
    documents: [],
    gallery: [],
    socialLinks: { website: '', twitter: '', instagram: '' },
    tokenization: {
    jurisdiction: 'us',
    legalAdvisor: 'advisor1',
    tokenizedAssets: ['Film Equity', 'Future Profits'],
    securityType: 'regD',
    maxSupply: '1000000000',
    tokenSymbol: 'FILM',
    blockchain: 'ethereum',
    lockupPeriod: '12',
    enableDividends: true,
    tradingOption: 'sto',
    whitelistOnly: true,
    tokenPrice: '1.00',
    customTerms: 'Standard terms apply. Additional conditions may be specified in the legal documentation.',
    vestingStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    vestingDuration: '24',
    cliffPeriod: '6',
      requireKycAml: true,
    accreditedOnly: true,
    distributionMethod: 'wallet',
    secondaryMarket: 'sto',
    spvName: 'FilmFund SPV LLC',
    legalDocuments: []
  },
  paymentAmount: '100', // Default payment amount
};

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
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

    if (field === 'coverImage') {
      setFormData(prev => ({
        ...prev,
        coverImage: validFiles[0] || null
      }));
    } else if (field === 'gallery') {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...validFiles]
      }));
    } else if (field === 'legalDocuments') {
    setFormData(prev => ({
      ...prev,
      tokenization: {
        ...prev.tokenization,
          legalDocuments: [...prev.tokenization.legalDocuments, ...validFiles]
      }
    }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: validFiles
      }));
    }
  };
  

  const handleTeamMemberImageChange = (index: number, file: File | null) => {
    const newTeamMembers = [...formData.teamMembers];
    newTeamMembers[index] = { ...newTeamMembers[index], image: file };
    setFormData(prev => ({
      ...prev,
      teamMembers: newTeamMembers
    }));
  };

  const handlePaymentSuccess = async () => {
    console.log('Payment successful. Creating project...');
    setIsCreating(true);
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to create a project');
      }

      // First, upload all files in parallel
      setCreationProgress('Uploading files...');
      console.log('Uploading files...');
      
      // Prepare all file upload promises
      const coverImageUploadPromise = formData.coverImage 
        ? projectService.uploadFile(
            'project-images',
            `${currentUser.id}/${formData.coverImage.name}`,
            formData.coverImage
          )
        : Promise.resolve('');

      const teamMemberUploadPromises = formData.teamMembers.map(member => {
        if (!member.image) return Promise.resolve({ ...member, image_url: '' });
        
        return projectService.uploadFile(
          'team-member-images',
          `${currentUser.id}/${member.name.replace(/\s+/g, '-').toLowerCase()}.${member.image.name.split('.').pop()}`,
          member.image
        ).then(memberImageUrl => ({ ...member, image_url: memberImageUrl }));
      });

      // Upload all other files in parallel
      const documentUploadPromises = formData.documents.map(file => 
        projectService.uploadFile('project-documents', `${currentUser.id}/${file.name}`, file)
      );
      
      const galleryUploadPromises = formData.gallery.map(file => 
        projectService.uploadFile('project-gallery', `${currentUser.id}/${file.name}`, file)
      );
      
      const legalDocumentUploadPromises = formData.tokenization.legalDocuments.map(file => 
        projectService.uploadFile('legal-documents', `${currentUser.id}/${file.name}`, file)
      );

      // Wait for all uploads to complete
      const [
        coverImageUrl,
        teamMembersWithImages,
        documentUploads,
        galleryUploads,
        legalDocumentUploads
      ] = await Promise.all([
        coverImageUploadPromise,
        Promise.all(teamMemberUploadPromises),
        Promise.all(documentUploadPromises),
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
        current_stage: formData.currentStage,
        budget: parseFloat(formData.budget),
        website: formData.website,
        funding_goal: parseFloat(formData.fundingGoal),
        duration: parseInt(formData.duration),
        stable_split: parseInt(formData.stableSplit),
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
          image_url: member.image_url
        })
      );
      await Promise.all(teamMemberPromises);

      // Add social links
      setCreationProgress('Adding social links...');
      console.log('Adding social links...');
      const socialLinkPromises = Object.entries(formData.socialLinks)
        .filter(([_, url]) => url)
        .map(([platform, url]) => 
          projectService.addProjectSocialLink({
            project_id: project.id,
            website: platform === 'website' ? url : null,
            twitter: platform === 'twitter' ? url : null,
            instagram: platform === 'instagram' ? url : null
          })
        );
      await Promise.all(socialLinkPromises);

      // Create tokenization
      setCreationProgress('Creating tokenization...');
      console.log('Creating tokenization...');
      await projectService.createTokenization({
        project_id: project.id,
        jurisdiction: formData.tokenization.jurisdiction,
        legal_advisor: formData.tokenization.legalAdvisor,
        tokenized_assets: formData.tokenization.tokenizedAssets,
        security_type: formData.tokenization.securityType,
        max_supply: formData.tokenization.maxSupply.toString(),
        token_symbol: formData.tokenization.tokenSymbol,
        blockchain: formData.tokenization.blockchain,
        lockup_period: formData.tokenization.lockupPeriod.toString(),
        enable_dividends: formData.tokenization.enableDividends,
        trading_option: formData.tokenization.tradingOption,
        whitelist_only: formData.tokenization.whitelistOnly,
        token_price: formData.tokenization.tokenPrice.toString(),
        custom_terms: formData.tokenization.customTerms,
        vesting_start_date: formData.tokenization.vestingStartDate,
        vesting_duration: formData.tokenization.vestingDuration.toString(),
        cliff_period: formData.tokenization.cliffPeriod.toString(),
        require_kyc_aml: formData.tokenization.requireKycAml,
        accredited_only: formData.tokenization.accreditedOnly,
        distribution_method: formData.tokenization.distributionMethod,
        secondary_market: formData.tokenization.secondaryMarket,
        spv_name: formData.tokenization.spvName
      });

      // Link uploaded files to the project
      setCreationProgress('Linking files to project...');
      console.log('Linking files to project...');
      const fileLinkPromises = [
        ...documentUploads.map(url => 
          projectService.addProjectMedia({
            project_id: project.id,
            file_url: url,
            file_type: 'document',
            file_name: url.split('/').pop() || 'document'
          })
        ),
        ...galleryUploads.map(url => 
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
      const investmentHighlightPromises = formData.investmentHighlights.map(highlight => 
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
      const financialStructurePromises = formData.financialStructure.map(structure => 
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
    navigate('/filmmaker/dashboard');
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
      teamMembers: [...prev.teamMembers, { name: '', role: '', bio: '', image: null, notableProjects: [] }]
    }));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newTeamMembers = [...formData.teamMembers];
    newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      teamMembers: newTeamMembers
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
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
      investmentHighlights: [...prev.investmentHighlights, { title: '', description: '' }]
    }));
  };

  const updateInvestmentHighlight = (index: number, field: string, value: string) => {
    const newInvestmentHighlights = [...formData.investmentHighlights];
    newInvestmentHighlights[index] = { ...newInvestmentHighlights[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      investmentHighlights: newInvestmentHighlights 
    }));
  };

  const removeInvestmentHighlight = (index: number) => {
    const newInvestmentHighlights = [...formData.investmentHighlights];
    newInvestmentHighlights.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      investmentHighlights: newInvestmentHighlights
    }));
  };

  const addFinancialStructure = () => { 
    setFormData(prev => ({
      ...prev,
      financialStructure: [...prev.financialStructure, { title: '', description: '' }]
    }));
  };

  const updateFinancialStructure = (index: number, field: string, value: string) => {
    const newFinancialStructure = [...formData.financialStructure];
    newFinancialStructure[index] = { ...newFinancialStructure[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      financialStructure: newFinancialStructure
    }));
  };

  const removeFinancialStructure = (index: number) => {
    const newFinancialStructure = [...formData.financialStructure];
    newFinancialStructure.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      financialStructure: newFinancialStructure
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
  
  

  const handleRemoveFile = (field: 'coverImage' | 'gallery' | 'documents' | 'legalDocuments', index?: number) => {
    if (field === 'legalDocuments') {
      setFormData(prev => ({
        ...prev,
        tokenization: {
          ...prev.tokenization,
          legalDocuments: prev.tokenization.legalDocuments.filter((_, i) => i !== index)
        }
      }));
    } else if (index !== undefined) {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field] as File[]).filter((_: File, i: number) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: null
      }));
    }
    // Reset the file input
    const input = document.getElementById(field === 'coverImage' ? 'cover-image' : 
      field === 'gallery' ? 'gallery-images' : 
      field === 'legalDocuments' ? 'legal-documents' : 'project-documents') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const addNotableProject = (memberIndex: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, index) => 
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
      teamMembers: prev.teamMembers.map((member, index) => 
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
      teamMembers: prev.teamMembers.map((member, index) => 
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
              <h3 className="text-white text-lg font-medium mb-2">Creating Project</h3>
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
              to="/filmmaker/dashboard"
              className="inline-flex items-center text-gray-400 hover:text-white mb-4"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
            <p className="text-gray-400">
              Fill in the details below to submit your film project for funding consideration.
            </p>
          </motion.div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {['Project Details', 'Team & Media', 'Financials', 'Payment'].map((step, index) => (
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
                        <label htmlFor="currentStage" className="block text-sm font-medium text-gray-300 mb-1">
                          Current Stage
                        </label>
                        <input
                          type="text"
                          id="currentStage"
                          name="currentStage"
                          value={formData.currentStage}
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
                    {formData.teamMembers.map((member, index) => (
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
                            Notable Projects
                          </label>
                          <div className="space-y-4">
                            {member.notableProjects.map((project, projectIndex) => (
                              <div key={projectIndex} className="p-4 bg-navy-600 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-white font-medium">Project {projectIndex + 1}</h4>
                    <button
                      type="button"
                                    onClick={() => removeNotableProject(index, projectIndex)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                    >
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

                    <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Profile Image
                      </label>
                          <div className="border-2 border-dashed border-navy-600 rounded-lg p-6">
                        <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
                                  handleTeamMemberImageChange(index, file);
                                } else if (file) {
                                  error('Image file size must be less than 5MB');
                                }
                              }}
                              className="hidden"
                              id={`team-member-image-${index}`}
                            />
                            <label
                              htmlFor={`team-member-image-${index}`}
                              className="flex flex-col items-center cursor-pointer"
                            >
                              {member.image ? (
                                <div className="relative w-32 h-32 mb-2">
                                  <img
                                    src={URL.createObjectURL(member.image)}
                                    alt={member.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleTeamMemberImageChange(index, null);
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
                          onChange={(e) => handleFileChange(e, 'coverImage')}
                          className="hidden"
                          id="cover-image"
                        />
                        <label
                          htmlFor="cover-image"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          {formData.coverImage ? (
                            <div className="relative w-64 h-36 mb-2">
                              <img
                                src={URL.createObjectURL(formData.coverImage)}
                                alt="Cover"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveFile('coverImage');
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
                          <ImageIcon size={32} className="text-gray-400 mb-2" />
                          <p className="text-gray-400 text-center mb-1">
                            Click to upload gallery images
                          </p>
                          <p className="text-sm text-gray-500 text-center">
                            PNG, JPG or GIF (max 10MB each)
                          </p>
                        </label>
                      </div>
                      {formData.gallery.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          {formData.gallery.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Gallery ${index + 1}`}
                                className="w-full object-cover rounded-lg"
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
                      )}
                      </div>

                      <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Documents
                        </label>
                      <div className="border-2 border-dashed border-navy-600 rounded-lg p-6">
                          <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          multiple
                          onChange={(e) => handleFileChange(e, 'documents')}
                          className="hidden"
                          id="project-documents"
                        />
                        <label
                          htmlFor="project-documents"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <FileText size={32} className="text-gray-400 mb-2" />
                          <p className="text-gray-400 text-center mb-1">
                            Click to upload project documents
                          </p>
                          <p className="text-sm text-gray-500 text-center">
                            PDF, DOC, DOCX or TXT (max 10MB each)
                          </p>
                        </label>
                        </div>
                      {formData.documents.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {formData.documents.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-navy-700 p-2 rounded-lg">
                              <div className="flex items-center">
                                <FileText size={16} className="text-gray-400 mr-2" />
                                <span className="text-gray-300">{file.name}</span>
                      </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile('documents', index)}
                                className="text-red-400 hover:text-red-300"
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

            {currentStep === 3 && (
            <>
                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                <h2 className="text-xl font-bold text-white mb-4">Investment Highlight</h2>
              
                <div className="space-y-6">
                  {formData.investmentHighlights.map((highlight, index) => (
                    <div key={index} className="p-4 bg-navy-700 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-medium">Investment {index + 1}</h3>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeInvestmentHighlight(index)}
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
                  {formData.financialStructure.map((structure, index) => (
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
                        required
                      />
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
                        required
                      />
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
                  <h2 className="text-xl font-bold text-white mb-4">Payment</h2>
                  
                  <div className="space-y-4">
                  <div>
                      <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-300 mb-1">
                        Payment Amount (USD)
                    </label>
                      <div className="relative">
                        <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                          type="number"
                          id="paymentAmount"
                          name="paymentAmount"
                          value={formData.paymentAmount}
                      onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          placeholder="Enter amount"
                          required
                          min="1"
                          step="0.01"
                        />
                      </div>
                    <p className="mt-1 text-sm text-gray-400">
                        This fee covers the cost of processing your project submission
                    </p>
                </div>

                    <StripePaymentForm
                      amount={parseFloat(formData.paymentAmount)}
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
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
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