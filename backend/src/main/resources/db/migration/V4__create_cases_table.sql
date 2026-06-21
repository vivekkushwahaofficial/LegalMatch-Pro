CREATE TABLE IF NOT EXISTS cases (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    title VARCHAR(255),
    description VARCHAR(2000),
    category VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    keywords VARCHAR(255),
    date_time VARCHAR(255),
    contact_info VARCHAR(255),
    other_party_name VARCHAR(255),
    other_party_location VARCHAR(255),
    other_party_contact VARCHAR(255),
    other_party_representative VARCHAR(255),
    investigating_officer VARCHAR(255),
    witnesses VARCHAR(1000),
    CONSTRAINT fk_cases_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS idx_cases_location ON cases (location);
CREATE INDEX IF NOT EXISTS idx_cases_category ON cases (category);
