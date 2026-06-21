-- Enforce required fields for directory tables without breaking existing rows.
-- This is conditional because some environments may not have these tables yet.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'lawyer_directory'
    ) THEN
        UPDATE lawyer_directory
        SET name = 'Unknown Lawyer'
        WHERE name IS NULL OR TRIM(name) = '';

        UPDATE lawyer_directory
        SET location = 'UNKNOWN'
        WHERE location IS NULL OR TRIM(location) = '';

        UPDATE lawyer_directory
        SET verified = FALSE
        WHERE verified IS NULL;

        ALTER TABLE lawyer_directory
            ALTER COLUMN name SET NOT NULL,
            ALTER COLUMN location SET NOT NULL,
            ALTER COLUMN verified SET NOT NULL;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'ngo_directory'
    ) THEN
        UPDATE ngo_directory
        SET name = 'Unknown NGO'
        WHERE name IS NULL OR TRIM(name) = '';

        UPDATE ngo_directory
        SET location = 'UNKNOWN'
        WHERE location IS NULL OR TRIM(location) = '';

        UPDATE ngo_directory
        SET verified = FALSE
        WHERE verified IS NULL;

        ALTER TABLE ngo_directory
            ALTER COLUMN name SET NOT NULL,
            ALTER COLUMN location SET NOT NULL,
            ALTER COLUMN verified SET NOT NULL;
    END IF;
END $$;
