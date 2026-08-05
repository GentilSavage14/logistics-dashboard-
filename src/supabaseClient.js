import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hmolfdbgnecmvegktgng.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtb2xmZGJnbmVjbXZlZ2t0Z25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMDMxNjgsImV4cCI6MjA5OTg3OTE2OH0.RV4Su8rd24DTKZQ2H9T4oNRfBhg5brY6L5RN5sv3wQE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);