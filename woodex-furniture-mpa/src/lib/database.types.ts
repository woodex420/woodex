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
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category_id: string | null
          sku: string | null
          price: number | null
          specifications: Json | null
          features: string[] | null
          gallery_images: string[] | null
          thumbnail_image: string | null
          is_active: boolean
          is_featured: boolean
          stock_status: string | null
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category_id?: string | null
          sku?: string | null
          price?: number | null
          specifications?: Json | null
          features?: string[] | null
          gallery_images?: string[] | null
          thumbnail_image?: string | null
          is_active?: boolean
          is_featured?: boolean
          stock_status?: string | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category_id?: string | null
          sku?: string | null
          price?: number | null
          specifications?: Json | null
          features?: string[] | null
          gallery_images?: string[] | null
          thumbnail_image?: string | null
          is_active?: boolean
          is_featured?: boolean
          stock_status?: string | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          icon: string | null
          features: string[] | null
          image_url: string | null
          is_active: boolean
          display_order: number
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          icon?: string | null
          features?: string[] | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          icon?: string | null
          features?: string[] | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          author_name: string
          author_role: string | null
          company: string | null
          rating: number | null
          content: string
          image_url: string | null
          is_featured: boolean
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_name: string
          author_role?: string | null
          company?: string | null
          rating?: number | null
          content: string
          image_url?: string | null
          is_featured?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_name?: string
          author_role?: string | null
          company?: string | null
          rating?: number | null
          content?: string
          image_url?: string | null
          is_featured?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image: string | null
          author_id: string | null
          category: string | null
          tags: string[] | null
          status: string
          published_at: string | null
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image?: string | null
          author_id?: string | null
          category?: string | null
          tags?: string[] | null
          status?: string
          published_at?: string | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image?: string | null
          author_id?: string | null
          category?: string | null
          tags?: string[] | null
          status?: string
          published_at?: string | null
          seo_title?: string | null
          seo_description?: string | null
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
      [_ in never]: never
    }
  }
}
