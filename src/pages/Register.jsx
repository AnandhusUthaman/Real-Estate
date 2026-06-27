import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { Compass, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const { register, showToast } = useGlobalContext();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill out all input fields.', 'error');
      return;
    }

    const res = register(name, email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      showToast(res.error, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-cream px-6 py-24 relative overflow-hidden">
      {/* Absolute graphic backgrounds */}
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
          <h1 className="font-display text-3xl font-bold text-primary">Secure Register</h1>
          <p className="font-sans text-xs text-neutral-laurel uppercase tracking-widest mt-1">
            Create Client Investment Profile
          </p>
        </div>

        {/* Register card */}
        <div className="bg-primary text-bg-cream rounded-[18px] border border-accent-gold/25 p-8 shadow-luxury">
          <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans text-primary">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
                <input
                  type="text"
                  placeholder="e.g. Elizabeth Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm pl-10 pr-4 py-2.5 w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
                <input
                  type="email"
                  placeholder="e.g. elizabeth@private.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm pl-10 pr-4 py-2.5 w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Account Password</label>
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

            <button
              type="submit"
              className="w-full btn-accent bg-accent-gold text-primary font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer flex items-center justify-center gap-2 mt-6"
            >
              Initialize Profile <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Login redirect footer */}
        <div className="text-center mt-6">
          <p className="font-sans text-sm text-primary/75">
            Already have secure access?{' '}
            <Link to="/login" className="text-accent-gold hover:text-primary transition-colors font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
