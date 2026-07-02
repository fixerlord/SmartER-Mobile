package com.example.smarter;

import android.content.Intent;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.smarter.models.ArrivalRequest;
import com.example.smarter.models.ArrivalResponse;
import com.example.smarter.models.BaseResponse;
import com.example.smarter.models.ChatMessage;
import com.example.smarter.models.TriageSummary;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChatActivity extends AppCompatActivity {

    private int hospitalId;
    private String hospitalName;
    private RecyclerView rvChat;
    private ChatAdapter adapter;
    private List<ChatMessage> chatMessages;
    private EditText etMessage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        hospitalId = getIntent().getIntExtra("hospitalId", -1);
        hospitalName = getIntent().getStringExtra("hospitalName");

        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            if (hospitalName != null) {
                getSupportActionBar().setTitle("Triage: " + hospitalName);
            }
        }
        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        rvChat = findViewById(R.id.rvChat);
        etMessage = findViewById(R.id.etMessage);
        MaterialButton btnSend = findViewById(R.id.btnSend);

        chatMessages = new ArrayList<>();
        chatMessages.add(new ChatMessage("bot", "Hello! I am your Health Assistant for " + (hospitalName != null ? hospitalName : "the ER") + ". Please describe your symptoms so I can prepare your arrival.", getCurrentTimestamp()));
        
        adapter = new ChatAdapter(chatMessages);
        rvChat.setLayoutManager(new LinearLayoutManager(this));
        rvChat.setAdapter(adapter);

        btnSend.setOnClickListener(v -> {
            String messageText = etMessage.getText().toString().trim();
            if (!messageText.isEmpty()) {
                chatMessages.add(new ChatMessage("patient", messageText, getCurrentTimestamp()));
                adapter.notifyItemInserted(chatMessages.size() - 1);
                rvChat.scrollToPosition(chatMessages.size() - 1);
                etMessage.setText("");

                // In this flow, we create arrival directly after the first description
                createArrival();
            } else {
                Toast.makeText(this, "Please describe how you are feeling", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private String getCurrentTimestamp() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        return sdf.format(new Date());
    }

    private void createArrival() {
        if (hospitalId == -1) {
            Toast.makeText(this, "Error: No hospital selected", Toast.LENGTH_SHORT).show();
            return;
        }

        String symptomsValue = "No description provided";
        for (int i = chatMessages.size() - 1; i >= 0; i--) {
            if ("patient".equals(chatMessages.get(i).getSender())) {
                symptomsValue = chatMessages.get(i).getMessage();
                break;
            }
        }

        List<TriageSummary.Field> fields = new ArrayList<>();
        fields.add(new TriageSummary.Field("Symptoms", symptomsValue));
        fields.add(new TriageSummary.Field("Severity", "Medium"));
        fields.add(new TriageSummary.Field("Chronology", "Symptoms started recently"));
        
        TriageSummary summary = new TriageSummary(fields);

        ArrivalRequest request = new ArrivalRequest(hospitalId, "John Doe", chatMessages, summary);

        ApiService service = ApiClient.getClient(this).create(ApiService.class);
        service.createArrival(request).enqueue(new Callback<BaseResponse<ArrivalResponse>>() {
            @Override
            public void onResponse(Call<BaseResponse<ArrivalResponse>> call, Response<BaseResponse<ArrivalResponse>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    // Correctly extract from nested 'data' object
                    int arrivalId = response.body().getData().getArrivalId();
                    Intent intent = new Intent(ChatActivity.this, StatusActivity.class);
                    intent.putExtra("arrivalId", arrivalId);
                    startActivity(intent);
                    finish();
                } else {
                    String error = "Failed to create arrival";
                    if (response.body() != null && response.body().getError() != null) {
                        error = response.body().getError();
                    }
                    Toast.makeText(ChatActivity.this, error, Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<BaseResponse<ArrivalResponse>> call, Throwable t) {
                Toast.makeText(ChatActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
