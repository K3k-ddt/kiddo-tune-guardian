-- Create a safe function to load children by parent code (no manual input in UI)
CREATE OR REPLACE FUNCTION public.get_children_for_code(parent_code_input text)
RETURNS TABLE(id uuid, username text, avatar_color text, parent_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT c.id, c.username, c.avatar_color, c.parent_id 
  FROM child_accounts c
  JOIN parent_accounts p ON c.parent_id = p.id
  WHERE p.parent_code = parent_code_input
  ORDER BY c.username;
$$;