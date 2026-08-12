import React, { useState } from 'react';

export default function AdminLoginModal({ onLoginSuccess, showToast, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#07111D] relative overflow-hidden flex items-center justify-center p-4">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--secondary)]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-900/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded p-8 max-w-md w-full shadow-2xl animate-fade-up visible relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-serif text-white font-medium tracking-wide">
            Portal Authorization
          </h2>
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-[var(--secondary)] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer font-light tracking-wider uppercase"
            disabled={loading}
          >
            <i className="fas fa-arrow-left text-[10px]"></i> Exit
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="admin@terranova.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] transition-all font-light"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] transition-all font-light"
            />
          </div>
          <button 
            type="submit" 
            className="btn-gold w-full justify-center mt-2 cursor-pointer shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Authorizing...
              </>
            ) : (
              <>
                Sign In
              </>
            )}
          </button>
          <p className="text-[10px] text-gray-500 text-center mt-4 tracking-wider uppercase">
          
          </p>
        </form>
      </div>
    </div>
  );
}
