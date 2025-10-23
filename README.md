# Library Finder 📚

A modern web application to discover, compare, and explore software libraries across different categories and platforms.

## Features

- 🔍 Fuzzy search for libraries
- 📊 Compare multiple libraries side-by-side
- 🔐 User authentication with Firebase
- 📈 Library statistics and analytics
- 💼 Admin dashboard for library management

## Tech Stack

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Lucide Icons
- Fuse.js (fuzzy search)

**Backend:**
- Node.js
- Express
- MongoDB (or your database)

**Authentication:**
- Firebase Authentication

## Prerequisites

- Node.js 14+ and npm
- Git
- Firebase account

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/library-finder.git
cd library-finder
```

### 2. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Add your Firebase credentials to `.env`:
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Go to Project Settings > Your apps > SDK setup and configuration
- Copy the config values to your `.env` file

### 3. Setup Backend (if applicable)
```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Add your configuration values to `.env`

### 4. Run the Application

**Frontend:**
```bash
cd frontend
npm start
```

Runs on `http://localhost:3000`

**Backend:**
```bash
cd backend
npm start
```

Runs on `http://localhost:5000`

## Environment Variables

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase API Key | `AIzaSy...` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `project.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase Project ID | `project-id` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `project.appspot.com` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID | `123456789` |
| `REACT_APP_FIREBASE_APP_ID` | Firebase App ID | `1:123:web:abc` |
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
3. Add your domain to authorized domains:
   - Authentication > Settings > Authorized domains
   - Add `localhost` for development

## Project Structure
```
library-finder/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── config/
│   │   └── App.jsx
│   ├── .env (not in git)
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env (not in git)
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Notes

- Never commit `.env` files
- Keep Firebase credentials secure
- Use environment variables for all sensitive data
- Rotate API keys if accidentally exposed

## License

This project is licensed under the MIT License.

## Contact

Your Name - your.email@example.com

Project Link: https://github.com/Codewithfarha/Capstone_Seng2025.git