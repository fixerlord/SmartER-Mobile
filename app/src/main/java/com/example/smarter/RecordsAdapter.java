package com.example.smarter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.smarter.models.ArrivalResponse;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

public class RecordsAdapter extends RecyclerView.Adapter<RecordsAdapter.ViewHolder> {

    private List<ArrivalResponse> records;
    private SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
    private SimpleDateFormat outputFormat = new SimpleDateFormat("MMM dd, yyyy • hh:mm a", Locale.getDefault());

    public RecordsAdapter(List<ArrivalResponse> records) {
        this.records = records;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_record, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ArrivalResponse record = records.get(position);
        
        holder.tvHospitalName.setText(record.getHospitalName() != null ? record.getHospitalName() : "Unknown Hospital");
        holder.tvDiagnosis.setText("Diagnosis: " + (record.getSuspectedDiagnosis() != null ? record.getSuspectedDiagnosis() : "Processing..."));
        
        String status = record.getStatus() != null ? record.getStatus().toUpperCase() : "PENDING";
        holder.tvStatus.setText(status);

        try {
            holder.tvDate.setText(outputFormat.format(inputFormat.parse(record.getCreatedAt())));
        } catch (Exception e) {
            holder.tvDate.setText(record.getCreatedAt());
        }
    }

    @Override
    public int getItemCount() {
        return records.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvHospitalName, tvDiagnosis, tvStatus, tvDate;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvHospitalName = itemView.findViewById(R.id.tvHospitalName);
            tvDiagnosis = itemView.findViewById(R.id.tvDiagnosis);
            tvStatus = itemView.findViewById(R.id.tvStatus);
            tvDate = itemView.findViewById(R.id.tvDate);
        }
    }
}
