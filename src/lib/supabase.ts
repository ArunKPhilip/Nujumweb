import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://swesxydbhujrpzmitipb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3ZXN4eWRiaHVqcnB6bWl0aXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTE2MTYsImV4cCI6MjA4MTM4NzYxNn0.z7F28hcebhi58GB9IS6_G-IiVCBMJM8V74GGwX403G0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
