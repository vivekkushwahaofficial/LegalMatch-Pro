CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    file_url VARCHAR(1000),
    message_type VARCHAR(50),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_chat_messages_match FOREIGN KEY (match_id) REFERENCES matches (match_id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_messages_sender FOREIGN KEY (sender_id) REFERENCES users (id)
);

ALTER TABLE chat_messages
    ADD COLUMN IF NOT EXISTS file_url VARCHAR(1000),
    ADD COLUMN IF NOT EXISTS message_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP;

UPDATE chat_messages
SET timestamp = NOW()
WHERE timestamp IS NULL;

ALTER TABLE chat_messages
    ALTER COLUMN timestamp SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_chat_messages_match_id ON chat_messages (match_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages (timestamp);
