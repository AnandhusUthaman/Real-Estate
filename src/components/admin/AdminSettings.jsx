import React, { useState } from 'react';
import {
  Lock,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  IndianRupee
} from 'lucide-react';

export default function AdminSettings({ showToast }) {
  const [siteName, setSiteName] = useState(() => localStorage.getItem('ts_site_name') || 'TerraNova');
  const [supportEmail, setSupportEmail] = useState(() => localStorage.getItem('ts_support_email') || 'terranovarealestateoffice@gmail.com');
  const [phone, setPhone] = useState(() => localStorage.getItem('ts_phone') || '8089729949');
  const [currency, setCurrency] = useState(() => localStorage.getItem('ts_currency') || '₹ INR');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('ts_site_name', siteName);
    localStorage.setItem('ts_support_email', supportEmail);
    localStorage.setItem('ts_phone', phone);
    localStorage.setItem('ts_currency', currency);
    showToast('General platform settings updated successfully!', 'success');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('All authorization password fields are required.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }
    showToast('Platform security credentials updated successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
      {/* General Settings */}
      <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-6 shadow-sm space-y-6">
        <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2 border-b border-neutral-laurel/10 pb-3">
          <Globe className="w-5 h-5 text-accent-gold" />
          <span>General Platform Configuration</span>
        </h3>
        <form onSubmit={handleGeneralSubmit} className="space-y-4 text-primary text-sm">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-laurel font-bold mb-1.5">Site Title</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary font-semibold"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-laurel font-bold mb-1.5">Concierge Support Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm pl-10 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary font-semibold"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-laurel font-bold mb-1.5">Direct Line Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm pl-10 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary font-semibold"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-laurel font-bold mb-1.5">Default Currency</label>
            <div className="relative">
              <IndianRupee className="absolute left-3.5 top-3 w-4 h-4 text-neutral-laurel" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm pl-10 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary font-semibold cursor-pointer"
              >
                <option>₹ INR</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="btn-accent bg-accent-gold text-primary font-bold py-3.5 px-6 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer flex items-center justify-center gap-2 mt-6"
          >
            <CheckCircle2 className="w-4 h-4" /> Save General Settings
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-6 shadow-sm space-y-6">
        <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2 border-b border-neutral-laurel/10 pb-3">
          <Lock className="w-5 h-5 text-accent-gold" />
          <span>Security & Authorization</span>
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 text-primary text-sm">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-laurel font-bold mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary placeholder:text-primary/30"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-laurel font-bold mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary placeholder:text-primary/30"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-laurel font-bold mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary placeholder:text-primary/30"
            />
          </div>
          <button
            type="submit"
            className="btn-accent bg-accent-gold text-primary font-bold py-3.5 px-6 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer flex items-center justify-center gap-2 mt-6"
          >
            <ShieldCheck className="w-4 h-4" /> Update Admin Password
          </button>
        </form>
      </div>
    </div>
  );
}
