# MindChain - AI-Powered Mental Wellness Platform

## Overview

MindChain is a comprehensive mental health and wellness web application powered by artificial intelligence. It provides users with tools for emotional tracking, journaling, therapy exercises, meditation, and gamified wellness experiences. The platform combines evidence-based therapeutic techniques with modern AI to make mental health support accessible, engaging, and personalized.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15.5.9, React 19, TypeScript |
| **Styling** | Tailwind CSS 3.4, Radix UI, Framer Motion |
| **Database** | Convex (Serverless database) |
| **Authentication** | Clerk 6.36.8 |
| **AI/ML** | Google AI SDK, @tanstack/ai, Gemini, Ollama |
| **State Management** | React Hook Form, Zod |
| **UI Components** | shadcn/ui inspired components |
| **File Storage** | UploadThing |
| **Analytics** | Vercel Analytics |

---

## Features

### 1. AI Companion Chat
- **Location:** `/chat`
- **Description:** Intelligent conversational AI companion for mental health support
- **Features:**
  - Context-aware conversations
  - Sentiment-aware responses
  - Powered by Google Gemini and Ollama (gemma:7b)
  - Persistent chat history stored in Convex

### 2. Smart Journaling
- **Location:** `/journal`
- **Description:** AI-powered journaling with sentiment analysis
- **Features:**
  - Rich text journal entries
  - Real-time sentiment analysis (Positive/Neutral/Negative)
  - Mood scoring (1-10 scale)
  - Mood trend visualization with charts
  - Secure storage per user

### 3. Daily Check-ins
- **Location:** `/check`
- **Description:** Interactive wellness assessments
- **Features:**
  - Personalized 10-question wellness assessment
  - AI-generated insights from responses
  - Historical tracking
  - Progress visualization
  - Wellness trend charts
  - 90-day activity heatmap
  - Automatic coin rewards (+5 coins per check-in)

### 4. CBT Therapy Exercises
- **Location:** `/cbt`
- **Description:** Cognitive Behavioral Therapy exercises
- **Features:**
  - Guided CBT exercises
  - Structured thought reframing
  - Progress tracking
  - Evidence-based techniques

### 5. Meditation Center
- **Location:** `/meditation`
- **Description:** Curated meditation sessions
- **Features:**
  - Multiple meditation tracks
  - Duration-based filtering
  - Timer with visual breathing guide
  - Ambient audio support

### 6. Relaxation Zone (Relaxo)
- **Location:** `/relaxo`
- **Description:** Stress relief and relaxation tools
- **Features:**
  - Interactive breathing exercises
  - Visual breathing circle animations
  - Customizable session durations
  - Calming visual feedback

### 7. Gamified Wellness Challenges
- **Location:** `/challenges`
- **Description:** Community wellness challenges
- **Features:**
  - Join wellness challenges with duration-based goals
  - Track daily progress and completed days
  - Community leaderboards
  - Duration-based goals
  - Coin and streak rewards upon completion
  - Progress persistence through Convex

### 8. Mind Games
- **Location:** `/games`
- **Description:** Curated brain-training games for mental wellness
- **Features:**
  - Puzzle games (Blockbuster Puzzle, Color Fill 3D, Pixel Sphere 3D)
  - Strategy games (Man Runner 2048, Hex Frvr, Dot King)
  - Mahjong games (Mahjongg Solitaire, Mahjong Puzzle Tile Match)
  - Relaxing gameplay options
  - Stress relief through engagement

### 9. Lofi Radio
- **Location:** `/lofi`
- **Description:** Curated lo-fi music streams for focus and relaxation
- **Features:**
  - Multiple live radio channels (Lofi Girl, Coffee Shop Vibes, Night Study Beats)
  - Embedded YouTube streams
  - Play/pause and mute controls
  - Station switching with live viewer counts
  - Animated audio visualizers
  - Listening tips for optimal experience

