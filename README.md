# Permalist

A simple to-do list app built with Node.js (Express + EJS) that saves its items in a PostgreSQL database, so the list stays after the server restarts.

## Setup

1. Create a `permalist` database in PostgreSQL with an `items` table:

   ```sql
   CREATE TABLE items (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL
   );
   ```

2. Copy `.env.example` to `.env` and fill in your database credentials.

3. Install dependencies and start the server:

   ```bash
   npm install
   npm start
   ```

4. Open http://localhost:3000
