import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUsers() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error("Users fetch failed:", error.message);
  } else {
    console.log("Users success!", data);
    if (data && data.length > 0) {
      console.log("Columns:", Object.keys(data[0]));
    }
  }
}

testUsers();
