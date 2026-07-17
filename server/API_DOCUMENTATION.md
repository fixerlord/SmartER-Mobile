# SmartER API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
**Note:** Prototype #1 does not include authentication. All endpoints are publicly accessible.

---

## Endpoints

### Health Check

#### GET /health
Check if the API server is running.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "SmartER API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

### Database Connection Test

#### GET /api/test-db
Test database connectivity.

**Response (200 OK):**
```json
{
  "connected": true
}
```

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Database connection error message"
}
```

---

## Hospitals

### GET /api/hospitals
Get all hospitals in the system.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Surrey Memorial Hospital",
      "address": "13750 96 Ave, Surrey, BC V3V 1Z2",
      "phone": "(604) 581-2211",
      "latitude": 49.1764,
      "longitude": -122.8427,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Royal Columbian Hospital",
      "address": "330 E Columbia St, New Westminster, BC V3L 3W7",
      "phone": "(604) 520-4253",
      "latitude": 49.2069,
      "longitude": -122.9106,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /api/hospitals/:id
Get a specific hospital by ID.

**Parameters:**
- `id` (path parameter) - Hospital ID (integer)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Surrey Memorial Hospital",
    "address": "13750 96 Ave, Surrey, BC V3V 1Z2",
    "phone": "(604) 581-2211",
    "latitude": 49.1764,
    "longitude": -122.8427,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Hospital not found"
}
```

---

## Arrivals

### POST /api/arrivals
Create a new patient arrival record.

**Request Body:**
```json
{
  "patientName": "John Doe",
  "hospitalId": 1,
  "priority": 3,
  "diagnosis": "Appendicitis"
}
```

**Field Validation:**
- `patientName` (required): String, 1-255 characters, non-empty after trimming
- `hospitalId` (required): Integer, must reference an existing hospital
- `priority` (required): Integer, must be between 1-5 (1=critical, 5=non-urgent)
- `diagnosis` (optional): String, max 500 characters

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_name": "John Doe",
    "hospital_id": 1,
    "priority": 3,
    "diagnosis": "Appendicitis",
    "status": "waiting",
    "arrived_at": "2024-01-15T10:30:00.000Z",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Patient name is required and must be a non-empty string"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Hospital not found"
}
```

---

### GET /api/arrivals
Get all arrival records.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_name": "John Doe",
      "hospital_id": 1,
      "hospital_name": "Surrey Memorial Hospital",
      "priority": 3,
      "diagnosis": "Appendicitis",
      "status": "waiting",
      "arrived_at": "2024-01-15T10:30:00.000Z",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### GET /api/arrivals/:id
Get a specific arrival record by ID.

**Parameters:**
- `id` (path parameter) - Arrival ID (integer)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_name": "John Doe",
    "hospital_id": 1,
    "hospital_name": "Surrey Memorial Hospital",
    "priority": 3,
    "diagnosis": "Appendicitis",
    "status": "waiting",
    "arrived_at": "2024-01-15T10:30:00.000Z",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid arrival ID"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Arrival not found"
}
```

---

## Queue Management

### GET /api/hospitals/:id/queue
Get the current queue for a specific hospital with calculated wait times.

**Parameters:**
- `id` (path parameter) - Hospital ID (integer)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "arrivalId": 15,
      "patientName": "John Doe",
      "priority": 2,
      "diagnosis": "Appendicitis",
      "estimatedWait": 10
    },
    {
      "arrivalId": 18,
      "patientName": "Jane Smith",
      "priority": 3,
      "diagnosis": "Broken arm",
      "estimatedWait": 40
    }
  ]
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid hospital ID"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Hospital not found"
}
```

**Queue Calculation Logic:**
- Fetches all active arrivals (status: 'waiting' or 'in_treatment') for the hospital
- Sorts by priority (1-5, ascending) then by arrival time
- Calculates estimated wait time based on:
  - Base wait time for priority level (1=0min, 2=10min, 3=30min, 4=60min, 5=90min)
  - Additional wait from patients ahead in queue
- Updates `estimated_wait` field in database
- Returns queue in priority order

---

## Error Responses

All endpoints may return the following error responses:

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal Server Error",
  "stack": "Error stack trace (development only)"
}
```

### Database-Specific Errors

**409 Conflict (Duplicate Resource):**
```json
{
  "success": false,
  "error": "Resource already exists"
}
```

**400 Bad Request (Invalid Input Format):**
```json
{
  "success": false,
  "error": "Invalid input format"
}
```

---

