import React, { useState } from 'react';

export default function ContactModal({ isOpen, onClose, showToast, onMessageSent }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const messageData = {
      from: name,
      email: email,
      subject: subject,
      date: 'Just now',
      read: false
    };

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      if (onMessageSent) {
        onMessageSent(data);
      }
      showToast('Your message has been sent successfully! ✉️');
      onClose();
      setName('');
      setEmail('');
      setSubject('');
    } catch (err) {
      showToast(`Failed to send message: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'contact-modal') {
      onClose();
    }
  };

  return (
    <div
      id="contact-modal"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="bg-white border border-gray-100/50 rounded p-8 max-w-md w-full shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif text-[var(--primary)] font-medium">
            Request Information
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-[var(--secondary)] transition duration-300 cursor-pointer"
            aria-label="Close modal"
            disabled={loading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dark)] mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full border border-gray-200/80 rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] transition-all bg-gray-50/50 text-[var(--text-dark)] font-light"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dark)] mb-1">Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full border border-gray-200/80 rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] transition-all bg-gray-50/50 text-[var(--text-dark)] font-light"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dark)] mb-1">Inquiry / Message</label>
            <textarea
              placeholder="I am interested in exploring listings details..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              rows="4"
              disabled={loading}
              className="w-full border border-gray-200/80 rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] transition-all bg-gray-50/50 text-[var(--text-dark)] font-light resize-none"
            ></textarea>
          </div>
          <button type="submit" className="btn-primary w-full justify-center mt-2 cursor-pointer" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Submitting...
              </>
            ) : (
              <>
                Submit Inquiry
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
