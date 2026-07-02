package com.example.smarter;

import com.example.smarter.models.ArrivalRequest;
import com.example.smarter.models.ArrivalResponse;
import com.example.smarter.models.AuthResponse;
import com.example.smarter.models.BaseResponse;
import com.example.smarter.models.Hospital;
import com.example.smarter.models.LoginRequest;
import com.example.smarter.models.RegisterRequest;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {
    @POST("api/auth/register")
    Call<BaseResponse<AuthResponse>> register(@Body RegisterRequest request);

    @POST("api/auth/login")
    Call<BaseResponse<AuthResponse>> login(@Body LoginRequest request);

    @GET("api/hospitals")
    Call<BaseResponse<List<Hospital>>> getHospitals();

    @POST("api/arrivals")
    Call<BaseResponse<ArrivalResponse>> createArrival(@Body ArrivalRequest request);

    @GET("api/arrivals/{id}")
    Call<BaseResponse<ArrivalResponse>> getArrivalStatus(@Path("id") int id);
}
