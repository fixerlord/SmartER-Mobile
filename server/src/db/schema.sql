-- SmartER Database Schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS arrivals CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;

-- Hospitals table
CREATE TABLE hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients table (for future use)
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    emergency_contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Arrivals table
CREATE TABLE arrivals (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 5),
    diagnosis VARCHAR(500),
    suspected_diagnosis VARCHAR(255),
    status VARCHAR(50) DEFAULT 'waiting',
    estimated_wait INTEGER DEFAULT 0,
    eta TIMESTAMP,
    arrived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Triage summary table
CREATE TABLE triage_summary (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(arrival_id)
);

-- Chat messages table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    arrival_id INTEGER NOT NULL REFERENCES arrivals(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('bot', 'patient')),
    message TEXT NOT NULL,
    timestamp VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospital occupancy table
CREATE TABLE hospital_occupancy (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    current_er_capacity INTEGER NOT NULL DEFAULT 0,
    max_er_capacity INTEGER NOT NULL DEFAULT 20,
    current_inpatient_capacity INTEGER NOT NULL DEFAULT 0,
    max_inpatient_capacity INTEGER NOT NULL DEFAULT 150,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hospital_id)
);

-- Indexes
CREATE INDEX idx_arrivals_hospital_id ON arrivals(hospital_id);
CREATE INDEX idx_arrivals_status ON arrivals(status);
CREATE INDEX idx_arrivals_priority ON arrivals(priority);
CREATE INDEX idx_arrivals_arrived_at ON arrivals(arrived_at);
CREATE INDEX idx_triage_summary_arrival_id ON triage_summary(arrival_id);
CREATE INDEX idx_chat_messages_arrival_id ON chat_messages(arrival_id);
CREATE INDEX idx_hospital_occupancy_hospital_id ON hospital_occupancy(hospital_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_arrivals_updated_at 
    BEFORE UPDATE ON arrivals
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_triage_summary_updated_at 
    BEFORE UPDATE ON triage_summary
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospital_occupancy_updated_at 
    BEFORE UPDATE ON hospital_occupancy
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
