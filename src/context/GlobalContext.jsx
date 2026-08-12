import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { luxuryProperties } from '../data/mockData';
import { API_BASE_URL } from '../config/api';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  // Properties State
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('le_properties');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasOldData = parsed.some(p => p.price && (p.price.includes('$') || p.location.toLowerCase().includes('london') || p.location.toLowerCase().includes('riviera')));
        if (hasOldData) {
          localStorage.setItem('le_properties', JSON.stringify(luxuryProperties));
          return luxuryProperties;
        }
        return parsed;
      } catch (e) {
        return luxuryProperties;
      }
    }
    return luxuryProperties;
  });

  // Favorites/Wishlist State
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('le_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Messages State
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('le_messages');
    return saved ? JSON.parse(saved) : [];
  });

  // Users State
  const [users, setUsers] = useState([]);

  // Notifications State
  const [notifications, setNotifications] = useState([]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('le_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Toasts State
  const [toasts, setToasts] = useState([]);

  // Helpers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('le_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  // Sync with Local Storage
  useEffect(() => {
    localStorage.setItem('le_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('le_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('le_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('le_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('le_session');
      localStorage.removeItem('le_token');
    }
  }, [currentUser]);

  // Fetch functions
  const fetchProperties = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.warn("Failed to fetch properties from backend, using local storage:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.warn("Failed to fetch messages from backend:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.warn("Failed to fetch users from backend:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.warn("Failed to fetch notifications from backend:", err);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      // Optimistic local state update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ read: true })
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(prev => prev.map(n => n.id === id ? data : n));
      }
    } catch (err) {
      console.warn("Failed to mark notification as read on backend:", err);
    }
  };

  // Initial Fetches
  useEffect(() => {
    fetchProperties();
    if (currentUser && currentUser.role === 'admin') {
      fetchMessages();
      fetchUsers();
      fetchNotifications();
    }
  }, [currentUser]);

  // Toast Functionality
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Toggle Favorite
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        showToast('Property removed from wishlist', 'info');
        return prev.filter((favId) => favId !== id);
      } else {
        showToast('Property added to wishlist! ❤️', 'success');
        return [...prev, id];
      }
    });
  };

  // Auth Operations
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.session) {
        const token = data.session.access_token;
        const user = data.session.user;

        if (token) {
          localStorage.setItem('le_token', token);
        }
        setCurrentUser(user);
        showToast(`Welcome back, ${user.name || user.email}!`, 'success');
        return { success: true, user };
      } else {
        return { success: false, error: data.error || 'Authentication failed. Please check your credentials.' };
      }
    } catch (err) {
      return { success: false, error: 'Unable to connect to authentication service.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (res.ok) {
        if (data.session?.access_token) {
          localStorage.setItem('le_token', data.session.access_token);
        }
        if (data.user) {
          setCurrentUser(data.user);
        }
        showToast(`Account created! Welcome to TerraNova, ${name}.`, 'success');
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Registration failed.' };
      }
    } catch (err) {
      return { success: false, error: 'Unable to connect to registration service.' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.warn("Logout API failed:", err);
    }
    setCurrentUser(null);
    showToast('Logged out of session.', 'info');
  };

  const updateProfile = (name, email) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, name, email };
      setCurrentUser(updatedUser);
      localStorage.setItem('le_session', JSON.stringify(updatedUser));
    }
  };

  // CRUD Operations for Admin / Dashboard
  const addProperty = async (newProperty) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newProperty)
      });
      if (res.ok) {
        const data = await res.json();
        setProperties((prev) => [data, ...prev]);
        showToast('New listing added to portfolio.', 'success');
        return { success: true };
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Server error');
      }
    } catch (err) {
      console.error(err);
      const propertyWithId = {
        ...newProperty,
        id: properties.length > 0 ? Math.max(...properties.map((p) => p.id)) + 1 : 1,
        featured: newProperty.featured === true,
        published: newProperty.published !== undefined ? newProperty.published : true
      };
      setProperties((prev) => [propertyWithId, ...prev]);
      showToast('Listing added to local portfolio (offline).', 'info');
      return { success: true };
    }
  };

  const updateProperty = async (updatedProperty) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties/${updatedProperty.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedProperty)
      });
      if (res.ok) {
        const data = await res.json();
        setProperties((prev) =>
          prev.map((p) => (p.id === data.id ? data : p))
        );
        showToast('Listing details updated successfully.', 'success');
        return { success: true };
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Server error');
      }
    } catch (err) {
      console.error(err);
      setProperties((prev) =>
        prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p))
      );
      showToast('Listing details updated locally (offline).', 'info');
      return { success: true };
    }
  };

  const deleteProperty = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        setFavorites((prev) => prev.filter((favId) => favId !== id));
        showToast('Listing removed from portfolio.', 'info');
        return { success: true };
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Server error');
      }
    } catch (err) {
      console.error(err);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setFavorites((prev) => prev.filter((favId) => favId !== id));
      showToast('Listing removed locally (offline).', 'info');
      return { success: true };
    }
  };

  // Send Message / Contact Enquiry
  const sendMessage = async (enquiry) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry)
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [data, ...prev]);
        showToast('Your consultation request has been received. An agent will contact you shortly.', 'success');
        return { success: true };
      }
    } catch (err) {
      console.warn("Failed to send message to backend, using local store:", err);
    }
    const newMessage = {
      ...enquiry,
      id: Date.now(),
      date: 'Just now',
      read: false
    };
    setMessages((prev) => [newMessage, ...prev]);
    showToast('Your consultation request has been received (offline).', 'success');
    return { success: true };
  };

  const deleteMessage = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showToast('Message deleted successfully', 'info');
        return { success: true };
      }
    } catch (err) {
      console.warn("Failed to delete message on backend, fallback local:", err);
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Message deleted locally (offline).', 'info');
    return { success: true };
  };

  const toggleMessageReplied = async (id, currentRepliedState) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ replied: !currentRepliedState })
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, replied: !currentRepliedState } : m));
        return { success: true };
      }
    } catch (err) {
      console.warn("Failed to toggle replied state on server, fallback local:", err);
    }
    setMessages(prev => prev.map(m => m.id === id ? { ...m, replied: !currentRepliedState } : m));
    return { success: true };
  };

  return (
    <GlobalContext.Provider
      value={{
        properties,
        favorites,
        messages,
        users,
        currentUser,
        toasts,
        showToast,
        toggleFavorite,
        login,
        register,
        logout,
        updateProfile,
        addProperty,
        updateProperty,
        deleteProperty,
        sendMessage,
        deleteMessage,
        toggleMessageReplied,
        fetchProperties,
        fetchMessages,
        fetchUsers,
        notifications,
        fetchNotifications,
        markNotificationAsRead
      }}
    >
      {children}
      
      {/* Dynamic Toast Renderer */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-item border-l-4">
            {toast.type === 'success' && <i className="fas fa-check-circle text-accent-gold"></i>}
            {toast.type === 'info' && <i className="fas fa-info-circle text-neutral-laurel"></i>}
            {toast.type === 'error' && <i className="fas fa-exclamation-circle text-red-500"></i>}
            <span className="text-sm font-sans tracking-wide">{toast.message}</span>
          </div>
        ))}
      </div>
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
