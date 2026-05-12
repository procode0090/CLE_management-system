import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crvtziahpmhkygjzfgdy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydnR6aWFocG1oa3lnanpmZ2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTc4NDUsImV4cCI6MjA5NDA3Mzg0NX0.I1UU7j2q_Nm92dlG--qkuIHiA-v9d4U35Yx9rs_0WDc';

export const supabase = createClient(supabaseUrl, supabaseKey);