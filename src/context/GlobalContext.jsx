import React, { createContext, useContext, useState, useEffect } from 'react';
import { luxuryProperties } from '../data/mockData';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  // Properties State
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('le_properties');
    return saved ? JSON.parse(saved) : luxuryProperties;
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

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('le_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Toasts State
  const [toasts, setToasts] = useState([]);

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
    }
  }, [currentUser]);

  // Toast Functionality
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

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
  const login = (email, password) => {
    // Demo flow: admin account
    if (email === 'admin@luxeestate.com' && password === 'admin123') {
      const adminUser = { email, name: 'Victoria Sterling', role: 'admin' };
      setCurrentUser(adminUser);
      showToast('Welcome back, Victoria. Accessing Portfolio Dashboard.', 'success');
      return { success: true };
    }
    
    // Client flow
    if (email && password) {
      const clientUser = { email, name: email.split('@')[0], role: 'client' };
      setCurrentUser(clientUser);
      showToast(`Welcome back, ${clientUser.name}!`, 'success');
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  const register = (name, email, password) => {
    if (name && email && password) {
      const newUser = { email, name, role: 'client' };
      setCurrentUser(newUser);
      showToast(`Account created! Welcome to LuxeEstate, ${name}.`, 'success');
      return { success: true };
    }
    return { success: false, error: 'Please fill in all fields.' };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out of session.', 'info');
  };

  // CRUD Operations for Admin / Dashboard
  const addProperty = (newProperty) => {
    const propertyWithId = {
      ...newProperty,
      id: properties.length > 0 ? Math.max(...properties.map((p) => p.id)) + 1 : 1,
      featured: false
    };
    setProperties((prev) => [propertyWithId, ...prev]);
    showToast('New listing added to portfolio.', 'success');
  };

  const updateProperty = (updatedProperty) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p))
    );
    showToast('Listing details updated successfully.', 'success');
  };

  const deleteProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
    showToast('Listing removed from portfolio.', 'info');
  };

  // Send Message / Contact Inquiry
  const sendMessage = (inquiry) => {
    const newMessage = {
      ...inquiry,
      id: Date.now(),
      date: 'Just now',
      read: false
    };
    setMessages((prev) => [newMessage, ...prev]);
    showToast('Your consultation request has been received. An agent will contact you shortly.', 'success');
  };

  return (
    <GlobalContext.Provider
      value={{
        properties,
        favorites,
        messages,
        currentUser,
        toasts,
        showToast,
        toggleFavorite,
        login,
        register,
        logout,
        addProperty,
        updateProperty,
        deleteProperty,
        sendMessage
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
