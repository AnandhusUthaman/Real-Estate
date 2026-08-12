import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPropertySlug } from '../../utils/seo';
import { API_BASE_URL } from '../../config/api';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Copy,
  Upload,
  X,
  Star,
  AlertCircle,
  FileImage,
  Globe,
  Building
} from 'lucide-react';

export default function AdminListings({ properties, onAddProperty, onUpdateProperty, onDeleteProperty, showToast }) {
  // Listings Filters/Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [sortField, setSortField] = useState('date'); // 'price' | 'title' | 'date'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('sale');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [beds, setBeds] = useState(4);
  const [baths, setBaths] = useState(4);
  const [area, setArea] = useState('4,500 sqft');
  const [amenities, setAmenities] = useState('Private Pool, 24/7 Concierge, Wellness Spa');
  const [status, setStatus] = useState('Exclusive');
  const [img, setImg] = useState('');
  const [googleMap, setGoogleMap] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [slug, setSlug] = useState('');

  // Drag and Drop Images Upload
  const [previewImages, setPreviewImages] = useState([]); // { file, base64, url }
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Custom Delete Confirmation Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState('');

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingProperty && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, editingProperty]);

  // Handle Drag Over
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle Drag Leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Process and read files as base64
  const processFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files are supported.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [
          ...prev,
          {
            file,
            base64: reader.result,
            name: file.name
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Handle File Input Select
  const handleFileSelect = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removePreviewImage = (idx) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Upload images to backend
  const uploadImages = async () => {
    const urls = [];
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('le_token')}`
    };

    for (const imageObj of previewImages) {
      if (imageObj.url) {
        urls.push(imageObj.url); // Already uploaded
      } else {
        try {
          const res = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ image: imageObj.base64, name: imageObj.name })
          });
          if (res.ok) {
            const data = await res.json();
            urls.push(data.url);
          } else {
            console.error("Upload failed on server");
          }
        } catch (err) {
          console.error("API upload request failed:", err);
        }
      }
    }
    return urls;
  };

  // Form Open helpers
  const openAddForm = () => {
    setEditingProperty(null);
    setTitle('');
    setDescription('Bespoke custom-built residence matching all global parameters of luxury design and structural excellence.');
    setType('sale');
    setPrice('$14,000,000');
    setLocation('Palm Jumeirah, Dubai');
    setAddress('Crescent Rd West, Palm Jumeirah, Dubai');
    setBeds(4);
    setBaths(4);
    setArea('4,500 sqft');
    setAmenities('Private Pool, 24/7 Concierge, Wellness Spa, Private Beach');
    setStatus('Exclusive');
    setImg('');
    setGoogleMap('https://maps.google.com/?q=Palm+Jumeirah+Dubai');
    setFeatured(false);
    setPublished(true);
    setSeoTitle('');
    setSeoDescription('');
    setSlug('');
    setPreviewImages([]);
    setIsFormOpen(true);
  };

  const openEditForm = (p) => {
    setEditingProperty(p);
    setTitle(p.title || '');
    setDescription(p.description || '');
    setType(p.type || 'sale');
    setPrice(p.price || '');
    setLocation(p.location || '');
    setAddress(p.address || '');
    setBeds(p.beds || 4);
    setBaths(p.baths || 4);
    setArea(p.area || '');
    setAmenities(Array.isArray(p.amenities) ? p.amenities.join(', ') : (p.amenities || ''));
    setStatus(p.status || '');
    setImg(p.img || '');
    setGoogleMap(p.googleMap || '');
    setFeatured(p.featured === true);
    setPublished(p.published !== false);
    setSeoTitle(p.seoTitle || '');
    setSeoDescription(p.seoDescription || '');
    setSlug(p.slug || '');

    // Set preview images
    const currentPreviews = [];
    if (p.img) {
      currentPreviews.push({ base64: p.img, url: p.img, name: 'Main Image' });
    }
    if (Array.isArray(p.gallery)) {
      p.gallery.forEach((gUrl, idx) => {
        if (gUrl !== p.img) {
          currentPreviews.push({ base64: gUrl, url: gUrl, name: `Gallery Image ${idx}` });
        }
      });
    }
    setPreviewImages(currentPreviews);
    setIsFormOpen(true);
  };

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !location || !price) {
      showToast('Title, Location, and Price are required.', 'error');
      return;
    }

    setUploading(true);
    showToast('Uploading listing imagery...', 'info');
    const uploadedUrls = await uploadImages();
    setUploading(false);

    // Prepare Amenities array
    const amenitiesArray = amenities.split(',').map((item) => item.trim()).filter(Boolean);

    const propertyData = {
      title,
      description,
      type,
      price,
      location,
      address,
      beds: parseInt(beds, 10) || 0,
      baths: parseInt(baths, 10) || 0,
      area,
      amenities: amenitiesArray,
      status,
      img: uploadedUrls[0] || img || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      gallery: uploadedUrls,
      googleMap,
      featured,
      published,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || description.slice(0, 150),
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    if (editingProperty) {
      onUpdateProperty({ ...editingProperty, ...propertyData });
    } else {
      onAddProperty(propertyData);
    }

    setIsFormOpen(false);
  };

  // Duplicate Listing
  const handleDuplicate = (p) => {
    const duplicated = {
      ...p,
      id: undefined,
      title: `${p.title} (Duplicate)`,
      slug: `${p.slug}-duplicate`,
      featured: false,
      published: false
    };
    onAddProperty(duplicated);
    showToast(`Listing duplicated as draft: "${duplicated.title}"`);
  };

  // Quick Toggles
  const handleTogglePublish = (p) => {
    onUpdateProperty({ ...p, published: !p.published });
    showToast(`Listing ${!p.published ? 'Published' : 'Unpublished'} successfully.`);
  };

  const handleToggleFeatured = (p) => {
    onUpdateProperty({ ...p, featured: !p.featured });
    showToast(`Listing ${!p.featured ? 'marked as Featured' : 'removed from Featured'}.`);
  };

  // Delete Action trigger
  const confirmDelete = (id, title) => {
    setDeleteConfirmId(id);
    setDeleteConfirmTitle(title);
  };

  const executeDelete = () => {
    onDeleteProperty(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  // Parse price helper
  const parsePrice = (priceStr) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  // Search & Filter & Sort Pipeline
  const filteredProperties = properties.filter((p) => {
    const matchesSearch = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.slug && p.slug.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchesType = filterType === 'all' ? true : p.type === filterType;
    const matchesStatus = filterStatus === 'all' ? true : p.status.toLowerCase() === filterStatus.toLowerCase();
    
    let matchesFeatured = true;
    if (filterFeatured === 'featured') matchesFeatured = p.featured === true;
    if (filterFeatured === 'standard') matchesFeatured = p.featured !== true;

    return matchesSearch && matchesType && matchesStatus && matchesFeatured;
  });

  // Sorting
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    let compA, compB;
    if (sortField === 'title') {
      compA = a.title.toLowerCase();
      compB = b.title.toLowerCase();
    } else if (sortField === 'price') {
      compA = parsePrice(a.price);
      compB = parsePrice(b.price);
    } else {
      // Date/ID
      compA = a.id;
      compB = b.id;
    }

    if (compA < compB) return sortDirection === 'asc' ? -1 : 1;
    if (compA > compB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Panel */}
      <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-laurel" />
            <input
              type="text"
              placeholder="Search by Title, Location, or Slug..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm pl-11 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary"
            />
          </div>
          <button
            onClick={openAddForm}
            className="btn-primary py-3 px-5 text-xs tracking-widest uppercase font-semibold flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 text-accent-gold" /> Add Property
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between border-t border-neutral-laurel/10 pt-4">
          <div className="flex flex-wrap gap-3 items-center text-xs font-sans">
            <div className="flex items-center gap-1.5 text-neutral-laurel font-bold uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
            </div>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="bg-bg-cream border border-neutral-laurel/10 rounded-[8px] py-1.5 px-3 text-primary cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-gold/30"
            >
              <option value="all">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>

            <select
              value={filterFeatured}
              onChange={(e) => { setFilterFeatured(e.target.value); setCurrentPage(1); }}
              className="bg-bg-cream border border-neutral-laurel/10 rounded-[8px] py-1.5 px-3 text-primary cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-gold/30"
            >
              <option value="all">Featured & Standard</option>
              <option value="featured">Featured Only</option>
              <option value="standard">Standard Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans">
            <span className="text-neutral-laurel font-bold uppercase tracking-wider">Sort:</span>
            <button
              onClick={() => toggleSort('title')}
              className={`px-3 py-1.5 rounded-[8px] border transition-all ${
                sortField === 'title' ? 'bg-primary text-bg-cream border-primary' : 'bg-bg-cream border-neutral-laurel/10 text-primary'
              }`}
            >
              Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('price')}
              className={`px-3 py-1.5 rounded-[8px] border transition-all ${
                sortField === 'price' ? 'bg-primary text-bg-cream border-primary' : 'bg-bg-cream border-neutral-laurel/10 text-primary'
              }`}
            >
              Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('date')}
              className={`px-3 py-1.5 rounded-[8px] border transition-all ${
                sortField === 'date' ? 'bg-primary text-bg-cream border-primary' : 'bg-bg-cream border-primary/10 text-primary'
              }`}
            >
              Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* Property Table Display */}
      <div className="bg-white rounded-[18px] border border-neutral-laurel/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-sm text-primary">
            <thead>
              <tr className="bg-primary/5 text-neutral-laurel text-[10px] tracking-widest uppercase font-bold border-b border-neutral-laurel/20">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Title & Slug</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Featured</th>
                <th className="py-4 px-6 text-center">Published</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-laurel/10">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-neutral-laurel">
                    No properties match your filter selection.
                  </td>
                </tr>
              ) : (
                currentItems.map((p) => (
                  <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                    <td className="py-4 px-6">
                      <img
                        src={p.img}
                        alt={p.title}
                        className="w-14 h-14 object-cover rounded-[8px] border border-neutral-laurel/25 shadow-sm"
                      />
                    </td>
                    <td className="py-4 px-6 font-sans">
                      <div className="font-bold text-primary text-sm leading-snug">{p.title}</div>
                      <div className="text-[11px] text-neutral-laurel mt-0.5 font-mono">{p.slug || 'no-slug'}</div>
                    </td>
                    <td className="py-4 px-6 text-xs text-neutral-laurel">{p.location}</td>
                    <td className="py-4 px-6 font-semibold text-primary">{p.price}</td>
                    <td className="py-4 px-6">
                      <span className="bg-primary/5 text-primary border border-accent-gold/20 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[4px]">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded-full transition-colors ${p.featured ? 'text-amber-500' : 'text-neutral-laurel/40 hover:text-amber-400'}`}
                        title={p.featured ? 'Remove Featured' : 'Mark Featured'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`px-2.5 py-0.5 rounded-[50px] text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          p.published !== false ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {p.published !== false ? 'Active' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          to={`/properties/${getPropertySlug(p)}`}
                          className="p-2 border border-neutral-laurel/25 hover:border-accent-gold text-primary rounded-[8px] hover:bg-accent-gold/10 transition-colors"
                          title="View Live Listing"
                        >
                          <Eye className="w-4 h-4 text-neutral-laurel" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-2 border border-neutral-laurel/25 hover:border-accent-gold text-primary rounded-[8px] hover:bg-accent-gold/10 transition-colors"
                          title="Duplicate Listing"
                        >
                          <Copy className="w-4 h-4 text-neutral-laurel" />
                        </button>
                        <button
                          onClick={() => openEditForm(p)}
                          className="p-2 border border-neutral-laurel/25 hover:border-accent-gold text-primary rounded-[8px] hover:bg-accent-gold/10 transition-colors"
                          title="Edit Listing"
                        >
                          <Edit3 className="w-4 h-4 text-accent-gold" />
                        </button>
                        <button
                          onClick={() => confirmDelete(p.id, p.title)}
                          className="p-2 border border-red-200 hover:border-red-500 text-red-500 rounded-[8px] hover:bg-red-500/10 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 bg-primary/5 border-t border-neutral-laurel/10">
            <span className="text-xs text-neutral-laurel font-sans">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedProperties.length)} of {sortedProperties.length} listings
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1 bg-white border border-neutral-laurel/20 rounded-[8px] text-xs disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1 bg-white border border-neutral-laurel/20 rounded-[8px] text-xs disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Property Form Modal (Add / Edit) */}
      {isFormOpen && (
        <div
          onClick={(e) => e.target.id === 'property-modal' && setIsFormOpen(false)}
          id="property-modal"
          className="fixed inset-0 bg-primary/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-bg-cream rounded-[18px] border border-accent-gold/30 p-8 max-w-4xl w-full shadow-luxury relative text-primary font-sans my-8 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-bold text-primary">
                {editingProperty ? 'Edit Managed Listing' : 'Add Luxury Portfolio Listing'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-neutral-laurel hover:text-primary p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Basic Details Section */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-accent-gold font-bold border-b border-accent-gold/10 pb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> Basic Listing Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Listing Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Royal Beachfront Pavilion"
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Slug *</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="royal-beachfront-pavilion"
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Location Details (Neighborhood/City) *</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Palm Jumeirah, Dubai"
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Crescent Rd West, Palm Jumeirah"
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Price *</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. $14,000,000"
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Listing Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none text-primary cursor-pointer"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Lease</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Status Badge</label>
                    <input
                      type="text"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      placeholder="e.g. Exclusive, Refurbished"
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Google Map URL</label>
                    <input
                      type="text"
                      value={googleMap}
                      onChange={(e) => setGoogleMap(e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={beds}
                      onChange={(e) => setBeds(parseInt(e.target.value, 10) || 0)}
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={baths}
                      onChange={(e) => setBaths(parseInt(e.target.value, 10) || 0)}
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Area Size (sqft)</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. 4,500 sqft"
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Amenities (Comma separated)</label>
                    <input
                      type="text"
                      value={amenities}
                      onChange={(e) => setAmenities(e.target.value)}
                      placeholder="Private Pool, 24/7 Concierge, Gym, Yacht Slip"
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">Full Description</label>
                    <textarea
                      rows="4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Drag and Drop Uploads section */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-accent-gold font-bold border-b border-accent-gold/10 pb-1 flex items-center gap-1.5">
                  <FileImage className="w-3.5 h-3.5" /> Drag & Drop Media Uploads
                </h3>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-[18px] p-8 text-center transition-all ${
                    isDragging ? 'border-accent-gold bg-accent-gold/5' : 'border-neutral-laurel/30 bg-white hover:border-accent-gold/50'
                  }`}
                >
                  <Upload className="w-10 h-10 text-accent-gold mx-auto mb-3" />
                  <p className="text-sm font-bold text-primary">Drag and drop your luxury listing images here</p>
                  <p className="text-xs text-neutral-laurel mt-1 mb-4">PNG, JPEG, WebP formats supported</p>
                  
                  <label className="cursor-pointer bg-primary text-bg-cream text-xs uppercase tracking-widest font-bold py-2.5 px-6 rounded-button border border-accent-gold/20 hover:border-accent-gold transition-colors inline-block">
                    Browse Files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Previews grid */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {previewImages.map((imgObj, idx) => (
                      <div key={idx} className="relative aspect-square rounded-[12px] overflow-hidden border border-neutral-laurel/20 group">
                        <img
                          src={imgObj.base64}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePreviewImage(idx)}
                          className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-0 left-0 w-full bg-accent-gold/90 text-primary text-[9px] uppercase tracking-wider font-bold py-0.5 text-center">
                            Main Image
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SEO & Configurations Section */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-accent-gold font-bold border-b border-accent-gold/10 pb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> SEO Metadata & Platform Config
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">SEO Title Tag</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Premium Plot in Thiruvananthapuram | TerraNova"
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-laurel block font-bold mb-1">SEO Description Meta</label>
                    <input
                      type="text"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Detailed high-end search listing description for Google..."
                      className="bg-white border border-neutral-laurel/10 rounded-[12px] text-sm px-4 py-2.5 w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-8 items-center bg-primary/5 rounded-[12px] p-4 border border-accent-gold/15">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-primary">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded text-accent-gold focus:ring-accent-gold w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold uppercase tracking-wider">Mark as Featured Masterpiece</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-primary">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="rounded text-accent-gold focus:ring-accent-gold w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold uppercase tracking-wider">Publish Directly to Live Site</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full btn-accent bg-accent-gold text-primary font-bold py-3.5 uppercase tracking-widest text-xs rounded-[12px] hover:bg-accent-gold/90 transition-all border-none cursor-pointer mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? 'Processing & Uploading Media...' : (editingProperty ? 'Update Listing Details' : 'Publish Listing')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] border border-red-200 p-6 max-w-sm w-full shadow-2xl space-y-4 font-sans text-primary text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <h4 className="font-bold text-lg">Confirm Deletion</h4>
              <p className="text-sm text-neutral-laurel mt-2 leading-relaxed">
                Are you sure you want to permanently delete the property <strong className="text-primary">"{deleteConfirmTitle}"</strong>? This action is irreversible.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-accent border-neutral-laurel/35 text-primary py-2 px-5 text-xs tracking-wider uppercase font-semibold hover:bg-primary/5"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="bg-red-600 border border-red-600 text-white rounded-button py-2 px-5 text-xs tracking-wider uppercase font-semibold hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
