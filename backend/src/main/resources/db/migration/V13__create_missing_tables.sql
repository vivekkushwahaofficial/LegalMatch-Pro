CREATE TABLE IF NOT EXISTS lawyers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    expertise VARCHAR(255),
    location VARCHAR(255),
    verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ngos (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    focus_area VARCHAR(255),
    location VARCHAR(255),
    verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS lawyer_directory (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    expertise VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    organization_details VARCHAR(1000)
);

CREATE INDEX IF NOT EXISTS idx_lawyer_location ON lawyer_directory (location);
CREATE INDEX IF NOT EXISTS idx_lawyer_expertise ON lawyer_directory (expertise);

CREATE TABLE IF NOT EXISTS ngo_directory (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    expertise VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    organization_details VARCHAR(1000)
);

CREATE INDEX IF NOT EXISTS idx_ngo_location ON ngo_directory (location);
CREATE INDEX IF NOT EXISTS idx_ngo_expertise ON ngo_directory (expertise);

CREATE TABLE IF NOT EXISTS impact_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    profile_id BIGINT NOT NULL,
    cases_taken INTEGER NOT NULL DEFAULT 0,
    cases_resolved INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP,
    CONSTRAINT uk_impact_logs_user UNIQUE (user_id),
    CONSTRAINT fk_impact_logs_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS logs (
    id BIGSERIAL PRIMARY KEY,
    message VARCHAR(255),
    type VARCHAR(255),
    created_at TIMESTAMP
);
