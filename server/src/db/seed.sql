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

-- Insert hospital occupancy
INSERT INTO hospital_occupancy (hospital_id, current_er_capacity, max_er_capacity, current_inpatient_capacity, max_inpatient_capacity) VALUES
(1, 14, 20, 132, 150),
(2, 8, 15, 98, 120),
(3, 22, 30, 145, 180);

-- Insert sample arrivals
INSERT INTO arrivals (patient_name, hospital_id, priority, diagnosis, suspected_diagnosis, status, eta, arrived_at) VALUES
('John Smith', 1, 2, 'Chest pain', 'Cardiac Arrest', 'waiting', NOW() + INTERVAL '15 minutes', NOW() - INTERVAL '30 minutes'),
('Jane Doe', 1, 4, 'Minor laceration', 'Minor Laceration', 'in_treatment', NOW() + INTERVAL '30 minutes', NOW() - INTERVAL '1 hour'),
('Bob Johnson', 2, 1, 'Severe trauma', 'Severe Trauma', 'in_treatment', NOW() + INTERVAL '5 minutes', NOW() - INTERVAL '15 minutes'),
('Alice Williams', 1, 3, 'Abdominal pain', 'Acute Appendicitis', 'waiting', NOW() + INTERVAL '20 minutes', NOW() - INTERVAL '45 minutes'),
('Charlie Brown', 3, 5, 'Cold symptoms', 'Common Cold', 'waiting', NOW() + INTERVAL '45 minutes', NOW() - INTERVAL '2 hours');

-- Insert sample triage summaries
INSERT INTO triage_summary (arrival_id, symptoms, chronology, quality, quantity, positive_modifiers, negative_modifiers, associated_symptoms, previous_history, family_history, current_medication, other_notes) VALUES
(1, 'Severe chest pain, difficulty breathing, sweating profusely', 'Started 15 minutes ago suddenly', 'Crushing pain, 10/10 severity', 'Continuous, radiating to left arm', 'None', 'Pain worsens with any movement', 'Nausea, dizziness, cold sweats', 'No previous cardiac events', 'Father had heart attack at age 55', 'None', 'Patient is extremely anxious and pale'),
(2, 'Cut on hand, bleeding controlled', 'Cut occurred 1 hour ago while cooking', 'Sharp pain initially, now throbbing, 4/10', '2-inch laceration on palm', 'Pressure stopped bleeding', 'Wound edges gaping, may need stitches', 'None', 'No significant medical history', 'None relevant', 'None', 'Wound cleaned with soap and water, tetanus shot up to date'),
(3, 'Multiple injuries from motor vehicle accident, bleeding heavily', 'Accident occurred 20 minutes ago', 'Severe pain throughout body, 9/10', 'Multiple lacerations, possible internal bleeding', 'Paramedics applied pressure bandages', 'Pain increasing, becoming disoriented', 'Confusion, rapid pulse, pale skin', 'No significant medical history', 'None relevant', 'None', 'Patient was driver, wearing seatbelt'),
(4, 'Severe abdominal pain, vomiting', 'Pain started 6 hours ago, worsening progressively', 'Sharp, stabbing pain in lower right abdomen, 8/10', 'Localized to McBurney''s point', 'Lying still helps slightly', 'Movement, coughing makes it much worse', 'Fever (38.5°C), nausea, loss of appetite', 'No previous abdominal surgeries', 'Sister had appendicitis', 'Took ibuprofen 2 hours ago, no relief', 'Patient has rebound tenderness'),
(5, 'Runny nose, sore throat, mild cough', 'Symptoms started 2 days ago', 'Mild discomfort, 3/10', 'Intermittent symptoms', 'Rest and fluids help', 'Symptoms persist', 'Mild fatigue, sneezing', 'No significant medical history', 'None relevant', 'Over-the-counter cold medicine', 'Patient concerned about COVID-19');

-- Insert sample chat messages
INSERT INTO chat_messages (arrival_id, sender, message, timestamp) VALUES
(1, 'bot', 'Hello, I''m the SmartER triage assistant. What brings you to the ER today?', '14:15:00'),
(1, 'patient', 'I have terrible chest pain and can''t breathe properly', '14:15:30'),
(1, 'bot', 'When did this pain start?', '14:15:35'),
(1, 'patient', 'About 15 minutes ago, suddenly', '14:16:00'),
(1, 'bot', 'On a scale of 1-10, how severe is the pain?', '14:16:05'),
(1, 'patient', '10! It''s crushing my chest', '14:16:20'),
(2, 'bot', 'What brings you in?', '17:00:00'),
(2, 'patient', 'I cut my hand with a knife while cooking', '17:00:20'),
(2, 'bot', 'Is it still bleeding?', '17:00:25'),
(2, 'patient', 'No, I got it to stop, but it''s pretty deep', '17:00:45'),
(3, 'bot', 'What happened?', '14:25:00'),
(3, 'patient', 'Car accident... hurts everywhere', '14:25:15'),
(3, 'bot', 'Where is the pain most severe?', '14:25:20'),
(3, 'patient', 'Chest and abdomen... bleeding a lot', '14:25:40'),
(4, 'bot', 'What symptoms are you experiencing?', '14:30:00'),
(4, 'patient', 'Terrible stomach pain on the right side', '14:30:20'),
(4, 'bot', 'When did it start?', '14:30:25'),
(4, 'patient', 'This morning around 8am, getting worse', '14:30:45'),
(5, 'bot', 'What symptoms are you experiencing?', '17:30:00'),
(5, 'patient', 'I have a runny nose and sore throat', '17:30:25'),
(5, 'bot', 'Any fever?', '17:30:30'),
(5, 'patient', 'No fever, just feeling a bit tired', '17:30:50');
