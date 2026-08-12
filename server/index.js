import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables flexibly from root or current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configured Production & Development CORS origins
const allowedOrigins = [
  'https://www.terranovarealestates.in',
  'https://terranovarealestates.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.CLIENT_ORIGIN,
  process.env.VITE_API_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.terranovarealestates.in') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Setup directories and static serving
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
      title: "New Property Enquiry",
      message: "John Doe sent an enquiry: 'Interested in Villa'",
      type: "enquiry",
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
  };
};

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || supabaseAnonKey;

const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY');

let supabase;
if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log('Backend connected to Supabase database successfully.');
} else {
  console.warn('Supabase not configured in .env. Running backend in In-Memory Mock Mode.');
}

// In-Memory stores for fallback mode
let propertiesStore = [
  { id: 1, title: "Premium Residential Plot", location: "Kowdiar, Thiruvananthapuram", price: "₹ 1,85,00,000", type: "Residential Plot", status: "For Sale", beds: 0, baths: 0, area: "12.5 Cents", roadAccess: "12m Tar Road", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80", featured: true },
  { id: 2, title: "NH 66 Commercial Land", location: "Kazhakoottam, Thiruvananthapuram", price: "₹ 8,90,00,000", type: "Commercial Plot", status: "For Sale", beds: 0, baths: 0, area: "45 Cents", roadAccess: "National Highway Frontage", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80", featured: true },
  { id: 3, title: "Agricultural Farm Land", location: "Wayanad, Kerala", price: "₹ 1,20,00,000", type: "Agricultural Land", status: "For Sale", beds: 0, baths: 0, area: "2.5 Acres", roadAccess: "Paved Village Road", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80", featured: true },
  { id: 4, title: "Industrial Development Plot", location: "Kinfra Industrial Park, Thiruvananthapuram", price: "₹ 3,50,00,000", type: "Industrial Land", status: "For Sale", beds: 0, baths: 0, area: "1.2 Acres", roadAccess: "Heavy Vehicle Access Road", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", featured: true },
  { id: 5, title: "Premium Gated Community Plot", location: "Akkulam, Thiruvananthapuram", price: "₹ 95,00,000", type: "Residential Plot", status: "For Sale", beds: 0, baths: 0, area: "10 Cents", roadAccess: "8m Wide Private Road", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", featured: false },
  { id: 6, title: "Commercial Corner Plot", location: "East Fort, Thiruvananthapuram", price: "₹ 2,40,00,000", type: "Commercial Plot", status: "For Sale", beds: 0, baths: 0, area: "8 Cents", roadAccess: "Dual Tar Road Frontage", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80", featured: false },
  { id: 7, title: "Oceanfront Luxury Villa", location: "Kovalam, Thiruvananthapuram", price: "₹ 5,20,00,000", type: "Villa/House", status: "For Sale", beds: 4, baths: 5, area: "4,500 sqft (18 Cents)", roadAccess: "6m Private Road", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80", featured: false }
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

// Admin authentication middleware - strictly checks JWT from Supabase Auth
const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Access token missing' });
  }
  const token = authHeader.split(' ')[1];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      const isUserAdmin = (adminEmail && user.email === adminEmail) ||
                          user.user_metadata?.role === 'admin' ||
                          user.app_metadata?.role === 'admin';

      if (!isUserAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admin authorization required' });
      }

      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ error: `Unauthorized: ${err.message}` });
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized: Database authentication service unconfigured' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (isSupabaseConfigured && supabase) {
    try {
      let { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'client'
          }
        }
      });

      if (error && supabase.auth.admin) {
        const adminResult = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name, role: 'client' }
        });
        if (!adminResult.error) {
          data = adminResult.data;
          error = null;
        }
      }

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const userRole = 'client';
      const enrichedUser = {
        id: data.user?.id,
        email: data.user?.email || email,
        name: name,
        role: userRole
      };

      return res.status(200).json({
        message: 'Registration successful',
        user: enrichedUser,
        session: data.session ? {
          ...data.session,
          user: enrichedUser
        } : {
          access_token: data.session?.access_token,
          user: enrichedUser
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(500).json({ error: 'Database authentication service unavailable' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const configuredAdminEmail = process.env.ADMIN_EMAIL;
  const configuredAdminPassword = process.env.ADMIN_PASSWORD;

  if (isSupabaseConfigured && supabase) {
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // Auto-register/confirm configured seed admin using Admin API
      if (error && configuredAdminEmail && email === configuredAdminEmail && configuredAdminPassword && password === configuredAdminPassword) {
        console.log('Attempting to confirm/create seed admin account using Supabase Admin API...');
        
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        const existingAdminUser = users ? users.find(u => u.email === configuredAdminEmail) : null;

        if (existingAdminUser) {
          console.log('Updating existing admin user to confirmed status...');
          await supabase.auth.admin.updateUserById(existingAdminUser.id, {
            email_confirm: true,
            password: configuredAdminPassword,
            user_metadata: { name: 'Admin', role: 'admin' }
          });
        } else {
          console.log('Creating new confirmed admin user...');
          await supabase.auth.admin.createUser({
            email: configuredAdminEmail,
            password: configuredAdminPassword,
            email_confirm: true,
            user_metadata: { name: 'Admin', role: 'admin' }
          });
        }

        const retry = await supabase.auth.signInWithPassword({ email, password });
        if (!retry.error) {
          data = retry.data;
          error = null;
        } else {
          console.error('SignIn retry error:', retry.error.message);
        }
      }

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      const userRole = (configuredAdminEmail && data.user.email === configuredAdminEmail) ||
                        data.user.user_metadata?.role === 'admin' ||
                        data.user.app_metadata?.role === 'admin' ? 'admin' : 'client';

      const enrichedSession = {
        ...data.session,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
          role: userRole
        }
      };

      return res.status(200).json({ message: 'Success', session: enrichedSession });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(401).json({ error: 'Authentication service unavailable' });
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
      console.warn('Supabase query error (falling back to local data):', err.message);
      let filtered = [...propertiesStore];
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
      }
      if (type && type !== 'all') {
        filtered = filtered.filter(p => p.type === type);
      }
      const merged = filtered.map(prop => mergeProperty(prop, metadata));
      return res.status(200).json(merged);
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
      console.warn('Supabase delete error (falling back to local data):', err.message);
      const numericId = parseInt(id);
      propertiesStore = propertiesStore.filter(p => p.id !== numericId);
      const metadata = getPropertiesMetadata();
      delete metadata[id];
      savePropertiesMetadata(metadata);
      return res.status(200).json({ message: 'Property deleted successfully' });
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
    const host = req.get('host');
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const fileUrl = `${protocol}://${host}/uploads/${fileName}`;
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
      console.warn('Supabase messages query error (falling back to mock data):', err.message);
      const sortedMessages = [...messagesStore].sort((a, b) => b.id - a.id);
      const merged = sortedMessages.map(msg => mergeMessage(msg, metadata));
      return res.status(200).json(merged);
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
        "New Property Enquiry",
        `"${createdMsg.from}" sent an enquiry: "${createdMsg.subject}"`,
        "enquiry",
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
      "New Property Enquiry",
      `"${createdMessage.from}" sent an enquiry: "${createdMessage.subject}"`,
      "enquiry",
      `/dashboard?tab=messages&id=${nextId}`,
      nextId
    );

    return res.status(201).json(mergeMessage(createdMessage, metadata));
  }
});

