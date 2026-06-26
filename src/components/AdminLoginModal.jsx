import React, { useState } from 'react';

export default function AdminLoginModal({ onLoginSuccess, showToast, onNavigate }) {
  const [email, setEmail] = useState('admin@homeverse.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      localStorage.setItem('hv_session', JSON.stringify(data.session));
      showToast('Welcome back, Admin! 🎉');
      onLoginSuccess();
    } catch (err) {
      showToast(`Login failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[var(--accent)] to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-fade-up visible">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            <i className="fas fa-shield-alt text-[var(--primary)] mr-2"></i> Admin Login
          </h2>
          <button
            onClick={() => onNavigate('/')}
            className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
            disabled={loading}
          >
            <i className="fas fa-arrow-left"></i> Home
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-sm text-[var(--text-dark)]">Email</label>
            <input
              type="email"
              placeholder="admin@homeverse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="mt-1 w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div>
            <label className="font-semibold text-sm text-[var(--text-dark)]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="mt-1 w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center mt-2 animate-bounce-subtle" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-lock"></i> Sign In
              </>
            )}
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            Demo: admin@homeverse.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}

