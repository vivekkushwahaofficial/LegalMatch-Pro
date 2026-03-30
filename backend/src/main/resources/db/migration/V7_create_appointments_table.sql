CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT,
    appointment_date DATE,
    appointment_time TIME,
    created_by_user_id BIGINT,
    created_at TIMESTAMP,
    case_id BIGINT,
    citizen_name VARCHAR(255),
    lawyer_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    CONSTRAINT fk_appointments_match FOREIGN KEY (match_id) REFERENCES matches (match_id),
    CONSTRAINT fk_appointments_created_by FOREIGN KEY (created_by_user_id) REFERENCES users (id),
    CONSTRAINT fk_appointments_case FOREIGN KEY (case_id) REFERENCES cases (id)
);

ALTER TABLE appointments
    ADD COLUMN IF NOT EXISTS match_id BIGINT,
    ADD COLUMN IF NOT EXISTS appointment_date DATE,
    ADD COLUMN IF NOT EXISTS appointment_time TIME,
    ADD COLUMN IF NOT EXISTS created_by_user_id BIGINT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS case_id BIGINT,
    ADD COLUMN IF NOT EXISTS citizen_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS lawyer_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'SCHEDULED';

CREATE INDEX IF NOT EXISTS idx_appointments_match_id ON appointments (match_id);
CREATE INDEX IF NOT EXISTS idx_appointments_created_by_user_id ON appointments (created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments (appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status);
