# API

This document describes all backend API endpoints for the SmartER prototype system.

---

## POST /api/arrival

Creates a new patient arrival.

### Request
```json id="post_arrival_req"
{
  "hospitalId": 1,
  "patientName": "John Doe",
  "chatLog": [
    {
      "sender": "patient",
      "message": "Chest pain",
      "timestamp": "2026-06-25T10:00:00Z"
    }
  ],
  "triageSummary": {
    "fields": [
      {
        "label": "Symptoms",
        "value": "Chest pain, shortness of breath"
      }
    ]
  }
}
````

### Response

```json id="post_arrival_res"
{
  "arrivalId": 101,
  "priority": 2,
  "eta": 35,
  "status": "waiting"
}
```

---

## GET /api/arrival/:id

Returns full arrival details for a patient.

### Response

```json id="get_arrival_res"
{
  "arrivalId": 101,
  "hospitalId": 1,
  "patientName": "John Doe",
  "priority": 2,
  "eta": 30,
  "status": "waiting",
  "chatLog": [],
  "triageSummary": {
    "fields": []
  }
}
```

---

## PUT /api/arrival/:id

Updates patient priority (nurse override).

### Request

```json id="put_arrival_req"
{
  "priority": 1
}
```

### Response

```json id="put_arrival_res"
{
  "success": true,
  "updatedPriority": 1,
  "eta": 20
}
```

---

## GET /api/arrival/:id/details

Returns detailed structured patient data for nurse dashboard.

### Response

```json id="arrival_details_res"
{
  "arrivalId": 101,
  "patientName": "John Doe",
  "priority": 2,
  "eta": 30,
  "chatLog": [],
  "triageSummary": {
    "fields": []
  },
  "suspectedDiagnosis": "Chest Pain",
  "createdAt": "2026-06-25T10:00:00Z"
}
```

---

## GET /api/hospitals

Returns list of hospitals.

### Response

```json id="hospitals_res"
[
  {
    "id": 1,
    "name": "Vancouver General Hospital",
    "erWaitTime": 45
  },
  {
    "id": 2,
    "name": "St. Paul's Hospital",
    "erWaitTime": 30
  }
]
```

---

## GET /api/hospital/:id/queue

Returns current hospital queue for nurse dashboard.

### Response

```json id="queue_res"
{
  "hospitalId": 1,
  "queue": [
    {
      "arrivalId": 101,
      "patientName": "John Doe",
      "priority": 2,
      "eta": 30
    }
  ]
}
```

---

## GET /api/hospital/:id/dashboard

Returns full nurse dashboard state.

Includes:

* queue
* occupancy
* hospital info

### Response

```json id="dashboard_res"
{
  "hospitalId": 1,
  "hospitalName": "Vancouver General Hospital",
  "occupancy": {
    "erBeds": {
      "occupied": 10,
      "available": 5,
      "total": 15
    }
  },
  "queue": [
    {
      "arrivalId": 101,
      "patientName": "John Doe",
      "priority": 2,
      "eta": 30
    }
  ]
}
```

---

# Notes

* ETA is always computed by backend
* Priority changes must trigger queue recalculation
* triageSummary uses dynamic `fields[]` format
* No frontend logic should calculate medical or queue data

````
