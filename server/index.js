import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environmental variables from the parent .env file
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing middleware (with 50mb limit for base64 uploads)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Setup directories and static serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploads folder statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Metadata storage file paths
const PROPERTIES_METADATA_PATH = path.join(DATA_DIR, 'properties_metadata.json');
const MESSAGES_METADATA_PATH = path.join(DATA_DIR, 'messages_metadata.json');
const NOTIFICATIONS_PATH = path.join(DATA_DIR, 'notifications.json');

// Initialize notifications store if empty
if (!fs.existsSync(NOTIFICATIONS_PATH)) {
  fs.writeFileSync(NOTIFICATIONS_PATH, JSON.stringify([
    {
      id: 1,
      title: "New Property Inquiry",
      message: "John Doe sent an inquiry: 'Interested in Villa'",
      type: "inquiry",
      read: false,
      route: "/dashboard?tab=messages&id=1",
      itemId: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "New User Registered",
      message: "Emily Rodriguez joined the platform.",
      type: "user",
      read: true,
      route: "/dashboard?tab=users&id=5",
      itemId: 5,
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ], null, 2), 'utf8');
}

const getNotifications = () => {
  try {
    if (fs.existsSync(NOTIFICATIONS_PATH)) {
      return JSON.parse(fs.readFileSync(NOTIFICATIONS_PATH, 'utf8'));
    }
  } catch (err) {
    console.error("Error reading notifications:", err);
  }
  return [];
};

const saveNotifications = (notifications) => {
  try {
    fs.writeFileSync(NOTIFICATIONS_PATH, JSON.stringify(notifications, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing notifications:", err);
  }
};

const addNotification = (title, message, type, route, itemId) => {
  const notifications = getNotifications();
  const newNotif = {
    id: Date.now() + Math.floor(Math.random() * 100),
    title,
    message,
    type,
    read: false,
    route,
    itemId: parseInt(itemId, 10) || itemId,
    created_at: new Date().toISOString()
  };
  notifications.unshift(newNotif);
  saveNotifications(notifications);
  return newNotif;
};

const getPropertiesMetadata = () => {
  try {
    if (fs.existsSync(PROPERTIES_METADATA_PATH)) {
      return JSON.parse(fs.readFileSync(PROPERTIES_METADATA_PATH, 'utf8'));
    }
  } catch (err) {
    console.error("Error reading properties metadata:", err);
  }
  return {};
};

const savePropertiesMetadata = (metadata) => {
  try {
    fs.writeFileSync(PROPERTIES_METADATA_PATH, JSON.stringify(metadata, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing properties metadata:", err);
  }
};

const getMessagesMetadata = () => {
  try {
    if (fs.existsSync(MESSAGES_METADATA_PATH)) {
      return JSON.parse(fs.readFileSync(MESSAGES_METADATA_PATH, 'utf8'));
    }
  } catch (err) {
    console.error("Error reading messages metadata:", err);
  }
  return {};
};

const saveMessagesMetadata = (metadata) => {
  try {
    fs.writeFileSync(MESSAGES_METADATA_PATH, JSON.stringify(metadata, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing messages metadata:", err);
  }
};

const mergeProperty = (prop, metadata) => {
  const meta = metadata[prop.id] || {};
  return {
    ...prop,
    description: meta.description !== undefined ? meta.description : (prop.description || ''),
    address: meta.address !== undefined ? meta.address : '',
    published: meta.published !== undefined ? meta.published : true,
    gallery: meta.gallery !== undefined ? meta.gallery : (prop.gallery || []),
    googleMap: meta.googleMap !== undefined ? meta.googleMap : '',
    seoTitle: meta.seoTitle !== undefined ? meta.seoTitle : '',
    seoDescription: meta.seoDescription !== undefined ? meta.seoDescription : '',
    slug: meta.slug !== undefined ? meta.slug : '',
    tagline: meta.tagline !== undefined ? meta.tagline : (prop.tagline || ''),
    amenities: meta.amenities !== undefined ? meta.amenities : (prop.amenities || []),
    nearby: meta.nearby !== undefined ? meta.nearby : (prop.nearby || []),
    floorPlan: meta.floorPlan !== undefined ? meta.floorPlan : (prop.floorPlan || '')
  };
};

const mergeMessage = (msg, metadata) => {
  const meta = metadata[msg.id] || {};
  return {
    ...msg,
    message: meta.message || ''
  };
};

// Admin authentication middleware
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  if (token === 'demo-token-xyz' || token.length > 20) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Invalid token' });
};

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
  const isAdminEmail = email === 'admin@homeverse.com' || email === 'terranovarealestateoffice@gmail.com';

  if (isSupabaseConfigured) {
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // If credentials fail, and they are using the default admin email, try to auto-create it
      if (error && (error.message === 'Invalid login credentials' || error.status === 400) && isAdminEmail) {
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
    if (isAdminEmail && password === 'admin123') {
      return res.status(200).json({
        message: 'Success (Demo)',
        session: { user: { email, role: 'admin', name: 'Victoria Sterling' }, access_token: 'demo-token-xyz' }
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials. Try terranovarealestateoffice@gmail.com / admin123' });
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
  const metadata = getPropertiesMetadata();

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

      // Merge metadata
      const merged = data.map(prop => mergeProperty(prop, metadata));
      return res.status(200).json(merged);
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
    const merged = results.map(prop => mergeProperty(prop, metadata));
    return res.status(200).json(merged);
  }
});

app.post('/api/properties', verifyAdmin, async (req, res) => {
  const propertyInput = req.body;

  // Extract standard fields
  const standardFields = {
    title: propertyInput.title,
    location: propertyInput.location,
    price: propertyInput.price,
    type: propertyInput.type,
    status: propertyInput.status || 'Active',
    beds: parseInt(propertyInput.beds, 10) || 0,
    baths: parseInt(propertyInput.baths, 10) || 0,
    area: propertyInput.area,
    img: propertyInput.img,
    featured: propertyInput.featured === true
  };

  // Extract metadata fields
  const metaFields = {
    description: propertyInput.description || '',
    address: propertyInput.address || '',
    published: propertyInput.published !== undefined ? propertyInput.published : true,
    gallery: propertyInput.gallery || [],
    googleMap: propertyInput.googleMap || '',
    seoTitle: propertyInput.seoTitle || '',
    seoDescription: propertyInput.seoDescription || '',
    slug: propertyInput.slug || '',
    tagline: propertyInput.tagline || '',
    amenities: propertyInput.amenities || [],
    nearby: propertyInput.nearby || [],
    floorPlan: propertyInput.floorPlan || ''
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([standardFields])
        .select();

      if (error) throw error;
      const createdProp = data[0];

      // Save metadata
      const metadata = getPropertiesMetadata();
      metadata[createdProp.id] = metaFields;
      savePropertiesMetadata(metadata);

      // Create notification
      addNotification(
        "New Property Added",
        `"${createdProp.title}" was added to the portfolio.`,
        "property",
        `/property/${createdProp.id}`,
        createdProp.id
      );

      return res.status(201).json(mergeProperty(createdProp, metadata));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const nextId = propertiesStore.length > 0 ? Math.max(...propertiesStore.map(p => p.id)) + 1 : 1;
    const createdProperty = { id: nextId, ...standardFields };
    propertiesStore.unshift(createdProperty);

    // Save metadata
    const metadata = getPropertiesMetadata();
    metadata[nextId] = metaFields;
    savePropertiesMetadata(metadata);

    // Create notification
    addNotification(
      "New Property Added",
      `"${createdProperty.title}" was added to the portfolio.`,
      "property",
      `/property/${nextId}`,
      nextId
    );

    return res.status(201).json(mergeProperty(createdProperty, metadata));
  }
});

app.put('/api/properties/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const propertyInput = req.body;

  // Extract standard fields
  const standardFields = {
    title: propertyInput.title,
    location: propertyInput.location,
    price: propertyInput.price,
    type: propertyInput.type,
    status: propertyInput.status,
    beds: parseInt(propertyInput.beds, 10) || 0,
    baths: parseInt(propertyInput.baths, 10) || 0,
    area: propertyInput.area,
    img: propertyInput.img,
    featured: propertyInput.featured === true
  };

  // Extract metadata fields
  const metaFields = {
    description: propertyInput.description || '',
    address: propertyInput.address || '',
    published: propertyInput.published !== undefined ? propertyInput.published : true,
    gallery: propertyInput.gallery || [],
    googleMap: propertyInput.googleMap || '',
    seoTitle: propertyInput.seoTitle || '',
    seoDescription: propertyInput.seoDescription || '',
    slug: propertyInput.slug || '',
    tagline: propertyInput.tagline || '',
    amenities: propertyInput.amenities || [],
    nearby: propertyInput.nearby || [],
    floorPlan: propertyInput.floorPlan || ''
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(standardFields)
        .eq('id', id)
        .select();

      if (error) throw error;
      const updatedProp = data[0];

      // Update metadata
      const metadata = getPropertiesMetadata();
      const oldPublished = metadata[id]?.published;
      metadata[id] = { ...metadata[id], ...metaFields };
      savePropertiesMetadata(metadata);

      // Check if published state changed to generate a notification
      if (propertyInput.published !== undefined && oldPublished !== propertyInput.published) {
        const title = propertyInput.published ? "Property Approved" : "Property Rejected";
        const msgText = `"${updatedProp.title}" was ${propertyInput.published ? 'approved and published' : 'rejected and moved to drafts'}.`;
        addNotification(title, msgText, "property", `/property/${id}`, id);
      }

      return res.status(200).json(mergeProperty(updatedProp, metadata));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const numericId = parseInt(id);
    propertiesStore = propertiesStore.map(p => p.id === numericId ? { ...p, ...standardFields } : p);
    const updated = propertiesStore.find(p => p.id === numericId);

    // Update metadata
    const metadata = getPropertiesMetadata();
    const oldPublished = metadata[id]?.published;
    metadata[id] = { ...metadata[id], ...metaFields };
    savePropertiesMetadata(metadata);

    // Check if published state changed to generate a notification
    if (propertyInput.published !== undefined && oldPublished !== propertyInput.published) {
      const title = propertyInput.published ? "Property Approved" : "Property Rejected";
      const msgText = `"${updated.title}" was ${propertyInput.published ? 'approved and published' : 'rejected and moved to drafts'}.`;
      addNotification(title, msgText, "property", `/property/${id}`, id);
    }

    return res.status(200).json(mergeProperty(updated, metadata));
  }
});

app.delete('/api/properties/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete metadata
      const metadata = getPropertiesMetadata();
      delete metadata[id];
      savePropertiesMetadata(metadata);

      return res.status(200).json({ message: 'Property deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const numericId = parseInt(id);
    propertiesStore = propertiesStore.filter(p => p.id !== numericId);

    // Delete metadata
    const metadata = getPropertiesMetadata();
    delete metadata[id];
    savePropertiesMetadata(metadata);

    return res.status(200).json({ message: 'Property deleted successfully' });
  }
});

// --- IMAGE UPLOAD ENDPOINT ---
app.post('/api/upload', verifyAdmin, async (req, res) => {
  const { image, name } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  try {
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 string' });
    }

    const ext = matches[1].split('/')[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');
    
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    fs.writeFileSync(filePath, buffer);
    const fileUrl = `http://localhost:5000/uploads/${fileName}`;
    return res.status(200).json({ url: fileUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// --- MESSAGES CRUD ENDPOINTS ---
app.get('/api/messages', verifyAdmin, async (req, res) => {
  const metadata = getMessagesMetadata();
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      const merged = data.map(msg => mergeMessage(msg, metadata));
      return res.status(200).json(merged);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const sortedMessages = [...messagesStore].sort((a, b) => b.id - a.id);
    const merged = sortedMessages.map(msg => mergeMessage(msg, metadata));
    return res.status(200).json(merged);
  }
});

app.post('/api/messages', async (req, res) => {
  const messageInput = req.body;

  // Extract standard fields
  const standardFields = {
    from: messageInput.from,
    email: messageInput.email,
    subject: messageInput.subject,
    date: messageInput.date || 'Just now',
    read: false
  };

  // Extract metadata field
  const messageBody = messageInput.message || '';

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([standardFields])
        .select();

      if (error) throw error;
      const createdMsg = data[0];

      // Save metadata
      const metadata = getMessagesMetadata();
      metadata[createdMsg.id] = { message: messageBody };
      saveMessagesMetadata(metadata);

      // Create notification
      addNotification(
        "New Property Inquiry",
        `"${createdMsg.from}" sent an inquiry: "${createdMsg.subject}"`,
        "inquiry",
        `/dashboard?tab=messages&id=${createdMsg.id}`,
        createdMsg.id
      );

      return res.status(201).json(mergeMessage(createdMsg, metadata));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const nextId = messagesStore.length > 0 ? Math.max(...messagesStore.map(m => m.id)) + 1 : 1;
    const createdMessage = { id: nextId, ...standardFields };
    messagesStore.unshift(createdMessage);

    // Save metadata
    const metadata = getMessagesMetadata();
    metadata[nextId] = { message: messageBody };
    saveMessagesMetadata(metadata);

    // Create notification
    addNotification(
      "New Property Inquiry",
      `"${createdMessage.from}" sent an inquiry: "${createdMessage.subject}"`,
      "inquiry",
      `/dashboard?tab=messages&id=${nextId}`,
      nextId
    );

    return res.status(201).json(mergeMessage(createdMessage, metadata));
  }
});

app.put('/api/messages/:id', verifyAdmin, async (req, res) => {
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
      const updatedMsg = data[0];
      const metadata = getMessagesMetadata();
      return res.status(200).json(mergeMessage(updatedMsg, metadata));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const numericId = parseInt(id);
    messagesStore = messagesStore.map(m => m.id === numericId ? { ...m, read } : m);
    const updated = messagesStore.find(m => m.id === numericId);
    const metadata = getMessagesMetadata();
    return res.status(200).json(mergeMessage(updated, metadata));
  }
});

// --- USERS ENDPOINTS ---
app.get('/api/users', verifyAdmin, async (req, res) => {
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

// --- NOTIFICATIONS ENDPOINTS ---
app.get('/api/notifications', verifyAdmin, (req, res) => {
  const notifs = getNotifications();
  return res.status(200).json(notifs);
});

app.put('/api/notifications/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { read } = req.body;
  const numericId = parseInt(id, 10);

  let notifs = getNotifications();
  notifs = notifs.map(n => n.id === numericId ? { ...n, read: read === true } : n);
  saveNotifications(notifs);

  const updated = notifs.find(n => n.id === numericId);
  if (!updated) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  return res.status(200).json(updated);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend API Server listening on port ${PORT}`);
});
