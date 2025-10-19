export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blocked_phrases: {
        Row: {
          blocked_at: string | null
          id: string
          parent_id: string
          phrase: string
        }
        Insert: {
          blocked_at?: string | null
          id?: string
          parent_id: string
          phrase: string
        }
        Update: {
          blocked_at?: string | null
          id?: string
          parent_id?: string
          phrase?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_phrases_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parent_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_songs: {
        Row: {
          blocked_at: string | null
          id: string
          parent_id: string
          video_id: string
          video_title: string
        }
        Insert: {
          blocked_at?: string | null
          id?: string
          parent_id: string
          video_id: string
          video_title: string
        }
        Update: {
          blocked_at?: string | null
          id?: string
          parent_id?: string
          video_id?: string
          video_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_songs_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parent_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      child_accounts: {
        Row: {
          avatar_color: string | null
          created_at: string | null
          daily_time_limit_minutes: number | null
          id: string
          is_locked: boolean | null
          last_reset_date: string | null
          limit_reset_time: string | null
          parent_id: string
          pin_code: string
          time_used_today: number | null
          username: string
        }
        Insert: {
          avatar_color?: string | null
          created_at?: string | null
          daily_time_limit_minutes?: number | null
          id?: string
          is_locked?: boolean | null
          last_reset_date?: string | null
          limit_reset_time?: string | null
          parent_id: string
          pin_code: string
          time_used_today?: number | null
          username: string
        }
        Update: {
          avatar_color?: string | null
          created_at?: string | null
          daily_time_limit_minutes?: number | null
          id?: string
          is_locked?: boolean | null
          last_reset_date?: string | null
          limit_reset_time?: string | null
          parent_id?: string
          pin_code?: string
          time_used_today?: number | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parent_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      child_sessions: {
        Row: {
          child_id: string
          created_at: string
          expires_at: string
          id: string
          last_activity: string
        }
        Insert: {
          child_id: string
          created_at?: string
          expires_at: string
          id?: string
          last_activity?: string
        }
        Update: {
          child_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          last_activity?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          added_at: string | null
          child_id: string
          id: string
          video_id: string
          video_thumbnail: string | null
          video_title: string
        }
        Insert: {
          added_at?: string | null
          child_id: string
          id?: string
          video_id: string
          video_thumbnail?: string | null
          video_title: string
        }
        Update: {
          added_at?: string | null
          child_id?: string
          id?: string
          video_id?: string
          video_thumbnail?: string | null
          video_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_accounts: {
        Row: {
          created_at: string | null
          id: string
          parent_code: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parent_code?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parent_code?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pin_attempts: {
        Row: {
          attempt_time: string
          child_id: string
          id: string
          ip_address: string | null
          was_successful: boolean
        }
        Insert: {
          attempt_time?: string
          child_id: string
          id?: string
          ip_address?: string | null
          was_successful?: boolean
        }
        Update: {
          attempt_time?: string
          child_id?: string
          id?: string
          ip_address?: string | null
          was_successful?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "pin_attempts_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      playback_history: {
        Row: {
          child_id: string
          id: string
          played_at: string | null
          search_query: string | null
          video_id: string
          video_thumbnail: string | null
          video_title: string
        }
        Insert: {
          child_id: string
          id?: string
          played_at?: string | null
          search_query?: string | null
          video_id: string
          video_thumbnail?: string | null
          video_title: string
        }
        Update: {
          child_id?: string
          id?: string
          played_at?: string | null
          search_query?: string | null
          video_id?: string
          video_thumbnail?: string | null
          video_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "playback_history_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          is_parent: boolean | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email: string
          id: string
          is_parent?: boolean | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          is_parent?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_playback_history: {
        Args: {
          search_query_input: string
          session_token: string
          video_id_input: string
          video_thumbnail_input: string
          video_title_input: string
        }
        Returns: Json
      }
      get_children_for_login: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_color: string
          id: string
          parent_id: string
          username: string
        }[]
      }
      get_current_child_from_session: {
        Args: { session_token: string }
        Returns: string
      }
      get_favorites: {
        Args: { session_token: string }
        Returns: {
          added_at: string
          id: string
          video_id: string
          video_thumbnail: string
          video_title: string
        }[]
      }
      get_playback_history: {
        Args: { session_token: string }
        Returns: {
          id: string
          played_at: string
          search_query: string
          video_id: string
          video_thumbnail: string
          video_title: string
        }[]
      }
      get_time_usage: {
        Args: { session_token: string }
        Returns: Json
      }
      reset_child_daily_time: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      toggle_favorite: {
        Args: {
          session_token: string
          video_id_input: string
          video_thumbnail_input: string
          video_title_input: string
        }
        Returns: Json
      }
      update_time_usage: {
        Args: { minutes_used: number; session_token: string }
        Returns: Json
      }
      verify_child_pin: {
        Args: { child_id_input: string; pin_input: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
