-- ═══════════════════════════════════
-- V12: Production Performance Indexes
-- ═══════════════════════════════════

-- Cases: status filter used by analytics and admin pages
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases (status);

-- Cases: user_id for citizen case lookups
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases (user_id);

-- Cases: location for geo analytics
CREATE INDEX IF NOT EXISTS idx_cases_location ON cases (location);

-- Cases: created_at for trend analytics
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases (created_at);

-- Matches: status for filtering and analytics counts
CREATE INDEX IF NOT EXISTS idx_matches_match_status ON matches (match_status);

-- Matches: case_id for case-match lookups
CREATE INDEX IF NOT EXISTS idx_matches_case_id ON matches (case_id);

-- Matches: user_id for provider-match lookups
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches (user_id);

-- Chat messages: matchId for chat history retrieval
CREATE INDEX IF NOT EXISTS idx_chat_messages_match_id ON chat_messages (match_id);

-- Notifications: userId + isRead for unread notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications (user_id, is_read);

-- Appointments: matchId for appointment lookups
CREATE INDEX IF NOT EXISTS idx_appointments_match_id ON appointments (match_id);

-- Users: status for admin verification queries
CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);

-- Users: submitted_date for growth trend analytics
CREATE INDEX IF NOT EXISTS idx_users_submitted_date ON users (submitted_date);
