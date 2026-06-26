import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environmental variables from the parent .env file
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

let supabase;
if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Backend connected to Supabase database successfully.');
} else {
  console.warn('Supabase not configured in .env. Running backend in In-Memory Mock Mode.');
}

// In-Memory fallback store for demo mode
let propertiesStore = [
  { id: 1, title: "Modern Family Villa", location: "Beverly Hills, CA", price: "$2,450,000", type: "sale", status: "For Sale", beds: 4, baths: 3, area: "3,200 sqft", img: "https://picsum.photos/400/300?random=1", featured: true },
  { id: 2, title: "Luxury Waterfront Apt", location: "Miami Beach, FL", price: "$4,800/mo", type: "rent", status: "For Rent", beds: 3, baths: 2, area: "1,800 sqft", img: "https://picsum.photos/400/300?random=2", featured: true },
  { id: 3, title: "Downtown Penthouse", location: "New York, NY", price: "$3,950,000", type: "sale", status: "For Sale", beds: 5, baths: 4, area: "4,100 sqft", img: "https://picsum.photos/400/300?random=3", featured: true },
  { id: 4, title: "Cozy Suburban Home", location: "Austin, TX", price: "$2,100/mo", type: "rent", status: "For Rent", beds: 3, baths: 2, area: "1,500 sqft", img: "https://picsum.photos/400/300?random=4", featured: true },
  { id: 5, title: "Hilltop Estate", location: "San Francisco, CA", price: "$5,800,000", type: "sale", status: "For Sale", beds: 6, baths: 5, area: "5,500 sqft", img: "https://picsum.photos/400/300?random=5", featured: false },
  { id: 6, title: "Chic Studio Loft", location: "Chicago, IL", price: "$1,800/mo", type: "rent", status: "For Rent", beds: 1, baths: 1, area: "750 sqft", img: "https://picsum.photos/400/300?random=6", featured: false },
  { id: 7, title: "Oceanview Paradise", location: "Malibu, CA", price: "$6,200,000", type: "sale", status: "For Sale", beds: 5, baths: 4, area: "4,800 sqft", img: "https://picsum.photos/400/300?random=7", featured: false },
  { id: 8, title: "Garden Apartment", location: "Seattle, WA", price: "$2,500/mo", type: "rent", status: "For Rent", beds: 2, baths: 1, area: "1,100 sqft", img: "https://picsum.photos/400/300?random=8", featured: false }
];

let messagesStore = [
  { id: 1, from: "John Doe", email: "john@example.com", subject: "Interested in Villa", date: "2 hours ago", read: false },
  { id: 2, from: "Jane Smith", email: "jane@example.com", subject: "Financing Options", date: "5 hours ago", read: false },
  { id: 3, from: "Bob Wilson", email: "bob@example.com", subject: "Property Tour Request", date: "1 day ago", read: true },
  { id: 4, from: "Alice Brown", email: "alice@example.com", subject: "Investment Portfolio", date: "2 days ago", read: true }
];

