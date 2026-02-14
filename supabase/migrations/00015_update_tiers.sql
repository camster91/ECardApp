-- Rename tier enum values from old naming to new naming
ALTER TYPE event_tier RENAME VALUE 'pro30' TO 'standard';
ALTER TYPE event_tier RENAME VALUE 'pass' TO 'premium';

-- Update max_responses to match new tier limits
UPDATE events SET max_responses = 50 WHERE tier = 'standard';
UPDATE events SET max_responses = 1200 WHERE tier = 'premium';
