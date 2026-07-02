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

        btnRefresh.setOnClickListener(v -> fetchStatus());

        fetchStatus();
    }

    private void fetchStatus() {
        if (arrivalId == -1) return;

        progressBar.setVisibility(View.VISIBLE);
        ApiService service = ApiClient.getClient(this).create(ApiService.class);
        service.getArrivalStatus(arrivalId).enqueue(new Callback<BaseResponse<ArrivalResponse>>() {
            @Override
            public void onResponse(Call<BaseResponse<ArrivalResponse>> call, Response<BaseResponse<ArrivalResponse>> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    displayStatus(response.body().getData());
                } else {
                    String error = "Failed to fetch status";
                    if (response.body() != null && response.body().getError() != null) {
                        error = response.body().getError();
                    }
                    Toast.makeText(StatusActivity.this, error, Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<BaseResponse<ArrivalResponse>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(StatusActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void displayStatus(ArrivalResponse status) {
        tvPriority.setText(String.valueOf(status.getPriority()));
        tvEta.setText(String.valueOf(status.getEta()));
        tvStatus.setText(status.getStatus());
    }
}
