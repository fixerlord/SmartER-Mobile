package com.example.smarter.models;

public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private String phone;

    public RegisterRequest(String username, String password, String fullName, String phone) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
    }
}
