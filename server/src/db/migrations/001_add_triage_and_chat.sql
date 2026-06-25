-- Migration: Add triage_summary, chat_messages, and hospital_occupancy tables
-- Run this migration if you already have the base schema

-- Add new columns to arrivals table
ALTER TABLE arrivals ADD COLUMN IF NOT EXISTS suspected_diagnosis VARCHAR(255);
ALTER TABLE arrivals ADD COLUMN IF NOT EXISTS eta TIMESTAMP;

-- Create triage_summary table
CREATE TABLE IF NOT EXISTS triage_summary (
    id SERIAL PRIMARY KEY,
    arrival_id INTEGER NOT NULL REFERENCES arrivals(id) ON DELETE CASCADE,
    symptoms TEXT,
    chronology TEXT,
    quality TEXT,
    quantity TEXT,
    positive_modifiers TEXT,
    negative_modifiers TEXT,
    associated_symptoms TEXT,
    previous_history TEXT,
    family_history TEXT,
    current_medication TEXT,
    other_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    arrival_id INTEGER NOT NULL REFERENCES arrivals(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('bot', 'patient')),
    message TEXT NOT NULL,
    timestamp VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hospital_occupancy table
CREATE TABLE IF NOT EXISTS hospital_occupancy (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    current_er_capacity INTEGER NOT NULL DEFAULT 0,
    max_er_capacity INTEGER NOT NULL DEFAULT 20,
    current_inpatient_capacity INTEGER NOT NULL DEFAULT 0,
    max_inpatient_capacity INTEGER NOT NULL DEFAULT 150,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hospital_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_triage_summary_arrival_id ON triage_summary(arrival_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_arrival_id ON chat_messages(arrival_id);
CREATE INDEX IF NOT EXISTS idx_hospital_occupancy_hospital_id ON hospital_occupancy(hospital_id);

-- Add trigger for triage_summary updated_at
CREATE TRIGGER update_triage_summary_updated_at 
    BEFORE UPDATE ON triage_summary
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for hospital_occupancy updated_at
CREATE TRIGGER update_hospital_occupancy_updated_at 
    BEFORE UPDATE ON hospital_occupancy
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default occupancy for existing hospitals
INSERT INTO hospital_occupancy (hospital_id, current_er_capacity, max_er_capacity, current_inpatient_capacity, max_inpatient_capacity)
SELECT id, 14, 20, 132, 150 FROM hospitals
ON CONFLICT (hospital_id) DO NOTHING;
