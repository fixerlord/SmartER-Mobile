package com.example.smarter;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class LoginActivity extends AppCompatActivity {

    Button btnLogin;
    TextView tvRegister;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        btnLogin = findViewById(R.id.btnLogin);
        tvRegister = findViewById(R.id.tvRegister);

        btnLogin.setOnClickListener(v -> {

            // Simulate JWT Token generation on successful login
            String fakeJwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";
            TokenManager.getInstance(this).saveToken(fakeJwtToken);

            Intent intent =
                    new Intent(LoginActivity.this,
                            DashboardActivity.class);

            startActivity(intent);
        });

        tvRegister.setOnClickListener(v -> {

            Intent intent =
                    new Intent(LoginActivity.this,
                            RegisterActivity.class);

            startActivity(intent);
        });
    }
}
