import React, { useState } from 'react';

export default function AdminSettings({ showToast }) {
  const [siteName, setSiteName] = useState('HomeVerse');
  const [supportEmail, setSupportEmail] = useState('support@homeverse.com');
  const [phone, setPhone] = useState('+1 (800) 123-4567');
  const [currency, setCurrency] = useState('$ USD');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    showToast('General settings updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('All password fields are required.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    showToast('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* General Settings */}
      <div class="admin-card">
        <h3 class="font-bold text-lg mb-4 text-[var(--text-dark)]">General Settings</h3>
        <form onSubmit={handleGeneralSubmit} class="space-y-4">
          <div>
            <label class="font-semibold text-sm">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              class="mt-1"
            />
          </div>
          <div>
            <label class="font-semibold text-sm">Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              class="mt-1"
            />
          </div>
          <div>
            <label class="font-semibold text-sm">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              class="mt-1"
            />
          </div>
          <div>
            <label class="font-semibold text-sm">Default Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              class="mt-1"
            >
              <option>$ USD</option>
              <option>€ EUR</option>
              <option>£ GBP</option>
            </select>
          </div>
          <button type="submit" class="btn-primary text-sm py-2.5 px-6 mt-2">
            Save Settings
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div class="admin-card">
        <h3 class="font-bold text-lg mb-4 text-[var(--text-dark)]">Security</h3>
        <form onSubmit={handlePasswordSubmit} class="space-y-4">
          <div>
            <label class="font-semibold text-sm">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              class="mt-1"
            />
          </div>
          <div>
            <label class="font-semibold text-sm">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              class="mt-1"
            />
          </div>
          <div>
            <label class="font-semibold text-sm">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              class="mt-1"
            />
          </div>
          <button type="submit" class="btn-primary text-sm py-2.5 px-6 mt-2">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