### 10. Community Support
- **Location:** `/community`
- **Description:** Anonymous peer support community
- **Features:**
  - Anonymous posting
  - Safe space for sharing
  - Community interactions
  - Moderated discussions

### 11. Todo/Goals Management
- **Location:** `/todo`
- **Description:** Goal setting and habit tracking
- **Features:**
  - Kanban-style task management
  - Daily wellness goals
  - Progress tracking
  - Habit streak monitoring

### 12. Mental Health Assessment
- **Location:** `/test`
- **Description:** Psychological wellness assessments
- **Features:**
  - Guided assessments
  - AI-powered quiz insights
  - Recommendations based on results
  - Progress tracking over time

### 13. Dashboard (Home)
- **Location:** `/home`
- **Description:** Central wellness command center
- **Features:**
  - Mood trend charts
  - Streak tracking
  - Progress summaries
  - Quick access to all features
  - Pie chart visualization of activities

---

## Gamification System

### Points & Rewards
- **Coins System:** Earn MindCoins for completing activities
  - Journaling: +10 coins
  - Daily check-in: +5 coins
  - Meditation session: +15 coins
  - CBT exercise completion: +20 coins
  - Challenge participation: +25 coins

### Badges & Achievements
- First Journal Entry
- 7-Day Streak Master
- Meditation Guru
- CBT Champion
- Community Supporter
- Challenge Conqueror

### Daily Quests
- Complete daily wellness tasks
- Earn bonus rewards
- Build consistent habits

### Streak Tracking
- Visual streak display
- Daily check-in bonuses
- Milestone celebrations with confetti
- Progress persistence through Convex

### Wellness Trends
- Daily wellness scores calculated from check-in responses
- Interactive trend visualization over time
- 90-day heatmap data for activity tracking
- Deduplicated daily scores (latest value per day)

---

## AI-Powered Features

### Sentiment Analysis
- Real-time mood detection from journal entries
- Categorization: Positive, Neutral, Negative
- Trend analysis over time
- Personalized recommendations based on emotional patterns

### AI Chat Companion
- RAG (Retrieval-Augmented Generation) ready
- Context-aware conversations
- Therapeutic approach
- 24/7 availability

### Intelligent Insights
- Quiz insight generation
- Pattern recognition in user behavior
- Proactive wellness suggestions
- Burnout risk prediction (future)
- Wellness trend calculation from check-in responses
- Interactive heatmap data for 90-day activity visualization

### Voice Interaction (Future)
- Voice-to-text journaling
- Voice chat with AI companion
- Speech synthesis for responses

### Ambient Audio
- Lofi Hip Hop Radio streams
- Multiple curated channels (Lofi Girl, Coffee Shop Vibes, Night Study Beats)
- Embedded YouTube live streams
- Audio controls (play/pause, mute)
- Station switching with live viewer counts
- Animated audio visualizers

---

## Database Schema (Convex)

### Users Table
```typescript
{
  userId: string,      // Clerk ID
  email: string,
  name: string?,
  coins: number,
  streak: number,
  lastCheckIn: number?
}
```

### Journal Table
```typescript
{
  userId: string,
  content: string,
  sentiment: string?,  // "Positive", "Neutral", "Negative"
  moodScore: number?,  // 1-10
  createdAt: number
}
```

### Check-ins Table
```typescript
{
  userId: string,
  answers: string[],
  insight: string,
  createdAt: number
}
```

### Chats & Messages Tables
- Persistent conversation history
- Chat organization by title
- Timestamped message retrieval

### Gamification Table
```typescript
{
  userId: string,
  points: number,
  badges: string[],
  dailyQuests: { quest: string, completed: boolean }[]
}
```

### Challenges Table
```typescript
{
  title: string,
  description: string,
  icon?: string,
  color?: string,
  duration: number,
  coinsReward?: number,
  streakReward?: number
}
```

