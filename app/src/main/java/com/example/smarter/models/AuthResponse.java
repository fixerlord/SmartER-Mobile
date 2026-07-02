package com.example.smarter.models;

public class AuthResponse {
    private User user;
    private String token;

    public User getUser() { return user; }
    public String getToken() { return token; }

    public static class User {
        private int id;
        private String username;
        private String fullName;

        public int getId() { return id; }
        public String getUsername() { return username; }
        public String getFullName() { return fullName; }
    }
}
