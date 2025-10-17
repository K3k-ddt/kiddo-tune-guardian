-- Function for children to view their own history
CREATE OR REPLACE FUNCTION public.get_playback_history(session_token uuid)
RETURNS TABLE(
  id uuid,
  video_id text,
  video_title text,
  video_thumbnail text,
  search_query text,
  played_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
  SELECT h.id, h.video_id, h.video_title, h.video_thumbnail, h.search_query, h.played_at
  FROM playback_history h
  WHERE h.child_id = child_id_result
  ORDER BY h.played_at DESC
  LIMIT 50;
END;
$$;

-- Function to track time usage
CREATE OR REPLACE FUNCTION public.update_time_usage(session_token uuid, minutes_used integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
  
  -- Reset if it's a new day
  IF child_record.last_reset_date < CURRENT_DATE THEN
    UPDATE child_accounts
    SET time_used_today = minutes_used,
        last_reset_date = CURRENT_DATE,
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

-- Function to get current time usage
CREATE OR REPLACE FUNCTION public.get_time_usage(session_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
  
  -- Reset if it's a new day
  IF child_record.last_reset_date < CURRENT_DATE THEN
    UPDATE child_accounts
    SET time_used_today = 0,
        last_reset_date = CURRENT_DATE,
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