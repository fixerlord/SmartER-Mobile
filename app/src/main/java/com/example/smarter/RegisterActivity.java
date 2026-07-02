package com.example.smarter;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.smarter.models.AuthResponse;
import com.example.smarter.models.BaseResponse;
import com.example.smarter.models.RegisterRequest;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {

    Button btnRegister;
    EditText etFullName, etUsername, etPhone, etPassword, etConfirmPassword;
    TextView tvLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        btnRegister = findViewById(R.id.btnRegister);
        etFullName = findViewById(R.id.etFullName);
        etUsername = findViewById(R.id.etUsername);
        etPhone = findViewById(R.id.etPhone);
        etPassword = findViewById(R.id.etPassword);
        etConfirmPassword = findViewById(R.id.etConfirmPassword);
        tvLogin = findViewById(R.id.tvLogin);

        btnRegister.setOnClickListener(v -> {
            String fullName = etFullName.getText().toString().trim();
            String username = etUsername.getText().toString().trim();
            String phone = etPhone.getText().toString().trim();
            String password = etPassword.getText().toString();
            String confirmPassword = etConfirmPassword.getText().toString();

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Username and password are required", Toast.LENGTH_SHORT).show();
                return;
            }

            if (!password.equals(confirmPassword)) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show();
                return;
            }

            performRegister(username, password, fullName, phone);
        });

        tvLogin.setOnClickListener(v -> finish());
    }

    private void performRegister(String username, String password, String fullName, String phone) {
        ApiService service = ApiClient.getClient(this).create(ApiService.class);
        RegisterRequest request = new RegisterRequest(username, password, fullName, phone);
        
        service.register(request).enqueue(new Callback<BaseResponse<AuthResponse>>() {
            @Override
            public void onResponse(Call<BaseResponse<AuthResponse>> call, Response<BaseResponse<AuthResponse>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    AuthResponse auth = response.body().getData();
                    TokenManager.getInstance(RegisterActivity.this).saveToken(auth.getToken());
                    
                    Toast.makeText(RegisterActivity.this, "Account created successfully", Toast.LENGTH_SHORT).show();
                    
                    Intent intent = new Intent(RegisterActivity.this, DashboardActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    String error = "Registration failed";
                    if (response.body() != null && response.body().getError() != null) {
                        error = response.body().getError();
                    }
                    Toast.makeText(RegisterActivity.this, error, Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<BaseResponse<AuthResponse>> call, Throwable t) {
                Toast.makeText(RegisterActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
