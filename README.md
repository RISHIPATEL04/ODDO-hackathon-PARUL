# ✈️ Traveloop
deployed web link (prefered to open in computer/laptop) : https://oddo-hackathon-parul-s9aa.vercel.app/

if you want to visit or test the website and you are uncomfortable for entring your own Gmail use this cedentials:

email : test@gmail.com
password : 1234

Traveloop is a personalized, intelligent, and collaborative platform that transforms the way individuals plan and experience travel. Built for the modern traveler, it combines seamless itinerary management with real-time budget tracking.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Lucide React (Icons)
- **Backend**: Next.js API Routes, NextAuth.js (Authentication)
- **Database**: MongoDB with Mongoose (ODM)
- **Styling**: Vanilla CSS (Modern Design System)

## 📁 Project File Structure

To ensure a production-ready and maintainable codebase, we follow a modular structure:

```text
Traveloop/
├── sample-data/              # Example data for your project
│   ├── seed-trips.js         # Adds example trips to your database
│   └── seed-community.mjs    # Adds example community posts
├── src/                      # Your main code folder
│   ├── app/                  # Next.js 16 Website Pages
│   │   ├── api/              # Backend connection code
│   │   ├── dashboard/        # The user's main home page
│   │   ├── trips/            # Booking steps (Flights, Hotels, Payment)
│   │   ├── globals.css       # All website design and colors
│   │   └── layout.js         # The main website frame
│   ├── components/           # Parts of the website (Navbar, Buttons)
│   │   ├── layout/           # Shared parts like the Menu
│   │   └── ui/               # Simple parts like Buttons and Inputs
│   ├── db-setup/             # Database connection setup
│   ├── database-models/      # Database tables (User, Trip)
│   ├── middleware.js         # Login security check
│   └── helpers/              # Useful code snippets (Formatters)
├── .env.example              # Example file for your settings
└── package.json              # List of tools used in the project
```

## 🛠️ Getting Started

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env.local` based on `.env.example`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_secret
   ```

3. **Seed Data (Optional)**:
   ```bash
   node scripts/seed-trips.js
   ```

4. **Run Development**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to start exploring!

## ✨ Key Features

- **Sequential Booking Flow**: From destination search to flights, hotels, and checkout.
- **Real-time Budget Tracker**: Dynamic cost calculation in Indian Rupees (₹).
- **Protected Routes**: Secure authentication using NextAuth.
- **Responsive Design**: Premium aesthetics inspired by modern travel platforms.
