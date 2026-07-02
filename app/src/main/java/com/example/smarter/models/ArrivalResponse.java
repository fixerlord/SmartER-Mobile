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

    public int getArrivalId() { return arrivalId; }
    public int getPriority() { return priority; }
    public int getEta() { return eta; }
    public String getStatus() { return status; }
    public int getHospitalId() { return hospitalId; }
}
