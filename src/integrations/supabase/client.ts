// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eraueukwcwyzknyyagmh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYXVldWt3Y3d5emtueXlhZ21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMTA4ODcsImV4cCI6MjA2Nzg4Njg4N30.2T3Dl3xXkk7swENuzDqXMB7E4d5dFPox2pvbgVRP8FI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});