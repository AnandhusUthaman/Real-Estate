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
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">
            <i class="fas fa-envelope text-[var(--primary)] mr-2"></i> Contact Our Team
          </h2>
          <button
            onClick={onClose}
            class="text-2xl text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close modal"
            disabled={loading}
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="font-semibold text-sm text-[var(--text-dark)]">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              class="mt-1"
            />
          </div>
          <div>
            <label class="font-semibold text-sm text-[var(--text-dark)]">Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              class="mt-1"
            />
          </div>
          <div>
            <label class="font-semibold text-sm text-[var(--text-dark)]">Message / Subject</label>
            <textarea
              placeholder="I am interested in buying/renting a property..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              rows="4"
              disabled={loading}
              class="mt-1 w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--primary)] resize-none"
            ></textarea>
          </div>
          <button type="submit" class="btn-primary w-full justify-center mt-2" disabled={loading}>
            {loading ? (
              <>
                <i class="fas fa-spinner fa-spin mr-2"></i> Sending...
              </>
            ) : (
              <>
                <i class="fas fa-paper-plane"></i> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
