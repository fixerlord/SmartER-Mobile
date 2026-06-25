# Database Tables

hospitals
- id
- name
- latitude
- longitude

patients
- id
- name

arrivals
- id
- patient_id
- hospital_id
- priority
- suspected_diagnosis
- estimated_wait
- status

triage_summary
- arrival_id
- symptoms
- chronology
- ...

chat_messages
- id
- arrival_id
- sender
- message
- timestamp