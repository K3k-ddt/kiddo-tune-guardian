-- Create table to track PIN verification attempts for brute force protection
CREATE TABLE IF NOT EXISTS public.pin_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_accounts(id) ON DELETE CASCADE,
  attempt_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  was_successful BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on pin_attempts
ALTER TABLE public.pin_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Only system can manage PIN attempts (no direct user access)
CREATE POLICY "System manages PIN attempts" ON public.pin_attempts
FOR ALL USING (false) WITH CHECK (false);

-- Create index for efficient failed attempt queries
CREATE INDEX idx_pin_attempts_child_time ON public.pin_attempts(child_id, attempt_time DESC);

-- Update verify_child_pin function with brute force protection
CREATE OR REPLACE FUNCTION public.verify_child_pin(child_id_input uuid, pin_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  child_record record;
  session_token uuid;
  failed_attempts int;
  recent_attempts int;
  lockout_until timestamptz;
BEGIN
  -- Get child account
  SELECT * INTO child_record FROM child_accounts WHERE id = child_id_input;
  
  -- Check if child exists
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Child not found');
  END IF;
  
  -- Check if account is locked due to time limits
  IF child_record.is_locked THEN
    RETURN json_build_object('success', false, 'error', 'Account is locked');
  END IF;
  
  -- Check for failed attempts in last 15 minutes
  SELECT COUNT(*) INTO failed_attempts
  FROM pin_attempts
  WHERE child_id = child_id_input
    AND attempt_time > now() - interval '15 minutes'
    AND was_successful = false;
  
  -- Check for any attempts in last 30 seconds (rate limiting)
  SELECT COUNT(*) INTO recent_attempts
  FROM pin_attempts
  WHERE child_id = child_id_input
    AND attempt_time > now() - interval '30 seconds';
    
  IF recent_attempts > 0 THEN
    RETURN json_build_object('success', false, 'error', 'Spróbuj ponownie za chwilę');
  END IF;
  
  -- Implement progressive lockout
  IF failed_attempts >= 5 THEN
    RETURN json_build_object('success', false, 'error', 'Za dużo prób. Spróbuj za 15 minut.');
  ELSIF failed_attempts >= 3 THEN
    RETURN json_build_object('success', false, 'error', 'Za dużo prób. Spróbuj za chwilę.');
  END IF;
  
  -- Verify PIN (constant-time comparison would be better but limited in PL/pgSQL)
  IF child_record.pin_code != pin_input THEN
    -- Log failed attempt
    INSERT INTO pin_attempts (child_id, was_successful)
    VALUES (child_id_input, false);
    
    RETURN json_build_object('success', false, 'error', 'Nieprawidłowy PIN');
  END IF;
  
  -- Log successful attempt
  INSERT INTO pin_attempts (child_id, was_successful)
  VALUES (child_id_input, true);
  
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
$function$;

-- Add parent_code column to parent_accounts for secure child login
ALTER TABLE public.parent_accounts 
ADD COLUMN IF NOT EXISTS parent_code TEXT UNIQUE;

-- Generate unique codes for existing parents
UPDATE public.parent_accounts 
SET parent_code = substr(md5(random()::text || id::text), 1, 8)
WHERE parent_code IS NULL;

-- Make parent_code required for new entries
ALTER TABLE public.parent_accounts 
ALTER COLUMN parent_code SET DEFAULT substr(md5(random()::text || gen_random_uuid()::text), 1, 8);

-- Replace get_children_for_login to require parent authentication
CREATE OR REPLACE FUNCTION public.get_children_for_login(parent_code_input text)
RETURNS TABLE(id uuid, username text, avatar_color text, parent_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT c.id, c.username, c.avatar_color, c.parent_id 
  FROM child_accounts c
  JOIN parent_accounts p ON c.parent_id = p.id
  WHERE p.parent_code = parent_code_input
  ORDER BY c.username;
$function$;