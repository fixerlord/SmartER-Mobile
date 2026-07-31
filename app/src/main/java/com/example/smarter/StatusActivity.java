package com.example.smarter;

import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.smarter.models.ArrivalResponse;
import com.example.smarter.models.BaseResponse;
import com.google.android.material.button.MaterialButton;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class StatusActivity extends AppCompatActivity {

    private int arrivalId;
    private TextView tvPriority, tvEta, tvStatus;
    private ProgressBar progressBar;
    private android.os.Handler pollHandler = new android.os.Handler();
    private Runnable pollRunnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_status);

        arrivalId = getIntent().getIntExtra("arrivalId", -1);

        tvPriority = findViewById(R.id.tvPriority);
        tvEta = findViewById(R.id.tvEta);
        tvStatus = findViewById(R.id.tvStatus);
        progressBar = findViewById(R.id.progressBar);
        MaterialButton btnRefresh = findViewById(R.id.btnRefresh);

        btnRefresh.setOnClickListener(v -> fetchStatus(true));

        pollRunnable = new Runnable() {
            @Override
            public void run() {
                fetchStatus(false);
                pollHandler.postDelayed(this, 3000); // Polling every 3 seconds
            }
        };

        fetchStatus(true);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (arrivalId != -1) {
            pollHandler.post(pollRunnable);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        pollHandler.removeCallbacks(pollRunnable);
    }

    private void fetchStatus(boolean showLoading) {
        if (arrivalId == -1) return;

        if (showLoading) progressBar.setVisibility(View.VISIBLE);
        ApiService service = ApiClient.getClient(this).create(ApiService.class);
        service.getArrivalStatus(arrivalId).enqueue(new Callback<BaseResponse<ArrivalResponse>>() {
            @Override
            public void onResponse(Call<BaseResponse<ArrivalResponse>> call, Response<BaseResponse<ArrivalResponse>> response) {
                if (showLoading) progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    displayStatus(response.body().getData());
                } else {
                    if (showLoading) {
                        String error = "Failed to fetch status";
                        if (response.body() != null && response.body().getError() != null) {
                            error = response.body().getError();
                        }
                        Toast.makeText(StatusActivity.this, error, Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<BaseResponse<ArrivalResponse>> call, Throwable t) {
                if (showLoading) {
                    progressBar.setVisibility(View.GONE);
                    Toast.makeText(StatusActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void displayStatus(ArrivalResponse status) {
        int priority = status.getPriority();
        String priorityText;
        switch (priority) {
            case 1: priorityText = "Critical (1)"; break;
            case 2: priorityText = "Emergency (2)"; break;
            case 3: priorityText = "Urgent (3)"; break;
            case 4: priorityText = "Semi-urgent (4)"; break;
            default: priorityText = "Non-urgent (5)"; break;
        }
        tvPriority.setText(priorityText);
        
        int waitMinutes = status.getEta();
        if (waitMinutes < 60) {
            tvEta.setText(waitMinutes + " mins");
        } else {
            tvEta.setText((waitMinutes / 60) + "h " + (waitMinutes % 60) + "m");
        }

        String statusStr = status.getStatus();
        if (statusStr != null) {
            tvStatus.setText(statusStr.substring(0, 1).toUpperCase() + statusStr.substring(1).replace('_', ' '));
        }
    }
}
