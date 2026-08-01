package com.example.smarter;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.core.app.ActivityCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.smarter.models.BaseResponse;
import com.example.smarter.models.Hospital;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HospitalActivity extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1001;
    private RecyclerView rvHospitals;
    private ProgressBar progressBar;
    private List<Hospital> allHospitals = new ArrayList<>();
    private HospitalAdapter adapter;
    private SearchView searchView;
    private FusedLocationProviderClient fusedLocationClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hospital);

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        rvHospitals = findViewById(R.id.rvHospitals);
        progressBar = findViewById(R.id.progressBar);
        searchView = findViewById(R.id.searchView);
        View btnRefresh = findViewById(R.id.btnRefresh);

        rvHospitals.setLayoutManager(new LinearLayoutManager(this));

        btnRefresh.setOnClickListener(v -> checkLocationAndFetch());

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                filterHospitals(query);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                filterHospitals(newText);
                return true;
            }
        });

        checkLocationAndFetch();
    }

    private void checkLocationAndFetch() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, LOCATION_PERMISSION_REQUEST_CODE);
        } else {
            getLastLocationAndFetch();
        }
    }

    private void getLastLocationAndFetch() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            fetchHospitals(null);
            return;
        }

        progressBar.setVisibility(View.VISIBLE);
        fusedLocationClient.getCurrentLocation(com.google.android.gms.location.Priority.PRIORITY_HIGH_ACCURACY, null).addOnSuccessListener(this, location -> {
            if (location != null) {
                Log.d("HospitalActivity", "Current Location: Lat=" + location.getLatitude() + ", Lon=" + location.getLongitude());
                System.out.println("Current Location: Lat=" + location.getLatitude() + ", Lon=" + location.getLongitude());
            } else {
                Log.d("HospitalActivity", "Current Location: null");
                System.out.println("Current Location: null");
            }
            fetchHospitals(location);
        }).addOnFailureListener(e -> {
            Log.e("HospitalActivity", "Error getting location", e);
            fetchHospitals(null);
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                getLastLocationAndFetch();
            } else {
                fetchHospitals(null);
            }
        }
    }

    private void fetchHospitals(Location location) {
        progressBar.setVisibility(View.VISIBLE);
        ApiService service = ApiClient.getClient(this).create(ApiService.class);
        
        Call<BaseResponse<List<Hospital>>> call;
        if (location != null) {
            call = service.getRecommendations(location.getLatitude(), location.getLongitude(), "driving");
        } else {
            call = service.getHospitals();
        }

        call.enqueue(new Callback<BaseResponse<List<Hospital>>>() {
            @Override
            public void onResponse(Call<BaseResponse<List<Hospital>>> call, Response<BaseResponse<List<Hospital>>> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    allHospitals = response.body().getData();
                    if (allHospitals == null || allHospitals.isEmpty()) {
                        findViewById(R.id.tvEmpty).setVisibility(View.VISIBLE);
                        rvHospitals.setVisibility(View.GONE);
                    } else {
                        findViewById(R.id.tvEmpty).setVisibility(View.GONE);
                        rvHospitals.setVisibility(View.VISIBLE);
                        setupRecyclerView(allHospitals);
                        if (getSupportActionBar() != null) {
                            String subtitle = allHospitals.size() + " centers available";
                            if (location != null) subtitle += " (nearby sorted)";
                            getSupportActionBar().setSubtitle(subtitle);
                        }
                    }
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

    private void filterHospitals(String query) {
        List<Hospital> filteredList = new ArrayList<>();
        for (Hospital h : allHospitals) {
            if (h.getName().toLowerCase().contains(query.toLowerCase()) || 
                (h.getAddress() != null && h.getAddress().toLowerCase().contains(query.toLowerCase()))) {
                filteredList.add(h);
            }
        }
        setupRecyclerView(filteredList);
    }

    private void setupRecyclerView(List<Hospital> hospitals) {
        adapter = new HospitalAdapter(hospitals, hospital -> {
            Intent intent = new Intent(HospitalActivity.this, ChatActivity.class);
            intent.putExtra("hospitalId", hospital.getId());
            intent.putExtra("hospitalName", hospital.getName());
            startActivity(intent);
            finish();
        });
        rvHospitals.setAdapter(adapter);
    }
}
