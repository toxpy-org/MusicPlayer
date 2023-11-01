
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.SUPABASEURL as string, process.env.SUPAKEY as string)