### User Challenges Table
```typescript
{
  userId: string,
  challengeId: id,
  progress: number,
  completedDays: number[],
  startedAt: number,
  lastCompletedAt?: number,
  isCompleted: boolean
}
```

---

## API Routes

| Route | Purpose |
| `/api/chat` | AI companion chat interface |
|-------|---------|
| `/api/analysis` | Sentiment & mood analysis |
| `/api/quiz-insights` | Quiz result interpretation |
| `/api/uploadthing` | File upload handling |

---

## Convex Database Functions

| Function | Purpose |
|----------|---------|
| `checkins.saveResult` | Save daily check-in with answers and AI insight |
| `checkins.getHistory` | Retrieve user's check-in history |
| `checkins.getWellnessTrends` | Calculate wellness scores over time |
| `checkins.hasCheckedInToday` | Check if user checked in today |
| `checkins.getHeatmapData` | Get 90-day activity heatmap data |
| `challenges.getChallenges` | Fetch all available challenges |
| `challenges.getChallengeWithProgress` | Get challenges with user's progress |
| `challenges.joinChallenge` | User joins a challenge |
| `challenges.updateProgress` | Update daily progress for a challenge |

---

## UI Components

### Core Components
- `app-sidebar.tsx` - Navigation sidebar with user info
- `navbar.tsx` - Top navigation bar
- `auth-provider.tsx` - Authentication context provider
- `footer.tsx` - Page footer
- `breathing-circle.tsx` - Animated breathing guide
- `mood-chart.tsx` - Mood trend visualization
- `progress-chart.tsx` - Progress tracking charts
- `summary-pie-chart.tsx` - Activity distribution
- `streak-tracker.tsx` - Streak display
- `timer.tsx` - Session timer
- `phase-indicator.tsx` - Multi-step progress
- `session-complete.tsx` - Completion celebration

### UI Library (shadcn-style)
- Button, Card, Badge, Avatar
- Dialog, Sheet (drawer)
- Toast notifications
- Progress bars
- Dropdown menu
- Tooltip, Tabs
- Kanban board
- Charts
- Input, Textarea
- Sidebar (custom)
- Select, Checkbox
- Skeleton loaders
- And more...

### Third-Party Integrations
- `@dnd-kit` - Drag and drop
- `recharts` - Data visualization
- `framer-motion` - Animations
- `canvas-confetti` - Celebrations
- `lucide-react` - Icons
- `sonner` - Toast notifications

---

## User Experience Features

### Authentication
- Clerk integration for secure auth
- Protected routes via middleware
- User profile management

### Theming
- Light/Dark mode support (next-themes)
- Dynamic brand colors
- Personalized mood-based themes (future)

### Accessibility
- Keyboard navigation
- Screen reader support (future)
- High contrast mode (future)

### Performance
- Server-side rendering (SSR)
- Static page generation
- Optimistic updates
- Edge runtime ready

---

## Project Structure

```
mindchain/
├── app/
│   ├── (landing)/          # Landing page
│   ├── (sidebar)/          # App pages with sidebar
│   │   ├── home/
│   │   ├── chat/
│   │   ├── journal/
│   │   ├── check/
│   │   ├── cbt/
│   │   ├── meditation/
│   │   ├── relaxo/
│   │   ├── challenges/
│   │   ├── community/
│   │   ├── games/
│   │   ├── todo/
│   │   └── test/
│   ├── api/                # API routes
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── app-sidebar.tsx
│   ├── navbar.tsx
│   ├── breathing-circle.tsx
│   ├── mood-chart.tsx
│   └── ...
├── convex/                 # Database & server functions
│   ├── schema.ts
│   ├── auth.config.ts
│   ├── cbt.ts
│   ├── challenges.ts
│   ├── chat.ts
│   ├── checkins.ts
│   ├── gamify.ts
│   ├── journal.ts
│   ├── meditation.ts
│   ├── messages.ts
│   └── users.ts
├── lib/
│   ├── ai.ts               # AI configuration
│   ├── games.ts            # Games catalog
│   ├── comm.ts             # Community utilities
│   ├── sse.ts              # Server-sent events
│   ├── compose-refs.ts     # React ref utilities
│   └── utils.ts
├── hooks/
│   └── use-toast.ts
├── types/
├── public/
├── package.json
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
```

