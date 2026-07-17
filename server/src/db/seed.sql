-- SmartER Seed Data

-- Insert hospitals
-- NOTE: Data might not be accurate. Notably most phone numbers use VGH's as placeholder.
INSERT INTO hospitals (name, address, phone, latitude, longitude) VALUES
-- =====================================================
-- Vancouver Hospitals (5)
-- =====================================================
('Vancouver General Hospital', '899 W 12th Ave, Vancouver, BC V5Z 1N1', '(604) 875-4111', 49.2628, -123.1246),
('St. Paul''s Hospital', '1081 Burrard St, Vancouver, BC V6Z 1Y6', '(604) 806-9090', 49.2805, -123.1284),
('BC Children''s Hospital', '4500 Oak St, Vancouver, BC V6H 3N1', '(604) 875-2345', 49.2447, -123.1248),
('Mount Saint Joseph Hospital', '3080 Prince Edward St, Vancouver, BC V5T 3N4', '(604) 874-1141', 49.2578, -123.0958),
('UBC Hospital', '2211 Wesbrook Mall, Vancouver, BC V6T 2B5', '(604) 822-7121', 49.2643, -123.2459),

-- =====================================================
-- Metro Vancouver Hospitals (9)
-- =====================================================
('Lions Gate Hospital', '231 E 15th St, North Vancouver, BC V7L 2L7', '(604) 988-3131', 49.3235, -123.0690),
('Richmond Hospital', '7000 Westminster Hwy, Richmond, BC V6X 1A2', '(604) 875-4111', 49.1708, -123.1368),
('Burnaby Hospital', '3935 Kincaid St, Burnaby, BC V5G 2X6', '(604) 875-4111', 49.2585, -122.9683),
('Royal Columbian Hospital', '330 E Columbia St, New Westminster, BC V3L 3W7', '(604) 875-4111', 49.2284, -122.8903),
('Eagle Ridge Hospital', '475 Guildford Way, Port Moody, BC V3H 3W9', '(604) 875-4111', 49.2785, -122.8290),
('Surrey Memorial Hospital', '13750 96 Ave, Surrey, BC V3V 1Z2', '(604) 581-2211', 49.1892, -122.8498),
('Delta Hospital', '5800 Mountain View Blvd, Delta, BC V4K 3V6', '(604) 875-4111', 49.0899, -123.0835),
('Peace Arch Hospital', '15521 Russell Ave, White Rock, BC V4B 2R4', '(604) 875-4111', 49.0283, -122.8030),
('Langley Memorial Hospital', '22051 Fraser Hwy, Langley, BC V3A 4H4', '(604) 875-4111', 49.1034, -122.6595),