app.put('/api/messages/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { read, replied } = req.body;

  if (isSupabaseConfigured) {
    try {
      const updateFields = {};
      if (read !== undefined) updateFields.read = read;
      if (replied !== undefined) updateFields.replied = replied;

      const { data, error } = await supabase
        .from('messages')
        .update(updateFields)
        .eq('id', id)
        .select();

      if (error) throw error;
      const updatedMsg = data[0];
      const metadata = getMessagesMetadata();

      if (replied !== undefined) {
        metadata[id] = { ...metadata[id], replied };
        saveMessagesMetadata(metadata);
      }

      return res.status(200).json(mergeMessage(updatedMsg, metadata));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const numericId = parseInt(id);
    messagesStore = messagesStore.map(m => {
      if (m.id === numericId) {
        const u = { ...m };
        if (read !== undefined) u.read = read;
        if (replied !== undefined) u.replied = replied;
        return u;
      }
      return m;
    });
    const updated = messagesStore.find(m => m.id === numericId);
    const metadata = getMessagesMetadata();

    if (replied !== undefined) {
      metadata[id] = { ...metadata[id], replied };
      saveMessagesMetadata(metadata);
    }

    return res.status(200).json(mergeMessage(updated, metadata));
  }
});

app.delete('/api/messages/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete metadata
      const metadata = getMessagesMetadata();
      delete metadata[id];
      saveMessagesMetadata(metadata);

      return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const numericId = parseInt(id);
    messagesStore = messagesStore.filter(m => m.id !== numericId);

    // Delete metadata
    const metadata = getMessagesMetadata();
    delete metadata[id];
    saveMessagesMetadata(metadata);

    return res.status(200).json({ message: 'Message deleted successfully' });
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
      console.warn('Supabase users query error (falling back to mock data):', err.message);
      return res.status(200).json(usersStore);
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
