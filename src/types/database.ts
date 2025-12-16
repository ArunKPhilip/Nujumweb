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
      users: {
        Row: {
          id: string
          username: string
          full_name: string
          email: string
          phone: string | null
          profile_picture: string | null
          disability_type: string
          country_of_residence: string
          nationality: string | null
          gender: string | null
          date_of_birth: string | null
          is_verified: boolean
          verification_status: string
          bio: string | null
          blood_group: string | null
          emergency_contact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          full_name: string
          email: string
          phone?: string | null
          profile_picture?: string | null
          disability_type: string
          country_of_residence: string
          nationality?: string | null
          gender?: string | null
          date_of_birth?: string | null
          is_verified?: boolean
          verification_status?: string
          bio?: string | null
          blood_group?: string | null
          emergency_contact?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          email?: string
          phone?: string | null
          profile_picture?: string | null
          disability_type?: string
          country_of_residence?: string
          nationality?: string | null
          gender?: string | null
          date_of_birth?: string | null
          is_verified?: boolean
          verification_status?: string
          bio?: string | null
          blood_group?: string | null
          emergency_contact?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          type: string
          file_name: string
          file_url: string
          status: string
          uploaded_at: string
          verified_at: string | null
          rejection_reason: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          file_name: string
          file_url: string
          status?: string
          uploaded_at?: string
          verified_at?: string | null
          rejection_reason?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          file_name?: string
          file_url?: string
          status?: string
          uploaded_at?: string
          verified_at?: string | null
          rejection_reason?: string | null
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          content: string
          media_urls: Json | null
          likes: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          media_urls?: Json | null
          likes?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          media_urls?: Json | null
          likes?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      community_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          likes: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          likes?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          likes?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      benefit_programs: {
        Row: {
          id: string
          title: string
          description: string
          type: string
          category: string
          eligibility: string[]
          benefits: string[]
          application_url: string | null
          deadline: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: string
          category: string
          eligibility: string[]
          benefits: string[]
          application_url?: string | null
          deadline?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: string
          category?: string
          eligibility?: string[]
          benefits?: string[]
          application_url?: string | null
          deadline?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      assistive_devices: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          price: number
          currency: string
          vendor_id: string
          images: string[]
          specifications: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          price: number
          currency: string
          vendor_id: string
          images?: string[]
          specifications?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          price?: number
          currency?: string
          vendor_id?: string
          images?: string[]
          specifications?: Json
          created_at?: string
          updated_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          description: string
          urgency: string
          location: Json | null
          status: string
          assigned_to: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          description: string
          urgency?: string
          location?: Json | null
          status?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          description?: string
          urgency?: string
          location?: Json | null
          status?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
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
      disability_type: "physical" | "visual" | "hearing" | "cognitive" | "speech" | "multiple" | "other"
      document_status: "pending" | "verified" | "rejected"
      document_type: "id_proof" | "disability_certificate" | "insurance" | "medical_report" | "other"
      service_request_status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
      service_request_type: "airport_assistance" | "mobility_support" | "transportation" | "medical_assistance" | "general_support"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
    }
  }
}
