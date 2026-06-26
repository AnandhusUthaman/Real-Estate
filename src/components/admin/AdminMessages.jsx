import React from 'react';

export default function AdminMessages({ messages, onToggleRead }) {
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div class="admin-card">
      <h3 class="font-bold text-lg mb-4 text-[var(--text-dark)]">Messages ({unreadCount} unread)</h3>
      <div class="space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            onClick={() => onToggleRead(m.id)}
            class={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition duration-200 ${
              !m.read ? 'bg-blue-50 border border-blue-100 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            title={!m.read ? "Click to mark as read" : "Click to mark as unread"}
          >
            <div class="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold shrink-0">
              {m.from.charAt(0)}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <p class="font-semibold text-sm text-[var(--text-dark)] truncate">{m.from}</p>
                <span class="text-xs text-[var(--text-muted)] whitespace-nowrap">{m.date}</span>
              </div>
              <p class="text-sm text-[var(--text-dark)] font-medium truncate">{m.subject}</p>
              <p class="text-xs text-[var(--text-muted)] truncate">{m.email}</p>
            </div>
            {!m.read && (
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 shrink-0" title="Unread message"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