## Status Codes Summary

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error
- `501 Not Implemented` - Endpoint not yet implemented

---

## Data Types

### Priority Levels
- `1` - Critical (life-threatening)
- `2` - Emergency (serious condition)
- `3` - Urgent (needs prompt attention)
- `4` - Semi-urgent (can wait briefly)
- `5` - Non-urgent (minor condition)

### Arrival Status
- `waiting` - Patient waiting to be seen
- `in_treatment` - Patient currently being treated
- `completed` - Treatment completed
- `cancelled` - Arrival cancelled

---

## Notes for Android Integration

1. **Base URL Configuration**: Store the base URL in a configuration file for easy environment switching.

2. **Error Handling**: Always check the `success` field in responses. If `false`, display the `error` message to the user.

3. **Timestamps**: All timestamps are in ISO 8601 format (UTC). Convert to local time for display.

4. **Validation**: Perform client-side validation before sending requests to reduce unnecessary API calls.

5. **Hospital Selection**: Fetch hospitals list once and cache it locally. Refresh periodically or on user request.

6. **Priority Selection**: Provide a user-friendly interface for selecting priority levels (1-5) with descriptions.

7. **Network Errors**: Implement retry logic and offline handling for network failures.

8. **Testing**: Use the `/health` and `/api/test-db` endpoints to verify connectivity during app initialization.

---

## Example Usage (cURL)

### Test Database Connection
```bash
curl http://localhost:5000/api/test-db
```

### Get All Hospitals
```bash
curl http://localhost:5000/api/hospitals
```

### Get Hospital Queue
```bash
curl http://localhost:5000/api/hospitals/1/queue
```

### Create Arrival
```bash
curl -X POST http://localhost:5000/api/arrivals \
  -H "Content-Type: application/json" \
  -d "{\"patientName\":\"John Doe\",\"hospitalId\":1,\"priority\":3,\"diagnosis\":\"Appendicitis\"}"
```

### Get Arrival by ID
```bash
curl http://localhost:5000/api/arrivals/1
```

---

## Database Schema Reference

### hospitals
- `id` - Serial primary key
- `name` - Hospital name (varchar 255)
- `address` - Full address (text)
- `phone` - Contact phone (varchar 20)
- `latitude` - GPS latitude (decimal 10,8)
- `longitude` - GPS longitude (decimal 11,8)
- `created_at` - Creation timestamp

### arrivals
- `id` - Serial primary key
- `patient_name` - Patient's name (varchar 255)
- `hospital_id` - Foreign key to hospitals
- `priority` - Priority level 1-5 (integer)
- `diagnosis` - Initial diagnosis (varchar 500)
- `status` - Current status (varchar 50)
- `arrived_at` - Arrival timestamp
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

---

## Patient Details

### GET /api/arrivals/:id/details
Get complete patient details including triage summary and chat log.

**Parameters:**
- `id` (path parameter) - Arrival ID (integer)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "P001",
    "priority": 2,
    "suspectedDiagnosis": "Cardiac Arrest",
    "eta": "2026-06-12T14:30:00.000Z",
    "triageSummary": {
      "symptoms": "Severe chest pain, difficulty breathing",
      "chronology": "Started 15 minutes ago suddenly",
      "quality": "Crushing pain, 10/10 severity",
      "quantity": "Continuous, radiating to left arm",
      "positiveModifiers": "None",
      "negativeModifiers": "Pain worsens with any movement",
      "associatedSymptoms": "Nausea, dizziness, cold sweats",
      "previousHistory": "No previous cardiac events",
      "familyHistory": "Father had heart attack at age 55",
      "currentMedication": "None",
      "otherNotes": "Patient is extremely anxious and pale"
    },
    "chatLog": [
      {
        "sender": "bot",
        "message": "Hello, I'm the SmartER triage assistant.",
        "timestamp": "14:15:00"
      },
      {
        "sender": "patient",
        "message": "I have terrible chest pain",
        "timestamp": "14:15:30"
      }
    ]
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Arrival not found"
}
```

---

## Hospital Dashboard

### GET /api/hospitals/:id/dashboard
Get complete hospital dashboard data including occupancy and patient queues.

**Parameters:**
- `id` (path parameter) - Hospital ID (integer)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "hospital": {
      "id": 1,
      "name": "Surrey Memorial Hospital",
      "address": "13750 96 Ave, Surrey, BC V3V 1Z2",
      "phone": "(604) 581-2211"
    },
    "occupancy": {
      "erBeds": {
        "total": 20,
        "occupied": 14,
        "available": 6
      },
      "inpatientRooms": {
        "total": 150,
        "occupied": 132,
        "available": 18
      }
    },
    "patients": [
      {
        "id": "P001",
        "priority": 1,
        "suspectedDiagnosis": "Cardiac Arrest",
        "eta": "2026-06-12T14:30:00.000Z"
      }
    ],
    "queues": {
      "priority1": [],
      "priority2": [],
      "priority3": [],
      "priority4": [],
      "priority5": []
    }
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Hospital not found"
}
```

