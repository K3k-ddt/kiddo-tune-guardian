-- Add field to track when limit was last reset (24h rolling window)
ALTER TABLE child_accounts 
ADD COLUMN IF NOT EXISTS limit_reset_time timestamp with time zone DEFAULT now();

-- Update the time usage function to use 24h rolling window
CREATE OR REPLACE FUNCTION public.get_time_usage(session_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  child_id_result uuid;
  child_record record;
BEGIN
  -- Get child from session
  child_id_result := get_current_child_from_session(session_token);
  
  IF child_id_result IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid session');
  END IF;
  
  -- Get current child data
  SELECT * INTO child_record FROM child_accounts WHERE id = child_id_result;
  
  -- Reset if 24 hours have passed since last reset
  IF child_record.limit_reset_time < (now() - interval '24 hours') THEN
    UPDATE child_accounts
    SET time_used_today = 0,
        limit_reset_time = now(),
        is_locked = false
    WHERE id = child_id_result;
    
    child_record.time_used_today := 0;
    child_record.is_locked := false;
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'time_used_today', child_record.time_used_today,
    'daily_limit', child_record.daily_time_limit_minutes,
    'remaining_minutes', GREATEST(0, child_record.daily_time_limit_minutes - child_record.time_used_today),
    'is_locked', child_record.is_locked
  );
END;
$$;

-- Update the update_time_usage function to use 24h rolling window
CREATE OR REPLACE FUNCTION public.update_time_usage(session_token uuid, minutes_used integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  child_id_result uuid;
  child_record record;
BEGIN
  -- Get child from session
  child_id_result := get_current_child_from_session(session_token);
  
  IF child_id_result IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid session');
  END IF;
  
  -- Get current child data
  SELECT * INTO child_record FROM child_accounts WHERE id = child_id_result;
  
  -- Reset if 24 hours have passed since last reset
  IF child_record.limit_reset_time < (now() - interval '24 hours') THEN
    UPDATE child_accounts
    SET time_used_today = minutes_used,
        limit_reset_time = now(),
        is_locked = (minutes_used >= daily_time_limit_minutes)
    WHERE id = child_id_result;
  ELSE
    -- Add time and check if limit exceeded
    UPDATE child_accounts
    SET time_used_today = time_used_today + minutes_used,
        is_locked = ((time_used_today + minutes_used) >= daily_time_limit_minutes)
    WHERE id = child_id_result;
  END IF;
  
  -- Get updated data
  SELECT * INTO child_record FROM child_accounts WHERE id = child_id_result;
  
  RETURN json_build_object(
    'success', true,
    'time_used_today', child_record.time_used_today,
    'daily_limit', child_record.daily_time_limit_minutes,
    'remaining_minutes', GREATEST(0, child_record.daily_time_limit_minutes - child_record.time_used_today),
    'is_locked', child_record.is_locked
  );
END;
$$;

-- Drop both versions of the function
DROP FUNCTION IF EXISTS public.get_children_for_login();
DROP FUNCTION IF EXISTS public.get_children_for_login(text);

-- Recreate get_children_for_login to not require parent_code
CREATE FUNCTION public.get_children_for_login()
RETURNS TABLE(id uuid, username text, avatar_color text, parent_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id, username, avatar_color, parent_id 
  FROM child_accounts 
  ORDER BY username;
$$;