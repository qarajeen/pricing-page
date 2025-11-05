// This is a workaround for using the Supabase client from a CDN script in a TypeScript environment.
declare const supabase: any;

const { createClient } = supabase;

// --- Supabase Credentials ---
const supabaseUrl = 'https://zrusbzvcrmzeywwzzdjd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXNienZjcm16ZXl3d3p6ZGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzU2NzIsImV4cCI6MjA3NzkxMTY3Mn0.uUmozBJHfTPwsDUGsYCxGmEnEwApVs8EXfxPi339evg';

// --- Supabase Client Initialization ---
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
