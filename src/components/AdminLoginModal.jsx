import React, { useState } from 'react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess, showToast }) {
  const [email, setEmail] = useState('admin@homeverse.com');
  const [password, setPassword] = useState('admin123');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@homeverse.com' && password === 'admin123') {
      showToast('Welcome back, Admin! 🎉');
      onLoginSuccess();
      onClose();
    } else {
      showToast('Invalid credentials. Try admin@homeverse.com / admin123');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'admin-login-modal') {
      onClose();
    }
  };

  return (
    <div
      id="admin-login-modal"
      onClick={handleOverlayClick}
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">
            <i class="fas fa-shield-alt text-[var(--primary)] mr-2"></i> Admin Login
          </h2>
          <button
            onClick={onClose}
            class="text-2xl text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close modal"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="font-semibold text-sm text-[var(--text-dark)]">Email</label>
            <input
              type="email"
              placeholder="admin@homeverse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              class="mt-1"
            />
          </div>
          <div>
            <label class="font-semibold text-sm text-[var(--text-dark)]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              class="mt-1"
            />
          </div>
          <button type="submit" class="btn-primary w-full justify-center mt-2">
            <i class="fas fa-lock"></i> Sign In
          </button>
          <p class="text-xs text-gray-400 text-center mt-2">
            Demo: admin@homeverse.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
