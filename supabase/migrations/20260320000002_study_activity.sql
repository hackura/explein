-- Create study_activity table to track study time
CREATE TABLE IF NOT EXISTS public.study_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  activity_type TEXT DEFAULT 'flashcards',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.study_activity ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can look at their own activity" ON public.study_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can log their own activity" ON public.study_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);
