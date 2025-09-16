# SkillCircle
*Suggests community and connection*

A skill-sharing platform that matches people who want to learn skills with locals who can teach them - covering cooking, tech, science, languages, trades, instruments and more.

## Project Structure

```
skill-circle/
├── web/              # Next.js web application
├── mobile/           # React Native Expo app
├── backend/          # Node.js API server
├── shared/           # Shared types and utilities
├── docs/             # Documentation
└── scripts/          # Build and deployment scripts
```

## Tech Stack

### Frontend
- **Web**: Next.js 14 with TypeScript, TailwindCSS
- **Mobile**: React Native with Expo, NativeWind

### Backend
- **API**: Node.js with Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io for messaging
- **Authentication**: NextAuth.js + Expo AuthSession

### Infrastructure
- **Web**: Vercel deployment
- **Backend**: Railway deployment
- **Database**: Supabase PostgreSQL
- **Storage**: Cloudinary
- **Maps**: Google Maps API

## Features

- 🔍 **Skill Discovery**: Browse and search for skills by category
- 📍 **Location-based Matching**: Find teachers and learners nearby
- 💬 **Real-time Messaging**: Direct communication between users
- ⭐ **Rating System**: Reviews and ratings for teachers
- 📅 **Scheduling**: Book and manage learning sessions
- 💳 **Payments**: Secure payment processing with Stripe
- 🔔 **Notifications**: Push notifications for matches and messages

## Getting Started

1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Set up environment variables
4. Start development servers: `npm run dev`

## Development

- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run test` - Run tests across all packages
- `npm run lint` - Lint all code

## License

MIT License
