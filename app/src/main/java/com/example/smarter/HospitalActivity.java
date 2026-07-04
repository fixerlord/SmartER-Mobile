package com.example.smarter;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.smarter.models.BaseResponse;
import com.example.smarter.models.Hospital;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HospitalActivity extends AppCompatActivity {

    private RecyclerView rvHospitals;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hospital);

        rvHospitals = findViewById(R.id.rvHospitals);
        progressBar = findViewById(R.id.progressBar);

        rvHospitals.setLayoutManager(new LinearLayoutManager(this));

        fetchHospitals();
    }

    private void fetchHospitals() {
        progressBar.setVisibility(View.VISIBLE);
        ApiService service = ApiClient.getClient(this).create(ApiService.class);
        service.getHospitals().enqueue(new Callback<BaseResponse<List<Hospital>>>() {
            @Override
            public void onResponse(Call<BaseResponse<List<Hospital>>> call, Response<BaseResponse<List<Hospital>>> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    setupRecyclerView(response.body().getData());
                } else {
                    String error = "Failed to fetch hospitals";
                    if (response.body() != null && response.body().getError() != null) {
                        error = response.body().getError();
                    }
                    Toast.makeText(HospitalActivity.this, error, Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<BaseResponse<List<Hospital>>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(HospitalActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setupRecyclerView(List<Hospital> hospitals) {
        HospitalAdapter adapter = new HospitalAdapter(hospitals, hospital -> {
            Intent intent = new Intent(HospitalActivity.this, ChatActivity.class);
            intent.putExtra("hospitalId", hospital.getId());
            intent.putExtra("hospitalName", hospital.getName());
            startActivity(intent);
            finish();
        });
        rvHospitals.setAdapter(adapter);
    }
}
