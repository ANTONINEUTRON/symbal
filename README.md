# Symbal - AI-Powered Creative Story App

Symbal is an innovative React Native application built with Expo that combines AI-powered storytelling with interactive creative challenges. Users embark on personalized narrative journeys where their mood and thoughts shape unique story experiences, complete with drawing and writing tasks that earn them SYM (in-app currency).

## 🌟 Key Features

### Core Gameplay
- **AI-Generated Stories**: Dynamic story generation based on user mood and context using Google Gemini AI
- **Creative Tasks**: Interactive drawing and writing challenges integrated into the narrative
- **Mood-Based Adaptation**: Stories adapt to user's current emotional state and preferences
- **Progressive Difficulty**: AI adjusts challenge complexity based on user progress and skill level

### Creative Challenges
- **Drawing Canvas**: Full-featured drawing interface with color palettes, brush sizes, and eraser tools
- **Writing Prompts**: Timed writing challenges with word limits and creative constraints
- **AI Feedback**: Intelligent evaluation and encouragement for all creative submissions
- **XP Rewards**: Earn SYM (experience points) for completing creative tasks

### User Progression
- **SYM Currency System**: Earn and spend in-app currency through gameplay
- **Level Progression**: Advance through levels based on accumulated experience
- **Achievement System**: Unlock badges and milestones for various accomplishments
- **Premium Features**: Access advanced features with sufficient SYM or real money purchases

### Social & Creator Features
- **Experience Manager**: Premium users can create custom story experiences
- **Revenue Sharing**: Creators can monetize their experiences by setting SYM costs
- **Community Discovery**: Browse and play experiences created by other users
- **Reward Claims**: Creators can offer rewards for completing their experiences

## 🛠 Tech Stack

### Frontend
- **React Native** with Expo SDK 52.0.30
- **Expo Router** 4.0.17 for navigation
- **TypeScript** for type safety
- **React Native Reanimated** for smooth animations
- **React Native Gesture Handler** for touch interactions
- **Expo Linear Gradient** for beautiful UI gradients
- **Lucide React Native** for consistent iconography

### Backend & Database
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL** with Row Level Security (RLS)
- **Supabase Edge Functions** for AI integration and server-side logic

### AI Integration
- **Google Gemini AI** for story generation and creative task evaluation
- **Custom Edge Functions** for secure API key management
- **Intelligent Content Generation** based on user context and history

### Payments (Future)
- **RevenueCat** integration for mobile in-app purchases
- **SYM Currency** system for in-app transactions

## 📱 Platform Support

- **iOS** (via Expo development build)
- **Android** (via Expo development build)
- **Web** (limited - some native features unavailable)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Expo CLI
- Supabase account and project
- Google AI Studio account (for Gemini API key)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Configure Supabase Edge Functions**:
Set the `GEMINI_API_KEY` as a Supabase secret:
```bash
# In Supabase Dashboard > Settings > Secrets
GEMINI_API_KEY=your_gemini_api_key
```

4. **Run database migrations**:
The migrations in `supabase/migrations/` will be automatically applied when you connect to Supabase.

5. **Start the development server**:
```bash
npm run dev
```

## 🎮 Game Types

### Creative Tasks
- **Drawing**: Freeform drawing with color palettes, themes, and style constraints
- **Writing**: Creative writing with genre, tone, and keyword requirements

### Traditional Games (Planned)
- **Quiz**: Multiple choice questions with AI-generated content
- **True/False**: Statement evaluation with contextual facts
- **Word Scramble**: Unscramble words related to the story theme
- **Matching**: Connect terms with their definitions
- **Typing Race**: Speed typing challenges with story excerpts
- **Passage Puzzle**: Fill-in-the-blank reading comprehension

## 🏗 Project Structure

