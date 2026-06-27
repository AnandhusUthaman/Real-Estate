import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { luxuryAgents } from '../data/mockData';
import { Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Agents() {
  const { sendMessage, showToast } = useGlobalContext();
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '10:00 AM',
    note: ''
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.date) {
      showToast('Please complete the booking details.', 'error');
      return;
    }

    sendMessage({
      from: bookingForm.name,
      email: bookingForm.email,
      subject: `Consultation Booked with ${selectedAgent.name}`,
      message: `Appointment scheduled for ${bookingForm.date} at ${bookingForm.time}. | Note: ${bookingForm.note || 'No notes'}`
    });

    showToast(`Appointment request sent to ${selectedAgent.name}!`, 'success');
    setSelectedAgent(null);
    setBookingForm({
      name: '',
      email: '',
      date: '',
      time: '10:00 AM',
      note: ''
    });
  };

  return (
    <div className="pt-32 pb-24 bg-bg-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Title */}
        <div className="space-y-4 mb-20 max-w-xl text-left">
          <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Our Advisors</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-primary">Private Brokers</h1>
          <p className="font-sans text-neutral-laurel leading-relaxed">
            Connect with our world-renowned advisory network managing high-volume portfolio acquisitions globally.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          {luxuryAgents.map((agent) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-bg-cream rounded-[18px] border border-neutral-laurel/20 overflow-hidden flex flex-col justify-between items-center text-center p-8 shadow-sm hover:border-accent-gold hover:shadow-luxury transition-all duration-300 group"
            >
              <div className="w-40 h-40 rounded-full overflow-hidden border border-accent-gold p-1 shadow-md mb-6">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-bold text-primary">{agent.name}</h3>
                <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-laurel font-bold block">
                  {agent.role}
                </span>
                <p className="font-sans text-xs text-secondary font-semibold uppercase tracking-wider">
                  {agent.specialization}
                </p>
                <p className="font-sans text-sm text-primary/75 max-w-xs leading-relaxed mt-4">
                  {agent.bio}
                </p>
              </div>

              <div className="w-full border-t border-neutral-laurel/20 pt-6 mt-8 space-y-4">
                <div className="flex justify-center items-center gap-3 font-sans text-xs text-primary/80">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-accent-gold" /> {agent.phone}
                  </div>
                  <span className="text-neutral-laurel">|</span>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-accent-gold" /> {agent.email}
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="w-full btn-primary text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 bg-primary hover:bg-secondary py-3 text-bg-cream"
                >
                  <Calendar className="w-4 h-4 text-accent-gold" /> Book Private Session
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Private Consultation Modal Dialog */}
        <AnimatePresence>
          {selectedAgent && (
            <div className="fixed inset-0 bg-primary/65 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-bg-cream rounded-[18px] border border-accent-gold/30 p-8 max-w-lg w-full shadow-luxury relative text-primary font-sans"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest text-neutral-laurel font-bold">Schedule With</span>
                    <h3 className="font-display text-2xl font-bold text-primary">{selectedAgent.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="text-neutral-laurel hover:text-primary font-bold text-lg"
                    aria-label="Close booking modal"
                  >
                    ✕
                  </button>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Your Email</label>
                    <input
                      type="email"
                      placeholder="e.g. john@private.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="bg-white border-neutral-laurel/20 rounded-[12px] text-xs px-4 py-2.5 w-full focus:outline-none text-primary/80"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Preferred Time</label>
                      <select
                        value={bookingForm.time}
                        onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                        className="bg-white border-neutral-laurel/20 rounded-[12px] text-xs px-4 py-2.5 w-full focus:outline-none text-primary cursor-pointer"
                      >
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Portfolio Special Requirements</label>
                    <textarea
                      rows="3"
                      placeholder="Specify focus regions, budget caps, or structural demands..."
                      value={bookingForm.note}
                      onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-accent bg-accent-gold text-primary font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer mt-4"
                  >
                    Confirm Private Booking
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
