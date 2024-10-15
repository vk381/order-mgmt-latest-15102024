-- Add this to the existing schema.sql file

ALTER TABLE users
ADD COLUMN phone_number VARCHAR(20);

-- Update the existing users table to include the phone_number
UPDATE users SET phone_number = '123-456-7890' WHERE phone_number IS NULL;

-- Make phone_number NOT NULL after updating existing records
ALTER TABLE users
MODIFY COLUMN phone_number VARCHAR(20) NOT NULL;