**Usage Notes:**
- This endpoint provides all data needed to render the nurse dashboard
- `patients` array contains all active patients
- `queues` object groups patients by priority level for easy rendering
- Occupancy data shows current ER and inpatient bed availability

---

## Priority Management

### PUT /api/arrivals/:id/priority
Update patient priority (drag-and-drop support).

**Parameters:**
- `id` (path parameter) - Arrival ID (integer)

**Request Body:**
```json
{
  "priority": 3
}
```

**Validation:**
- `priority` (required): Integer, must be between 1-5

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Priority updated successfully",
  "data": {
    "hospital": { ... },
    "occupancy": { ... },
    "patients": [ ... ],
    "queues": { ... }
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Priority is required and must be an integer between 1 and 5"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Arrival not found"
}
```

**Workflow:**
1. Updates arrival priority in database
2. Recalculates queue wait times for the hospital
3. Returns complete updated dashboard state
4. React dashboard can immediately re-render with new data

---

## Database Schema Updates

### New Tables

#### triage_summary
Stores detailed triage questionnaire responses.

**Columns:**
- `id` - Serial primary key
- `arrival_id` - Foreign key to arrivals (unique)
- `symptoms` - Text
- `chronology` - Text
- `quality` - Text
- `quantity` - Text
- `positive_modifiers` - Text
- `negative_modifiers` - Text
- `associated_symptoms` - Text
- `previous_history` - Text
- `family_history` - Text
- `current_medication` - Text
- `other_notes` - Text
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### chat_messages
Stores triage chat conversation history.

**Columns:**
- `id` - Serial primary key
- `arrival_id` - Foreign key to arrivals
- `sender` - VARCHAR(20), 'bot' or 'patient'
- `message` - Text
- `timestamp` - VARCHAR(20), time string like "14:15:00"
- `created_at` - Timestamp

#### hospital_occupancy
Tracks hospital bed capacity.

**Columns:**
- `id` - Serial primary key
- `hospital_id` - Foreign key to hospitals (unique)
- `current_er_capacity` - Integer
- `max_er_capacity` - Integer
- `current_inpatient_capacity` - Integer
- `max_inpatient_capacity` - Integer
- `updated_at` - Timestamp

### Updated Tables

#### arrivals
Added columns:
- `suspected_diagnosis` - VARCHAR(255)
- `eta` - Timestamp (estimated time of arrival)

---

## Migration Instructions

To apply database changes to existing installation:

```bash
psql -U postgres -d smarter -f server/src/db/migrations/001_add_triage_and_chat.sql
```

Or for fresh installation:

```bash
psql -U postgres -d smarter -f server/src/db/schema.sql
psql -U postgres -d smarter -f server/src/db/seed.sql
```

---

## React Integration Notes

### No React Changes Required

The backend APIs are designed to match the existing React data structure from `patientsData.json`.

### API Usage in React

Replace the placeholder JSON with API calls:

**Current (placeholder):**
```javascript
import patientsData from './data/patientsData.json';
setPatients(patientsData.patients);
setHospitalOccupancy(patientsData.hospitalOccupancy);
```

**Updated (API):**
```javascript
// Fetch dashboard data
const response = await fetch('http://localhost:5000/api/hospitals/1/dashboard');
const result = await response.json();

setPatients(result.data.patients);
setHospitalOccupancy(result.data.occupancy);
```

**Fetch patient details:**
```javascript
const response = await fetch(`http://localhost:5000/api/arrivals/${arrivalId}/details`);
const result = await response.json();
setSelectedPatient(result.data);
```

**Update priority (drag-and-drop):**
```javascript
const response = await fetch(`http://localhost:5000/api/arrivals/${patientId}/priority`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ priority: newPriority })
});
const result = await response.json();

