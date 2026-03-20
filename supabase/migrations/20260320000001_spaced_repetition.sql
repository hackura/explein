-- Add spaced repetition columns to flashcards table
ALTER TABLE public.flashcards 
ADD COLUMN IF NOT EXISTS next_review TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS ease_factor FLOAT DEFAULT 2.5,
ADD COLUMN IF NOT EXISTS interval INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS repetitions INTEGER DEFAULT 0;

-- Create an index for faster querying of due cards
CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON public.flashcards (user_id, next_review);
