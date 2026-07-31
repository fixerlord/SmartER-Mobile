package com.example.smarter.models;

import com.google.gson.annotations.SerializedName;

public class Hospital {
    private int id;
    private String name;
    private String address;
    private String phone;
    private double latitude;
    private double longitude;
    
    @SerializedName("erWaitTime")
    private int erWaitTime;
    
    // New recommendation fields
    private Integer estimatedWaitMinutes;
    private Integer travelMinutes;
    private Double travelDistanceKm;
    private Integer totalWaitMinutes;
    private boolean travelDataAvailable;

    public int getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getPhone() { return phone; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    
    public int getErWaitTime() { 
        if (estimatedWaitMinutes != null) return estimatedWaitMinutes;
        return erWaitTime; 
    }
    
    public Integer getEstimatedWaitMinutes() { return estimatedWaitMinutes; }
    public Integer getTravelMinutes() { return travelMinutes; }
    public Double getTravelDistanceKm() { return travelDistanceKm; }
    public Integer getTotalWaitMinutes() { return totalWaitMinutes; }
    public boolean isTravelDataAvailable() { return travelDataAvailable; }
}
