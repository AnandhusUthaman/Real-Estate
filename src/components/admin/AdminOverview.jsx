import React from 'react';
import {
  Building,
  CheckCircle2,
  FileText,
  Star,
  Mail,
  Users,
  PlusCircle,
  BarChart3,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export default function AdminOverview({ properties, messages, users, onTabChange, onAddPropertyClick, showToast }) {
  // Statistics calculations
  const totalProperties = properties.length;
  const totalPublished = properties.filter(p => p.published !== false).length;
  const draftProperties = properties.filter(p => p.published === false).length;
  const featuredProperties = properties.filter(p => p.featured === true).length;
  const totalEnquiries = messages.length;
  const totalUsers = users.length || 5; // Fallback to mock count

  // Recent activities list
  const recentActivities = [
    { id: 1, type: 'publish', text: 'Property "Obsidian Penthouse" updated & published', time: '12 mins ago' },
    { id: 2, type: 'enquiry', text: 'Enquiry received from Countess Alexandra on "Villa Al-Zubarah"', time: '1 hour ago' },
    { id: 3, type: 'featured', text: 'Property "The Luminary Estate" marked as Featured', time: '3 hours ago' },
    { id: 4, type: 'user', text: 'New investor account registered: Maximilian Kael', time: '5 hours ago' },
    { id: 5, type: 'delete', text: 'Draft property #12 deleted permanently', time: '1 day ago' }
  ];

  const handleExport = () => {
    showToast('Exporting analytics report — PDF generated.', 'success');
  };

  return (
    <div className="space-y-10">
      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { label: 'Total Properties', value: totalProperties, icon: Building, color: 'text-accent-gold bg-accent-gold/10' },
          { label: 'Published', value: totalPublished, icon: CheckCircle2, color: 'text-green-500 bg-green-500/10' },
          { label: 'Drafts', value: draftProperties, icon: FileText, color: 'text-neutral-laurel bg-neutral-laurel/10' },
          { label: 'Featured', value: featuredProperties, icon: Star, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Total Enquiries', value: totalEnquiries, icon: Mail, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-purple-500 bg-purple-500/10' }
        ].map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div key={idx} className="bg-white rounded-[18px] border border-neutral-laurel/20 p-5 shadow-sm hover:shadow-luxury transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${card.color} shrink-0`}>
                  <IconComp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest text-neutral-laurel font-bold">{card.label}</p>
                <p className="text-2xl font-display font-bold text-primary mt-1">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SVG Area Chart */}
        <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display text-lg font-bold text-primary">Portfolio Interest Analytics</h3>
              <p className="text-xs text-neutral-laurel font-sans">Monthly overview of property views and private enquiries</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-sans">
              <div className="flex items-center gap-1.5 font-medium text-primary">
                <span className="w-3 h-3 bg-accent-gold rounded-full" />
                <span>Views (x100)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-primary">
                <span className="w-3 h-3 bg-secondary rounded-full" />
                <span>Leads</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart Graphic */}
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D8C2A4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#D8C2A4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f1ece5" strokeWidth="1" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#f1ece5" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1ece5" strokeWidth="1" />
              <line x1="0" y1="170" x2="500" y2="170" stroke="#f1ece5" strokeWidth="1" />

              {/* Views Area Chart */}
              <path
                d="M0 170 C 50 140, 100 150, 150 90 C 200 40, 250 80, 300 60 C 350 40, 400 90, 450 30 C 480 10, 500 20, 500 20 L 500 170 Z"
                fill="url(#viewsGrad)"
              />
              <path
                d="M0 170 C 50 140, 100 150, 150 90 C 200 40, 250 80, 300 60 C 350 40, 400 90, 450 30 C 480 10, 500 20, 500 20"
                fill="none"
                stroke="#D8C2A4"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Leads Line Chart */}
              <path
                d="M0 160 C 50 150, 100 130, 150 120 C 200 100, 250 110, 300 80 C 350 70, 400 85, 450 50 C 480 40, 500 35, 500 35"
                fill="none"
                stroke="#2A6151"
                strokeWidth="3"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {/* Labels */}
              <text x="5" y="192" fill="#B2B7AA" fontSize="10" fontFamily="sans-serif">Week 1</text>
              <text x="125" y="192" fill="#B2B7AA" fontSize="10" fontFamily="sans-serif">Week 2</text>
              <text x="250" y="192" fill="#B2B7AA" fontSize="10" fontFamily="sans-serif">Week 3</text>
              <text x="375" y="192" fill="#B2B7AA" fontSize="10" fontFamily="sans-serif">Week 4</text>
              <text x="470" y="192" fill="#B2B7AA" fontSize="10" fontFamily="sans-serif">Active</text>
            </svg>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent-gold" />
              <span>Recent Activity Log</span>
            </h3>

            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0 mt-1.5 animate-pulse" />
                  <div className="space-y-0.5 font-sans">
                    <p className="text-primary font-medium leading-relaxed">{act.text}</p>
                    <p className="text-[10px] text-neutral-laurel font-semibold uppercase">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onTabChange('analytics')}
            className="w-full mt-6 flex items-center justify-center gap-1.5 border border-accent-gold/45 text-primary text-xs uppercase tracking-widest font-semibold font-sans py-3 rounded-button hover:bg-accent-gold/10 transition-colors"
          >
            <span>Full System Logs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-6 shadow-sm">
        <h3 className="font-display text-lg font-bold text-primary mb-5">Broker Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onAddPropertyClick}
            className="btn-primary text-xs tracking-widest uppercase font-semibold py-3 px-6 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-accent-gold" /> Add New Listing
          </button>
          <button
            onClick={() => onTabChange('messages')}
            className="btn-accent border-accent-gold/45 text-primary text-xs tracking-widest uppercase font-semibold py-3 px-6 flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-accent-gold" /> Manage Enquiries
          </button>
          <button
            onClick={handleExport}
            className="btn-accent border-accent-gold/45 text-primary text-xs tracking-widest uppercase font-semibold py-3 px-6 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-accent-gold" /> Export Monthly Report
          </button>
        </div>
      </div>
    </div>
  );
}
