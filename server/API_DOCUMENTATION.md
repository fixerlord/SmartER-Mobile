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

## Future Endpoints (Not Yet Implemented)

The following endpoints return `501 Not Implemented`:
- `/api/patients/*`
- `/api/triage/*`
- `/api/queue/*`
- `/api/chat/*`
- `/api/occupancy/*`
- `/api/records/*`

These will be implemented in future iterations.
