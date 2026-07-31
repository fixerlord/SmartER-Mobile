package com.example.smarter.models;

import com.google.gson.annotations.SerializedName;

public class ArrivalResponse {
    @SerializedName("id")
    private int arrivalId;
    
    private int priority;
    
    @SerializedName("estimated_wait")
    private int eta;
    
    private String status;
    
    @SerializedName("hospital_id")
    private int hospitalId;

    @SerializedName("hospital_name")
    private String hospitalName;

    @SerializedName("hospital_address")
    private String hospitalAddress;

    @SerializedName("suspected_diagnosis")
    private String suspectedDiagnosis;

    @SerializedName("created_at")
    private String createdAt;

    @SerializedName("queue_position")
    private int queuePosition;

    private Vitals vitals;

    public int getArrivalId() { return arrivalId; }
    public int getPriority() { return priority; }
    public int getEta() { return eta; }
    public String getStatus() { return status; }
    public int getHospitalId() { return hospitalId; }
    public String getHospitalName() { return hospitalName; }
    public String getHospitalAddress() { return hospitalAddress; }
    public String getSuspectedDiagnosis() { return suspectedDiagnosis; }
    public String getCreatedAt() { return createdAt; }
    public int getQueuePosition() { return queuePosition; }
    public Vitals getVitals() { return vitals; }

    public static class Vitals {
        @SerializedName("heart_rate")
        private int heartRate;
        private int oxygen;
        private String status;

        public int getHeartRate() { return heartRate; }
        public int getOxygen() { return oxygen; }
        public String getStatus() { return status; }
    }
}
