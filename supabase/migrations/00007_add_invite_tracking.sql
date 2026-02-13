-- Add invite tracking columns to guests table
ALTER TABLE guests
  ADD COLUMN invite_status TEXT NOT NULL DEFAULT 'not_sent'
    CHECK (invite_status IN ('not_sent', 'sent', 'failed')),
  ADD COLUMN invite_sent_at TIMESTAMPTZ;
