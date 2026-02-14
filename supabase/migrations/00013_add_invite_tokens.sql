-- Add invite token to guests for magic link pre-filling
ALTER TABLE guests ADD COLUMN IF NOT EXISTS invite_token text UNIQUE;
CREATE INDEX IF NOT EXISTS idx_guests_invite_token ON guests(invite_token) WHERE invite_token IS NOT NULL;
