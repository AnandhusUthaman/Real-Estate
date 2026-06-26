import React from 'react';

export default function AdminUsers({ users }) {
  return (
    <div class="admin-card overflow-x-auto">
      <h3 class="font-bold text-lg mb-4 text-[var(--text-dark)]">Registered Users ({users.length})</h3>
      <table class="admin-table min-w-[600px]">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td class="font-medium text-[var(--text-dark)]">{u.name}</td>
              <td class="text-gray-600">{u.email}</td>
              <td class="text-gray-700 font-semibold">{u.role}</td>
              <td class="text-gray-500">{u.joined}</td>
              <td>
                <span class={`status-badge ${u.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                  {u.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
