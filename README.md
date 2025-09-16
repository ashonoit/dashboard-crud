# Fullstack CRUD App

A full-stack CRUD (Create, Read, Update, Delete) application for managing users, featuring authentication with local login/register and Google OAuth integration.

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - For token-based authentication
- **Passport.js** with Google OAuth 2.0 strategy - For social authentication
- **bcryptjs** - For password hashing
- **CORS** - For cross-origin resource sharing
- **dotenv** - For environment variable management

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - For client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - For notifications
- **React CSV** - For CSV export functionality
- **Prop-types** - For type checking

## Features

- **User Authentication**
  - Local registration and login with email/password
  - Google OAuth 2.0 integration
  - JWT-based session management
  - Protected routes

- **User Management (CRUD)**
  - View users in a paginated table
  - Add new users
  - Edit existing users
  - Delete users
  - Export user data to CSV

- **Responsive UI**
  - Dark theme design
  - Mobile-friendly interface

## Working Flow

1. **Authentication**:
   - User visits the application
   - If not authenticated, redirected to login page
   - Options: Register new account, login with existing credentials, or sign in with Google
   - Upon successful authentication, JWT token is stored in localStorage
   - User is redirected to dashboard

2. **Dashboard**:
   - Displays a table of all users
   - Pagination controls for navigating through user list
   - Buttons for adding new users, editing existing ones, and deleting users
   - CSV download button to export user data

3. **User Operations**:
   - **Create**: Click "Add User" to open modal with form for new user details
   - **Read**: View user information in the table
   - **Update**: Click edit button on a user row to modify details in modal
   - **Delete**: Click delete button to remove a user (with confirmation)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- Google OAuth credentials (for Google sign-in feature)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/crudApp
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   BACKEND_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Google OAuth Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (for development)
6. Copy the Client ID and Client Secret to your `.env` file

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Google OAuth callback

### Users (Protected routes - require JWT token)
- `GET /api/users` - Get all users (with pagination)
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Project Structure

```
fullstack-crud-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── users.js
│   ├── package.json
│   ├── server.js
│   └── .env (create this)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddUserModal.jsx
│   │   │   ├── EditUserModal.jsx
│   │   │   ├── UserTable.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── OAuthRedirect.jsx
│   │   ├── routes/
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── index.html
└── README.md
```

## Usage

1. Start both backend and frontend servers as described in setup
2. Open your browser and navigate to `http://localhost:5173`
3. Register a new account or login with existing credentials
4. Use the dashboard to manage users

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
