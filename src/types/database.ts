export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'filmmaker' | 'investor';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  filmmaker_id: string;
  title: string;
  tagline: string | null;
  genre: string;
  status: string;
  timeline: string | null;
  current_stage: string | null;
  budget: number;
  website: string | null;
  funding_goal: number;
  duration: number;
  stable_split: number;
  synopsis: string | null;
  description: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  created_at: string;
}

export interface ProjectTeamMember {
  id: string;
  project_id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  created_at: string;
}

export interface ProjectTeamMemberProject {
  id: string;
  team_member_id: string;
  title: string;
  link: string | null;
  description: string | null;
  created_at: string;
}

export interface ProjectSocialLink {
  id: string;
  project_id: string;
  website: string | null;
  twitter: string | null;
  instagram: string | null;
  created_at: string;
}

export interface ProjectInvestmentHighlight {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface ProjectFinancialStructure {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface ProjectRisk {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  duration: string;
  description: string | null;
  created_at: string;
}

export interface ProjectTokenization {
  id: string;
  project_id: string;
  jurisdiction: string;
  legal_advisor: string | null;
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
  custom_terms: string | null;
  vesting_start_date: string;
  vesting_duration: string;
  cliff_period: string;
  require_kyc_aml: boolean;
  accredited_only: boolean;
  distribution_method: string;
  secondary_market: string;
  spv_name: string;
  created_at: string;
}

export interface ProjectLegalDocument {
  id: string;
  project_id: string;
  file_url: string;
  file_name: string;
  created_at: string;
}

export interface ProjectPayment {
  id: string;
  project_id: string;
  amount: number;
  status: string;
  payment_intent_id: string | null;
  created_at: string;
} 

export interface PrivateSale {
  id: string;
  user_id: string;
  wallet_address: string;
  token_amount: number;
  quote_amount: number;
  created_at: string;
  transaction_hash: string;
}
