# Architecture

Patient App (patient-ui)
↓ 
Express Backend (REST API) ↔ PostgreSQL
↑
React Nurse Dashboard (nurse-ui)

## Supported Hospitals

One React dashboard supports multiple hospitals.

Each patient belongs to one hospital.

Each nurse dashboard displays exactly one hospital.

Patient chooses hospital before entering queue.

## Queue Model

Priority:
1 = most urgent
5 = least urgent

Nurse may override AI triage.

Queue recalculates after changes.