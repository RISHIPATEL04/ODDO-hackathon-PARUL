# Traveloop

Traveloop is a personalized, intelligent, and collaborative platform that transforms the way individuals plan and experience travel.

## Project File Structure

To ensure a production-ready, maintainable, and highly understandable codebase, we use a structured folder layout.

```text
Traveloop/
├── src/                      # Source code of the application
│   ├── app/                  # Next.js 13+ App Router (Pages & API routes)
│   │   ├── api/              # API endpoints (e.g., auth, users, trips)
│   │   ├── dashboard/        # Dashboard page & routes
│   │   ├── explore/          # Explore destinations page
│   │   ├── login/            # Login page
│   │   ├── profile/          # User profile page
│   │   ├── signup/           # Signup page
│   │   ├── trips/            # Trips management page
│   │   ├── globals.css       # Global stylesheet
│   │   ├── layout.js         # Root layout structure
│   │   └── page.js           # Main landing page
│   │
│   ├── components/           # Reusable React components
│   │   ├── layout/           # Global layout components (Navbar, AuthProvider, etc.)
│   │   └── ui/               # Generic UI components (Buttons, Inputs, Modals, Cards)
│   │
│   ├── lib/                  # Library configurations and core setup
│   │   └── mongodb.js        # MongoDB connection utility
│   │
│   ├── models/               # Mongoose Database Models (Schema definitions)
│   │   ├── Trip.js           # Trip model
│   │   └── User.js           # User model
│   │
│   ├── hooks/                # Custom React Hooks (e.g., useFetch, useAuth)
│   ├── services/             # Abstractions for external API calls and services
│   ├── utils/                # Helper functions, formatters, and utilities
│   └── constants/            # Application-wide constants and enums
│
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies and npm scripts
├── next.config.mjs           # Next.js configuration
├── eslint.config.mjs         # ESLint configuration for code quality
└── seed.js                   # Database seeding script
```

## Folder Responsibilities

- **`app/`**: Contains all the routes, both for rendering pages and for API endpoints. It uses the Next.js App Router conventions (`page.js`, `layout.js`).
- **`components/`**: Divided into `layout` (for structural components like Navbars and Footers) and `ui` (for atomic reusable components like Buttons and Modals).
- **`lib/`**: Contains core configurations like database connections and third-party integrations (e.g., `mongodb.js`).
- **`models/`**: Stores Mongoose schemas to define the shape of your data in MongoDB.
- **`hooks/`, `services/`, `utils/`, `constants/`**: Foundational directories for scalable development to separate logic from UI components.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory and add your MongoDB connection string and NextAuth secrets.
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Seeding the Database

If you need to populate the database with initial test data, run:
```bash
node seed.js
```
