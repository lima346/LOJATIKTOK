import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dolpfojgnfmotyddeees.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbHBmb2pnbmZtb3R5ZGRlZWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTM2MjgsImV4cCI6MjA4NzI2OTYyOH0.80JRtVddezUSuLkbNNpwHOOorNk_7l3cLDOpwPXRQRU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