```
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with navigation
│   ├── index.tsx          # Main story feed
│   ├── auth.tsx           # Authentication screen
│   ├── profile.tsx        # User profile and settings
│   ├── premium.tsx        # Premium features and SYM purchase
│   ├── experience-manager.tsx # Create/manage custom experiences
│   ├── achievements.tsx   # Achievement gallery
│   └── rewards.tsx        # Reward claims and creator hub
├── components/            # Reusable UI components
│   ├── StoryCard.tsx      # Main story display component
│   ├── GameModal.tsx      # Game container modal
│   ├── XPTracker.tsx      # SYM and mood display
│   ├── ThoughtModal.tsx   # Mood update interface
│   └── games/             # Individual game components
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state management
├── hooks/                 # Custom React hooks
│   ├── useUserProgress.ts # User progress and SYM management
│   ├── useAIStoryGeneration.ts # AI story generation
│   └── useCustomExperiences.ts # Experience CRUD operations
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client configuration
│   ├── gemini.ts          # AI integration utilities
│   └── storyCache.ts      # Local story caching
├── types/                 # TypeScript type definitions
│   ├── index.ts           # Core application types
│   ├── database.ts        # Supabase database types
│   └── env.d.ts           # Environment variable types
├── data/                  # Static data and fallbacks
│   └── storyData.ts       # Fallback stories and game content
└── supabase/              # Supabase configuration
    ├── functions/         # Edge Functions
    │   ├── generate-story/ # AI story generation
    │   └── judge-submission/ # AI creative task evaluation
    └── migrations/        # Database schema migrations
```

## 🔐 Authentication & Security

- **Supabase Auth** with email/password authentication
- **Row Level Security (RLS)** for all database tables
- **Automatic profile creation** on user signup
- **Secure API key management** via Supabase secrets

## 💰 Monetization Features

### SYM Currency System
- **Earn SYM**: Complete creative tasks to earn 5-10 SYM per game
- **Spend SYM**: Access premium features and custom experiences
- **Purchase SYM**: Buy SYM packages via mobile in-app purchases (RevenueCat)

### Premium Features (75,000 SYM threshold)
- **Experience Manager**: Create and publish custom story experiences
- **Revenue Sharing**: Set SYM costs for your experiences and earn from other users
- **Advanced Analytics**: Track plays, ratings, and earnings from your experiences
- **Priority Support**: Enhanced customer service

### Creator Economy
- **Custom Experiences**: Premium users can create and monetize story experiences
- **Reward Systems**: Offer rewards for completing experiences (badges, SYM, external rewards)
- **Community Discovery**: Public marketplace for user-generated content

## 🎨 Design Philosophy

- **Apple-level aesthetics** with attention to detail and micro-interactions
- **Gradient-heavy design** using purple, pink, and gold color schemes
- **Responsive layouts** that work across different screen sizes
- **Smooth animations** using React Native Reanimated
- **Intuitive gestures** for navigation and interaction

## 🔧 Development

### Available Scripts
- `npm run dev` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run build:web` - Build for web deployment
- `npm run lint` - Run ESLint

### Environment Setup
1. Install Expo CLI globally: `npm install -g @expo/cli`
2. Set up Expo account and EAS CLI for builds
3. Configure Supabase project with provided schema
4. Set up Google AI Studio for Gemini API access

## 📊 Database Schema

### Core Tables
- **profiles**: User account information
- **user_progress**: XP, level, mood, completed games, achievements
- **custom_experiences**: User-created story experiences with monetization
- **app_settings**: Global application configuration (premium thresholds, etc.)

### Key Features
- **Automatic profile creation** on user signup
- **XP capping** (max 10 SYM per game) to maintain balance
- **Mood tracking** for personalized AI story generation
- **Achievement system** with unlockable badges

## 🤖 AI Integration

### Story Generation
- **Context-aware**: Uses user mood, progress, and history
- **Variety**: Generates different game types to maintain engagement
- **Fallback system**: Local content when AI is unavailable

### Creative Evaluation
- **Intelligent feedback**: AI judges drawing and writing submissions
- **Encouraging tone**: Always positive and constructive
- **Detailed analysis**: Highlights strengths and suggests improvements

## 🚀 Deployment

### Mobile
1. Create Expo development build
2. Configure RevenueCat for in-app purchases
3. Submit to App Store and Google Play

### Web (Limited)
- Use `expo export --platform web` for static web deployment
- Note: Some native features (camera, haptics) won't work on web

## 🔮 Future Enhancements

- **Voice narration** for accessibility
- **Collaborative experiences** with multiple users
- **Advanced AI models** for even more personalized content
- **Social features** like following creators and sharing achievements
- **Offline mode** with local story caching
- **Multi-language support** for global reach

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

---

**Built with ❤️ using Expo, Supabase, and Google AI**