-- =====================================================
-- Elsewhere in British Columbia (25)
-- =====================================================
('Abbotsford Regional Hospital and Cancer Centre', '32900 Marshall Rd, Abbotsford, BC V2S 0C2', '(604) 875-4111', 49.0424, -122.3133),
('Chilliwack General Hospital', '45600 Menholm Rd, Chilliwack, BC V2P 1P7', '(604) 875-4111', 49.1706, -121.9583),
('Fraser Canyon Hospital', '1275 7th Ave, Hope, BC V0X 1L4', '(604) 875-4111', 49.3803, -121.4427),
('Cowichan District Hospital', '3045 Gibbins Rd, Duncan, BC V9L 1E5', '(604) 875-4111', 48.7808, -123.7093),
('Nanaimo Regional General Hospital', '1200 Dufferin Cres, Nanaimo, BC V9S 2B7', '(604) 875-4111', 49.1806, -123.9565),
('Royal Jubilee Hospital', '1952 Bay St, Victoria, BC V8R 1J8', '(604) 875-4111', 48.4272, -123.3265),
('Victoria General Hospital', '1 Hospital Way, Victoria, BC V8Z 6R5', '(604) 875-4111', 48.4513, -123.4308),
('Kelowna General Hospital', '2268 Pandosy St, Kelowna, BC V1Y 1T2', '(604) 875-4111', 49.8790, -119.4826),
('Penticton Regional Hospital', '550 Carmi Ave, Penticton, BC V2A 3G6', '(604) 875-4111', 49.4868, -119.5850),
('Vernon Jubilee Hospital', '2101 32 St, Vernon, BC V1T 5L2', '(604) 875-4111', 50.2675, -119.2712),
('Royal Inland Hospital', '311 Columbia St, Kamloops, BC V2C 2T1', '(604) 875-4111', 50.6695, -120.3408),
('University Hospital of Northern BC', '1475 Edmonton St, Prince George, BC V2M 1S2', '(604) 875-4111', 53.9140, -122.7498),
('Kootenay Boundary Regional Hospital', '1200 Hospital Bench, Trail, BC V1R 4M1', '(604) 875-4111', 49.0990, -117.7030),
('East Kootenay Regional Hospital', '13 24 Ave N, Cranbrook, BC V1C 3H9', '(604) 875-4111', 49.5100, -115.7587),
('Campbell River Hospital', '375 2nd Ave, Campbell River, BC V9W 3V1', '(604) 875-4111', 50.0354, -125.2732),
('Comox Valley Hospital', '101 Lerwick Rd, Courtenay, BC V9N 0B9', '(604) 875-4111', 49.6764, -124.9952),
('Mills Memorial Hospital', '4720 Haugland Ave, Terrace, BC V8G 2W1', '(604) 875-4111', 54.5180, -128.5960),
('G.R. Baker Memorial Hospital', '543 Front St, Quesnel, BC V2J 2K7', '(604) 875-4111', 52.9756, -122.4948),
('Cariboo Memorial Hospital', '517 North 6th Ave, Williams Lake, BC V2G 2C1', '(604) 875-4111', 52.1294, -122.1413),
('Shuswap Lake General Hospital', '601 10 St NE, Salmon Arm, BC V1E 4N2', '(604) 875-4111', 50.7056, -119.2733),
('Squamish General Hospital', '38140 Behrner Dr, Squamish, BC V8B 0J3', '(604) 875-4111', 49.7017, -123.1545),
('qathet General Hospital', '5000 Joyce Ave, Powell River, BC V8A 5R3', '(604) 875-4111', 49.8490, -124.5236),
('Sechelt Hospital', '5544 Sunshine Coast Hwy, Sechelt, BC V7Z 0N6', '(604) 875-4111', 49.4723, -123.7573),
('Bella Coola General Hospital', '1025 Elcho St, Bella Coola, BC V0T 1C0', '(604) 875-4111', 52.3725, -126.7530),
('Nicola Valley Hospital', '3451 Voght St, Merritt, BC V1K 1C6', '(604) 875-4111', 50.1147, -120.7895);

-- Insert hospital occupancy
-- NOTE: Capacity is randomly generated and does not reflect actual values of the respective hospitals
INSERT INTO hospital_occupancy (hospital_id, current_er_capacity, max_er_capacity, current_inpatient_capacity, max_inpatient_capacity) VALUES
(1, 23, 35, 520, 650),
(2, 17, 28, 340, 420),
(3, 14, 22, 210, 260),
(4, 10, 18, 165, 210),
(5, 6, 12, 95, 120),
(6, 16, 24, 240, 300),
(7, 14, 20, 220, 280),
(8, 13, 20, 205, 260),
(9, 22, 32, 430, 500),
(10, 8, 14, 110, 140),
(11, 28, 40, 610, 700),
(12, 9, 14, 105, 140),
(13, 10, 16, 125, 160),
(14, 21, 30, 275, 340),
(15, 13, 20, 170, 220),
(16, 18, 28, 260, 320),
(17, 24, 36, 470, 560),
(18, 25, 38, 510, 600),
(19, 19, 30, 360, 430),
(20, 16, 24, 230, 290),
(21, 18, 26, 250, 310),
(22, 15, 22, 235, 290),
(23, 20, 30, 390, 470),
(24, 12, 18, 185, 230),
(25, 14, 22, 205, 260),
(26, 10, 16, 140, 180),
(27, 11, 18, 145, 190),
(28, 9, 15, 130, 170),
(29, 8, 14, 110, 150),
(30, 7, 12, 95, 125),
(31, 8, 13, 100, 135),
(32, 7, 12, 85, 120),
(33, 6, 10, 65, 90),
(34, 7, 12, 95, 125),
(35, 8, 13, 100, 135),
(36, 7, 12, 85, 120),
(37, 6, 10, 65, 90),
(38, 6, 10, 65, 90),
(39, 7, 11, 75, 100);

-- Insert sample patients (for future use)
INSERT INTO patients (patient_id, name, age, gender, phone, email) VALUES
('PAT-001', 'John Smith', 45, 'Male', '604-555-0101', 'john.smith@email.com'),
('PAT-002', 'Jane Doe', 32, 'Female', '604-555-0102', 'jane.doe@email.com'),
('PAT-003', 'Bob Johnson', 58, 'Male', '604-555-0103', 'bob.johnson@email.com');

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
