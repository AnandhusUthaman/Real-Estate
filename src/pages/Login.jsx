import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { Compass, User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login, showToast } = useGlobalContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    const res = login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      showToast(res.error, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-cream px-6 py-24 relative overflow-hidden">
      {/* Absolute graphic circles */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent-gold/5 filter blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Compass className="w-8 h-8 text-accent-gold" />
            <span className="font-display text-2xl font-bold tracking-widest text-primary">
              LUXE<span className="text-accent-gold">ESTATE</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-primary">Private Access</h1>
          <p className="font-sans text-xs text-neutral-laurel uppercase tracking-widest mt-1">
            Brokerage & Investment Platform
          </p>
        </div>

        {/* Auth Panel */}
        <div className="bg-primary text-bg-cream rounded-[18px] border border-accent-gold/25 p-8 shadow-luxury">
          <form onSubmit={handleLoginSubmit} className="space-y-5 font-sans text-primary">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Email Address</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
                <input
                  type="email"
                  placeholder="e.g. admin@luxeestate.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm pl-10 pr-4 py-2.5 w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm pl-10 pr-4 py-2.5 w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Quick credentials helper for user convenience */}
            <div className="bg-secondary/15 rounded-[12px] p-3 text-center border border-accent-gold/10">
              <p className="text-[11px] font-sans text-neutral-laurel">
                Demo Admin: <span className="text-accent-gold font-bold">admin@luxeestate.com</span> / <span className="text-accent-gold font-bold">admin123</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full btn-accent bg-accent-gold text-primary font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              Sign In to Session <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Register Redirect footer */}
        <div className="text-center mt-6">
          <p className="font-sans text-sm text-primary/75">
            Do not have secure access?{' '}
            <Link to="/register" className="text-accent-gold hover:text-primary transition-colors font-semibold">
              Register Portfolio
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
