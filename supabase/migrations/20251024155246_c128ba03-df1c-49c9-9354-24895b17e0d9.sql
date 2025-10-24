-- Update get_children_for_login to only return children for authenticated parent
CREATE OR REPLACE FUNCTION public.get_children_for_login()
RETURNS TABLE(id uuid, username text, avatar_color text, parent_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT c.id, c.username, c.avatar_color, c.parent_id 
  FROM child_accounts c
  JOIN parent_accounts p ON c.parent_id = p.id
  WHERE p.user_id = auth.uid()
  ORDER BY c.username;
$$;

-- Add function to delete child account
CREATE OR REPLACE FUNCTION public.delete_child_account(child_id_input uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  parent_id_result uuid;
BEGIN
  -- Check if the child belongs to the authenticated parent
  SELECT c.parent_id INTO parent_id_result
  FROM child_accounts c
  JOIN parent_accounts p ON c.parent_id = p.id
  WHERE c.id = child_id_input AND p.user_id = auth.uid();
  
  IF parent_id_result IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;
  
  -- Delete related data first (due to foreign key constraints)
  DELETE FROM child_sessions WHERE child_id = child_id_input;
  DELETE FROM pin_attempts WHERE child_id = child_id_input;
  DELETE FROM favorites WHERE child_id = child_id_input;
  DELETE FROM playback_history WHERE child_id = child_id_input;
  
  -- Delete the child account
  DELETE FROM child_accounts WHERE id = child_id_input;
  
  RETURN json_build_object('success', true);
END;
$$;