package com.example.smarter;

import com.example.smarter.models.ArrivalRequest;
import com.example.smarter.models.ArrivalResponse;
import com.example.smarter.models.Hospital;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {
    @GET("api/hospitals")
    Call<List<Hospital>> getHospitals();

    @POST("api/arrivals")
    Call<ArrivalResponse> createArrival(@Body ArrivalRequest request);

    @GET("api/arrivals/{id}")
    Call<ArrivalResponse> getArrivalStatus(@Path("id") int id);
}
