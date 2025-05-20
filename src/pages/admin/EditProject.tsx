import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { projectService } from '../../services/projectService';
import NewProject from '../projects/NewProject';

function transformProjectData(dbData: any) {
  // Combine social links into a single object
  const socialLinks = {
    website: dbData.project_social_links?.find((l: any) => l.website)?.website || '',
    twitter: dbData.project_social_links?.find((l: any) => l.twitter)?.twitter || '',
    instagram: dbData.project_social_links?.find((l: any) => l.instagram)?.instagram || '',
  };

  return {
    ...dbData,
    team_members: dbData.project_team_members || [],
    milestones: dbData.project_milestones || [],
    investment_highlights: dbData.project_investment_highlights || [],
    financial_structures: dbData.project_financial_structures || [],
    risks: dbData.project_risks || [],
    gallery: [], // You can map project_media here if you have images
    tokenization: dbData.project_tokenization?.[0] || {}, // Use the first tokenization object
    social_links: socialLinks,
    // Add any other mappings as needed
  };
}

function extractS3Path(url: string, bucket: string) {
  // Example: https://.../project-cover-image/userid/filename.jpg => userid/filename.jpg
  const idx = url.indexOf(`${bucket}/`);
  return idx !== -1 ? url.substring(idx + bucket.length + 1) : '';
}

const EditProject: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const project = await projectService.getProjectById(projectId);
        console.log('projeect editing ', project);
        setProjectData(transformProjectData(project));
      } catch (err) {
        error('Failed to fetch project details');
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, navigate, error]);

  const handleUpdate = async (updatedData: any) => {
    if (!projectId || !projectData || !currentUser) return;
    setIsUpdating(true);
    try {
      // --- COVER IMAGE ---
      let coverImageUrl = projectData.cover_image;
      if (updatedData.cover_image && updatedData.cover_image !== projectData.cover_image) {
        if (projectData.cover_image) {
          await projectService.deleteFile('project-cover-image', extractS3Path(projectData.cover_image, 'project-cover-image'));
        }
        coverImageUrl = await projectService.uploadFile(
          'project-cover-image',
          `${currentUser.id}/${updatedData.cover_image.name}`,
          updatedData.cover_image
        );
      }

      // --- GALLERY ---
      // DB: project_media (file_type: 'image')
      const originalGallery = projectData.gallery || [];
      const updatedGallery = updatedData.gallery || [];
      // Remove deleted images
      for (const img of originalGallery) {
        if (!updatedGallery.some((f: any) => f.name === img.file_name)) {
          await projectService.deleteFile('project-gallery', extractS3Path(img.file_url, 'project-gallery'));
          await projectService.deleteProjectMedia(img.id);
        }
      }
      // Add new images
      for (const file of updatedGallery) {
        if (!originalGallery.some((img: any) => img.file_name === file.name)) {
          const url = await projectService.uploadFile('project-gallery', `${currentUser.id}/${file.name}`, file);
          await projectService.addProjectMedia({
            project_id: projectId,
            file_url: url,
            file_type: 'image',
            file_name: file.name,
          });
        }
      }

      // --- DOCUMENTS ---
      // DB: project_media (file_type: 'document')
      const originalDocs = projectData.documents || [];
      const updatedDocs = updatedData.documents || [];
      for (const doc of originalDocs) {
        if (!updatedDocs.some((f: any) => f.name === doc.file_name)) {
          await projectService.deleteFile('project-documents', extractS3Path(doc.file_url, 'project-documents'));
          await projectService.deleteProjectMedia(doc.id);
        }
      }
      for (const file of updatedDocs) {
        if (!originalDocs.some((doc: any) => doc.file_name === file.name)) {
          const url = await projectService.uploadFile('project-documents', `${currentUser.id}/${file.name}`, file);
          await projectService.addProjectMedia({
            project_id: projectId,
            file_url: url,
            file_type: 'document',
            file_name: file.name,
          });
        }
      }

      // --- LEGAL DOCUMENTS ---
      // DB: project_legal_documents
      const originalLegalDocs = projectData.tokenization.legal_documents || [];
      const updatedLegalDocs = updatedData.tokenization.legal_documents || [];
      for (const doc of originalLegalDocs) {
        if (!updatedLegalDocs.some((f: any) => f.name === doc.file_name)) {
          await projectService.deleteFile('legal-documents', extractS3Path(doc.file_url, 'legal-documents'));
          await projectService.deleteLegalDocument(doc.id);
        }
      }
      for (const file of updatedLegalDocs) {
        if (!originalLegalDocs.some((doc: any) => doc.file_name === file.name)) {
          const url = await projectService.uploadFile('legal-documents', `${currentUser.id}/${file.name}`, file);
          await projectService.addLegalDocument({
            project_id: projectId,
            file_url: url,
            file_name: file.name,
          });
        }
      }

      // --- MAIN PROJECT TABLE ---
      const {
        documents, gallery, team_members, investment_highlights, financial_structures, risks, milestones, social_links, tokenization, ...projectFields
      } = updatedData;
      await projectService.updateProject(projectId, {
        ...projectFields,
        cover_image: coverImageUrl,
      });

      // --- TEAM MEMBERS, SOCIAL LINKS, TOKENIZATION, ETC. ---
      // (Implement similar diff logic or full replace as needed)
      // For brevity, you may want to delete all and re-add, or implement more granular updates.

      success('Project updated successfully');
      navigate('/admin/dashboard');
    } catch (err) {
      error('Failed to update project');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-navy-950 pt-20 flex items-center justify-center">
        <div className="text-white">Project not found</div>
      </div>
    );
  }

  return (
    <NewProject 
      isEditing={true}
      initialData={projectData}
      onUpdate={handleUpdate}
    />
  );
};

export default EditProject; 