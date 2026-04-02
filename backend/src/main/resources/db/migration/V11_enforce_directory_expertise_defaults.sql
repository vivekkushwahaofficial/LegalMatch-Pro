-- Backfill and enforce non-null expertise defaults in directory tables.
-- This keeps existing rows valid before constraints are applied.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'lawyer_directory'
    ) THEN
        UPDATE lawyer_directory
        SET expertise = 'Not Provided'
        WHERE expertise IS NULL OR TRIM(expertise) = '';

        ALTER TABLE lawyer_directory
            ALTER COLUMN expertise SET NOT NULL;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'ngo_directory'
    ) THEN
        UPDATE ngo_directory
        SET expertise = 'Not Provided'
        WHERE expertise IS NULL OR TRIM(expertise) = '';

        ALTER TABLE ngo_directory
            ALTER COLUMN expertise SET NOT NULL;
    END IF;
END $$;
