# Petition System - Quick Start

1. Install Node.js (LTS). Then in this folder:  npm install
2. Copy .env.example to .env and fill in MONGO_URI (your MongoDB Atlas string) and JWT_SECRET.
3. Create the demo accounts:  npm run seed
4. Start the server:  npm run dev
5. Open http://localhost:3000/login.html

Demo accounts (created by `npm run seed`):
  admin     admin@example.com     / ChangeMe123!
  reviewer  reviewer@example.com  / Reviewer123!
  student   student@example.com   / Student123!
