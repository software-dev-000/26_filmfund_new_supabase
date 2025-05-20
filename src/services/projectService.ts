import { supabase } from '../config/supabase';
import { s3Service } from './s3Service';
import { 
  Project, 
  ProjectTeamMember,
  ProjectTeamMemberProject,
  ProjectMedia, 
  ProjectSocialLink,
  ProjectTokenization,
  ProjectMilestone,
  ProjectInvestmentHighlight,
  ProjectFinancialStructure,
  ProjectRisk,
  ProjectLegalDocument,
  ProjectPayment
} from '../types/database';

export const projectService = {
  // Project CRUD operations
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProjectById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_team_members (
          *,
          project_team_member_projects (*)
        ),
        project_media (*),
        project_social_links (*),
        project_tokenization (*),
        project_milestones (*),
        project_investment_highlights (*),
        project_financial_structures (*),
        project_risks (*),
        project_legal_documents (*),
        project_payments (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getAllProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_team_members (
          *,
          project_team_member_projects (*)
        ),
        project_media (*),
        project_social_links (*),
        project_tokenization (*),
        project_milestones (*),
        project_investment_highlights (*),
        project_financial_structures (*),
        project_risks (*),
        project_legal_documents (*),
        project_payments (*)
      `);

    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(id: string) {
    try {
      // First, get all files that need to be deleted from S3
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select(`
          cover_image,
          project_media (file_url),
          project_legal_documents (file_url),
          project_team_members (image_url)
        `)
        .eq('id', id)
        .single();

      console.log('[project]', project);
      // return;
      if (fetchError) throw fetchError;

      // Delete cover image if exists
      if (project.cover_image) {
        const coverImagePath = project.cover_image.split('project-cover-image/')[1];
        if (coverImagePath) {
          await s3Service.deleteFile('project-cover-image', coverImagePath);
        }
      }

      // Delete media files
      if (project.project_media) {
        await Promise.all(
          project.project_media.map(async (media: any) => {
            const mediaPath = media.file_url.split('project-gallery/')[1];
            if (mediaPath) {
              await s3Service.deleteFile('project-gallery', mediaPath);
            }
          })
        );
      }

      // Delete legal documents
      if (project.project_legal_documents) {
        await Promise.all(
          project.project_legal_documents.map(async (doc: any) => {
            const docPath = doc.file_url.split('legal-documents/')[1];
            if (docPath) {
              await s3Service.deleteFile('legal-documents', docPath);
            }
          })
        );
      }

      // Delete team member images
      if (project.project_team_members) {
        await Promise.all(
          project.project_team_members.map(async (member: any) => {
            const memberPath = member.image_url.split('team-member-avatar/')[1];
            if (memberPath) {
              await s3Service.deleteFile('team-member-avatar', memberPath);
            }
          })
        );
      }

      // Delete the project (this will cascade delete all related records)
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // User operations
  async getAllUserCount() {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count;
  },

  // Team members operations
  async addTeamMember(teamMember: Omit<ProjectTeamMember, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_team_members')
      .insert(teamMember)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTeamMember(id: string, updates: Partial<ProjectTeamMember>) {
    const { data, error } = await supabase
      .from('project_team_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTeamMember(id: string) {
    const { error } = await supabase
      .from('project_team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Team member notable projects operations
  async addNotableProject(notableProject: Omit<ProjectTeamMemberProject, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_team_member_projects')
      .insert(notableProject)
      .select()
      .single();

    if (error) throw error;
    return data;
  },  

  async updateNotableProject(id: string, updates: Partial<ProjectTeamMemberProject>) {
    const { data, error } = await supabase
      .from('project_team_member_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteNotableProject(id: string) {
    const { error } = await supabase
      .from('project_notable_projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },  
  
  // Project media operations
  async addProjectMedia(media: Omit<ProjectMedia, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_media')
      .insert(media)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProjectMedia(id: string) {
    const { error } = await supabase
      .from('project_media')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Project social links operations
  async addProjectSocialLink(social: Omit<ProjectSocialLink, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_social_links')
      .insert(social)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProjectSocialLink(id: string, updates: Partial<ProjectSocialLink>) {
    const { data, error } = await supabase
      .from('project_social_links')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProjectSocialLink(id: string) {
    const { error } = await supabase
      .from('project_social_links')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Tokenization operations
  async createTokenization(tokenization: Omit<ProjectTokenization, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_tokenization')
      .insert(tokenization)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTokenization(id: string, updates: Partial<ProjectTokenization>) {
    const { data, error } = await supabase
      .from('project_tokenization')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Project milestones operations
  async addMilestone(milestone: Omit<ProjectMilestone, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_milestones')
      .insert(milestone)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMilestone(id: string, updates: Partial<ProjectMilestone>) {
    const { data, error } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMilestone(id: string) {
    const { error } = await supabase
      .from('project_milestones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Investment highlights operations
  async addInvestmentHighlight(highlight: Omit<ProjectInvestmentHighlight, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_investment_highlights')
      .insert(highlight)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateInvestmentHighlight(id: string, updates: Partial<ProjectInvestmentHighlight>) {
    const { data, error } = await supabase
      .from('project_investment_highlights')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteInvestmentHighlight(id: string) {
    const { error } = await supabase
      .from('project_investment_highlights')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Financial structures operations
  async addFinancialStructure(structure: Omit<ProjectFinancialStructure, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_financial_structures')
      .insert(structure)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFinancialStructure(id: string, updates: Partial<ProjectFinancialStructure>) {
    const { data, error } = await supabase
      .from('project_financial_structures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFinancialStructure(id: string) {
    const { error } = await supabase
      .from('project_financial_structures')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Project risks operations
  async addRisk(risk: Omit<ProjectRisk, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_risks')
      .insert(risk)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRisk(id: string, updates: Partial<ProjectRisk>) {
    const { data, error } = await supabase
      .from('project_risks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRisk(id: string) {
    const { error } = await supabase
      .from('project_risks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Legal documents operations
  async addLegalDocument(document: Omit<ProjectLegalDocument, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_legal_documents')
      .insert(document)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLegalDocument(id: string) {
    const { error } = await supabase
      .from('project_legal_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Payment operations
  async addPayment(payment: Omit<ProjectPayment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_payments')
      .insert(payment)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePayment(id: string, updates: Partial<ProjectPayment>) {
    const { data, error } = await supabase
      .from('project_payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // File upload operations
  async uploadFile(bucket: string, path: string, file: File) {
    try {
      const publicUrl = await s3Service.uploadFile(bucket, path, file);
      return publicUrl;
    } catch (error) {
      console.error(`Error uploading file to ${bucket}:`, error);
      throw error;
    }
  },

  async getFileUrl(bucket: string, path: string) {
    const publicUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${bucket}/${path}`;
    return publicUrl;
  },

  async deleteFile(bucket: string, path: string) {
    try {
      await s3Service.deleteFile(bucket, path);
    } catch (error) {
      console.error(`Error deleting file from ${bucket}:`, error);
      throw error;
    }
  },

  

};

export interface GlobalStats {
  totalFunded: number;
  globalInvestors: number;
  filmProjects: number;
}

export const fetchGlobalStats = async (): Promise<GlobalStats> => {
  try {
    // Fetch total funded amount from projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('funding_raised')
      .eq('status', 'funded');

    const totalFunded = projectsData?.reduce((sum: number, project: { funding_raised: number }) => 
      sum + (project.funding_raised || 0), 0) || 0;

    // Fetch total number of investors
    const { count: investorCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'investor');

    // Fetch total number of projects
    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    return {
      totalFunded,
      globalInvestors: investorCount || 0,
      filmProjects: projectCount || 0
    };
  } catch (error) {
    console.error('Error fetching global stats:', error);
    return {
      totalFunded: 0,
      globalInvestors: 0,
      filmProjects: 0
    };
  }
}; 