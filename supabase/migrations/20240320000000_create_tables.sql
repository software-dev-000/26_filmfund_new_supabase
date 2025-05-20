CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('filmmaker', 'investor', 'admin', 'superadmin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create projects table
DROP TABLE IF EXISTS public.projects;
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filmmaker_id UUID REFERENCES users(id) NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    genre TEXT NOT NULL,
    status TEXT NOT NULL,
    timeline TEXT,
    current_stage TEXT,
    budget DECIMAL NOT NULL,
    website TEXT,
    funding_goal DECIMAL NOT NULL,
    duration INTEGER NOT NULL,
    stable_split INTEGER NOT NULL,
    synopsis TEXT,
    description TEXT,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_media table
DROP TABLE IF EXISTS public.project_media;
CREATE TABLE project_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_team_members table
DROP TABLE IF EXISTS public.project_team_members;
CREATE TABLE project_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_team_member_projects table
DROP TABLE IF EXISTS public.project_team_member_projects;
CREATE TABLE project_team_member_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_member_id UUID REFERENCES project_team_members(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    link TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_social_links table
DROP TABLE IF EXISTS public.project_social_links;
CREATE TABLE project_social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    website TEXT,
    twitter TEXT,
    instagram TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_investment_highlights table
DROP TABLE IF EXISTS public.project_investment_highlights;
CREATE TABLE project_investment_highlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_financial_structures table
DROP TABLE IF EXISTS public.project_financial_structures;
CREATE TABLE project_financial_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_risks table
DROP TABLE IF EXISTS public.project_risks;
CREATE TABLE project_risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_milestones table
DROP TABLE IF EXISTS public.project_milestones;
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_tokenization table
DROP TABLE IF EXISTS public.project_tokenization;
CREATE TABLE project_tokenization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    jurisdiction TEXT NOT NULL,
    legal_advisor TEXT,
    tokenized_assets TEXT[],
    security_type TEXT NOT NULL,
    max_supply TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    blockchain TEXT NOT NULL,
    lockup_period TEXT NOT NULL,
    enable_dividends BOOLEAN DEFAULT false,
    trading_option TEXT NOT NULL,
    whitelist_only BOOLEAN DEFAULT false,
    token_price TEXT NOT NULL,
    custom_terms TEXT,
    vesting_start_date TEXT NOT NULL,
    vesting_duration TEXT NOT NULL,
    cliff_period TEXT NOT NULL,
    require_kyc_aml BOOLEAN DEFAULT false,
    accredited_only BOOLEAN DEFAULT false,
    distribution_method TEXT NOT NULL,
    secondary_market TEXT NOT NULL,
    spv_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_legal_documents table
DROP TABLE IF EXISTS public.project_legal_documents;
CREATE TABLE project_legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_payments table
DROP TABLE IF EXISTS public.project_payments;
CREATE TABLE project_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    amount DECIMAL NOT NULL,
    status TEXT NOT NULL,
    payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS private_sale;

create table private_sale (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  wallet_address text not null,
  token_amount integer not null,
  quote_amount integer not null,
  transaction_hash text,
  is_claimed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
);

-- Add indexes
create index private_sale_user_id_idx on private_sale(user_id);
create index private_sale_wallet_address_idx on private_sale(wallet_address); 

-- Add RLS policies
alter table private_sale enable row level security;

-- Allow users to insert their own purchases
create policy "Users can insert their own purchases"
on private_sale for insert
with check (auth.uid() = user_id);

-- Allow all users and admins to view all purchases
create policy "All users can view all purchases"
on private_sale for select
using (true);



-- Add RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_member_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_investment_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_financial_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tokenization ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_payments ENABLE ROW LEVEL SECURITY;

-- Projects policies
ALTER POLICY "Enable read access for all users"
    ON users
    TO public
    USING (true);

CREATE POLICY "Users can view all projects"
    ON projects FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = filmmaker_id);

DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
CREATE POLICY "Users can update their own projects or admins can update any project"
    ON projects FOR UPDATE
    USING (
        auth.uid() = filmmaker_id 
        OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type IN ('admin', 'superadmin')
        )
    );

DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
CREATE POLICY "Users can delete their own projects or superadmins can delete any project"
    ON projects FOR DELETE
    USING (
        auth.uid() = filmmaker_id 
        OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'superadmin'
        )
    );

-- Project media policies
CREATE POLICY "Users can view all project media"
    ON project_media FOR SELECT
    USING (true);

CREATE POLICY "Users can create project media for their projects"
    ON project_media FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_media.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

-- Project team members policies
CREATE POLICY "Users can view all project team members"
    ON project_team_members FOR SELECT
    USING (true);

CREATE POLICY "Users can create team members for their projects"
    ON project_team_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_team_members.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

-- Project team member projects policies
CREATE POLICY "Users can view all team member projects"
    ON project_team_member_projects FOR SELECT
    USING (true);

CREATE POLICY "Users can create team member projects"
    ON project_team_member_projects FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM project_team_members
            JOIN projects ON projects.id = project_team_members.project_id
            WHERE project_team_members.id = project_team_member_projects.team_member_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

-- Project social links policies
CREATE POLICY "Users can view all project social links"
    ON project_social_links FOR SELECT
    USING (true);

CREATE POLICY "Users can create social links for their projects"
    ON project_social_links FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_social_links.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

-- Project investment highlights policies
CREATE POLICY "Users can view all project investment highlights"
    ON project_investment_highlights FOR SELECT
    USING (true);

CREATE POLICY "Users can create investment highlights for their projects"
    ON project_investment_highlights FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_investment_highlights.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

-- Project financial structures policies
CREATE POLICY "Users can view all project financial structures"
    ON project_financial_structures FOR SELECT
    USING (true);

CREATE POLICY "Users can create financial structures for their projects"
    ON project_financial_structures FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_financial_structures.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

-- Project risks policies
CREATE POLICY "Users can view all project risks"
    ON project_risks FOR SELECT
    USING (true);

CREATE POLICY "Users can create risks for their projects"
    ON project_risks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_risks.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

-- Project milestones policies
CREATE POLICY "Users can view all project milestones"
    ON project_milestones FOR SELECT
    USING (true);

CREATE POLICY "Users can create milestones for their projects"
    ON project_milestones FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_milestones.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

-- Project tokenization policies
CREATE POLICY "Users can view all project tokenization"
    ON project_tokenization FOR SELECT
    USING (true);

CREATE POLICY "Users can create tokenization for their projects"
    ON project_tokenization FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_tokenization.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

-- Project legal documents policies
CREATE POLICY "Users can view all project legal documents"
    ON project_legal_documents FOR SELECT
    USING (true);

CREATE POLICY "Users can create legal documents for their projects"
    ON project_legal_documents FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_legal_documents.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

-- Project payments policies
CREATE POLICY "Users can view their project payments"
    ON project_payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_payments.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    );

CREATE POLICY "Users can create payments for their projects"
    ON project_payments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_payments.project_id
            AND projects.filmmaker_id = auth.uid()
        )
    ); 

-- Create an improved function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_val TEXT;
  last_name_val TEXT;
  user_type_val TEXT;
BEGIN
  -- Extract first_name from metadata with fallbacks
  first_name_val := 
    COALESCE(
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'firstName',
      NEW.raw_user_meta_data->>'given_name',
      NEW.raw_user_meta_data->>'name',
      'New'
    );
  
  -- Extract last_name from metadata with fallbacks
  last_name_val := 
    COALESCE(
      NEW.raw_user_meta_data->>'last_name',
      NEW.raw_user_meta_data->>'lastName',
      NEW.raw_user_meta_data->>'family_name',
      NEW.raw_user_meta_data->>'surname',
      'User'
    );
  
  -- Extract user_type from metadata with fallbacks
  user_type_val := 
    COALESCE(
      NEW.raw_user_meta_data->>'user_type',
      NEW.raw_user_meta_data->>'userType',
      NEW.raw_user_meta_data->>'role',
      'filmmaker'
    );
  
  -- Ensure user_type is one of the allowed values
  IF user_type_val NOT IN ('filmmaker', 'investor', 'admin', 'superadmin') THEN
    user_type_val := 'filmmaker';
  END IF;

  -- Insert the new user record
  INSERT INTO public.users (id, email, first_name, last_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    first_name_val,
    last_name_val,
    user_type_val
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;