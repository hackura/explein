-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_pro BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Users can view own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create a trigger to automatically create a profile for every new user
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create flashcards table
CREATE TABLE public.flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  deck_name TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Flashcards Policies
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own flashcards" ON public.flashcards FOR ALL USING (auth.uid() = user_id);

-- Create notes table
CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notes Policies
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notes" ON public.notes FOR ALL USING (auth.uid() = user_id);
