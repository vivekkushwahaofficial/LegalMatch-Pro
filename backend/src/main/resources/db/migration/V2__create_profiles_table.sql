CREATE TABLE IF NOT EXISTS lawyer_profiles (
    id BIGSERIAL PRIMARY KEY,
    specialization VARCHAR(255) NOT NULL,
    license_number VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    CONSTRAINT uk_lawyer_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_lawyer_profiles_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS ngo_profiles (
    id BIGSERIAL PRIMARY KEY,
    ngo_name VARCHAR(255),
    specialization VARCHAR(255),
    registration_number VARCHAR(255),
    location VARCHAR(255),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT,
    CONSTRAINT uk_ngo_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_ngo_profiles_user FOREIGN KEY (user_id) REFERENCES users (id)
);
