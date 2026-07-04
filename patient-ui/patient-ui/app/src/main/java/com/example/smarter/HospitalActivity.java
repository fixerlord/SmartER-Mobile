package com.example.smarter;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.smarter.models.Hospital;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HospitalActivity extends AppCompatActivity {

    private RecyclerView rvHospitals;
    private ProgressBar progressBar;
    private HospitalAdapter adapter;

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
        service.getHospitals().enqueue(new Callback<List<Hospital>>() {
            @Override
            public void onResponse(Call<List<Hospital>> call, Response<List<Hospital>> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    setupRecyclerView(response.body());
                } else {
                    Toast.makeText(HospitalActivity.this, "Failed to fetch hospitals", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Hospital>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(HospitalActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setupRecyclerView(List<Hospital> hospitals) {
        adapter = new HospitalAdapter(hospitals, hospital -> {
            Intent intent = new Intent();
            intent.putExtra("hospitalId", hospital.getId());
            intent.putExtra("hospitalName", hospital.getName());
            setResult(RESULT_OK, intent);
            finish();
        });
        rvHospitals.setAdapter(adapter);
    }
}
