# Blog Platform - Backend

This is the REST API for the Multi-User Blog Platform, built with **Node.js**, **Express**, and **MongoDB**. It handles authentication, data management, and business logic.

## 🚀 Tech Stack

-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** MongoDB (with Mongoose)
-   **Authentication:** JWT (JSON Web Tokens)
-   **Security:** APIs protected with CORS and Password Hashing (bcryptjs)

## 📂 Project Structure

```bash
server/
├── models/         # Mongoose Schemas (User, Post, Comment)
├── routes/         # API Route Handlers (Auth, Posts, Comments)
├── middleware/     # Auth verification middleware
├── createAdmin.js  # Script to create an admin user
├── seedData.js     # Script to populate demo data
└── index.js        # Entry point
```

## 🛠️ Setup & Installation

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `server` root and add:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will run on [http://localhost:5000](http://localhost:5000).

## ⚙️ Scripts & Utilities

-   **Create Admin User:**
    Creates a user with `role: 'admin'` and credentials (`email: admin@example.com`, `password: admin123`).
    ```bash
    node createAdmin.js
    ```

-   **Seed Demo Data:**
    Populates the database with sample blog posts.
    ```bash
    node seedData.js
    ```

## 📦 Deployment

This project deals with persistent data (MongoDB), so a service like **Render**, **Railway**, or **Heroku** is recommended.

### Deploying to Render
1.  Push your code to GitHub.
2.  Create a "Web Service" on [Render](https://render.com).
3.  **Root Directory:** `server`.
4.  **Build Command:** `npm install`.
5.  **Start Command:** `npm start`.
6.  **Environment Variables:** Add `MONGO_URI`, `JWT_SECRET`, and `PORT` (usually automatic on Render, but good to check).

## 🔌 API Endpoints

### Auth
-   `POST /api/auth/register` - Create account
-   `POST /api/auth/login` - Login & get token

### Posts
-   `GET /api/posts` - Get all published posts
-   `GET /api/posts/:slug` - Get single post
-   `POST /api/posts` - Create post (Auth required)
-   `PUT /api/posts/:id` - Update post (Owner/Admin only)
-   `DELETE /api/posts/:id` - Delete post (Owner/Admin only)
-   `GET /api/posts/user/drafts` - Get current user's drafts

### Comments
-   `GET /api/comments/:postId` - Get comments for a post
-   `POST /api/comments` - Add comment (Auth required)
-   `DELETE /api/comments/:id` - Delete comment
