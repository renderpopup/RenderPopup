export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          summary: string
          description: string
          date: string
          location: string
          organizer: string
          category: string
          status: 'open' | 'closed' | 'upcoming'
          applications_count: number
          eligibility: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          description: string
          date: string
          location: string
          organizer: string
          category: string
          status?: 'open' | 'closed' | 'upcoming'
          applications_count?: number
          eligibility: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          description?: string
          date?: string
          location?: string
          organizer?: string
          category?: string
          status?: 'open' | 'closed' | 'upcoming'
          applications_count?: number
          eligibility?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          event_id: string
          user_id: string
          user_name: string
          user_email: string
          applied_at: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          user_name: string
          user_email: string
          applied_at?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          user_name?: string
          user_email?: string
          applied_at?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
      counter_proposals: {
        Row: {
          id: string
          user_id: string
          brand_name: string
          description: string
          budget: string
          target_date: string
          category: string
          status: 'pending' | 'accepted' | 'rejected'
          submitted_at: string
          proposals_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_name: string
          description: string
          budget: string
          target_date: string
          category: string
          status?: 'pending' | 'accepted' | 'rejected'
          submitted_at?: string
          proposals_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand_name?: string
          description?: string
          budget?: string
          target_date?: string
          category?: string
          status?: 'pending' | 'accepted' | 'rejected'
          submitted_at?: string
          proposals_count?: number
          created_at?: string
        }
      }
      brand_profiles: {
        Row: {
          id: string
          user_id: string
          brand_name: string
          company_name: string
          business_number: string
          representative_name: string
          email: string
          phone: string
          website: string | null
          description: string
          industry: string
          address: string
          product_images: string[]
          business_registration: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_name: string
          company_name: string
          business_number: string
          representative_name: string
          email: string
          phone: string
          website?: string | null
          description: string
          industry: string
          address: string
          product_images?: string[]
          business_registration?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand_name?: string
          company_name?: string
          business_number?: string
          representative_name?: string
          email?: string
          phone?: string
          website?: string | null
          description?: string
          industry?: string
          address?: string
          product_images?: string[]
          business_registration?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_status: 'open' | 'closed' | 'upcoming'
      application_status: 'pending' | 'approved' | 'rejected'
      proposal_status: 'pending' | 'accepted' | 'rejected'
      user_role: 'user' | 'admin'
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type Event = Tables<'events'>
export type Application = Tables<'applications'>
export type CounterProposal = Tables<'counter_proposals'>
export type BrandProfile = Tables<'brand_profiles'>
export type Profile = Tables<'profiles'>

