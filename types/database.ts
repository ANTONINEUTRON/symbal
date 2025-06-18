export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          xp: number;
          level: number;
          current_story_index: number;
          current_thought: string;
          completed_games: string[];
          achievements: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          xp?: number;
          level?: number;
          current_story_index?: number;
          current_thought?: string;
          completed_games?: string[];
          achievements?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          xp?: number;
          level?: number;
          current_story_index?: number;
          current_thought?: string;
          completed_games?: string[];
          achievements?: string[];
          updated_at?: string;
        };
      };
      custom_experiences: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          is_public: boolean;
          plays: number;
          rating: number;
          content: any; // JSON content for the experience
          reward_type: 'none' | 'regular' | 'text_input' | 'image_upload';
          reward_count: number;
          reward_instructions?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          is_public?: boolean;
          plays?: number;
          rating?: number;
          content?: any;
          reward_type?: 'none' | 'regular' | 'text_input' | 'image_upload';
          reward_count?: number;
          reward_instructions?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          is_public?: boolean;
          plays?: number;
          rating?: number;
          content?: any;
          reward_type?: 'none' | 'regular' | 'text_input' | 'image_upload';
          reward_count?: number;
          reward_instructions?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      difficulty_level: 'Easy' | 'Medium' | 'Hard';
      reward_type: 'none' | 'regular' | 'text_input' | 'image_upload';
    };
  };
}