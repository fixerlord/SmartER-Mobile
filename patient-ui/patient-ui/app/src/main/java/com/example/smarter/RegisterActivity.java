package com.example.smarter;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class RegisterActivity extends AppCompatActivity {

    Button btnRegister;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        btnRegister = findViewById(R.id.btnRegister);

        btnRegister.setOnClickListener(v -> {

            Intent intent =
                    new Intent(RegisterActivity.this,
                            DashboardActivity.class);

            startActivity(intent);

            finish();
        });
    }
}