import React, { useState } from 'react';

export default function AdminListings({ properties, onAddProperty, onUpdateProperty, onDeleteProperty, showToast }) {
  const [filterType, setFilterType] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('sale');
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [area, setArea] = useState('1,500 sqft');
  const [img, setImg] = useState('');

  const filteredProperties = properties.filter((p) => {
    if (filterType === 'all') return true;
    return p.type === filterType;
  });

  const openAddForm = () => {
    setEditingProperty(null);
    setTitle('');
    setLocation('');
    setPrice('');
    setType('sale');
    setBeds(3);
    setBaths(2);
    setArea('1,500 sqft');
    setImg('https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 100));
    setIsFormOpen(true);
  };

  const openEditForm = (p) => {
    setEditingProperty(p);
    setTitle(p.title);
    setLocation(p.location);
    setPrice(p.price);
    setType(p.type);
    setBeds(p.beds);
    setBaths(p.baths);
    setArea(p.area);
    setImg(p.img);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title || !location || !price) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const propertyData = {
      title,
      location,
      price,
      type,
      status: type === 'sale' ? 'For Sale' : 'For Rent',
      beds: parseInt(beds) || 0,
      baths: parseInt(baths) || 0,
      area,
      img: img || 'https://picsum.photos/400/300?random=10'
    };

    if (editingProperty) {
      onUpdateProperty({ ...editingProperty, ...propertyData });
      showToast(`Property "${title}" updated successfully!`);
    } else {
      onAddProperty(propertyData);
      showToast(`Property "${title}" added successfully!`);
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDeleteProperty(id);
      showToast(`Property deleted successfully.`);
    }
  };

  return (
    <div class="admin-card overflow-x-auto">
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 min-w-[600px]">
        <h3 class="font-bold text-lg text-[var(--text-dark)]">All Properties ({filteredProperties.length})</h3>
        <div class="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            class="text-sm w-auto pr-8 py-2 border border-gray-200 rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <button
            onClick={openAddForm}
            class="btn-primary text-sm py-2 px-4 whitespace-nowrap"
          >
            <i class="fas fa-plus"></i> Add Property
          </button>
        </div>
      </div>

      <table class="admin-table min-w-[600px]">
        <thead>
          <tr>
            <th>ID</th>
            <th>Property</th>
            <th>Location</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProperties.map((p) => (
            <tr key={p.id}>
              <td class="text-[var(--text-muted)]">#{p.id}</td>
              <td class="font-semibold text-[var(--text-dark)]">{p.title}</td>
              <td class="text-gray-600">{p.location}</td>
              <td class="text-gray-700 font-semibold">{p.price}</td>
              <td>
                <span class={`status-badge ${p.type === 'sale' ? 'status-active' : 'status-pending'}`}>
                  {p.status}
                </span>
              </td>
              <td>
                <div class="flex gap-3">
                  <button
                    onClick={() => openEditForm(p)}
                    class="text-blue-600 hover:text-blue-800 cursor-pointer"
                    title="Edit Property"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    class="text-red-600 hover:text-red-800 cursor-pointer"
                    title="Delete Property"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal Form */}
      {isFormOpen && (
        <div
          onClick={(e) => e.target.id === 'property-modal' && setIsFormOpen(false)}
          id="property-modal"
          class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div class="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-[var(--text-dark)]">
                {editingProperty ? 'Edit Property' : 'Add Property'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                class="text-2xl text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleFormSubmit} class="space-y-4">
              <div>
                <label>Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Family Villa"
                  required
                />
              </div>
              <div>
                <label>Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Beverly Hills, CA"
                  required
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label>Price *</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. $2,450,000 or $4,800/mo"
                    required
                  />
                </div>
                <div>
                  <label>Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label>Beds</label>
                  <input
                    type="number"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label>Baths</label>
                  <input
                    type="number"
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label>Area</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 3,200 sqft"
                  />
                </div>
              </div>
              <div>
                <label>Image URL</label>
                <input
                  type="text"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  placeholder="e.g. https://picsum.photos/400/300"
                />
              </div>
              <button type="submit" class="btn-primary w-full justify-center mt-4">
                {editingProperty ? 'Save Changes' : 'Create Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