---

## Setup & Installation

```bash
# Clone the repository
git clone <repo-url>
cd mindchain

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your keys:
# - CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - CONVEX_DEPLOY_KEY
# - GEMINI_API_KEY
# - UPLOADTHING_SECRET
# - UPLOADTHING_APP_ID

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Environment Variables Required

| Variable | Description |
|----------|-------------|
| `CLERK_PUBLISHABLE_KEY` | Clerk auth public key |
| `CLERK_SECRET_KEY` | Clerk auth secret key |
| `CONVEX_DEPLOY_KEY` | Convex database deployment key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `UPLOADTHING_SECRET` | UploadThing secret key |
| `UPLOADTHING_APP_ID` | UploadThing app ID |

---

## Future Improvements (Roadmap)

### Phase 1: Core Experience Enhancements
- [x] Unified Dashboard with command center
- [x] Gamification V1 (MindCoins, streaks, badges)
- [x] Daily Check-ins with wellness scoring
- [x] Challenges system with progress tracking
- [x] Lofi Radio for ambient audio
- [ ] RAG implementation for AI memory
- [ ] Real-time sentiment analysis feedback
- [ ] Mood-based UI color adaptation

### Phase 2: "Wow" Features (Hackathon Impact)
- [ ] **Voice Interaction:** Web Speech API & ElevenLabs integration
- [ ] **MindGarden:** 3D/SVG interactive wellness garden (Three.js)
- [ ] **Predictive Well-being:** AI burnout risk prediction
- [ ] **Collaborative Communities:** Anonymous support groups with AI moderation
- [x] **Group Challenges:** Shared wellness goals (implemented)

### Phase 3: UX/UI Polish
- [ ] OKLCH dynamic themes by mood
- [ ] Interactive Emotional Heatmap
- [ ] "Soul Map" word cloud visualization
- [ ] Micro-interactions & haptic feedback
- [ ] Smooth page transitions
- [x] Skeleton loaders for AI content

### Phase 4: Technical Excellence
- [ ] **Offline Mode:** PWA support for offline journaling
- [ ] **Accessibility:** Full screen-reader support
- [ ] **Edge Runtime:** API route optimization
- [ ] **E2E Encryption:** Private journal encryption (Web Crypto API)
- [ ] **Performance:** Sub-second load times

### Bonus Features
- [ ] Apple Watch / WearOS integration
- [ ] Therapist matching
- [ ] Journal export (PDF)
- [ ] Social sharing (anonymized)
- [ ] Multi-language support
- [ ] Corporate wellness program portal
- [ ] Crisis detection & intervention

---

## Hackathon Presentation Tips

### Demo Flow (2 Minutes)
1. **Hook (15s):** "Mental health affects 1 in 4 people. MindChain makes wellness addictive."
2. **Demo (60s):** Show MindGarden growing, AI chat, gamification
3. **Impact (30s):** Stats on engagement, mental health outcomes
4. **Call to Action (15s):** "Try it at mindchain.app"

### Key Metrics to Highlight
- Daily active users target
- Average session time (gamification impact)
- Journal completion rates
- AI engagement scores
- Community participation

### Competitive Advantages
1. **AI-First:** Real sentiment analysis, not just tracking
2. **Gamification:** Makes wellness habit-forming
3. **Evidence-Based:** CBT, meditation, structured exercises
4. **Community:** Anonymous peer support
5. **Personalization:** Mood-based everything

---

## License

Private project - All rights reserved.

---

## Credits

Built with care for mental wellness accessibility. Made with Next.js, AI, and heart.

---

*MindChain - Your AI-Powered Journey to Mental Wellness*
