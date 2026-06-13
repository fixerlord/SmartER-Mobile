package com.example.smarter;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

public class DashboardActivity extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1001;
    private static final double HOSPITAL_LAT = 49.1764;
    private static final double HOSPITAL_LNG = -122.8427;
    private static final float GEOFENCE_RADIUS_METERS = 500;

    FloatingActionButton btnLogout;
    MaterialCardView btnTriage, btnRecords;
    MaterialCardView cardGeofence;
    TextView tvGeofenceMessage;
    ImageView ivGeofenceStatus;
    Button btnCheckProximity;
    ExtendedFloatingActionButton fabChat;

    private FusedLocationProviderClient fusedLocationClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        initViews();
        setupClickListeners();
        checkLocationPermissions();
    }

    private void initViews() {
        btnLogout = findViewById(R.id.btnLogout);
        btnTriage = findViewById(R.id.btnTriageCard);
        btnRecords = findViewById(R.id.btnRecordsCard);
        
        cardGeofence = findViewById(R.id.cardGeofence);
        tvGeofenceMessage = findViewById(R.id.tvGeofenceMessage);
        ivGeofenceStatus = findViewById(R.id.ivGeofenceStatus);
        btnCheckProximity = findViewById(R.id.btnCheckProximity);
        fabChat = findViewById(R.id.fabChat);
    }

    private void setupClickListeners() {
        btnTriage.setOnClickListener(v -> Toast.makeText(this, "New Triage Started", Toast.LENGTH_SHORT).show());
        btnRecords.setOnClickListener(v -> Toast.makeText(this, "Viewing Medical Records", Toast.LENGTH_SHORT).show());

        btnCheckProximity.setOnClickListener(v -> checkProximity());

        fabChat.setOnClickListener(v -> {
            Intent intent = new Intent(DashboardActivity.this, ChatActivity.class);
            startActivity(intent);
        });

        btnLogout.setOnClickListener(v -> {
            TokenManager.getInstance(this).clearToken();
            Intent intent = new Intent(DashboardActivity.this, LoginActivity.class);
            startActivity(intent);
            finish();
        });
    }

    private void checkLocationPermissions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    LOCATION_PERMISSION_REQUEST_CODE);
        } else {
            checkProximity();
        }
    }

    private void checkProximity() {
        tvGeofenceMessage.setText("Checking proximity...");
        
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            tvGeofenceMessage.setText("Location permission required");
            return;
        }

        fusedLocationClient.getLastLocation().addOnSuccessListener(this, location -> {
            if (location != null) {
                float[] results = new float[1];
                Location.distanceBetween(location.getLatitude(), location.getLongitude(),
                        HOSPITAL_LAT, HOSPITAL_LNG, results);
                float distanceInMeters = results[0];

                if (distanceInMeters <= GEOFENCE_RADIUS_METERS) {
                    onArrivedAtHospital();
                } else {
                    tvGeofenceMessage.setText("Not near hospital (" + (int)distanceInMeters + "m away)");
                    ivGeofenceStatus.setColorFilter(ContextCompat.getColor(this, R.color.textSecondary));
                }
            } else {
                simulateArrivalForDemo();
            }
        });
    }

    private void onArrivedAtHospital() {
        tvGeofenceMessage.setText("Welcome! You've been automatically checked in.");
        tvGeofenceMessage.setTextColor(ContextCompat.getColor(this, R.color.colorPrimary));
        ivGeofenceStatus.setImageResource(android.R.drawable.presence_online);
        ivGeofenceStatus.setColorFilter(ContextCompat.getColor(this, R.color.colorPrimary));
        
        Toast.makeText(this, "Auto Check-In Successful!", Toast.LENGTH_LONG).show();
    }

    private void simulateArrivalForDemo() {
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            onArrivedAtHospital();
        }, 2000);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                checkProximity();
            } else {
                tvGeofenceMessage.setText("Permission denied. Auto check-in disabled.");
            }
        }
    }
}
