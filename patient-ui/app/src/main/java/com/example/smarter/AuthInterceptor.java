package com.example.smarter;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {
    private TokenManager tokenManager;

    public AuthInterceptor(TokenManager tokenManager) {
        this.tokenManager = tokenManager;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        String token = tokenManager.getToken();
        Request.Builder requestBuilder = chain.request().newBuilder();

        if (token != null) {
            requestBuilder.addHeader("Authorization", "Bearer " + token);
        }

        return chain.proceed(requestBuilder.build());
    }
}
