package com.example.smarter;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.smarter.models.ArrivalRequest;
import com.example.smarter.models.ArrivalResponse;
import com.example.smarter.models.ChatMessage;
import com.example.smarter.models.TriageSummary;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChatActivity extends AppCompatActivity {

    private static final int REQUEST_SELECT_HOSPITAL = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        MaterialButton btnSend = findViewById(R.id.btnSend);
        // For prototype, we'll use a single "Submit Triage" action as per Task 1
        btnSend.setOnClickListener(v -> {
            Intent intent = new Intent(ChatActivity.this, HospitalActivity.class);
            startActivityForResult(intent, REQUEST_SELECT_HOSPITAL);
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_SELECT_HOSPITAL && resultCode == RESULT_OK && data != null) {
            int hospitalId = data.getIntExtra("hospitalId", -1);
            if (hospitalId != -1) {
                createArrival(hospitalId);
            }
        }
    }

    private void createArrival(int hospitalId) {
        // Task 1: MOCKED chatLog and triageSummary
        List<ChatMessage> chatLog = new ArrayList<>();
        chatLog.add(new ChatMessage("patient", "I have chest pain", "2026-06-25T10:00:00Z"));

        List<TriageSummary.Field> fields = new ArrayList<>();
        fields.add(new TriageSummary.Field("Symptoms", "Chest pain, shortness of breath"));
        fields.add(new TriageSummary.Field("Severity", "High"));
        TriageSummary summary = new TriageSummary(fields);

        ArrivalRequest request = new ArrivalRequest(hospitalId, "John Doe", chatLog, summary);

        ApiService service = ApiClient.getClient(this).create(ApiService.class);
        service.createArrival(request).enqueue(new Callback<ArrivalResponse>() {
            @Override
            public void onResponse(Call<ArrivalResponse> call, Response<ArrivalResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Intent intent = new Intent(ChatActivity.this, StatusActivity.class);
                    intent.putExtra("arrivalId", response.body().getArrivalId());
                    startActivity(intent);
                    finish();
                } else {
                    Toast.makeText(ChatActivity.this, "Failed to create arrival", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ArrivalResponse> call, Throwable t) {
                Toast.makeText(ChatActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
