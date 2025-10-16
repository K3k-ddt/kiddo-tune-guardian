-- Fix child_accounts RLS policies
-- Remove the public SELECT policy
DROP POLICY IF EXISTS "Anyone can view child accounts for login" ON public.child_accounts;

-- Create secure RPC for login screen that only returns safe data
CREATE OR REPLACE FUNCTION public.get_children_for_login()
RETURNS TABLE(id uuid, username text, avatar_color text)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT id, username, avatar_color FROM child_accounts ORDER BY username;
$$;

-- Create RPC for secure PIN verification
CREATE OR REPLACE FUNCTION public.verify_child_pin(child_id_input uuid, pin_input text)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  child_record record;
  session_token uuid;
BEGIN
  -- Get child account
  SELECT * INTO child_record FROM child_accounts WHERE id = child_id_input;
  
  -- Check if child exists
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Child not found');
  END IF;
  
  -- Check if account is locked
  IF child_record.is_locked THEN
    RETURN json_build_object('success', false, 'error', 'Account is locked');
  END IF;
  
  -- Verify PIN
  IF child_record.pin_code != pin_input THEN
    RETURN json_build_object('success', false, 'error', 'Invalid PIN');
  END IF;
  
  -- Create session token
  session_token := gen_random_uuid();
  
  -- Insert session
  INSERT INTO child_sessions (id, child_id, expires_at)
  VALUES (session_token, child_id_input, now() + interval '24 hours');
  
  -- Return success with session token
  RETURN json_build_object(
    'success', true, 
    'session_token', session_token,
    'child_id', child_id_input,
    'username', child_record.username,
    'avatar_color', child_record.avatar_color,
    'parent_id', child_record.parent_id
  );
END;
$$;

-- Create child_sessions table for secure authentication
CREATE TABLE IF NOT EXISTS public.child_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES child_accounts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  last_activity timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on child_sessions
ALTER TABLE public.child_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policy for child_sessions
CREATE POLICY "Sessions are managed by system only"
ON public.child_sessions FOR ALL
USING (false)
WITH CHECK (false);

-- Create function to get current child from session
CREATE OR REPLACE FUNCTION public.get_current_child_from_session(session_token uuid)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  child_id_result uuid;
BEGIN
  -- Clean up expired sessions
  DELETE FROM child_sessions WHERE expires_at < now();
  
  -- Get child_id from valid session
  SELECT child_id INTO child_id_result
  FROM child_sessions
  WHERE id = session_token
    AND expires_at > now();
  
  -- Update last activity if session found
  IF FOUND THEN
    UPDATE child_sessions 
    SET last_activity = now()
    WHERE id = session_token;
  END IF;
  
  RETURN child_id_result;
END;
$$;

-- Fix playback_history RLS policies
DROP POLICY IF EXISTS "View playback history" ON public.playback_history;
DROP POLICY IF EXISTS "Insert playback history" ON public.playback_history;

-- Create secure RPC for inserting playback history
CREATE OR REPLACE FUNCTION public.add_playback_history(
  session_token uuid,
  video_id_input text,
  video_title_input text,
  video_thumbnail_input text,
  search_query_input text
)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  child_id_result uuid;
BEGIN
  -- Get child from session
  child_id_result := get_current_child_from_session(session_token);
  
  IF child_id_result IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid session');
  END IF;
  
  -- Insert history
  INSERT INTO playback_history (child_id, video_id, video_title, video_thumbnail, search_query)
  VALUES (child_id_result, video_id_input, video_title_input, video_thumbnail_input, search_query_input);
  
  RETURN json_build_object('success', true);
END;
$$;

-- Parents can view their children's history
CREATE POLICY "Parents view children history"
ON public.playback_history FOR SELECT
USING (child_id IN (
  SELECT c.id FROM child_accounts c
  JOIN parent_accounts p ON c.parent_id = p.id
  WHERE p.user_id = auth.uid()
));

-- Fix favorites RLS policies
DROP POLICY IF EXISTS "View own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Manage own favorites" ON public.favorites;

-- Create secure RPC for managing favorites
CREATE OR REPLACE FUNCTION public.toggle_favorite(
  session_token uuid,
  video_id_input text,
  video_title_input text,
  video_thumbnail_input text
)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  child_id_result uuid;
  existing_favorite_id uuid;
BEGIN
  -- Get child from session
  child_id_result := get_current_child_from_session(session_token);
  
  IF child_id_result IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid session');
  END IF;
  
  -- Check if favorite exists
  SELECT id INTO existing_favorite_id
  FROM favorites
  WHERE child_id = child_id_result AND video_id = video_id_input;
  
  IF FOUND THEN
    -- Remove favorite
    DELETE FROM favorites WHERE id = existing_favorite_id;
    RETURN json_build_object('success', true, 'action', 'removed');
  ELSE
    -- Add favorite
    INSERT INTO favorites (child_id, video_id, video_title, video_thumbnail)
    VALUES (child_id_result, video_id_input, video_title_input, video_thumbnail_input);
    RETURN json_build_object('success', true, 'action', 'added');
  END IF;
END;
$$;

-- Create RPC to get favorites
CREATE OR REPLACE FUNCTION public.get_favorites(session_token uuid)
RETURNS TABLE(
  id uuid,
  video_id text,
  video_title text,
  video_thumbnail text,
  added_at timestamptz
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  child_id_result uuid;
BEGIN
  -- Get child from session
  child_id_result := get_current_child_from_session(session_token);
  
  IF child_id_result IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT f.id, f.video_id, f.video_title, f.video_thumbnail, f.added_at
  FROM favorites f
  WHERE f.child_id = child_id_result
  ORDER BY f.added_at DESC;
END;
$$;

-- Parents can view their children's favorites
CREATE POLICY "Parents view children favorites"
ON public.favorites FOR SELECT
USING (child_id IN (
  SELECT c.id FROM child_accounts c
  JOIN parent_accounts p ON c.parent_id = p.id
  WHERE p.user_id = auth.uid()
));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_child_sessions_expires ON child_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_child_sessions_child_id ON child_sessions(child_id);