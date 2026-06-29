import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { Compass, ShieldAlert, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login, showToast } = useGlobalContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('terranovarealestateoffice@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      showToast(res.error, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-cream px-6 py-32 relative overflow-hidden">
      {/* Premium Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-primary/5 filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-accent-gold/5 filter blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <Compass className="w-8 h-8 text-accent-gold group-hover:rotate-45 transition-transform duration-500" />
            <span className="font-display text-2xl font-bold tracking-widest text-primary">
              TERRA<span className="text-accent-gold">NOVA</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-primary">Admin Gateway</h1>
          <p className="font-sans text-xs text-neutral-laurel uppercase tracking-widest mt-1.5 font-semibold">
            Secure Platform Authorization
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-primary text-bg-cream rounded-[18px] border border-accent-gold/25 p-8 shadow-luxury relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent-gold/20 via-accent-gold to-accent-gold/20" />
          
          <form onSubmit={handleLoginSubmit} className="space-y-5 font-sans text-primary">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">
                Admin Username (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
                <input
                  type="email"
                  placeholder="terranovarealestateoffice@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-bg-cream text-primary border-neutral-laurel/20 rounded-[12px] text-sm pl-10 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/50 transition-all placeholder:text-primary/30"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">
                Authorization Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-bg-cream text-primary border-neutral-laurel/20 rounded-[12px] text-sm pl-10 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/50 transition-all placeholder:text-primary/30"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Premium credentials helper */}
            <div className="bg-secondary/20 rounded-[12px] p-3 text-center border border-accent-gold/10 flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-accent-gold shrink-0" />
              <p className="text-[10.5px] font-sans text-neutral-laurel leading-normal">
                Credentials: <span className="text-bg-cream font-bold">terranovarealestateoffice@gmail.com</span> / <span className="text-bg-cream font-bold">admin123</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-accent bg-accent-gold text-primary font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? 'Authorizing Session...' : 'Sign In to Dashboard'} 
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-primary/60 hover:text-accent-gold transition-colors tracking-wider uppercase font-semibold">
            ← Return to Main Site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
