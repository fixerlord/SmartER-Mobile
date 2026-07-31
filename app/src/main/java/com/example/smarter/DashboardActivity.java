package com.example.smarter;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.smarter.models.ArrivalResponse;
import com.example.smarter.models.BaseResponse;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DashboardActivity extends AppCompatActivity {

    private TextView tvHospital, tvHospitalAddress, tvWaitTime, tvStatus;
    private TextView tvQueuePosition, tvHeartRate, tvVitalsStatus;
    private MaterialCardView cardStatus;
    private android.os.Handler pollHandler = new android.os.Handler();
    private Runnable pollRunnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        tvHospital = findViewById(R.id.tvHospital);
        tvHospitalAddress = findViewById(R.id.tvHospitalAddress);
        tvWaitTime = findViewById(R.id.tvWaitTime);
        tvStatus = findViewById(R.id.tvStatus);
        cardStatus = findViewById(R.id.cardStatus);

        tvQueuePosition = findViewById(R.id.tvQueuePosition);
        tvHeartRate = findViewById(R.id.tvHeartRate);
        tvVitalsStatus = findViewById(R.id.tvVitalsStatus);

        TextView tvGreeting = findViewById(R.id.tvGreeting);
        TextView tvWelcome = findViewById(R.id.tvWelcome);
        
        String name = TokenManager.getInstance(this).getUserName();
        int userId = TokenManager.getInstance(this).getUserId();
        
        tvGreeting.setText("Welcome back,");
        tvWelcome.setText(name);

        pollRunnable = new Runnable() {
            @Override
            public void run() {
                if (userId != -1) {
                    fetchLatestVisit(userId);
                }
                pollHandler.postDelayed(this, 3000); // Update every 3 seconds for "real-time" feel
            }
        };

        if (userId == -1) {
            Log.w("DashboardActivity", "UserId is missing. Some features may be limited.");
            // Optionally force logout or refresh token here
        }

        fetchLatestVisit(userId);

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

        MaterialCardView btnRecordsCard = findViewById(R.id.btnRecordsCard);
        btnRecordsCard.setOnClickListener(v -> {
            Log.d("DashboardActivity", "My Records card clicked");
            startActivity(new Intent(this, RecordsActivity.class));
        });

        ExtendedFloatingActionButton fabChat = findViewById(R.id.fabChat);
        fabChat.setOnClickListener(v -> {
            startActivity(new Intent(this, HospitalActivity.class));
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        int userId = TokenManager.getInstance(this).getUserId();
        if (userId != -1) {
            fetchLatestVisit(userId);
            pollHandler.post(pollRunnable);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        pollHandler.removeCallbacks(pollRunnable);
    }

    private void fetchLatestVisit(int userId) {
        ApiService service = ApiClient.getClient(this).create(ApiService.class);
        service.getLatestArrival(userId).enqueue(new Callback<BaseResponse<ArrivalResponse>>() {
            @Override
            public void onResponse(Call<BaseResponse<ArrivalResponse>> call, Response<BaseResponse<ArrivalResponse>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    ArrivalResponse arrival = response.body().getData();
                    if (arrival != null) {
                        updateVisitUI(arrival);
                    } else {
                        showNoActiveVisit();
                    }
                }
            }

            @Override
            public void onFailure(Call<BaseResponse<ArrivalResponse>> call, Throwable t) {
                Log.e("DashboardActivity", "Error fetching latest visit: " + t.getMessage());
            }
        });
    }

    private void updateVisitUI(ArrivalResponse arrival) {
        cardStatus.setVisibility(View.VISIBLE);
        tvHospital.setText(arrival.getHospitalName());
        tvHospitalAddress.setText(arrival.getHospitalAddress());
        
        int waitMinutes = arrival.getEta(); // mapped to estimated_wait
        if (waitMinutes < 60) {
            tvWaitTime.setText(waitMinutes + "m");
        } else {
            int hrs = waitMinutes / 60;
            int mins = waitMinutes % 60;
            tvWaitTime.setText(hrs + "h " + mins + "m");
        }
        
        String status = arrival.getStatus();
        if (status != null) {
            String formattedStatus = status.substring(0, 1).toUpperCase() + status.substring(1).replace('_', ' ');
            tvStatus.setText(formattedStatus);
            
            // Change color based on status
            if (status.equals("in_treatment")) {
                tvStatus.setTextColor(androidx.core.content.ContextCompat.getColor(this, R.color.dashTeal));
            } else {
                tvStatus.setTextColor(androidx.core.content.ContextCompat.getColor(this, R.color.dashAmber));
            }
        }

        // Update Queue Position
        tvQueuePosition.setText("#" + arrival.getQueuePosition());

        // Update Vitals (Mock alive data)
        ArrivalResponse.Vitals vitals = arrival.getVitals();
        if (vitals != null) {
            tvHeartRate.setText(vitals.getHeartRate() + " bpm");
            tvVitalsStatus.setText(vitals.getStatus() + " (SpO2: " + vitals.getOxygen() + "%)");
        }
    }

    private void showNoActiveVisit() {
        // Option 1: Hide the card
        // cardStatus.setVisibility(View.GONE);
        
        // Option 2: Show placeholder
        tvHospital.setText("No active visit");
        tvHospitalAddress.setText("Start a triage to see your status here");
        tvWaitTime.setText("--");
        tvStatus.setText("Inactive");

        tvQueuePosition.setText("--");
        tvHeartRate.setText("-- bpm");
        tvVitalsStatus.setText("Offline");
    }
}
