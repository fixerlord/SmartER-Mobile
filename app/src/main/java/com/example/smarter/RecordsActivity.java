package com.example.smarter;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.smarter.models.ArrivalResponse;
import com.example.smarter.models.BaseResponse;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RecordsActivity extends AppCompatActivity {

    private RecyclerView rvRecords;
    private ProgressBar progressBar;
    private TextView tvEmpty;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_records);

        rvRecords = findViewById(R.id.rvRecords);
        progressBar = findViewById(R.id.progressBar);
        tvEmpty = findViewById(R.id.tvEmpty);

        rvRecords.setLayoutManager(new LinearLayoutManager(this));

        fetchRecords();
    }

    private void fetchRecords() {
        int userId = TokenManager.getInstance(this).getUserId();
        Log.d("RecordsActivity", "Fetching records for userId: " + userId);
        if (userId == -1) {
            Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        progressBar.setVisibility(View.VISIBLE);
        ApiService service = ApiClient.getClient(this).create(ApiService.class);
        service.getUserRecords(userId).enqueue(new Callback<BaseResponse<List<ArrivalResponse>>>() {
            @Override
            public void onResponse(Call<BaseResponse<List<ArrivalResponse>>> call, Response<BaseResponse<List<ArrivalResponse>>> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    List<ArrivalResponse> records = response.body().getData();
                    Log.d("RecordsActivity", "Records found: " + (records != null ? records.size() : 0));
                    if (records == null || records.isEmpty()) {
                        tvEmpty.setVisibility(View.VISIBLE);
                        rvRecords.setVisibility(View.GONE);
                    } else {
                        tvEmpty.setVisibility(View.GONE);
                        rvRecords.setVisibility(View.VISIBLE);
                        rvRecords.setAdapter(new RecordsAdapter(records));
                    }
                } else {
                    String error = "Failed to fetch records";
                    if (response.body() != null && response.body().getError() != null) {
                        error = response.body().getError();
                    }
                    Log.e("RecordsActivity", "Error: " + error);
                    Toast.makeText(RecordsActivity.this, error, Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<BaseResponse<List<ArrivalResponse>>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Log.e("RecordsActivity", "Network Error: " + t.getMessage());
                Toast.makeText(RecordsActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
