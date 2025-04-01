
-- Create a function to add user invitations (to be run in Supabase SQL Editor)
CREATE OR REPLACE FUNCTION create_user_invitation(
  user_email TEXT,
  user_role USER_ROLE,
  inviter_id UUID,
  invite_token TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_id UUID;
BEGIN
  INSERT INTO user_invitations (
    email,
    role,
    invited_by,
    token
  ) VALUES (
    user_email,
    user_role,
    inviter_id,
    invite_token
  )
  RETURNING id INTO invitation_id;
  
  RETURN invitation_id;
END;
$$;
