-- Create simplified function to get all children (no parent filtering needed)
CREATE OR REPLACE FUNCTION public.get_all_children_simple()
RETURNS TABLE(id uuid, username text, avatar_color text, parent_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT id, username, avatar_color, parent_id 
  FROM child_accounts
  ORDER BY username;
$$;

-- Create simplified function to verify child PIN (no parent code needed)
CREATE OR REPLACE FUNCTION public.verify_child_pin_simple(
  child_id_input uuid,
  pin_input text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  stored_pin text;
BEGIN
  -- Get the stored PIN for this child
  SELECT pin_code INTO stored_pin
  FROM child_accounts
  WHERE id = child_id_input;
  
  -- Return true if PIN matches, false otherwise
  RETURN (stored_pin = pin_input);
END;
$$;