// Update entire dashboard with new data
setPatients(result.data.patients);
setHospitalOccupancy(result.data.occupancy);
```

---

## Hospital Recommendations

### GET /api/hospitals/recommendations
Get hospitals sorted by total wait time (travel time + ER wait time) based on patient location.

**This endpoint is the preferred method for mobile apps to fetch the list of hospitals**, as it provides personalized recommendations based on the patient's current location and chosen travel mode.

**Query Parameters:**
- `lat` (required) - Patient latitude (number, -90 to 90)
- `lon` (required) - Patient longitude (number, -180 to 180)
- `travelMode` (required) - Mode of travel: 'driving', 'walking', or 'cycling'

**Example Request:**
```
GET /api/hospitals/recommendations?lat=49.2827&lon=-123.1207&travelMode=driving
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "Royal Columbian Hospital",
      "address": "330 E Columbia St, New Westminster, BC V3L 3W7",
      "phone": "(604) 520-4253",
      "latitude": 49.2069,
      "longitude": -122.9106,
      "created_at": "2024-01-01T00:00:00.000Z",
      "estimatedWaitMinutes": 24,
      "travelMinutes": 11,
      "travelDistanceKm": 6.8,
      "totalWaitMinutes": 35,
      "travelDataAvailable": true
    },
    {
      "id": 1,
      "name": "Surrey Memorial Hospital",
      "address": "13750 96 Ave, Surrey, BC V3V 1Z2",
      "phone": "(604) 581-2211",
      "latitude": 49.1764,
      "longitude": -122.8427,
      "created_at": "2024-01-01T00:00:00.000Z",
      "estimatedWaitMinutes": 30,
      "travelMinutes": 18,
      "travelDistanceKm": 12.3,
      "totalWaitMinutes": 48,
      "travelDataAvailable": true
    }
  ]
}
```

**Response Fields:**
- `id` - Hospital ID
- `name` - Hospital name
- `address` - Full address
- `phone` - Contact phone number
- `latitude` - Hospital latitude
- `longitude` - Hospital longitude
- `created_at` - Record creation timestamp
- `estimatedWaitMinutes` - Current estimated ER wait time at the hospital
- `travelMinutes` - Calculated travel time from patient location to hospital
- `travelDistanceKm` - Travel distance in kilometers
- `totalWaitMinutes` - Sum of estimatedWaitMinutes + travelMinutes (used for sorting)
- `travelDataAvailable` - Boolean indicating if travel data was successfully calculated

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Missing required parameters: lat, lon, and travelMode are required"
}
```

```json
{
  "success": false,
  "error": "Invalid latitude: must be a number between -90 and 90"
}
```

```json
{
  "success": false,
  "error": "Invalid longitude: must be a number between -180 and 180"
}
```

```json
{
  "success": false,
  "error": "Invalid travelMode: must be one of driving, walking, cycling"
}
```

**Sorting Logic:**
- Hospitals are sorted by `totalWaitMinutes` in ascending order (shortest total wait first)
- If travel data cannot be calculated for a hospital, it will have `travelDataAvailable: false` and `travelMinutes`, `travelDistanceKm`, and `totalWaitMinutes` will be `null`
- Hospitals with unavailable travel data are sorted to the end of the list

**Travel Time Calculation:**
- Uses the TravelTimeProvider abstraction (currently OSRM)
- Supports three travel modes: driving, walking, cycling
- If travel time calculation fails for a specific hospital, the request continues processing other hospitals
- The endpoint only returns a 500 error if the overall request cannot be completed

**Wait Time Calculation:**
- `estimatedWaitMinutes` is calculated as the average `estimated_wait` of all active arrivals (status: 'waiting' or 'in_treatment') at each hospital
- If no active arrivals exist, defaults to 30 minutes
- `totalWaitMinutes = estimatedWaitMinutes + travelMinutes`

**Mobile App Integration:**
- Use this endpoint instead of `/api/hospitals` to get location-aware hospital recommendations
- Request user's location permission to get accurate lat/lon coordinates
- Allow users to select their travel mode (driving/walking/cycling)
- Display hospitals sorted by total wait time
- Show both travel time and ER wait time separately for transparency
- Handle hospitals with `travelDataAvailable: false` gracefully (e.g., show "Travel data unavailable")

**Example cURL:**
```bash
curl "http://localhost:5000/api/hospitals/recommendations?lat=49.2827&lon=-123.1207&travelMode=driving"
```

---

## Future Endpoints (Not Yet Implemented)

The following endpoints return `501 Not Implemented`:
- `/api/patients/*`
- `/api/triage/*` (except priority update)
- `/api/chat/*` (except via arrival details)
- `/api/occupancy/*` (except via dashboard)
- `/api/records/*`

These will be implemented in future iterations.
