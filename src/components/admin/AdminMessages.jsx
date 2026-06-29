import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Mail,
  MailOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Reply,
  Inbox
} from 'lucide-react';

export default function AdminMessages({ messages, onToggleRead, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const location = useLocation();

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const msgId = urlParams.get('id');
    if (msgId) {
      const numericId = parseInt(msgId, 10);
      setExpandedId(numericId);
      setTimeout(() => {
        const element = document.getElementById(`message-card-${numericId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-accent-gold', 'ring-offset-2');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-accent-gold', 'ring-offset-2');
          }, 3000);
        }
      }, 300);
    }
  }, [location.search]);

  const handleReplyClick = (e, email, subject) => {
    e.stopPropagation();
    window.location.href = `mailto:${email}?subject=RE: ${encodeURIComponent(subject)}&body=Dear client,`;
    showToast(`Drafted email reply to ${email}`);
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    const matchesSearch = searchQuery
      ? m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesUnread = filterUnread ? !m.read : true;

    return matchesSearch && matchesUnread;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Filters bar */}
      <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-grow max-w-md w-full">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-laurel" />
          <input
            type="text"
            placeholder="Search by Sender, Email, or Subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm pl-11 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary"
          />
        </div>

        <div className="flex gap-4 items-center shrink-0">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-sans font-semibold text-primary">
            <input
              type="checkbox"
              checked={filterUnread}
              onChange={(e) => setFilterUnread(e.target.checked)}
              className="rounded text-accent-gold focus:ring-accent-gold w-4 h-4 cursor-pointer"
            />
            <span>Show Unread Only ({unreadCount})</span>
          </label>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-16 bg-white border border-neutral-laurel/20 rounded-[18px] p-8 shadow-sm">
            <Inbox className="w-12 h-12 text-accent-gold mx-auto stroke-1 mb-4" />
            <h3 className="font-display text-xl font-bold text-primary">No inquiries found</h3>
            <p className="font-sans text-xs text-neutral-laurel max-w-xs mx-auto mt-2">
              There are no messages matching your search query or filter.
            </p>
          </div>
        ) : (
          filteredMessages.map((m) => {
            const isExpanded = expandedId === m.id;
            return (
              <div
                key={m.id}
                id={`message-card-${m.id}`}
                onClick={() => {
                  toggleExpand(m.id);
                  if (!m.read) onToggleRead(m.id);
                }}
                className={`bg-white rounded-[18px] border transition-all cursor-pointer p-6 shadow-sm hover:shadow-luxury ${
                  !m.read ? 'border-accent-gold/50 bg-gradient-to-r from-accent-gold/5 to-white' : 'border-neutral-laurel/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      !m.read ? 'bg-primary text-bg-cream' : 'bg-primary/5 text-primary border border-primary/10'
                    }`}>
                      {m.from.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-sans">
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="font-bold text-primary text-sm">{m.from}</span>
                        <span className="text-[10px] text-neutral-laurel font-mono bg-primary/5 px-2 py-0.5 rounded-[4px]">{m.email}</span>
                      </div>
                      <span className="text-xs uppercase tracking-widest text-accent-gold block font-semibold mt-0.5">{m.subject}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-sans">
                    <span className="text-[10px] text-neutral-laurel font-semibold uppercase">{m.date}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRead(m.id);
                      }}
                      className="p-1 text-neutral-laurel/60 hover:text-primary transition-colors"
                      title={m.read ? 'Mark Unread' : 'Mark Read'}
                    >
                      {m.read ? <Mail className="w-4.5 h-4.5" /> : <MailOpen className="w-4.5 h-4.5 text-accent-gold" />}
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-laurel" /> : <ChevronDown className="w-4 h-4 text-neutral-laurel" />}
                  </div>
                </div>

                {/* Expanded Message Content */}
                {isExpanded && (
                  <div className="mt-6 border-t border-neutral-laurel/10 pt-4 space-y-4 animate-fade-down font-sans">
                    <div className="bg-bg-cream/45 p-4 rounded-[12px] border border-neutral-laurel/10">
                      <p className="text-sm text-primary/90 leading-relaxed whitespace-pre-line italic">
                        "{m.message || 'No message content provided.'}"
                      </p>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={(e) => handleReplyClick(e, m.email, m.subject)}
                        className="btn-accent border-accent-gold/45 text-primary py-2 px-4 text-xs tracking-wider uppercase font-semibold flex items-center gap-1.5 hover:bg-accent-gold/10"
                      >
                        <Reply className="w-3.5 h-3.5 text-accent-gold" /> Compose Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
