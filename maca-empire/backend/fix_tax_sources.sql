-- Add missing source column to tax_knowledge to fix "Unknown" citations
ALTER TABLE tax_knowledge ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Income Tax Act';

-- Update existing records to reflect the most likely source
UPDATE tax_knowledge SET source = 'Income Tax Act' WHERE source IS NULL;
