-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('filmmaker', 'investor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filmmaker_id UUID REFERENCES users(id) NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    genre TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('feature', 'short', 'series', 'documentary')),
    funding_goal DECIMAL(20,2) NOT NULL,
    duration INTEGER NOT NULL,
    stable_split INTEGER NOT NULL CHECK (stable_split BETWEEN 0 AND 100),
    synopsis TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'funding', 'production', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create team_members table
CREATE TABLE team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create project_media table
CREATE TABLE project_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'document')),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create project_social table
CREATE TABLE project_social (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('website', 'twitter', 'instagram')),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create tokenization table
CREATE TABLE tokenization (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    jurisdiction TEXT NOT NULL,
    legal_advisor TEXT NOT NULL,
    tokenized_assets TEXT[] NOT NULL,
    security_type TEXT NOT NULL,
    max_supply INTEGER NOT NULL,
    token_symbol TEXT NOT NULL,
    blockchain TEXT NOT NULL,
    lockup_period INTEGER NOT NULL,
    enable_dividends BOOLEAN NOT NULL DEFAULT false,
    trading_option TEXT NOT NULL,
    whitelist_only BOOLEAN NOT NULL DEFAULT false,
    token_price DECIMAL(20,8) NOT NULL,
    custom_terms TEXT,
    vesting_start_date DATE NOT NULL,
    vesting_duration INTEGER NOT NULL,
    cliff_period INTEGER NOT NULL,
    require_kyc_aml BOOLEAN NOT NULL DEFAULT true,
    accredited_only BOOLEAN NOT NULL DEFAULT false,
    distribution_method TEXT NOT NULL,
    secondary_market TEXT NOT NULL,
    spv_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create investments table
CREATE TABLE investments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    investor_id UUID REFERENCES users(id) NOT NULL,
    amount DECIMAL(20,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create project_milestones table
CREATE TABLE project_milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create project_updates table
CREATE TABLE project_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create project_comments table
CREATE TABLE project_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_social ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokenization ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can insert their own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id); 
    
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Anyone can view published projects"
    ON projects FOR SELECT
    USING (status != 'draft');

CREATE POLICY "Filmmakers can create projects"
    ON projects FOR INSERT
    WITH CHECK (filmmaker_id = auth.uid());

CREATE POLICY "Filmmakers can update their own projects"
    ON projects FOR UPDATE
    USING (filmmaker_id = auth.uid());

-- Team members policies
CREATE POLICY "Anyone can view team members of published projects"
    ON team_members FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = team_members.project_id
        AND projects.status != 'draft'
    ));

CREATE POLICY "Filmmakers can manage team members of their projects"
    ON team_members FOR ALL
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = team_members.project_id
        AND projects.filmmaker_id = auth.uid()
    ));

-- Project media policies
CREATE POLICY "Anyone can view media of published projects"
    ON project_media FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_media.project_id
        AND projects.status != 'draft'
    ));

CREATE POLICY "Filmmakers can manage media of their projects"
    ON project_media FOR ALL
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_media.project_id
        AND projects.filmmaker_id = auth.uid()
    ));

-- Project social policies
CREATE POLICY "Anyone can view social links of published projects"
    ON project_social FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_social.project_id
        AND projects.status != 'draft'
    ));

CREATE POLICY "Filmmakers can manage social links of their projects"
    ON project_social FOR ALL
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_social.project_id
        AND projects.filmmaker_id = auth.uid()
    ));

-- Tokenization policies
CREATE POLICY "Anyone can view tokenization of published projects"
    ON tokenization FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = tokenization.project_id
        AND projects.status != 'draft'
    ));

CREATE POLICY "Filmmakers can manage tokenization of their projects"
    ON tokenization FOR ALL
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = tokenization.project_id
        AND projects.filmmaker_id = auth.uid()
    ));

-- Investments policies
CREATE POLICY "Investors can view their own investments"
    ON investments FOR SELECT
    USING (investor_id = auth.uid());

CREATE POLICY "Filmmakers can view investments in their projects"
    ON investments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = investments.project_id
        AND projects.filmmaker_id = auth.uid()
    ));

CREATE POLICY "Investors can create investments"
    ON investments FOR INSERT
    WITH CHECK (investor_id = auth.uid());

-- Project milestones policies
CREATE POLICY "Anyone can view milestones of published projects"
    ON project_milestones FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_milestones.project_id
        AND projects.status != 'draft'
    ));

CREATE POLICY "Filmmakers can manage milestones of their projects"
    ON project_milestones FOR ALL
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_milestones.project_id
        AND projects.filmmaker_id = auth.uid()
    ));

-- Project updates policies
CREATE POLICY "Anyone can view updates of published projects"
    ON project_updates FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_updates.project_id
        AND projects.status != 'draft'
    ));

CREATE POLICY "Filmmakers can manage updates of their projects"
    ON project_updates FOR ALL
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_updates.project_id
        AND projects.filmmaker_id = auth.uid()
    ));

-- Project comments policies
CREATE POLICY "Anyone can view comments of published projects"
    ON project_comments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_comments.project_id
        AND projects.status != 'draft'
    ));

CREATE POLICY "Authenticated users can create comments"
    ON project_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
    ON project_comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON project_comments FOR DELETE
    USING (auth.uid() = user_id);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tokenization_updated_at
    BEFORE UPDATE ON tokenization
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at
    BEFORE UPDATE ON investments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at
    BEFORE UPDATE ON project_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_updates_updated_at
    BEFORE UPDATE ON project_updates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_comments_updated_at
    BEFORE UPDATE ON project_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 