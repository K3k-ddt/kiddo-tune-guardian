-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  is_parent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parent accounts table
CREATE TABLE public.parent_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create child accounts table
CREATE TABLE public.child_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.parent_accounts(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  pin_code TEXT NOT NULL, -- 4 digit PIN
  avatar_color TEXT DEFAULT '#FF6B6B',
  daily_time_limit_minutes INTEGER DEFAULT 60,
  time_used_today INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, username)
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_accounts(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_title TEXT NOT NULL,
  video_thumbnail TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, video_id)
);

-- Create playback history table
CREATE TABLE public.playback_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_accounts(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_title TEXT NOT NULL,
  video_thumbnail TEXT,
  search_query TEXT,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocked songs table
CREATE TABLE public.blocked_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.parent_accounts(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_title TEXT NOT NULL,
  blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, video_id)
);

-- Create blocked phrases table
CREATE TABLE public.blocked_phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.parent_accounts(id) ON DELETE CASCADE,
  phrase TEXT NOT NULL,
  blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, phrase)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playback_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_phrases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for parent_accounts
CREATE POLICY "Parents can view their own account" ON public.parent_accounts
  FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id));

CREATE POLICY "Parents can create their own account" ON public.parent_accounts
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id));

-- RLS Policies for child_accounts
CREATE POLICY "Parents can view their children" ON public.child_accounts
  FOR SELECT USING (parent_id IN (SELECT id FROM public.parent_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Parents can manage their children" ON public.child_accounts
  FOR ALL USING (parent_id IN (SELECT id FROM public.parent_accounts WHERE user_id = auth.uid()));

-- RLS Policies for favorites (children can manage their own)
CREATE POLICY "View own favorites" ON public.favorites
  FOR SELECT USING (true);

CREATE POLICY "Manage own favorites" ON public.favorites
  FOR ALL USING (true);

-- RLS Policies for playback_history
CREATE POLICY "View playback history" ON public.playback_history
  FOR SELECT USING (true);

CREATE POLICY "Insert playback history" ON public.playback_history
  FOR INSERT WITH CHECK (true);

-- RLS Policies for blocked_songs
CREATE POLICY "Parents manage blocked songs" ON public.blocked_songs
  FOR ALL USING (parent_id IN (SELECT id FROM public.parent_accounts WHERE user_id = auth.uid()));

-- RLS Policies for blocked_phrases
CREATE POLICY "Parents manage blocked phrases" ON public.blocked_phrases
  FOR ALL USING (parent_id IN (SELECT id FROM public.parent_accounts WHERE user_id = auth.uid()));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, is_parent)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'is_parent')::boolean, false)
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to reset daily time for children
CREATE OR REPLACE FUNCTION public.reset_child_daily_time()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.child_accounts
  SET time_used_today = 0,
      is_locked = FALSE,
      last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
END;
$$;