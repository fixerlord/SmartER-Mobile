package com.example.smarter;

import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.smarter.models.ChatMessage;
import com.google.android.material.card.MaterialCardView;

import java.util.List;

public class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.ViewHolder> {

    private List<ChatMessage> messages;

    public ChatAdapter(List<ChatMessage> messages) {
        this.messages = messages;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_chat_message, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ChatMessage message = messages.get(position);
        holder.tvMessage.setText(message.getMessage());

        LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) holder.cardMessage.getLayoutParams();
        if ("patient".equals(message.getSender())) {
            holder.container.setGravity(Gravity.END);
            holder.cardMessage.setCardBackgroundColor(holder.itemView.getContext().getResources().getColor(R.color.loginSoftBlue));
            params.gravity = Gravity.END;
        } else {
            holder.container.setGravity(Gravity.START);
            holder.cardMessage.setCardBackgroundColor(holder.itemView.getContext().getResources().getColor(R.color.white));
            params.gravity = Gravity.START;
        }
        holder.cardMessage.setLayoutParams(params);
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvMessage;
        MaterialCardView cardMessage;
        LinearLayout container;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvMessage = itemView.findViewById(R.id.tvMessage);
            cardMessage = itemView.findViewById(R.id.cardMessage);
            container = itemView.findViewById(R.id.llMessageContainer);
        }
    }
}
