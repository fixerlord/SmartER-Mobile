-- SmartER Seed Data

-- Insert hospitals
INSERT INTO hospitals (name, address, phone, latitude, longitude) VALUES
('Surrey Memorial Hospital', '13750 96 Ave, Surrey, BC V3V 1Z2', '(604) 581-2211', 49.1764, -122.8427),
('Royal Columbian Hospital', '330 E Columbia St, New Westminster, BC V3L 3W7', '(604) 520-4253', 49.2069, -122.9106),
('Vancouver General Hospital', '899 W 12th Ave, Vancouver, BC V5Z 1M9', '(604) 875-4111', 49.2606, -123.1216);

-- Insert sample patients (for future use)
INSERT INTO patients (patient_id, name, age, gender, phone, email) VALUES
('PAT-001', 'John Smith', 45, 'Male', '604-555-0101', 'john.smith@email.com'),
('PAT-002', 'Jane Doe', 32, 'Female', '604-555-0102', 'jane.doe@email.com'),
('PAT-003', 'Bob Johnson', 58, 'Male', '604-555-0103', 'bob.johnson@email.com');

-- Insert sample arrivals
INSERT INTO arrivals (patient_name, hospital_id, priority, diagnosis, status, arrived_at) VALUES
('John Smith', 1, 2, 'Chest pain', 'waiting', NOW() - INTERVAL '30 minutes'),
('Jane Doe', 1, 4, 'Minor laceration', 'in_treatment', NOW() - INTERVAL '1 hour'),
('Bob Johnson', 2, 1, 'Severe trauma', 'in_treatment', NOW() - INTERVAL '15 minutes'),
('Alice Williams', 1, 3, 'Abdominal pain', 'waiting', NOW() - INTERVAL '45 minutes'),
('Charlie Brown', 3, 5, 'Cold symptoms', 'waiting', NOW() - INTERVAL '2 hours');
