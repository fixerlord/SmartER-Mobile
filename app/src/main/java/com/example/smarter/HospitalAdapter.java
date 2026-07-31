package com.example.smarter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.smarter.models.Hospital;

import java.util.List;
import java.util.Locale;

public class HospitalAdapter extends RecyclerView.Adapter<HospitalAdapter.ViewHolder> {

    private List<Hospital> hospitals;
    private OnHospitalClickListener listener;

    public interface OnHospitalClickListener {
        void onHospitalClick(Hospital hospital);
    }

    public HospitalAdapter(List<Hospital> hospitals, OnHospitalClickListener listener) {
        this.hospitals = hospitals;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_hospital, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Hospital hospital = hospitals.get(position);
        holder.tvName.setText(hospital.getName());
        holder.tvAddress.setText(hospital.getAddress());
        
        StringBuilder info = new StringBuilder();
        int waitTime = hospital.getErWaitTime();
        info.append("ER Wait: ").append(waitTime).append(" mins");

        if (hospital.isTravelDataAvailable()) {
            info.append(" • ").append(hospital.getTravelMinutes()).append(" min drive");
            if (hospital.getTravelDistanceKm() != null) {
                info.append(" (").append(String.format(Locale.getDefault(), "%.1f", hospital.getTravelDistanceKm())).append(" km)");
            }
        }
        
        holder.tvWaitTime.setText(info.toString());
        holder.itemView.setOnClickListener(v -> listener.onHospitalClick(hospital));
    }

    @Override
    public int getItemCount() {
        return hospitals.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvAddress, tvWaitTime;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tvHospitalName);
            tvAddress = itemView.findViewById(R.id.tvHospitalAddress);
            tvWaitTime = itemView.findViewById(R.id.tvWaitTime);
        }
    }
}
