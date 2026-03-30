CREATE TABLE IF NOT EXISTS matches (
    match_id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    provider_id BIGINT,
    provider_type VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    match_status VARCHAR(50),
    lawyer_approved_chat BOOLEAN NOT NULL DEFAULT FALSE,
    ngo_approved_chat BOOLEAN NOT NULL DEFAULT FALSE,
    score DOUBLE PRECISION NOT NULL DEFAULT 0,
    request_message VARCHAR(2000),
    attachment_url VARCHAR(1000),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_matches_case FOREIGN KEY (case_id) REFERENCES cases (id),
    CONSTRAINT fk_matches_user FOREIGN KEY (user_id) REFERENCES users (id)
);

ALTER TABLE matches
    ADD COLUMN IF NOT EXISTS provider_id BIGINT,
    ADD COLUMN IF NOT EXISTS provider_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PENDING',
    ADD COLUMN IF NOT EXISTS match_status VARCHAR(50),
    ADD COLUMN IF NOT EXISTS lawyer_approved_chat BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS ngo_approved_chat BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS score DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS request_message VARCHAR(2000),
    ADD COLUMN IF NOT EXISTS attachment_url VARCHAR(1000),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

UPDATE matches
SET match_status = status
WHERE (match_status IS NULL OR match_status = '') AND status IS NOT NULL;

UPDATE matches
SET status = match_status
WHERE (status IS NULL OR status = '') AND match_status IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_matches_case_id ON matches (case_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches (user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches (match_status);
CREATE INDEX IF NOT EXISTS idx_matches_provider_id ON matches (provider_id);
