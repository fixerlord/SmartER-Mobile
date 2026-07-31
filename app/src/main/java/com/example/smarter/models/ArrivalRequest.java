package com.example.smarter.models;

import java.util.List;

public class ArrivalRequest {
    private int hospitalId;
    private Integer userId;
    private String patientName;
    private List<ChatMessage> chatLog;
    private TriageSummary triageSummary;

    public ArrivalRequest(int hospitalId, Integer userId, String patientName, List<ChatMessage> chatLog, TriageSummary triageSummary) {
        this.hospitalId = hospitalId;
        this.userId = userId;
        this.patientName = patientName;
        this.chatLog = chatLog;
        this.triageSummary = triageSummary;
    }
}
