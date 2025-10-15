-- Drop existing restrictive policy for viewing children
DROP POLICY IF EXISTS "Parents can view their children" ON public.child_accounts;

-- Create new policy that allows public SELECT for child login screen
CREATE POLICY "Anyone can view child accounts for login" 
ON public.child_accounts 
FOR SELECT 
USING (true);

-- Keep the management policy for parents only
-- (this already exists, just documenting it)
-- Parents can still manage (UPDATE, DELETE) only their own children through existing policy