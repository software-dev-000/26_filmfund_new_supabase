import { supabase } from '../config/supabase';
import { s3Service } from './s3Service';
import { 
  Project, 
  ProjectTeamMember,
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

  async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_team_members (*),
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
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
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

  async getAllProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_team_members (*),
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
  }
}; 