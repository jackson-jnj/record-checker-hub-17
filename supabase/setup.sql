
-- This file contains SQL create statements for setting up the Supabase database
-- Run these statements in the SQL Editor in the Supabase dashboard

-- Create enum types
CREATE TYPE application_status AS ENUM ('pending', 'processing', 'approved', 'rejected');
CREATE TYPE application_type AS ENUM ('standard', 'enhanced', 'vulnerable');
CREATE TYPE user_role AS ENUM ('applicant', 'officer', 'verifier', 'administrator');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    nrc TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'applicant',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number TEXT NOT NULL UNIQUE,
    applicant_id UUID NOT NULL REFERENCES profiles(id),
    type application_type NOT NULL,
    status application_status NOT NULL DEFAULT 'pending',
    purpose TEXT,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_officer_id UUID REFERENCES profiles(id),
    estimated_completion_date TIMESTAMP WITH TIME ZONE,
    fee DECIMAL,
    payment_status TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    priority TEXT,
    notes TEXT
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    size BIGINT,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create helper functions
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT AS $$
DECLARE
    ref_no TEXT;
BEGIN
    ref_no := 'PRC-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
               LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN ref_no;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_role(
    _user_id UUID
)
RETURNS user_role AS $$
DECLARE
    _role user_role;
BEGIN
    SELECT role INTO _role FROM user_roles 
    WHERE user_id = _user_id 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    RETURN _role;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION has_role(
    _user_id UUID,
    _role user_role
)
RETURNS BOOLEAN AS $$
DECLARE
    result BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = _user_id AND role = _role
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_audit_log(
    _user_id UUID,
    _action TEXT,
    _table_name TEXT,
    _record_id TEXT,
    _old_data JSONB,
    _new_data JSONB
)
RETURNS UUID AS $$
DECLARE
    _id UUID;
BEGIN
    INSERT INTO audit_logs (
        user_id, action, table_name, record_id, old_data, new_data, ip_address
    ) VALUES (
        _user_id, _action, _table_name, _record_id, _old_data, _new_data, NULL
    ) RETURNING id INTO _id;
    
    RETURN _id;
END;
$$ LANGUAGE plpgsql;

-- Create RLS Policies
-- Profiles table policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Officers and admins can view all profiles" 
    ON profiles FOR SELECT 
    USING (has_role(auth.uid(), 'officer') OR has_role(auth.uid(), 'administrator'));

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" 
    ON profiles FOR UPDATE 
    USING (has_role(auth.uid(), 'administrator'));

-- Applications table policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications" 
    ON applications FOR SELECT 
    USING (auth.uid() = applicant_id);

CREATE POLICY "Officers and admins can view all applications" 
    ON applications FOR SELECT 
    USING (has_role(auth.uid(), 'officer') OR has_role(auth.uid(), 'administrator') OR has_role(auth.uid(), 'verifier'));

CREATE POLICY "Users can insert their own applications" 
    ON applications FOR INSERT 
    WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Users can update their own pending applications" 
    ON applications FOR UPDATE 
    USING (auth.uid() = applicant_id AND status = 'pending');

CREATE POLICY "Officers and admins can update any application" 
    ON applications FOR UPDATE 
    USING (has_role(auth.uid(), 'officer') OR has_role(auth.uid(), 'administrator') OR has_role(auth.uid(), 'verifier'));

-- Documents table policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents" 
    ON documents FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM applications 
        WHERE applications.id = documents.application_id 
        AND applications.applicant_id = auth.uid()
    ));

CREATE POLICY "Officers and admins can view all documents" 
    ON documents FOR SELECT 
    USING (has_role(auth.uid(), 'officer') OR has_role(auth.uid(), 'administrator') OR has_role(auth.uid(), 'verifier'));

CREATE POLICY "Users can insert documents for their own applications" 
    ON documents FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM applications 
        WHERE applications.id = application_id 
        AND applications.applicant_id = auth.uid()
    ));

CREATE POLICY "Officers and admins can insert documents" 
    ON documents FOR INSERT 
    WITH CHECK (has_role(auth.uid(), 'officer') OR has_role(auth.uid(), 'administrator'));

-- Notifications table policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
    ON notifications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
    ON notifications FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create demo accounts trigger and function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, nrc)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'nrc');
  
  -- Default role for new users is 'applicant'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'applicant');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert demo users (run these commands in SQL editor after setting up the schema)
-- Note: In a real environment, you would need to create these users through the auth API
/*
-- Create admin user
INSERT INTO auth.users (id, email) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com');
  
INSERT INTO public.profiles (id, first_name, last_name) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin', 'User');
  
INSERT INTO public.user_roles (user_id, role) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'administrator');

-- Create officer user
INSERT INTO auth.users (id, email) VALUES 
  ('00000000-0000-0000-0000-000000000002', 'officer@example.com');
  
INSERT INTO public.profiles (id, first_name, last_name) VALUES 
  ('00000000-0000-0000-0000-000000000002', 'Police', 'Officer');
  
INSERT INTO public.user_roles (user_id, role) VALUES 
  ('00000000-0000-0000-0000-000000000002', 'officer');

-- Create verifier user
INSERT INTO auth.users (id, email) VALUES 
  ('00000000-0000-0000-0000-000000000003', 'verifier@example.com');
  
INSERT INTO public.profiles (id, first_name, last_name) VALUES 
  ('00000000-0000-0000-0000-000000000003', 'Record', 'Verifier');
  
INSERT INTO public.user_roles (user_id, role) VALUES 
  ('00000000-0000-0000-0000-000000000003', 'verifier');

-- Create applicant user
INSERT INTO auth.users (id, email) VALUES 
  ('00000000-0000-0000-0000-000000000004', 'applicant@example.com');
  
INSERT INTO public.profiles (id, first_name, last_name, nrc) VALUES 
  ('00000000-0000-0000-0000-000000000004', 'John', 'Applicant', '123456/78/9');
  
INSERT INTO public.user_roles (user_id, role) VALUES 
  ('00000000-0000-0000-0000-000000000004', 'applicant');
*/
