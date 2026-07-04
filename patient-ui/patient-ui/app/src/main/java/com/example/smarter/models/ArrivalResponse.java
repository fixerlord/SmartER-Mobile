package com.example.smarter.models;

public class ArrivalResponse {
    private int arrivalId;
    private int priority;
    private int eta;
    private String status;
    private int hospitalId;

    public int getArrivalId() { return arrivalId; }
    public int getPriority() { return priority; }
    public int getEta() { return eta; }
    public String getStatus() { return status; }
    public int getHospitalId() { return hospitalId; }
}
