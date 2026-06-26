## Decision 1

PostgreSQL will run locally during development.

Reason:
Simplifies deployment and debugging.

## Decision 2

Backend follows route/controller/service architecture.

Reason:
Keeps business logic separate from API endpoints.

## Decision 3

Hospital information is stored in PostgreSQL.

Reason:
Allows hospital-specific queues and routing.

## Decision 4

Backend verifies database connectivity through API endpoints.

Reason:
Simplifies debugging during development.

## Decision 5

Arrival records are separate from patient records.

Reason:
Supports future repeat visits.

## Decision 6

Backend APIs are designed independently of the Android implementation.

Reason:
Mobile application is developed separately.

Backend serves as the system of record and exposes documented REST endpoints.

## Decision 7

Hospital and arrival APIs were implemented before queue logic.

Reason:
Arrival records are the core data model used by both nurse and patient applications.


## Decision 8

API contract is documented separately from implementation.

Reason:
Allows independent frontend development by multiple team members.

## Decision 9

Queue calculations are performed on the backend and persisted in the database.

Reason:
Ensures consistent queue state across all clients.


## Decision 10

Hospital queues are completely isolated.

Reason:
Patients should only affect wait times at their selected hospital.

## Decision 11

Nurse dashboard displays one hospital queue at a time.

Reason:
Simplifies multi-hospital support without authentication.

## Decision 12

Nurses may override triage priority.

Reason:
Clinical staff remain the final authority.

## Decision 13

Patient app communicates only through REST APIs.

Reason:
Keeps client independent from database implementation.

## Decision 16

The nurse dashboard structure will be preserved (except removal of Inpatient beds occupancy).

Reason:
The existing UI already demonstrates core triage workflows including queue visualization, patient inspection, and priority reassignment.

Backend APIs should adapt to the UI rather than replacing it.

## Decision 17

The dashboard will use a single "dashboard" API call for initial loading.

Reason:
Reduces the number of API requests and keeps frontend logic simple.