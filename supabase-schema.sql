-- NUJJUM Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create custom types
CREATE TYPE disability_type AS ENUM ('physical', 'visual', 'hearing', 'cognitive', 'speech', 'multiple', 'other');
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE document_type AS ENUM ('id_proof', 'disability_certificate', 'insurance', 'medical_report', 'other');
CREATE TYPE service_request_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE service_request_type AS ENUM ('airport_assistance', 'mobility_support', 'transportation', 'medical_assistance', 'general_support');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');

-- Create users table with Supabase auth integration
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  profile_picture TEXT,
  disability_type disability_type NOT NULL DEFAULT 'other',
  country_of_residence TEXT NOT NULL DEFAULT 'United Arab Emirates',
  nationality TEXT,
  gender TEXT,
  date_of_birth DATE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  bio TEXT,
  blood_group TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status document_status NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  PRIMARY KEY (id)
);

-- Create community_posts table
CREATE TABLE community_posts (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  likes UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create community_comments table
CREATE TABLE community_comments (
  id UUID DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create benefit_programs table
CREATE TABLE benefit_programs (
  id UUID DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- 'government' or 'private'
  category TEXT NOT NULL,
  eligibility TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  application_url TEXT,
  deadline DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create assistive_devices table
CREATE TABLE assistive_devices (
  id UUID DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AED',
  vendor_id UUID, -- References vendors table when implemented
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create service_requests table
CREATE TABLE service_requests (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type service_request_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'emergency'
  location JSONB, -- GPS coordinates and address
  status service_request_status NOT NULL DEFAULT 'pending',
  assigned_to UUID, -- References help providers when implemented
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (id)
);

-- Insert sample benefit programs
INSERT INTO benefit_programs (title, description, type, category, eligibility, benefits, application_url) VALUES
('Dubai Disability Pension', 'Financial support for residents with disabilities in Dubai', 'government', 'Financial Support',
ARRAY['Dubai resident', 'Confirmed disability', 'Income below threshold'], ARRAY['Monthly stipend', 'Medical coverage'],
'https://dubaipolice.gov.ae'),

('Abu Dhabi Social Security', 'Comprehensive social security benefits for Emirati citizens with disabilities', 'government', 'Social Services',
ARRAY['Emirati citizen', 'Registered disability', 'Regular medical checkups'], ARRAY['Monthly allowance', 'Home care services', 'Transportation subsidies'],
'https://socialsecurity.abudhabi'),

('EHS Disability Support Program', 'Employment and housing support for people with disabilities', 'private', 'Employment',
ARRAY['UAE resident', 'Age 18+', 'Completed education'], ARRAY['Job training', 'Housing assistance', 'Employment placement'],
'https://ehs.ae/disability-support'),

('Sharjah Care Foundation', 'Community-based care and rehabilitation services', 'private', 'Healthcare',
ARRAY['Sharjah resident', 'Medical certification required'], ARRAY['Rehabilitation services', 'Psychological support', 'Community integration programs'],
'https://scf.sharjah.ae');

-- Insert sample assistive devices
INSERT INTO assistive_devices (name, description, category, price, currency, images, specifications) VALUES
('Smart Wheelchair', 'AI-powered electric wheelchair with voice control and obstacle avoidance', 'Mobility', 25000.00, 'AED',
ARRAY['https://example.com/wheelchair-1.jpg'], '{"battery":"8 hours", "weight":"25kg", "max_speed":"6km/h"}'),

('Braille Display', 'USB-connected braille display for computer access', 'Visual Impairment', 1500.00, 'AED',
ARRAY['https://example.com/braille-display-1.jpg'], '{"cells":"20", "connectivity":"USB", "compatible_os":"Windows, Mac, Linux"}'),

('Hearing Aid Bundle', 'Digital hearing aids with Bluetooth connectivity and app control', 'Hearing Aid', 3500.00, 'AED',
ARRAY['https://example.com/hearing-aid-1.jpg'], '{"battery_life":"5 days", "bluetooth":"Yes", "noise_reduction":"Advanced"}'),

('Communication Aid', 'AAC device with text-to-speech and pre-recorded messages', 'Communication', 1200.00, 'AED',
ARRAY['https://example.com/aac-device-1.jpg'], '{"display":"8 inch", "voice_options":"Multiple", "portability":"Handheld"}');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assistive_devices_updated_at BEFORE UPDATE ON assistive_devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow user creation during signup" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for documents table
CREATE POLICY "Users can view their own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for community_posts table
CREATE POLICY "Anyone can view community posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for community_comments table
CREATE POLICY "Anyone can view comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON community_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON community_comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for service_requests table
CREATE POLICY "Users can view their own service requests" ON service_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create service requests" ON service_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own service requests" ON service_requests FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for benefit_programs and assistive_devices (public read access)
CREATE POLICY "Anyone can view benefit programs" ON benefit_programs FOR SELECT USING (true);
CREATE POLICY "Anyone can view assistive devices" ON assistive_devices FOR SELECT USING (true);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, username)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), COALESCE(NEW.raw_user_meta_data->>'username', ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check if username is available
CREATE OR REPLACE FUNCTION is_username_available(username_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (SELECT 1 FROM users WHERE username = username_to_check);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_comments_user_id ON community_comments(user_id);
CREATE INDEX idx_service_requests_user_id ON service_requests(user_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_devices_category ON assistive_devices(category);
