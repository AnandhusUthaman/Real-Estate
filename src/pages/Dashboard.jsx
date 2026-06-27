import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import {
  FolderKanban,
  Mail,
  User,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Sliders,
  DollarSign,
  MapPin,
  Maximize,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const {
    currentUser,
    properties,
    messages,
    addProperty,
    updateProperty,
    deleteProperty,
    logout,
    showToast
  } = useGlobalContext();

  const navigate = useNavigate();

  // If no session, redirect to login
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  // Dashboard Active Tab State
  const [activeTab, setActiveTab] = useState(isAdmin ? 'listings' : 'profile');

  // Edit / Add Property Modal State
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  // Form State for Property Add/Edit
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    location: '',
    price: '',
    type: 'sale',
    status: 'Exclusive',
    beds: 4,
    baths: 4,
    area: '4,500 sqft',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tagline: 'Modern architectural design integrated with luxury features.',
    amenities: ['Private Pool', '24/7 Concierge', 'Wellness Spa'],
    nearby: ['Helipad Access - 5 min'],
    floorPlan: 'Level 1 Suite Layout',
    description: 'Bespoke custom-built residence matching all global parameters of luxury design and structural excellence.'
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email
  });

  const handlePropertyFormSubmit = (e) => {
    e.preventDefault();
    if (!propertyForm.title || !propertyForm.location || !propertyForm.price) {
      showToast('Title, Location, and Price are required.', 'error');
      return;
    }

    if (editingProperty) {
      updateProperty({
        ...propertyForm,
        id: editingProperty.id,
        featured: editingProperty.featured
      });
      setEditingProperty(null);
    } else {
      addProperty(propertyForm);
    }

    setIsPropertyModalOpen(false);
    // Reset Form
    setPropertyForm({
      title: '',
      location: '',
      price: '',
      type: 'sale',
      status: 'Exclusive',
      beds: 4,
      baths: 4,
      area: '4,500 sqft',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      tagline: 'Modern architectural design integrated with luxury features.',
      amenities: ['Private Pool', '24/7 Concierge', 'Wellness Spa'],
      nearby: ['Helipad Access - 5 min'],
      floorPlan: 'Level 1 Suite Layout',
      description: 'Bespoke custom-built residence matching all global parameters of luxury design and structural excellence.'
    });
  };

  const handleEditClick = (prop) => {
    setEditingProperty(prop);
    setPropertyForm(prop);
    setIsPropertyModalOpen(true);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    showToast('Profile information updated.', 'success');
  };

  return (
    <div className="pt-32 pb-24 bg-bg-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Dashboard panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-neutral-laurel/20 mb-12">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-neutral-laurel font-bold">Secure Dashboard</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary flex items-center gap-3">
              <span>Welcome, {currentUser.name}</span>
              <span className="text-xs font-sans tracking-widest uppercase py-1 px-3 bg-primary text-bg-cream rounded-[50px] border border-accent-gold/25">
                {currentUser.role}
              </span>
            </h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2 border border-accent-gold/45 hover:border-accent-gold text-primary rounded-[12px] px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-accent-gold/10 transition-all font-sans"
          >
            <LogOut className="w-4 h-4 text-accent-gold" /> Log Out
          </button>
        </div>

        {/* Dashboard grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* Navigation Sidebar */}
          <aside className="bg-primary text-bg-cream rounded-[18px] border border-accent-gold/20 p-6 space-y-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm uppercase tracking-wider font-sans font-semibold transition-all text-left ${
                    activeTab === 'listings' ? 'bg-accent-gold text-primary' : 'hover:bg-secondary/20 text-neutral-laurel hover:text-bg-cream'
                  }`}
                >
                  <FolderKanban className="w-4 h-4 shrink-0" />
                  <span>Listings Portfolio</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm uppercase tracking-wider font-sans font-semibold transition-all text-left ${
                    activeTab === 'messages' ? 'bg-accent-gold text-primary' : 'hover:bg-secondary/20 text-neutral-laurel hover:text-bg-cream'
                  }`}
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Client Messages ({messages.length})</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm uppercase tracking-wider font-sans font-semibold transition-all text-left ${
                activeTab === 'profile' ? 'bg-accent-gold text-primary' : 'hover:bg-secondary/20 text-neutral-laurel hover:text-bg-cream'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profile Settings</span>
            </button>
          </aside>

          {/* Main Dashboard Panel */}
          <main className="lg:col-span-3">
            {/* TABS 1: LISTINGS PORTFOLIO (Admin only) */}
            {activeTab === 'listings' && isAdmin && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="font-display text-2xl font-bold text-primary">Managed Portfolio</h2>
                  <button
                    onClick={() => {
                      setEditingProperty(null);
                      setIsPropertyModalOpen(true);
                    }}
                    className="btn-accent px-5 py-3 text-xs tracking-widest uppercase font-semibold flex items-center gap-2 border-accent-gold/45"
                  >
                    <Plus className="w-4 h-4" /> Add Listing
                  </button>
                </div>

                <div className="bg-white rounded-[18px] border border-neutral-laurel/20 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-sm text-primary">
                      <thead>
                        <tr className="bg-primary/5 text-neutral-laurel text-[11px] tracking-widest uppercase font-bold border-b border-neutral-laurel/20">
                          <th className="py-4 px-6">Image</th>
                          <th className="py-4 px-6">Title</th>
                          <th className="py-4 px-6">Location</th>
                          <th className="py-4 px-6">Price</th>
                          <th className="py-4 px-6">Type</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-laurel/10">
                        {properties.map((prop) => (
                          <tr key={prop.id} className="hover:bg-primary/5 transition-colors">
                            <td className="py-4 px-6">
                              <img src={prop.img} alt={prop.title} className="w-12 h-12 object-cover rounded-[8px] border border-neutral-laurel/25" />
                            </td>
                            <td className="py-4 px-6 font-bold">{prop.title}</td>
                            <td className="py-4 px-6 text-xs text-neutral-laurel">{prop.location}</td>
                            <td className="py-4 px-6 font-semibold">{prop.price}</td>
                            <td className="py-4 px-6 capitalize text-xs font-semibold">{prop.type}</td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEditClick(prop)}
                                  className="p-2 border border-neutral-laurel/25 hover:border-accent-gold text-primary rounded-[8px] hover:bg-accent-gold/10 transition-colors"
                                  aria-label="Edit listing"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteProperty(prop.id)}
                                  className="p-2 border border-red-200 hover:border-red-500 text-red-500 rounded-[8px] hover:bg-red-55/10 transition-colors"
                                  aria-label="Delete listing"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TABS 2: CLIENT MESSAGES (Admin only) */}
            {activeTab === 'messages' && isAdmin && (
              <div className="space-y-8">
                <h2 className="font-display text-2xl font-bold text-primary">Inquiries Submitted</h2>

                {messages.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-neutral-laurel/20 rounded-[18px] p-8">
                    <Mail className="w-12 h-12 text-accent-gold mx-auto stroke-1 mb-4" />
                    <h3 className="font-display text-xl font-bold text-primary">No Inquiries</h3>
                    <p className="font-sans text-xs text-neutral-laurel max-w-xs mx-auto mt-2">
                      Your catalog registry hasn't received any private inquiry messages recently.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="bg-white rounded-[18px] border border-neutral-laurel/20 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-accent-gold transition-colors"
                      >
                        <div className="space-y-2 font-sans">
                          <div className="flex gap-3 items-center">
                            <h4 className="font-bold text-primary text-base">{msg.from}</h4>
                            <span className="text-[10px] text-neutral-laurel bg-primary/5 px-2 py-0.5 rounded-[4px]">
                              {msg.email}
                            </span>
                          </div>
                          <span className="text-xs uppercase tracking-wider text-accent-gold block font-semibold">
                            {msg.subject}
                          </span>
                          <p className="text-sm text-primary/80 leading-relaxed italic">
                            "{msg.message}"
                          </p>
                        </div>
                        <span className="text-xs text-neutral-laurel shrink-0 self-end md:self-center font-semibold">
                          {msg.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABS 3: PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <div className="space-y-8 max-w-xl">
                <h2 className="font-display text-2xl font-bold text-primary">Profile Configuration</h2>

                <div className="bg-primary text-bg-cream rounded-[18px] border border-accent-gold/25 p-8 shadow-luxury">
                  <form onSubmit={handleProfileSubmit} className="space-y-4 font-sans text-primary">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Profile Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="bg-bg-cream border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        className="bg-bg-cream/50 border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none cursor-not-allowed opacity-60 text-primary/55"
                        disabled
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-accent bg-accent-gold text-primary font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer flex items-center justify-center gap-2 mt-6"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Property Modal Dialog (Add / Edit) */}
      <AnimatePresence>
        {isPropertyModalOpen && (
          <div className="fixed inset-0 bg-primary/65 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-bg-cream rounded-[18px] border border-accent-gold/30 p-8 max-w-2xl w-full shadow-luxury relative text-primary font-sans my-8"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-display text-2xl font-bold text-primary">
                  {editingProperty ? 'Edit Managed Listing' : 'Add Luxury Portfolio Listing'}
                </h3>
                <button
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="text-neutral-laurel hover:text-primary font-bold text-lg"
                  aria-label="Close property modal"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handlePropertyFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Listing Title</label>
                    <input
                      type="text"
                      value={propertyForm.title}
                      onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                      placeholder="e.g. Royal Beachfront Pavilion"
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Location Details</label>
                    <input
                      type="text"
                      value={propertyForm.location}
                      onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                      placeholder="e.g. Palm Jumeirah, Dubai"
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Price</label>
                    <input
                      type="text"
                      value={propertyForm.price}
                      onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                      placeholder="e.g. $14,000,000"
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Listing Type</label>
                    <select
                      value={propertyForm.type}
                      onChange={(e) => setPropertyForm({ ...propertyForm, type: e.target.value })}
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none text-primary cursor-pointer"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Lease</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Status Badge</label>
                    <input
                      type="text"
                      value={propertyForm.status}
                      onChange={(e) => setPropertyForm({ ...propertyForm, status: e.target.value })}
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Beds</label>
                    <input
                      type="number"
                      value={propertyForm.beds}
                      onChange={(e) => setPropertyForm({ ...propertyForm, beds: parseInt(e.target.value, 10) || 4 })}
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Baths</label>
                    <input
                      type="number"
                      value={propertyForm.baths}
                      onChange={(e) => setPropertyForm({ ...propertyForm, baths: parseInt(e.target.value, 10) || 4 })}
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Area (sqft)</label>
                    <input
                      type="text"
                      value={propertyForm.area}
                      onChange={(e) => setPropertyForm({ ...propertyForm, area: e.target.value })}
                      className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={propertyForm.img}
                    onChange={(e) => setPropertyForm({ ...propertyForm, img: e.target.value })}
                    className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Short Tagline</label>
                  <input
                    type="text"
                    value={propertyForm.tagline}
                    onChange={(e) => setPropertyForm({ ...propertyForm, tagline: e.target.value })}
                    className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Full Description</label>
                  <textarea
                    rows="3"
                    value={propertyForm.description}
                    onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                    className="bg-white border-neutral-laurel/20 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-accent bg-accent-gold text-primary font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer mt-4"
                >
                  {editingProperty ? 'Update Listing Details' : 'Publish Listing'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
