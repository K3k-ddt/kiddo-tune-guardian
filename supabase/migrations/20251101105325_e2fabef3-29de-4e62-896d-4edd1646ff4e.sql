-- Fix get_children_for_code to handle case-insensitive comparison
CREATE OR REPLACE FUNCTION public.get_children_for_code(parent_code_input text)
 RETURNS TABLE(id uuid, username text, avatar_color text, parent_id uuid)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT c.id, c.username, c.avatar_color, c.parent_id 
  FROM child_accounts c
  JOIN parent_accounts p ON c.parent_id = p.id
  WHERE LOWER(p.parent_code) = LOWER(parent_code_input)
  ORDER BY c.username;
$function$;