let usersStore = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", role: "Homeowner", status: "active", joined: "Jan 12, 2025" },
  { id: 2, name: "Michael Chen", email: "michael@example.com", role: "Investor", status: "active", joined: "Dec 3, 2024" },
  { id: 3, name: "Theresa Lee", email: "theresa@example.com", role: "Buyer", status: "active", joined: "Feb 8, 2025" },
  { id: 4, name: "David Kim", email: "david@example.com", role: "Seller", status: "inactive", joined: "Nov 20, 2024" },
  { id: 5, name: "Emily Rodriguez", email: "emily@example.com", role: "Renter", status: "active", joined: "Mar 1, 2025" }
];

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (isSupabaseConfigured) {
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // If credentials fail, and they are using the default admin email, try to auto-create it
      if (error && (error.message === 'Invalid login credentials' || error.status === 400) && email === 'admin@homeverse.com') {
        console.log('Admin account not found. Automatically attempting to register admin account...');
        
        // Attempt sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) {
          console.error('Auto-registration signUp failed:', signUpError.message, signUpError);
          return res.status(401).json({ error: `Login failed, and auto-registration failed: ${signUpError.message}` });
        }

        console.log('Auto-registration signUp success. Retrying signIn...');

        // Retry login
        const retry = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (retry.error) {
          console.error('SignIn retry after auto-registration failed:', retry.error.message, retry.error);
          // If sign in fails after sign up, it's likely due to email confirmation requirement
          if (retry.error.message.includes('confirm') || retry.error.message.includes('verified')) {
            return res.status(401).json({
              error: 'Admin account created successfully, but email verification is enabled on your Supabase project. Please check your email inbox to confirm your account, or disable "Confirm email" under Authentication > Providers > Email in your Supabase Dashboard.'
            });
          }
          return res.status(401).json({ error: retry.error.message });
        }

        return res.status(200).json({ message: 'Success (Auto-registered Admin)', session: retry.data.session });
      }

      if (error) {
        console.error('SignIn failed:', error.message, error);
        return res.status(401).json({ error: error.message });
      }
      return res.status(200).json({ message: 'Success', session: data.session });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    // In-memory demo auth
    if (email === 'admin@homeverse.com' && password === 'admin123') {
      return res.status(200).json({
        message: 'Success (Demo)',
        session: { user: { email }, access_token: 'demo-token-xyz' }
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials. Try admin@homeverse.com / admin123' });
    }
  }
});

app.post('/api/auth/logout', async (req, res) => {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
  return res.status(200).json({ message: 'Logged out successfully' });
});

// --- PROPERTIES CRUD ENDPOINTS ---
app.get('/api/properties', async (req, res) => {
  const { query, type } = req.query;

  if (isSupabaseConfigured) {
    try {
      let dbQuery = supabase.from('properties').select('*');

      if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,location.ilike.%${query}%`);
      }
      if (type && type !== 'all') {
        dbQuery = dbQuery.eq('type', type);
      }

      const { data, error } = await dbQuery.order('id', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    // In-memory filter
    let results = [...propertiesStore];
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }
    if (type && type !== 'all') {
      results = results.filter(p => p.type === type);
    }
    // Return sorted by id desc
    results.sort((a, b) => b.id - a.id);
    return res.status(200).json(results);
  }
});

app.post('/api/properties', async (req, res) => {
  const newProperty = req.body;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([{ ...newProperty, featured: false }])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const nextId = propertiesStore.length > 0 ? Math.max(...propertiesStore.map(p => p.id)) + 1 : 1;
    const createdProperty = { id: nextId, ...newProperty, featured: false };
    propertiesStore.unshift(createdProperty);
    return res.status(201).json(createdProperty);
  }
});

app.put('/api/properties/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updatedData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return res.status(200).json(data[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const numericId = parseInt(id);
    propertiesStore = propertiesStore.map(p => p.id === numericId ? { ...p, ...updatedData } : p);
    const updated = propertiesStore.find(p => p.id === numericId);
    return res.status(200).json(updated);
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  const { id } = req.params;

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Property deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const numericId = parseInt(id);
    propertiesStore = propertiesStore.filter(p => p.id !== numericId);
    return res.status(200).json({ message: 'Property deleted successfully' });
  }
});

// --- MESSAGES CRUD ENDPOINTS ---
app.get('/api/messages', async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const sortedMessages = [...messagesStore].sort((a, b) => b.id - a.id);
    return res.status(200).json(sortedMessages);
  }
});

app.post('/api/messages', async (req, res) => {
  const newMessage = req.body;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const nextId = messagesStore.length > 0 ? Math.max(...messagesStore.map(m => m.id)) + 1 : 1;
    const createdMessage = { id: nextId, ...newMessage };
    messagesStore.unshift(createdMessage);
    return res.status(201).json(createdMessage);
  }
});

app.put('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ read })
        .eq('id', id)
        .select();

      if (error) throw error;
      return res.status(200).json(data[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const numericId = parseInt(id);
    messagesStore = messagesStore.map(m => m.id === numericId ? { ...m, read } : m);
    const updated = messagesStore.find(m => m.id === numericId);
    return res.status(200).json(updated);
  }
});

// --- USERS ENDPOINTS ---
app.get('/api/users', async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(200).json(usersStore);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend API Server listening on port ${PORT}`);
});
