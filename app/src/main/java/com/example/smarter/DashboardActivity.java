package com.example.smarter;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.card.MaterialCardView;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

public class DashboardActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        TextView tvWelcome = findViewById(R.id.tvWelcome);
        // We could get user name from intent or TokenManager
        tvWelcome.setText("Israel");

        FloatingActionButton btnLogout = findViewById(R.id.btnLogout);
        btnLogout.setOnClickListener(v -> {
            TokenManager.getInstance(this).clearToken();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });

        MaterialCardView btnTriageCard = findViewById(R.id.btnTriageCard);
        btnTriageCard.setOnClickListener(v -> {
            startActivity(new Intent(this, HospitalActivity.class));
        });

        ExtendedFloatingActionButton fabChat = findViewById(R.id.fabChat);
        fabChat.setOnClickListener(v -> {
            startActivity(new Intent(this, HospitalActivity.class));
        });
    }
}
